// utils/coachEngine.ts
// AI 教練 V4 – 中階 EV 模型（position + combo strength + SPR + variant）
// 輸出 GTO 動作 + EV + 頻率 + 解析

import { getRangeForPosition } from "../lib/range/rangeLoader";

// 牌力評分（簡化版、但很好用）
const RANK_ORDER: Record<string, number> = {
  A: 14, K: 13, Q: 12, J: 11,
  T: 10, 9: 9, 8: 8, 7: 7, 6: 6,
  5: 5, 4: 4, 3: 3, 2: 2
};

// 計算手牌基本分數
function calcComboStrength(combo: string): number {
  // AA / AKs / AKo / QJs...
  const c1 = combo[0];
  const c2 = combo[1];

  const v1 = RANK_ORDER[c1] || 0;
  const v2 = RANK_ORDER[c2] || 0;

  let base = v1 + v2;

  if (combo.endsWith("s")) base += 2; // suited
  if (combo.endsWith("o")) base -= 1; // offsuit

  if (c1 === c2) base += 8; // pair bonus

  return base;
}

// 各位置基本 EV（這部分你可之後調整）
const POSITION_BASE_EV: Record<string, number> = {
  UTG: -0.2,
  CO: 0.1,
  BTN: 0.25,
  SB: -0.15,
  BB: -0.5
};

// SPR 因子（越深 SPR 行為越接近混合）
function sprFactor(spr: number): number {
  if (spr >= 20) return 0.5;
  if (spr >= 12) return 0.3;
  if (spr >= 7) return 0.1;
  if (spr >= 3) return -0.1;
  return -0.3;
}

// variant bonus（strong / mix / fold）
const VARIANT_EV: Record<string, number> = {
  strong: 0.8,
  mix: 0.3,
  fold: -0.6
};

export function analyzeHandV4(pos: string, combo: string, spr: number) {
  const cleanPos = pos.toUpperCase();
  const range = getRangeForPosition(cleanPos);
  const entry = range[combo.toUpperCase()];

  const pureAction = entry?.pure ?? "FOLD";
  const variant = entry?.pure === "RAISE"
    ? "strong"
    : entry?.pure === "CALL"
    ? "mix"
    : "fold";

  // 基本 hand score
  const handScore = calcComboStrength(combo);

  // 中階 EV 模型核心計算：
  const baseEV = POSITION_BASE_EV[cleanPos] ?? 0;

  const evRaise =
    baseEV + handScore * 0.05 + sprFactor(spr) + VARIANT_EV[variant];

  const evCall =
    baseEV + handScore * 0.03 + sprFactor(spr) * 0.5 + VARIANT_EV[variant] * 0.5;

  const evFold = baseEV - 0.2;

  // 找 GTO 動作
  let best = "FOLD";
  let bestEV = evFold;

  if (evCall > bestEV) {
    bestEV = evCall;
    best = "CALL";
  }
  if (evRaise > bestEV) {
    bestEV = evRaise;
    best = "RAISE";
  }

  // 解析（AI 教練講的話）
  let explanation = "";

  if (best === "RAISE") {
    explanation = `${combo} 在 ${cleanPos} 有足夠的手牌品質（hand score ${handScore}）能主動抓取底池。` +
      `EV_raise = ${evRaise.toFixed(2)} 明顯優於其他動作，因此 GTO 傾向偏進攻。`;
  } else if (best === "CALL") {
    explanation = `${combo} 在這個 SPR（${spr}）中屬於邊緣 / 混合策略牌。` +
      `手牌強度 ${handScore} 不足以純進攻，因此 GTO 取向是以 Call 做平衡。`;
  } else {
    explanation = `${combo} 在此位置的手牌強度偏弱（score ${handScore}），` +
      `EV_fold（${evFold.toFixed(2)}）優於參與，因此 GTO 建議直接棄牌。`;
  }

  return {
    position: cleanPos,
    combo,
    spr,
    ev: {
      RAISE: Number(evRaise.toFixed(2)),
      CALL: Number(evCall.toFixed(2)),
      FOLD: Number(evFold.toFixed(2))
    },
    bestAction: best,
    explanation
  };
}
