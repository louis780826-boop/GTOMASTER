// =========================================
// GTO+ MASTER 複盤引擎 v3 (完整正式版)
// =========================================

export interface StreetAnalysis {
  summary: string;
  decision: string;
  advice: string[];
}

export interface ReviewResult {
  score: number;
  preflop: StreetAnalysis;
  flop: StreetAnalysis;
  turn: StreetAnalysis;
  river: StreetAnalysis;
  leaks: string[];
  recommendedLessons: { chapterId: number; title: string }[];
  recommendedPractice: string[];
}

export function extractCards(str: string): string[] {
  const matches = str.match(/([2-9tjqka][shdc])/gi);
  if (!matches) return [];
  return matches.map((c) => c.toLowerCase());
}

export function classifyBoard(cards: string[]) {
  if (cards.length < 3) return { texture: "unknown", pairs: false };

  const ranks = cards.map((c) => c[0]);
  const suits = cards.map((c) => c[1]);

  const uniqueRanks = new Set(ranks);
  const uniqueSuits = new Set(suits);

  const isPaired = uniqueRanks.size <= 2;
  const isMonotone = uniqueSuits.size === 1;
  const isTwoTone = uniqueSuits.size === 2;

  let texture = "dry";
  if (isPaired) texture = "paired";
  else if (isMonotone) texture = "monotone";
  else if (isTwoTone) texture = "wet";

  return {
    texture,
    paired: isPaired,
    monotone: isMonotone,
    wet: texture === "wet",
  };
}

import { GTO_CHAPTERS } from "./gtoChapters";

export function recommendChapters(tags: string[]) {
  const list = GTO_CHAPTERS.filter((c) =>
    c.tags.some((t: string) => tags.includes(t))
  ).slice(0, 3);

  return list.map((c) => ({
    chapterId: c.id,
    title: c.title,
  }));
}

export function collectPracticeTags(leaks: string[]): string[] {
  const tags: string[] = [];

  for (const leak of leaks) {
    if (leak.includes("hero call")) tags.push("river_bluffcatch");
    if (leak.includes("小注偏少")) tags.push("flop_cbet_small");
    if (leak.includes("過度被動")) tags.push("turn_probe");
    if (leak.includes("3bet")) tags.push("preflop_3bet_defense");
    if (leak.includes("barrel")) tags.push("turn_barrel_logic");
    if (leak.includes("check-raise") || leak.includes("check raise")) tags.push("flop_xraise");
  }

  return Array.from(new Set(tags));
}

// ----- Preflop -----
function classifyHeroHand(c1: string, c2: string) {
  const r1 = c1[0].toUpperCase();
  const r2 = c2[0].toUpperCase();
  const s1 = c1[1], s2 = c2[1];

  const suited = s1 === s2;
  const pair = r1 === r2;

  const rankOrder = "23456789TJQKA";
  const v1 = rankOrder.indexOf(r1);
  const v2 = rankOrder.indexOf(r2);

  if (pair) {
    if ("AKQJ".includes(r1)) return { tier: "premium", label: `頂端口袋對（${r1}${r1}）` };
    if ("T98".includes(r1)) return { tier: "strong", label: `強口袋對（${r1}${r1}）` };
    if ("76".includes(r1)) return { tier: "medium", label: `中等口袋對（${r1}${r1}）` };
    return { tier: "weak", label: `小口袋對（${r1}${r1}）` };
  }

  if ("AKQJT".includes(r1) && "AKQJT".includes(r2)) {
    if (suited) return { tier: "premium", label: `強同花大牌（${c1}${c2}）` };
    return { tier: "strong", label: `強高張（${c1}${c2}）` };
  }

  if (suited && Math.abs(v1 - v2) === 1) {
    return { tier: "medium", label: `同花連張（${c1}${c2}）` };
  }

  return { tier: "weak", label: `邊緣牌（${c1}${c2}）` };
}

function detectPosition(input: string): string {
  const posMap: Record<string, string> = {
    utg: "UTG",
    lj: "LJ",
    hj: "HJ",
    co: "CO",
    btn: "BTN",
    sb: "SB",
    bb: "BB",
  };

  const lower = input.toLowerCase();
  for (const k in posMap) {
    if (lower.includes(k)) return posMap[k];
  }

  return "Unknown";
}

function detectPreflopAction(input: string): string {
  const t = input.toLowerCase();

  if (t.includes("3bet") || t.includes("3-bet")) return "3bet";
  if (t.includes("4bet") || t.includes("4-bet")) return "4bet";
  if (t.includes("raise") || t.includes("開局")) return "raise";
  if (t.includes("call") || t.includes("跟注")) return "call";
  if (t.includes("limp")) return "limp";
  if (t.includes("fold")) return "fold";

  return "unknown";
}

function analyzePreflop(input: string, heroCards: string[]) {
  if (heroCards.length < 2) {
    return {
      summary: "無法讀取 Hero 手牌。",
      decision: "未知",
      advice: ["請輸入 Hero 手牌，例如：Ah Kh"],
      leaks: [] as string[],
    };
  }

  const [c1, c2] = heroCards;
  const hero = classifyHeroHand(c1, c2);
  const pos = detectPosition(input);
  const action = detectPreflopAction(input);

  const leaks: string[] = [];
  const advice: string[] = [];

  let summary = `你在 ${pos} 拿到：${hero.label}。`;

  if (action === "call" && hero.tier === "weak" && !["SB", "BB"].includes(pos)) {
    leaks.push("Preflop 過度 call。");
    advice.push("弱牌在非盲位不應進池。");
  }

  if (action === "limp" && pos !== "SB") {
    leaks.push("不恰當的 limp。");
    advice.push("除 SB 外幾乎沒有 limp 的理由。");
  }

  if (action === "call" && hero.tier === "premium") {
    leaks.push("頂端牌力不該只 call。");
    advice.push("AK, QQ+ 應 raise / 3bet。");
  }

  if (action === "3bet" && hero.tier === "weak") {
    leaks.push("3bet light 過多。");
    advice.push("建議減少用弱牌 3bet light。");
  }

  advice.push("請在 preflop 就先規劃 SPR 與三街計畫。");

  return {
    summary,
    decision: `你的 Preflop 行動：${action}`,
    advice,
    leaks,
  };
}

// ----- Flop -----
function detectFlopSizing(input: string): string | null {
  const t = input.toLowerCase();

  if (t.includes("1/4") || t.includes("25%")) return "small";
  if (t.includes("1/3") || t.includes("33%")) return "small";
  if (t.includes("1/2")) return "medium";
  if (t.includes("2/3") || t.includes("66%")) return "big";
  if (t.includes("3/4") || t.includes("75%")) return "big";
  if (t.includes("pot")) return "pot";
  if (t.includes("overbet") || t.includes("120%")) return "overbet";

  return null;
}

function detectFlopAction(input: string): string {
  const t = input.toLowerCase();
  if (t.includes("x/r") || t.includes("check raise") || t.includes("check-raise")) return "xraise";
  if (t.includes("x/c") || t.includes("check call") || t.includes("check-call")) return "xcall";
  if (t.includes("check")) return "check";
  if (t.includes("raise")) return "raise";
  if (t.includes("bet")) return "bet";
  return "unknown";
}

function analyzeFlop(input: string, board: string[], preAction: string) {
  const texture = classifyBoard(board);
  const action = detectFlopAction(input);
  const sizing = detectFlopSizing(input);

  const advice: string[] = [];
  const leaks: string[] = [];

  let summary = `Flop 牌面：${texture.texture}。`;

  const heroPFR = preAction === "raise" || preAction === "3bet";

  if (heroPFR) summary += "你是 PFR，通常具 range advantage。";
  else summary += "你非 PFR，需要更注重防守與反擊 timing。";

  if (action === "check" && heroPFR) {
    leaks.push("Flop 作為 PFR 過度 check。");
    advice.push("在乾牌面應採用 1/4–1/3 小注高頻 C-Bet。");
  }

  if (action === "bet") {
    if (sizing === "big" && texture.texture === "dry") {
      leaks.push("乾牌面不該使用大注。");
      advice.push("乾牌面建議 1/4–1/3 小注。");
    }

    if (sizing === "overbet" && !texture.paired) {
      leaks.push("Flop 不適合 overbet。");
      advice.push("Overbet 多出現在 turn/river 的極化場景。");
    }
  }

  if (action === "xraise") {
    leaks.push("Flop check-raise 頻率可能過高。");
    advice.push("Check-raise 應以強 value 或高 equity bluff 為主。");
  }

  return {
    summary,
    decision: `你的 Flop 行動：${action}（size: ${sizing ?? "未指定"}）`,
    advice,
    leaks,
  };
}

// ----- Turn -----
function detectTurnAction(input: string): string {
  const t = input.toLowerCase();
  if (t.includes("x/r") || t.includes("check raise") || t.includes("check-raise")) return "xraise";
  if (t.includes("x/c") || t.includes("check call") || t.includes("check-call")) return "xcall";
  if (t.includes("probe")) return "probe";
  if (t.includes("overbet")) return "overbet";
  if (t.includes("bet")) return "bet";
  if (t.includes("check")) return "check";
  return "unknown";
}

function analyzeTurn(input: string, board: string[]) {
  const texture = classifyBoard(board);
  const action = detectTurnAction(input);

  const advice: string[] = [];
  const leaks: string[] = [];

  let summary = `Turn：${texture.texture} 牌面。`;

  if (action === "check") {
    advice.push("Turn check 是可以的，但需有明確 river 計畫。");
    leaks.push("請注意不要在 Turn 過度放棄 equity。");
  }

  if (action === "overbet") {
    leaks.push("Turn overbet 使用頻率偏高。");
    advice.push("Turn overbet 多用於強極化範圍，需確認組合合理。");
  }

  if (action === "xraise") {
    leaks.push("Turn check-raise 頻率可能過高或組合不佳。");
    advice.push("Turn x/r 應限於強 value 與高 equity bluff。");
  }

  return {
    summary,
    decision: `你的 Turn 行動：${action}`,
    advice,
    leaks,
  };
}

// ----- River -----
function detectRiverAction(input: string) {
  const t = input.toLowerCase();
  if (t.includes("x/r") || t.includes("check raise") || t.includes("check-raise")) return "xraise";
  if (t.includes("x/c") || t.includes("check call") || t.includes("check-call")) return "xcall";
  if (t.includes("x/f") || t.includes("check fold") || t.includes("check-fold")) return "xfold";
  if (t.includes("shove") || t.includes("jam") || t.includes("all-in") || t.includes("all in"))
    return "jam";
  if (t.includes("thin")) return "thinvalue";
  if (t.includes("overbet")) return "overbet";
  if (t.includes("bet")) return "bet";
  if (t.includes("check")) return "check";
  return "unknown";
}

function analyzeRiver(input: string, board: string[]) {
  const texture = classifyBoard(board);
  const action = detectRiverAction(input);

  const advice: string[] = [];
  const leaks: string[] = [];

  let summary = `River：${texture.texture}。`;

  if (action === "check") {
    advice.push("River check 代表你放棄主動權，請確認是否錯過 thin value。");
  }

  if (action === "bet") {
    advice.push("River value bet 需要清楚知道哪些更差的牌會跟注你。");
  }

  if (action === "thinvalue") {
    advice.push("Thin value 是高級技巧，需清楚界定對手 bluffcatch 範圍。");
  }

  if (action === "xcall") {
    leaks.push("可能過度使用 hero call。");
    advice.push("Hero call 應建立在 blocker 與 population bluff rate 的理解上。");
  }

  if (action === "overbet") {
    leaks.push("River overbet 使用頻率偏高。");
    advice.push("Overbet 需以極化 range：強 value 或純 bluff 執行。");
  }

  if (action === "jam") {
    advice.push("面對 all-in，請檢查自己的 hand 是否落在合理的 bluffcatch 邊界。");
  }

  return {
    summary,
    decision: `你的 River 行動：${action}`,
    advice,
    leaks,
  };
}

// ----- Leak & Recommendation -----
function calculateScore(leaks: string[]): number {
  const base = 95;
  const penalty = Math.min(leaks.length * 5, 40);
  return Math.max(55, base - penalty);
}

function generatePracticeTags(allLeaks: string[]) {
  return collectPracticeTags(allLeaks);
}

function generateLessonRecommendations(allLeaks: string[]) {
  const tagMap: Record<string, string[]> = {
    "hero call": ["river", "bluffcatch"],
    "過度 check": ["flop"],
    "Flop 作為 PFR 過度 check": ["flop", "cbet"],
    "3bet": ["preflop", "3bet"],
    "overbet": ["river", "overbet"],
  };

  let tags: string[] = [];

  for (const leak of allLeaks) {
    for (const key in tagMap) {
      if (leak.includes(key)) tags.push(...tagMap[key]);
    }
  }

  if (tags.length === 0) tags.push("range");

  return recommendChapters(tags);
}

// ----- 主函式 -----
export function analyzeHandV3(input: string): ReviewResult {
  const cards = extractCards(input);
  const heroCards = cards.slice(0, 2);
  const flop = cards.slice(2, 5);
  const turn = cards.slice(5, 6);
  const river = cards.slice(6, 7);

  const pre = analyzePreflop(input, heroCards);
  const flp = analyzeFlop(input, flop, detectPreflopAction(input));
  const trn = analyzeTurn(input, [...flop, ...turn]);
  const rvr = analyzeRiver(input, [...flop, ...turn, ...river]);

  const allLeaks = [...pre.leaks, ...flp.leaks, ...trn.leaks, ...rvr.leaks];

  const score = calculateScore(allLeaks);
  const recommendedPractice = generatePracticeTags(allLeaks);
  const recommendedLessons = generateLessonRecommendations(allLeaks);

  return {
    score,
    preflop: pre,
    flop: flp,
    turn: trn,
    river: rvr,
    leaks: allLeaks,
    recommendedLessons,
    recommendedPractice,
  };
}
