// utils/analysisEngine.ts

import parseHand, { ParsedHand } from "./handParser";

export interface CoachReport {
  summary: string;
  preflop: string;
  flop: string;
  turn: string;
  river: string;
  leaks: string[];
  recommendedChapters: string[];
  recommendedQuizzes: string[];
  score: number; // 0~100 教練評分
}

/** 判斷強牌/弱牌（簡易版本，可之後再擴充） */
function evaluateHeroHand(hand: string | null): string {
  if (!hand) return "未能偵測到 Hero 手牌。";

  const premium = ["AA", "KK", "QQ", "JJ", "AKS", "AKO"];
  const strong = ["TT", "99", "AQS", "AJS", "KQS", "AQO"];
  const medium = ["88", "77", "ATs", "KJs", "QJs", "AJo"];

  const up = hand.toUpperCase();

  if (premium.includes(up)) return `頂級起手牌（${up}）。`;
  if (strong.includes(up)) return `強牌（${up}）。`;
  if (medium.includes(up)) return `中等強度（${up}）。`;

  return `偏弱或中低強度（${up}）。`;
}

/** 推薦章節（依 Leak 類型） */
function recommendChapters(leaks: string[]): string[] {
  const map: Record<string, string[]> = {
    "過度跟注": ["第14章：Bluffcatch 基礎", "第22章：河牌防守"],
    "缺乏計畫": ["第5章：街別規劃", "第19章：SPR 操作"],
    "cbet 過度": ["第7章：K-high 牌面策略", "第10章：Flop c-bet 頻率"],
    "turn 過度跟注": ["第12章：Turn 防守", "第18章：頻率管理"],
  };

  const out = new Set<string>();

  leaks.forEach((leak) => {
    Object.keys(map).forEach((key) => {
      if (leak.includes(key)) {
        map[key].forEach((c) => out.add(c));
      }
    });
  });

  return Array.from(out);
}

/** 推薦題庫方向 */
function recommendQuizzes(leaks: string[]): string[] {
  const output: string[] = [];

  if (leaks.some((l) => l.includes("跟注"))) {
    output.push("河牌 bluffcatch 題庫");
  }
  if (leaks.some((l) => l.includes("cbet"))) {
    output.push("Flop cbet 頻率題庫");
  }
  if (leaks.some((l) => l.includes("turn"))) {
    output.push("Turn 防守題庫");
  }

  return output.length ? output : ["一般 GTO 基礎題庫"];
}

/** 主 AI 分析引擎（給教練頁面使用） */
export default function analyze(raw: string): CoachReport {
  const data: ParsedHand = parseHand(raw);

  const leaks: string[] = [];
  const summaryParts: string[] = [];

  // Hero / Villain 摘要
  summaryParts.push(`你的手牌：${data.heroHand ?? "（未偵測）"}`);
  if (data.villainHand) {
    summaryParts.push(`對手亮牌：${data.villainHand}`);
  }

  // 牌面摘要
  if (data.flop.length === 3) {
    summaryParts.push(`Flop：${data.flop.join(" ")}`);
  }
  if (data.turn) summaryParts.push(`Turn：${data.turn}`);
  if (data.river) summaryParts.push(`River：${data.river}`);

  // ===== 街別文字敘述 =====
  let preflop = "";
  let flop = "";
  let turn = "";
  let river = "";

  // Preflop
  const heroEval = evaluateHeroHand(data.heroHand);
  preflop = `Preflop：${heroEval}`;

  // Flop：偵測配對牌面
  if (data.flop.length === 3) {
    const ranks = data.flop.map((x) => x[0]);
    const [a, b, c] = ranks;
    const isPaired = a === b || a === c || b === c;

    if (isPaired) {
      flop =
        "Flop：配對牌面，GTO 建議降低 bluff 頻率並保持 pot control，避免在 marginal hand 過度 c-bet。";
      leaks.push("cbet 過度");
    } else {
      flop =
        "Flop：非配對牌面，標準情況下可以依 range 優勢維持正常 c-bet 頻率。";
    }
  } else {
    flop =
      "Flop：尚未提供完整牌面資訊，建議在實戰中紀錄完整 Flop 牌。";
  }

  // Turn：若仍持續被動 + call，視為潛在 leak
  if (data.turn) {
    turn =
      "Turn：持續被動跟注時，要注意自己是否只是『不想被 Bluff』，而缺乏完整計畫。";
    if (data.actions.includes("Call")) {
      leaks.push("turn 過度跟注");
    }
  } else {
    turn = "Turn：無具體資訊。";
  }

  // River：針對 call 線檢查
  if (data.river) {
    river =
      "River：應在進河牌前就決定好哪些牌面會 hero call，哪些會直接放棄，避免臨場情緒決策。";
    if (data.actions.includes("Call")) {
      leaks.push("河牌過度跟注");
    }
  } else {
    river = "River：無具體資訊。";
  }

  // 缺乏整體計畫（純 call 線）
  if (data.actions.includes("Call") && !data.actions.includes("Raise")) {
    leaks.push("缺乏計畫的跟注線");
  }

  const chapters = recommendChapters(leaks);
  const quizzes = recommendQuizzes(leaks);

  // 簡單評分邏輯：從 90 分開始，每個 leak 扣 6 分，最低 55
  const baseScore = 90;
  const penalty = Math.min(leaks.length * 6, 30);
  const score = Math.max(55, baseScore - penalty);

  return {
    summary: summaryParts.join("\n"),
    preflop,
    flop,
    turn,
    river,
    leaks,
    recommendedChapters: chapters,
    recommendedQuizzes: quizzes,
    score,
  };
}
