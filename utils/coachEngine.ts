// utils/coachEngine.ts

import { getRangeForPosition } from "../lib/range/rangeLoader";

export type Action = "RAISE" | "CALL" | "FOLD" | "MIX";

export type LeakCategory =
  | "OK"
  | "TOO_TIGHT"
  | "TOO_LOOSE"
  | "OVER_AGGRO"
  | "OVER_PASSIVE";

export interface CoachResult {
  heroPosition: string;      // 英文位置字串：UTG / HJ / CO / BTN / SB / BB
  villainPosition?: string;  // 之後你要用可以再填
  combo: string;             // 手牌：AKs / QQ / JTo ...
  spr: number;               // SPR
  gtoAction: Action;         // GTO 建議
  heroAction: Action;        // 玩家實際行動（外部給或預設）
  leakCategory: LeakCategory;
  evDiff: number;            // EV 差異（以 bb 為單位，正負皆可）
  notes: string[];           // 額外說明，給 explain.ts 用
}

/**
 * 牌力粗略評分：用來推估 GTO 趨勢（不中庸，不陽春）
 */
function evaluateComboStrength(combo: string): number {
  const ranks = "23456789TJQKA";
  const c = combo.toUpperCase().trim();

  // 先把對子 / suited / offsuit 拆開
  const isPair = c.length >= 2 && c[0] === c[1];
  const isSuited = c.endsWith("S");
  const isOffsuit = c.endsWith("O");

  const r1 = c[0];
  const r2 = c[1];

  const v1 = ranks.indexOf(r1);
  const v2 = ranks.indexOf(r2);

  if (v1 === -1 || v2 === -1) return 0;

  const base = (v1 + v2) / 2;

  let score = base;

  if (isPair) score += 3;
  if (isSuited) score += 1;
  if (isOffsuit) score -= 0.5;

  return score; // 大約 0 ~ 15
}

/**
 * 依照牌力 + SPR 給一個合理的 GTO 趨勢（不依賴真實 solver，但邏輯接近）
 */
function getHeuristicGTOAction(strength: number, spr: number): Action {
  // 高牌力：大部分時間加注 / 下注
  if (strength >= 11) {
    if (spr <= 3) return "RAISE";
    return "MIX";
  }

  // 中等牌力：偏向 call / mix
  if (strength >= 7) {
    if (spr <= 2) return "MIX";
    return "CALL";
  }

  // 弱牌力：大多數時間該 fold
  if (spr >= 3) return "FOLD";
  return "MIX";
}

/**
 * 根據 GTO 建議 vs 玩家實際行動，判定 leak 類型
 */
function classifyLeak(gto: Action, hero: Action): LeakCategory {
  if (gto === "FOLD" && (hero === "RAISE" || hero === "CALL")) {
    return "TOO_LOOSE";
  }
  if (gto === "RAISE" && hero === "CALL") {
    return "OVER_PASSIVE";
  }
  if (gto === "RAISE" && hero === "FOLD") {
    return "TOO_TIGHT";
  }
  if (gto === "CALL" && hero === "RAISE") {
    return "OVER_AGGRO";
  }
  return "OK";
}

/**
 * 簡易 EV 差異估計：越偏離 GTO，EV 差異越大
 */
function estimateEvDiff(gto: Action, hero: Action, strength: number): number {
  if (gto === hero) return 0;

  const penaltyBase = Math.max(1, (strength - 5) / 2); // 牌力越高，錯誤越貴

  if (gto === "RAISE" && hero === "FOLD") {
    return -2.5 * penaltyBase;
  }
  if (gto === "RAISE" && hero === "CALL") {
    return -1.5 * penaltyBase;
  }
  if (gto === "CALL" && hero === "RAISE") {
    return -1.2 * penaltyBase;
  }
  if (gto === "FOLD" && (hero === "CALL" || hero === "RAISE")) {
    return -1.8 * penaltyBase;
  }

  return -1 * penaltyBase;
}

/**
 * 核心入口：V4 版教練引擎
 * - pos: 玩家位置（UTG/HJ/CO/BTN/SB/BB/其他）
 * - combo: 手牌（AKs / QQ / JTo）
 * - spr: SPR
 * - heroAction: 玩家實際選擇，不給就視為 CALL（保險值）
 */
export function analyzeHandV4(
  pos: string,
  combo: string,
  spr: number,
  heroAction: Action = "CALL"
): CoachResult {
  const heroPosition = pos.toUpperCase().trim();
  const heroCombo = combo.toUpperCase().trim();

  // 1) 嘗試從 range engine 拿資料（之後你補真實 range 就可以直接接上）
  const rangeTable = getRangeForPosition(heroPosition);
  const entry = rangeTable[heroCombo];

  let gtoAction: Action;

  if (entry && entry.pure) {
    gtoAction = entry.pure;
  } else {
    // 沒有真實 range：用 heuristic fallback
    const strength = evaluateComboStrength(heroCombo);
    gtoAction = getHeuristicGTOAction(strength, spr);
  }

  // 2) 分類 leak
  const leakCategory = classifyLeak(gtoAction, heroAction);

  // 3) 估算 EV 差異
  const strength = evaluateComboStrength(heroCombo);
  const evDiff = estimateEvDiff(gtoAction, heroAction, strength);

  // 4) 組裝說明（給 explain.ts 用）
  const notes: string[] = [];

  notes.push(`位置：${heroPosition}，手牌：${heroCombo}，SPR：約 ${spr.toFixed(1)}`);
  notes.push(`GTO 傾向動作：${gtoAction}，你的實際動作：${heroAction}`);

  switch (leakCategory) {
    case "TOO_TIGHT":
      notes.push("這裡你的棄牌過於保守，長期會損失可賺取的 EV。");
      break;
    case "TOO_LOOSE":
      notes.push("這手牌在多數情況下不適合繼續投入太多籌碼。");
      break;
    case "OVER_AGGRO":
      notes.push("過度激進會導致在對手範圍較強時付出太多代價。");
      break;
    case "OVER_PASSIVE":
      notes.push("該進攻時沒有進攻，會讓你錯過許多可盈利的 spot。");
      break;
    case "OK":
      notes.push("這個決策大致接近 GTO 水準，可以持續這樣的思維。");
      break;
  }

  if (Math.abs(evDiff) > 2) {
    notes.push(`此處 EV 損失約 ${evDiff.toFixed(2)} bb，屬於值得優先修正的重大 leak。`);
  }

  return {
    heroPosition,
    villainPosition: undefined,
    combo: heroCombo,
    spr,
    gtoAction,
    heroAction,
    leakCategory,
    evDiff,
    notes,
  };
}
