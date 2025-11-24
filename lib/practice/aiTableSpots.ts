export type AiTableSpot = {
  id: string;
  tableType: string;
  heroPosition: string;
  heroCards: string[]; // 兩張牌，格式如 "K♠"
  board: string[];
  pot: number;
  effectiveStack: number;
  villainPosition: string;
  villainAction: string;
  description: string;
  actions: string[];
  correctAction: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  explanation: string;
};

export const AI_TABLE_SPOTS: AiTableSpot[] = [
  {
    id: "btn-vs-bb-a5s-srpot",
    tableType: "6-max 現金局 · BTN vs BB",
    heroPosition: "BTN",
    heroCards: ["A♠", "5♠"],
    board: ["K♦", "7♣", "2♠"],
    pot: 4.5,
    effectiveStack: 36,
    villainPosition: "BB",
    villainAction: "BB check 給你行動。",
    description:
      "40BB 有效籌碼，你在 BTN open 2.5bb，BB 防守。翻牌 K♦7♣2♠，BB check。",
    actions: ["check-back", "small-bet", "overbet"],
    correctAction: "small-bet",
    difficulty: "easy",
    tags: ["SRP", "BTN vs BB", "cbet", "high-card-board"],
    explanation:
      "在標準情況下，BTN range 在這類高牌 board 具 range advantage，且 A5s 具備 backdoor equity 與 blocker 效應，小額 cbet 是常見線路。check-back 雖非錯誤，但會讓你在許多情況下放棄主動權。",
  },
  {
    id: "co-3bet-pot-qq",
    tableType: "6-max 現金局 · 3bet pot",
    heroPosition: "CO",
    heroCards: ["Q♣", "Q♠"],
    board: ["T♥", "6♣", "3♦"],
    pot: 18,
    effectiveStack: 82,
    villainPosition: "BTN",
    villainAction: "BTN call 你的 3bet，翻牌你先行。",
    description:
      "你在 CO 持 QQ 對 BTN open 做 3bet，BTN call。翻牌 T♥6♣3♦，你在位置優勢。",
    actions: ["check-back", "small-bet", "big-bet"],
    correctAction: "small-bet",
    difficulty: "medium",
    tags: ["3bet pot", "overpair", "cbet"],
    explanation:
      "這類中高連接 board 對 3bet range 相對有利，你的 QQ 為強 value。多數情況下小額 cbet 即可達到保護與 thin value 目的，大注在此類情況較傾向偏極化策略。",
  },
  {
    id: "sb-vs-bb-kjs",
    tableType: "6-max 現金局 · SB vs BB",
    heroPosition: "SB",
    heroCards: ["K♠", "J♠"],
    board: ["9♠", "8♣", "2♦"],
    pot: 5,
    effectiveStack: 45,
    villainPosition: "BB",
    villainAction: "BB check 給你行動。",
    description:
      "你在 SB open，BB call。翻牌 9♠8♣2♦ 屬於中段連接 board，range 較接近。",
    actions: ["check-back", "small-bet", "big-bet"],
    correctAction: "check-back",
    difficulty: "medium",
    tags: ["SRP", "SB vs BB", "mixed-strategy"],
    explanation:
      "SB 在這類中段連接牌面上，range 優勢不明顯，BB 擁有更多兩對與強 draw。KJs 雖有 overcard 與 backdoor，但在實務中這類手牌偏向混頻，check-back 讓你保留 turn / river 遊戲空間。",
  },
  {
    id: "bb-defend-a4o",
    tableType: "6-max 現金局 · BB 防守",
    heroPosition: "BB",
    heroCards: ["A♦", "4♣"],
    board: ["Q♣", "7♦", "2♣"],
    pot: 5,
    effectiveStack: 48,
    villainPosition: "BTN",
    villainAction: "BTN cbet 小注 1/3 pot。",
    description:
      "BTN open，BB 防守。翻牌 Q♣7♦2♣，BTN 用 1/3 pot 小注 cbet。",
    actions: ["fold", "call", "raise"],
    correctAction: "call",
    difficulty: "easy",
    tags: ["SRP", "BB defend", "vs small cbet"],
    explanation:
      "A4o 雖然沒擊中，但擁有 backdoor wheel、backdoor flush blocker 與高牌優勢。面對小注 cbet，多數情況下可以作為防守範圍的一部分選擇 call，而非直接 fold。",
  },
];

export function getRandomAiTableSpot(): AiTableSpot {
  const idx = Math.floor(Math.random() * AI_TABLE_SPOTS.length);
  return AI_TABLE_SPOTS[idx];
}
