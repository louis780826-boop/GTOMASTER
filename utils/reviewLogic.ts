// utils/reviewLogic.ts
// GTO+ MASTER 複盤核心邏輯（最終穩定版）
// 輸入：一段自然語言牌局描述
// 輸出：一大段繁體中文複盤結果字串（給 UI 直接顯示）

const RANK_ORDER = "23456789TJQKA";

type Card = {
  rank: string;
  suit: string;
};

// --------------- 基礎工具 ---------------

function normalizeText(raw: string): string {
  return raw.replace(/\s+/g, " ").trim();
}

function toLowerNoSpace(raw: string): string {
  return raw.toLowerCase().replace(/\s+/g, "");
}

function parseCard(twoChars: string): Card | null {
  if (!twoChars || twoChars.length !== 2) return null;
  const rank = twoChars[0].toUpperCase();
  const suit = twoChars[1].toLowerCase();
  if (!"23456789TJQKA".includes(rank)) return null;
  if (!"shdc".includes(suit)) return null;
  return { rank, suit };
}

function extractAllTwoCardCombos(text: string): string[] {
  // 例如：Ah Kh / AhKh / ah kh / JJ / 8h8c
  const regex = /([2-9tjqka][shdc]\s*[2-9tjqka][shdc])/gi;
  const matches = text.match(regex);
  if (!matches) return [];
  return matches.map((m) => m.replace(/\s+/g, "").toUpperCase());
}

// --------------- Hero / Villain / Board 解析 ---------------

function extractHeroAndVillain(raw: string): { hero: string | null; villain: string | null } {
  const text = normalizeText(raw).toLowerCase();
  const combos = extractAllTwoCardCombos(text);
  if (combos.length === 0) {
    return { hero: null, villain: null };
  }

  // 嘗試從關鍵字判斷 hero / villain
  // 如果有 "hero"、"我"、"拿" 等就優先當 hero
  let hero: string | null = null;
  let villain: string | null = null;

  // 先預設 hero = 第一組，villain = 最後一組
  hero = combos[0];
  if (combos.length > 1) {
    villain = combos[combos.length - 1];
  }

  // 如果文字中有「對手」、「對家」、「他拿」且後面剛好有手牌，就加強 villain 判定
  // 這裡簡化處理，保留穩定性
  return { hero, villain };
}

function extractBoard(raw: string): string[] {
  // 支援「8hKh8c8s6H」、「8h Kh 8c 8s 6h」這種格式
  const compact = toLowerNoSpace(raw);
  // 找長度 3~5 張牌的連續牌面：每張2字元 => 長度 6~10
  const boardRegex = /([2-9tjqka][shdc]){3,5}/gi;
  const matches = compact.match(boardRegex);
  if (!matches || matches.length === 0) return [];

  const last = matches[matches.length - 1].toLowerCase();
  const cards: string[] = [];
  for (let i = 0; i < last.length; i += 2) {
    const c = last.slice(i, i + 2);
    const parsed = parseCard(c);
    if (parsed) cards.push(parsed.rank + parsed.suit);
  }
  return cards.map((c) => c.toUpperCase());
}

// --------------- 英文牌面描述 ---------------

function describeHeroHand(hero: string | null): string {
  if (!hero || hero.length !== 4) {
    return "未能確定 Hero 手牌強度（描述中請盡量包含明確的兩張手牌，例如 Ah Kh、JJ 等）。";
  }

  const c1 = parseCard(hero.slice(0, 2));
  const c2 = parseCard(hero.slice(2, 4));
  if (!c1 || !c2) {
    return "未能確定 Hero 手牌強度（牌面格式讀取失敗）。";
  }

  const ranks = [c1.rank, c2.rank];
  const suits = [c1.suit, c2.suit];

  let desc = `Hero 手牌：${hero}。\n`;

  if (c1.rank === c2.rank) {
    // 口袋對
    const idx = RANK_ORDER.indexOf(c1.rank);
    if (idx >= RANK_ORDER.indexOf("Q")) {
      desc += "這是一手頂級口袋對（QQ+），屬於 preflop 極高價值牌，通常應該主動爭取較大的底池，避免過多多人底池。\n";
    } else if (idx >= RANK_ORDER.indexOf("9")) {
      desc += "這是一手強口袋對（99–JJ），在多數情境下是 preflop 進攻方的主力牌組，應該有明確的 3bet / 4bet 計畫與 postflop 操作策略。\n";
    } else if (idx >= RANK_ORDER.indexOf("6")) {
      desc += "這是一手中等口袋對（66–88），更多是 set mining 與中小底池控制的工具，避免在不利牌面上做過度 hero call。\n";
    } else {
      desc += "這是一手偏中下的口袋對，更多是 set mining 工具牌，通常不適合在大底池裡硬扛到底。\n";
    }
  } else {
    // 非口袋對
    const suited = suits[0] === suits[1];
    const highRanks = ranks.map((r) => RANK_ORDER.indexOf(r)).sort((a, b) => b - a);
    const highest = highRanks[0];

    if (suited && highest >= RANK_ORDER.indexOf("T")) {
      desc += "這是一手高張同花手牌，兼具抽牌與 showdown value 的潛力，適合用來做半詐唬與翻前積極開局。\n";
    } else if (!suited && highest >= RANK_ORDER.indexOf("T")) {
      desc += "這是一手高張 offsuit 手牌，頂對或 top-top 時有不錯的 showdown value，但要避免 kicker 太弱時硬扛三街。\n";
    } else if (suited) {
      desc += "這是一手同花連張或接近連張牌，更多是以 flop 後強抽牌（強聽牌）為主，翻前不需要打得太大，但要有明確的 postflop 計畫。\n";
    } else {
      desc += "這是一手中下範圍的 offsuit 手牌，通常不適合在大底池中硬扛，除非遇到非常明顯的弱玩家與好位置。\n";
    }
  }

  return desc.trim();
}

function describeFlop(board: string[]): string {
  if (board.length < 3) {
    return "Flop 牌面資訊不足，無法明確判斷紋理與 range 互動。";
  }
  const flop = board.slice(0, 3).map((c) => parseCard(c)).filter(Boolean) as Card[];

  const ranks = flop.map((c) => c.rank);
  const suits = flop.map((c) => c.suit);
  const uniqueSuits = new Set(suits);
  const rankCounts: Record<string, number> = {};
  ranks.forEach((r) => {
    rankCounts[r] = (rankCounts[r] || 0) + 1;
  });

  const isPaired = Object.values(rankCounts).some((c) => c >= 2);
  const isTrips = Object.values(rankCounts).some((c) => c === 3);

  let texture = "";

  if (uniqueSuits.size === 1) {
    texture += "同花（monotone）牌面，flush 完成或強聽牌比例偏高，整體策略需要更偏向極化，避免用中等強度牌大量硬扛。";
  } else if (uniqueSuits.size === 2) {
    texture += "雙花（two-tone）牌面，有明顯 flush 聽牌存在，c-bet 時要注意給對手足夠錯誤的跟注賠率。";
  } else {
    texture += "彩虹（rainbow）牌面，flush 壓力較小，可以更專注在高張、pair 與 straight draw 的交互。";
  }

  if (isTrips) {
    texture = "配對到三條的牌面（trips board），整體 range 通常被嚴重壓縮，價值與詐唬都需要更小的頻率且更明確的對象。";
  } else if (isPaired) {
    texture = "配對牌面（paired board），range 通常會極化得很嚴重，要避免 over-bluff，同時在拿到強牌時不要過度 slow play。";
  }

  return `Flop 牌面特徵：${board.slice(0, 3).join(" ")}。\n${texture}`;
}

function describeTurnRiver(board: string[]): string {
  if (board.length < 4) {
    return "Turn / River 資訊不足，無法完整評估後續街道的策略變化。";
  }
  const turnCard = board[3];
  const riverCard = board.length >= 5 ? board[4] : null;

  let text = `Turn：${turnCard}`;
  text += "。Turn 通常是決策最容易出現 leak 的街道，要特別注意你的延續開火是否有足夠的 value / bluff 結構，以及 SPR 是否允許你繼續在這條線上前進。\n";

  if (riverCard) {
    text += `River：${riverCard}。River 是整手牌的總結，建議在進入 river 前就預先想好「哪些牌面會繼續 value / bluff，哪些牌面直接放棄」，避免臨場才隨機決定。`;
  }

  return text.trim();
}

// --------------- 動作與 leak 分析（文字層面） ---------------

function analyzeActionPattern(raw: string): {
  callDown: boolean;
  overAggro: boolean;
  tooPassive: boolean;
  multiWay: boolean;
} {
  const t = raw.toLowerCase();

  const callDown =
    t.includes("一路call") ||
    t.includes("一路 call") ||
    t.includes("一路跟") ||
    t.includes("call 到 showdown") ||
    t.includes("一路跟到河牌");

  const overAggro =
    t.includes("全下") ||
    t.includes("all-in") ||
    t.includes("all in") ||
    t.includes("jam") ||
    t.includes("overbet");

  const tooPassive =
    t.includes("check behind") ||
    t.includes("慢玩") ||
    t.includes("只跟") ||
    t.includes("平跟") ||
    t.includes("跟注為主");

  const multiWay = t.includes("多人底池") || t.includes("3人") || t.includes("4人");

  return { callDown, overAggro, tooPassive, multiWay };
}

function buildLeakSummary(pattern: ReturnType<typeof analyzeActionPattern>): string {
  const lines: string[] = [];

  if (pattern.callDown) {
    lines.push(
      "你描述中出現「一路 call 到 showdown / 一路跟到河牌」的情況，這通常代表缺乏事先設定『在哪一街要放棄』的停損點，是非常常見的 leak。"
    );
  }
  if (pattern.overAggro) {
    lines.push(
      "牌局中有出現 all-in / 過大下注（overbet/jam）等描述，請確認這些極端下注是否有足夠的 value 組合支撐，而不是單純情緒化操作。"
    );
  }
  if (pattern.tooPassive) {
    lines.push(
      "有提到偏向慢玩、check behind 或過多平跟的傾向，這可能會導致你在拿到強牌時沒有完成應有的價值擷取，也容易讓對手免費實現他們的 equity。"
    );
  }
  if (pattern.multiWay) {
    lines.push(
      "牌局似乎經常出現多人底池，多人底池中你的單一牌力價值會明顯下降，建議在 preflop 與 flop 階段更積極地縮減參與玩家數。"
    );
  }

  if (lines.length === 0) {
    lines.push(
      "從文字中暫時沒有看到特別明顯的極端 leak，但仍建議你檢視：preflop 開局範圍是否過寬、是否經常在 turn 過度延續開火、以及在 river 是否有過多 hero call。"
    );
  }

  lines.push(
    "建議你在之後的訓練中，刻意練習：事先寫下這手牌在各街的『放棄條件』（例如：遇到第三次加注就 fold、river 只接 1.2x pot 以下），讓自己在實戰中有明確的停止點。"
  );

  return lines.join("\n");
}

// --------------- 對手手牌 / 結果描述 ---------------

function describeVillainHand(villain: string | null, raw: string): string {
  if (!villain) {
    return "對手最終手牌在描述中不明確，建議未來記錄牌局時，盡量補上對手攤牌資訊，方便你事後檢討自己的 range 評估是否合理。";
  }

  // 簡單描述 JJ vs AK 類型的典型牌局
  const t = raw.toLowerCase();
  let extra = "";

  if (t.includes("jj") && (villain.includes("AK") || t.includes("ak"))) {
    extra =
      "這手牌屬於非常典型的 JJ vs AK 類型：preflop 本身通常是 coin flip 結構，真正決定輸贏的是你對 SPR 的設計、以及是否有預先規劃好三街的行動，而不是單一結果。";
  }

  return `這手牌最後對手攤出：${villain}。\n${extra}`.trim();
}

// --------------- 主函式：輸入全文 → 回傳整段說明 ---------------

export default function reviewLogic(raw: string): string {
  const text = normalizeText(raw);
  const { hero, villain } = extractHeroAndVillain(text);
  const board = extractBoard(text);
  const pattern = analyzeActionPattern(text);

  const heroDesc = describeHeroHand(hero);
  const flopDesc = board.length >= 3 ? describeFlop(board) : "Flop 牌面資訊不足，建議之後紀錄手牌時盡量補上完整三張公牌。";
  const turnRiverDesc = board.length >= 4 ? describeTurnRiver(board) : "Turn / River 資訊不足，無法完整評估後兩街的策略結構。";
  const leakSummary = buildLeakSummary(pattern);
  const villainDesc = describeVillainHand(villain, text);

  const recommend = [
    "推薦接下來可優先複習的 GTO 觀念：",
    "1. Preflop：開局範圍與 3bet / 4bet 結構，避免在無位置情況下用中等強度牌過度 defend。",
    "2. Flop：牌面紋理判讀（paired / monotone / two-tone / 高低牌混合），決定哪些牌型適合作為持續下注的主力。",
    "3. Turn：學習如何在 turn 收縮槍口（barrel 範圍縮窄），避免用過多中等強度牌硬扛到 river。",
    "4. River：建立 bluff / value 的比例概念，不要讓自己的 river 行為一看就被對手讀成『不是 nuts 就是空氣』。",
  ].join("\n");

  const result = [
    heroDesc,
    "",
    flopDesc,
    "",
    turnRiverDesc,
    "",
    villainDesc,
    "",
    "優先修正的 leak（建議當作接下來訓練重點）：",
    leakSummary,
    "",
    recommend,
  ].join("\n");

  return result.trim();
}
