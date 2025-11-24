export type ReviewResult = {
  score: number;
  label: string;
  comments: string[];
  leaks: string[];
};

// ===== 小工具：牌面解析 =====

// 支援 AhKh / Ah Kh / 8hKh8c8s6H 這類格式，大小寫都可
function extractCards(str: string): string[] {
  const matches = str.match(/([2-9TJQKA][shdcSHDC])/g);
  if (!matches) return [];
  return matches.map((c) => c.toLowerCase()); // 統一小寫處理
}

function rankValue(r: string): number {
  return "23456789TJQKA".indexOf(r.toUpperCase());
}

type HeroTier = "top" | "strong" | "medium" | "marginal" | "trash";

function classifyHeroByCards(cards: string[]): { label: string; tier: HeroTier } {
  if (cards.length !== 2) {
    return { label: "未提供明確手牌", tier: "medium" };
  }
  const [c1, c2] = cards;
  const r1 = c1[0];
  const r2 = c2[0];
  const s1 = c1[1];
  const s2 = c2[1];

  const pair = r1 === r2;
  const suited = s1 === s2;
  const highCount =
    (rankValue(r1) >= rankValue("T") ? 1 : 0) +
    (rankValue(r2) >= rankValue("T") ? 1 : 0);

  if (pair && rankValue(r1) >= rankValue("Q")) {
    return { label: "頂端口袋對（QQ+）", tier: "top" };
  }
  if (
    (r1 === "A" && r2 === "K") ||
    (r1 === "K" && r2 === "A")
  ) {
    return { label: "AK 頂端組合", tier: "top" };
  }
  if (pair && rankValue(r1) >= rankValue("9")) {
    return { label: "強口袋對（99–JJ）", tier: "strong" };
  }
  if (suited && highCount === 2) {
    return { label: "強同花大牌（AQs、KQs 類）", tier: "strong" };
  }
  if (pair && rankValue(r1) >= rankValue("6")) {
    return { label: "中等口袋對", tier: "medium" };
  }
  if (suited && highCount === 1) {
    return { label: "中等同花高牌 / 連牌", tier: "medium" };
  }
  if (pair) {
    return { label: "邊緣小口袋對", tier: "marginal" };
  }
  if (highCount === 0) {
    return { label: "偏弱非同花組合", tier: "trash" };
  }
  return { label: "邊緣高牌組合", tier: "marginal" };
}

// 支援「Hero 手牌：Ah Kh」「手拿JJ」「單獨輸入 ah kh」這幾種
function classifyHeroFromText(input: string): { label: string; tier: HeroTier } {
  // 1) 先試 Hero / Hero 手牌 行
  const heroLine =
    input.match(/hero[^\n]*?([2-9TJQKA][shdc]\s*[2-9TJQKA][shdc])/i)?.[1] ||
    input.match(/hero 手牌[:：]\s*([^\n]+)/i)?.[1] ||
    "";

  const heroByCards = extractCards(heroLine);
  if (heroByCards.length === 2) {
    return classifyHeroByCards(heroByCards);
  }

  // 2) 再試「手拿JJ」「手拿 QQ」這種中文描述
  const jjMatch = input.match(/手拿\s*([2-9TJQKA]{2})/i);
  if (jjMatch) {
    const ranks = jjMatch[1].toUpperCase();
    if (ranks[0] === ranks[1]) {
      const r = ranks[0];
      if (r === "A" || r === "K" || r === "Q") {
        return { label: `頂端口袋對（${r}${r}）`, tier: "top" };
      }
      if (r === "J" || r === "T" || r === "9") {
        return { label: `強口袋對（${r}${r}）`, tier: "strong" };
      }
      if (r === "8" || r === "7" || r === "6") {
        return { label: `中等口袋對（${r}${r}）`, tier: "medium" };
      }
      return { label: `小口袋對（${r}${r}）`, tier: "marginal" };
    }
  }

  // 3) 保底：直接從整段文字抓所有牌，拿前兩張當 Hero（例如單獨輸入 "ah kh"）
  const allCards = extractCards(input);
  if (allCards.length >= 2) {
    return classifyHeroByCards(allCards.slice(0, 2));
  }

  // 4) 還是抓不到就放棄
  return { label: "未能確定 Hero 手牌強度", tier: "medium" };
}

// 簡單的 flop 牌面分類，用「最後 3–5 張牌」粗略當 board
function classifyBoardTexture(cards: string[]): { label: string; note: string } {
  if (cards.length < 3) {
    return {
      label: "未提供牌面",
      note:
        "這次沒有提供具體的公共牌，因此我沒辦法做牌面結構分析，只能針對 preflop 與整體線路給建議。",
    };
  }

  const ranks = cards.map((c) => c[0]);
  const suits = cards.map((c) => c[1]);
  const uniqSuit = new Set(suits);
  const vals = ranks.map(rankValue).sort((a, b) => a - b);

  const isPaired =
    ranks[0] === ranks[1] ||
    ranks[0] === ranks[2] ||
    ranks[1] === ranks[2];

  if (uniqSuit.size === 1) {
    return {
      label: "單色濕板 Flop",
      note: "單一花色的牌面，同花強度與阻擋牌特別重要。",
    };
  }
  if (uniqSuit.size === 2 && vals[2] - vals[0] <= 4) {
    return {
      label: "濕板 Flop（有順有花）",
      note:
        "順子與同花聽牌都很多，下注頻率和尺寸要更謹慎，避免給對手免費實現 equity。",
    };
  }
  if (!isPaired && uniqSuit.size === 3 && vals[2] - vals[0] > 4) {
    return {
      label: "超乾 Flop",
      note:
        "這種乾牌面多數情況 PFR 端有 range 優勢，可以用較高頻率的小尺寸 c-bet。",
    };
  }
  if (isPaired) {
    return {
      label: "配對牌面 Flop",
      note:
        "配對牌面容易讓 range 極化，要注意不要 over-bluff，也不要過度 hero call。",
    };
  }

  return { label: "一般牌面", note: "" };
}

// 找「他拿 AKs」這種對手攤牌
function detectVillainHand(input: string): string | null {
  const m = input.match(/他拿\s*([2-9TJQKA]{2}s?)/i);
  if (!m) return null;
  return m[1].toUpperCase();
}

// ===== Sizing 擷取與分析 =====

type SizingSummary = {
  small: number; // 1/4, 1/3
  medium: number; // 1/2
  big: number; // 2/3, 3/4
  pot: number; // pot, 滿池
  overbet: number; // overbet, 超池
  jam: number; // all-in, jam, shove, 全壓
};

function extractSizingPatterns(input: string): SizingSummary {
  const lower = input.toLowerCase();
  const summary: SizingSummary = {
    small: 0,
    medium: 0,
    big: 0,
    pot: 0,
    overbet: 0,
    jam: 0,
  };

  // 小注：1/4, 1/3
  summary.small += (lower.match(/1\/4/g) || []).length;
  summary.small += (lower.match(/1\/3/g) || []).length;
  if (lower.includes("小注")) summary.small += 1;

  // 中注：1/2
  summary.medium += (lower.match(/1\/2/g) || []).length;
  if (lower.includes("half pot") || lower.includes("半池")) summary.medium += 1;

  // 大注：2/3, 3/4
  summary.big += (lower.match(/2\/3/g) || []).length;
  summary.big += (lower.match(/3\/4/g) || []).length;
  if (lower.includes("大注")) summary.big += 1;

  // pot（避免誤抓其他字，這裡用 \bpot\b）
  summary.pot += (lower.match(/\bpot\b/g) || []).length;
  if (lower.includes("滿池")) summary.pot += 1;
  if (lower.includes("pot size")) summary.pot += 1;

  // overbet
  if (lower.includes("overbet") || lower.includes("超池") || lower.includes("超過底池")) {
    summary.overbet += 1;
  }

  // jam / shove / all-in / 全壓 / 全下
  if (
    lower.includes("all-in") ||
    lower.includes("all in") ||
    lower.includes("jam") ||
    lower.includes("shove") ||
    lower.includes("全壓") ||
    lower.includes("全下")
  ) {
    summary.jam += 1;
  }

  return summary;
}

// ===== 主函式：給 Review / Coach 使用 =====

export function analyzeHandV2(input: string): ReviewResult {
  const lower = input.toLowerCase();
  const comments: string[] = [];
  const leaks: string[] = [];
  let score = 82;

  // 1) Hero 手牌
  const heroInfo = classifyHeroFromText(input);
  comments.push(`Hero 手牌評估：${heroInfo.label}。`);

  // 2) 牌面（支援 8hKh8c8s6H 一串貼上）
  const allCards = extractCards(input);
  const boardCards = allCards.length >= 3 ? allCards.slice(-5) : []; // 粗略取最後 3–5 張當 board
  const boardInfo = classifyBoardTexture(boardCards);
  comments.push(`Flop 牌面特徵：${boardInfo.label}。`);
  if (boardInfo.note) comments.push(boardInfo.note);

  if (boardInfo.label === "未提供牌面") {
    comments.push(
      "下次如果能把 Flop / Turn / River 一起打上來，我可以針對每一街的牌面變化做更精準的建議。"
    );
  }

  // 3) 對手攤牌
  const villain = detectVillainHand(input);
  if (villain) {
    comments.push(`這手牌最後對手攤出：${villain}。`);
    if (heroInfo.label.includes("口袋對") && villain.startsWith("AK")) {
      comments.push(
        "JJ vs AK 這類標準 coin flip，preflop 本身沒有太大問題，重點在於你怎麼設計 SPR、以及有沒有計畫好後續三街。"
      );
    }
  }

  // 4) Sizing 模式
  const sizing = extractSizingPatterns(input);
  const totalSizingEvents =
    sizing.small +
    sizing.medium +
    sizing.big +
    sizing.pot +
    sizing.overbet +
    sizing.jam;

  if (totalSizingEvents > 0) {
    const used: string[] = [];
    if (sizing.small) used.push("小注（1/4~1/3）");
    if (sizing.medium) used.push("中等注（1/2）");
    if (sizing.big) used.push("大注（2/3~3/4）");
    if (sizing.pot) used.push("滿池注");
    if (sizing.overbet) used.push("overbet / 超池");
    if (sizing.jam) used.push("All-in / Jam");

    comments.push(`這手牌中你提到的下注尺寸類型：${used.join("、")}。`);

    // 教練級判斷
    if (sizing.small > 0 && sizing.big === 0 && sizing.overbet === 0 && sizing.jam === 0) {
      comments.push(
        "整手牌幾乎都偏小注，常見問題是拿到明顯領先時沒有把底池做大，或讓對手太便宜地實現聽牌。"
      );
      leaks.push("在有明顯 range / 牌力優勢時下注尺寸過小，長期會漏失 value。");
      score -= 4;
    }

    if (sizing.big + sizing.overbet + sizing.pot >= 2) {
      comments.push(
        "你在描述中使用了多次大尺寸（2/3 以上、滿池或 overbet），整體趨向於把底池做得偏大。"
      );
      leaks.push(
        "大尺寸與 overbet 使用頻率較高，請確認你的 range 是否足夠 polar，否則容易讓對手 exploit。"
      );
      score -= 3;
    }

    if (sizing.jam > 0 && totalSizingEvents === sizing.jam) {
      comments.push(
        "描述中幾乎只提到 All-in / Jam，而沒有提到前面街別的尺寸規劃，代表你在回想這手牌時主要只記得「最後一槍」。"
      );
      leaks.push("習慣只記得 All-in 結果，忽略前面街別的尺寸與決策，容易錯過真正的 leak。");
    }

    if (sizing.overbet > 0) {
      comments.push(
        "有使用 overbet / 超池尺寸，這在現代 GTO 裡是合理武器，但前提是你的 value 與 bluff 組合必須很清楚。"
      );
    }
  }

  // 5) 情緒 / 決策習慣相關 leak
  if (lower.includes("怕") || lower.includes("害怕")) {
    leaks.push("描述中多次提到「怕」，代表決策過程偏向情緒，而不是以 range 為主的思考。");
    score -= 4;
  }
  if (lower.includes("隨便") || lower.includes("感覺")) {
    leaks.push("依賴「感覺」做決策，缺乏清楚的 preflop / postflop 計畫。");
    score -= 4;
  }
  if (lower.includes("一路call") || lower.includes("一路 call")) {
    leaks.push("你提到「一路 call 到 showdown」，常見問題是缺乏事先設定『在哪一街要放棄』的停損點。");
  }

  // 6) 總體評價 label
  let label = "一般水準，還有進步空間";
  if (score >= 90) label = "非常接近標準 GTO 決策";
  else if (score >= 80) label = "整體方向正確，但仍有幾個明顯 leak";
  else if (score >= 70) label = "決策偏離標準不少，建議重整整體思考流程";
  else label = "整手牌的決策結構都有問題，需要從基礎策略重新整理";

  return {
    score,
    label,
    comments,
    leaks,
  };
}
