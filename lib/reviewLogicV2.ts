// lib/reviewLogicV2.ts
// AI 複盤系統 + 教練模式 v2.5 統一邏輯引擎

// -------------------------
// 型別定義
// -------------------------
export type ReviewResultV2 = {
  score: number;
  summary: string;
  streets: {
    title: string;
    points: string[];
  }[];
  recommendedLessons: {
    chapterId: number;
    title: string;
  }[];
};

export type CoachResultV2 = {
  coreAdvice: string;
  streets: {
    title: string;
    points: string[];
  }[];
  trainingTips: string[];
  recommendedLessons: {
    chapterId: number;
    title: string;
  }[];
};

// -------------------------
// 解析前置：洗 Hero、Board、位置、動作
// -------------------------

function normalizeCards(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, " ")
    .replace(/,/g, "")
    .toLowerCase();
}

function extractHeroHand(text: string): string | null {
  const t = normalizeCards(text);

  const reg = /([2-9tjqka][shdc]\s*[2-9tjqka][shdc])/i;
  const m = t.match(reg);

  if (m) {
    return m[0].replace(/\s+/g, "").toUpperCase();
  }
  return null;
}

function extractBoard(text: string): string[] {
  const t = normalizeCards(text);
  const reg = /([2-9tjqka][shdc]){3,5}/gi;
  const m = t.match(reg);
  if (!m) return [];

  const board = m[m.length - 1].match(/[2-9tjqka][shdc]/gi);
  return board ? board.map((c) => c.toUpperCase()) : [];
}

function randomScore() {
  return 70 + Math.floor(Math.random() * 25);
}

// -------------------------
// 核心複盤引擎 v2.5
// -------------------------
export function analyzeHandV2(text: string): ReviewResultV2 {
  const hero = extractHeroHand(text);
  const board = extractBoard(text);
  const score = randomScore();

  const streets = [];

  streets.push({
    title: "Preflop",
    points: [
      hero
        ? `你拿到 ${hero}，屬於標準可操作牌。`
        : "未偵測到 Hero 手牌，可能是描述太模糊。",
      "建議確認開局 sizing、位置優勢、與 VSR。"
    ]
  });

  if (board.length >= 3) {
    streets.push({
      title: "Flop",
      points: [
        `翻牌偵測到：${board.slice(0, 3).join(" ")}。`,
        "注意 c-bet 頻率與在這種紋理上的策略極化。"
      ]
    });
  }

  if (board.length >= 4) {
    streets.push({
      title: "Turn",
      points: [
        `Turn： ${board[3]}`,
        "Turn 通常是策略最容易偏誤的一街，要避免無計畫延續開火。"
      ]
    });
  }

  if (board.length == 5) {
    streets.push({
      title: "River",
      points: [
        `River：${board[4]}`,
        "確認你的 river bluff / value 兩側比例是否平衡。"
      ]
    });
  }

  return {
    score,
    summary:
      "整體決策穩定，但仍有可優化空間。注意不要在中等強度牌過度 hero-call。",
    streets,
    recommendedLessons: [
      { chapterId: 4, title: "3-Bet 防守策略" },
      { chapterId: 12, title: "Flop 紋理與極化策略" },
      { chapterId: 22, title: "Turn 決策與槍口收縮" }
    ]
  };
}

// -------------------------
// 教練模式邏輯 v2.5
// -------------------------
export function analyzeHandCoachV2(text: string): CoachResultV2 {
  const hero = extractHeroHand(text);
  const board = extractBoard(text);

  const streets = [];

  streets.push({
    title: "Preflop 建議",
    points: [
      hero
        ? `你的起手牌為 ${hero}，屬於中強牌組，建議預先設定好 3 街計畫。`
        : "未能識別起手牌，但依描述可推測為中等強度範圍。",
      "布局重點：不要只跟注，要思考 SPR、後位壓力、與策略穩定度。"
    ]
  });

  if (board.length >= 3) {
    streets.push({
      title: "Flop 建議",
      points: [
        `偵測到 flop：${board.slice(0, 3).join(" ")}`,
        "在此類牌面避免 autopilot cbet，應考量 range 對 range。"
      ]
    });
  }

  if (board.length >= 4) {
    streets.push({
      title: "Turn 建議",
      points: [
        `Turn：${board[3]}`,
        "Turn 是 leak 最多的街道，建議優先練習 sizing 與強弱極化。"
      ]
    });
  }

  if (board.length === 5) {
    streets.push({
      title: "River 建議",
      points: [
        `River：${board[4]}`,
        "避免將 bluff 變成 hero call，也不要把 marginal hand 過度 value bet。"
      ]
    });
  }

  return {
    coreAdvice:
      "最重要：提前決定「哪一街若遭遇強力反制就應該棄牌」，避免無計畫一路 call 到 river。",
    streets,
    trainingTips: [
      "檢查你的 flop–turn–river 策略是否一致，避免不同街採用不同邏輯。",
      "專注改善 turn 行為，這是大多數玩家最大的 leak。",
      "開始建立更穩定的 preflop game plan。"
    ],
    recommendedLessons: [
      { chapterId: 8, title: "Flop 極化策略" },
      { chapterId: 19, title: "Turn 架構與延續開火" },
      { chapterId: 28, title: "River Bluff 與價值區辨" }
    ]
  };
}
