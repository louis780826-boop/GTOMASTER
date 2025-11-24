
import type {
  SpotInput,
  CoachResult,
  CoachSummary,
  LeakItem,
  StreetPlan,
  Tier,
  Street,
  ActionType,
} from "./types";

function clamp01(v: number): number {
  if (v < 0) return 0;
  if (v > 1) return 1;
  return v;
}

function scoreFromSPR(spr: number, street: Street): number {
  // 粗略：低 SPR 偏向 all‑in 決策，高 SPR 偏向控池與頻率
  if (spr <= 1) return street === "preflop" ? 0.9 : 0.8;
  if (spr <= 3) return 0.8;
  if (spr <= 6) return 0.7;
  if (spr <= 10) return 0.6;
  return 0.5;
}

function heuristicRecommendedAction(input: SpotInput): ActionType {
  const { street, heroAction, spr, villainAggression } = input;

  if (street === "preflop") {
    if (heroAction === "raise") return "raise";
    if (heroAction === "call") {
      if (spr > 8) return "call";
      if (spr < 2) return "fold";
      return "call";
    }
    return heroAction;
  }

  if (street === "flop") {
    if (heroAction === "bet" || heroAction === "raise") {
      if (villainAggression === "high" && spr < 3) return "bet";
      return "bet";
    }
    if (heroAction === "check") {
      if (villainAggression === "high") return "check";
      return "call";
    }
    return heroAction;
  }

  // turn / river 簡化
  if (street === "turn" || street === "river") {
    if (heroAction === "bet" || heroAction === "raise") {
      if (villainAggression === "low") return "bet";
      return "check";
    }
    if (heroAction === "check") {
      if (villainAggression === "high") return "call";
      return "fold";
    }
    return heroAction;
  }

  return heroAction;
}

function buildRationale(input: SpotInput, action: ActionType): string {
  const { street, spr, villainAggression, heroPosition } = input;
  const sprScore = scoreFromSPR(spr, street);
  const aggrWord =
    villainAggression === "high"
      ? "高侵略"
      : villainAggression === "low"
      ? "被動"
      : "正常";
  return `在 ${street.toUpperCase()}，位置 ${heroPosition}，SPR 約 ${spr.toFixed(
    1
  )}，面對對手偏 ${aggrWord} 的風格，此決策在 GTO 思路下屬於中等頻率的標準線。SPR 分數約 ${(sprScore * 100).toFixed(
    0
  )} 分，建議以此動作為主線，搭配少量混合策略。`;
}

function detectLeaks(input: SpotInput, rec: ActionType): LeakItem[] {
  const leaks: LeakItem[] = [];
  const { heroAction, street, spr, villainAggression } = input;

  if (heroAction === "call" && rec === "fold") {
    leaks.push({
      id: "overcall",
      label: "過度跟注（Over‑Call）",
      severity: spr > 6 ? "high" : "medium",
      description:
        "在該 SPR 與牌面情境下，理論上應該有較多棄牌頻率，但你選擇了跟注。",
      advice:
        "檢查自己的跟注頻率，特別是在沒有強聽牌或頂段牌力時，適度增加棄牌比例，避免把太多邊緣牌帶到後位街。",
    });
  }

  if (heroAction === "bet" && villainAggression === "high" && spr > 8) {
    leaks.push({
      id: "thinbet_vs_maniac",
      label: "對高侵略對手薄價下注",
      severity: "medium",
      description:
        "面對本身就偏向高侵略的對手，過度薄價下注容易被加注攻擊，導致棘手局面。",
      advice:
        "在 SPR 偏高的情況下，面對高侵略對手時，可適度轉向更多 check / call 線，保留 range 彈性，避免被頻繁 check‑raise。",
    });
  }

  if (street === "preflop" && heroAction === "raise" && spr < 2) {
    leaks.push({
      id: "shallow_3bet_spot",
      label: "籌碼淺時的過度開局 / 3bet",
      severity: "low",
      description:
        "在 SPR 已經非常淺的情況下，很多邊界牌在理論裡會直接進入 all‑in 或 fold 決策樹。",
      advice:
        "檢查自己在 SPR < 2 狀態下的 preflop 範圍，適度簡化成 shove / fold 策略，減少 post‑flop 打法的困難度。",
    });
  }

  return leaks;
}

function buildStreetPlan(input: SpotInput, rec: ActionType): StreetPlan[] {
  const base: StreetPlan[] = [];

  base.push({
    street: "preflop",
    recommendation: input.street === "preflop" ? rec : "raise",
    comment:
      "建立穩定且不易被利用的開局 / 防守範圍，避免出現明顯過鬆或過緊的情況。",
  });

  base.push({
    street: "flop",
    recommendation: "bet",
    comment:
      "在有範圍優勢與位置優勢時，保留一定比例的持續下注（c‑bet），但避免在極度濕板用過大頻率。",
  });

  base.push({
    street: "turn",
    recommendation: "check",
    comment:
      "轉牌是縮窄範圍與選擇主要價值線的關鍵街，多數情況下可適度控制底池大小。",
  });

  base.push({
    street: "river",
    recommendation: "bet",
    comment:
      "河牌決策重點在於：價值下注 vs 放棄，避免在幾乎沒有 bluff 候選牌時硬擠 bluff。",
  });

  return base;
}

function buildSummary(input: SpotInput, tier: Tier): CoachSummary {
  const rec = heuristicRecommendedAction(input);
  const baseConf = scoreFromSPR(input.spr, input.street);
  const tierBonus = tier === "MASTER" ? 0.1 : tier === "PRO" ? 0.05 : 0;
  const confidence = clamp01(baseConf + tierBonus);

  const rationale = buildRationale(input, rec);

  const gtoTendency =
    "此線路大致貼近 GTO 思維：在大多數情況下能維持 range 平衡，不會出現嚴重的過度 bluff 或過度 value。";

  const exploitHint =
    "若對手明顯出現過度跟注或過度棄牌傾向，可以在相同結構的牌桌中，適度放大 value bet 或增加 bluff 頻率。";

  return {
    recommendedAction: rec,
    confidence,
    rationale,
    gtoTendency,
    exploitHint,
  };
}

function computeScores(input: SpotInput, leaks: LeakItem[]): {
  gtoScore: number;
  exploitScore: number;
} {
  let base = scoreFromSPR(input.spr, input.street) * 100;
  const penalty = leaks.reduce((acc, l) => {
    if (l.severity === "high") return acc + 15;
    if (l.severity === "medium") return acc + 8;
    return acc + 3;
  }, 0);
  const gtoScore = Math.max(0, Math.min(100, base - penalty));
  const exploitScore = Math.max(0, Math.min(100, 100 - gtoScore / 2));
  return { gtoScore, exploitScore };
}

export function analyzeSpot(input: SpotInput, tier: Tier): CoachResult {
  const summary = buildSummary(input, tier);
  const leaks = detectLeaks(input, summary.recommendedAction);
  const streets = buildStreetPlan(input, summary.recommendedAction);
  const { gtoScore, exploitScore } = computeScores(input, leaks);

  return {
    tier,
    input,
    result: {
      basicSummary: summary,
      streets,
      leaks,
      gtoScore,
      exploitScore,
    },
  };
}
