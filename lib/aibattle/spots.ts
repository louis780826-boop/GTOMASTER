export type StreetConfig = {
  villainAction: string;
  actions: string[]; // 可選動作
  correctAction: string;
  explanation: string;
};

export type AIBattleSpot = {
  id: string;
  tableType: string;
  heroPosition: string;
  heroCards: string[]; // 例如 ["A♠", "5♠"]
  boardFlop: string[]; // 例如 ["K♦", "7♣", "2♠"]
  turnCard: string; // "9♥"
  riverCard: string; // "3♣"
  pot: number;
  effectiveStack: number;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  preflopDescription: string;
  flop: StreetConfig;
  turn: StreetConfig;
  river: StreetConfig;
};

export const AIBATTLE_SPOTS: AIBattleSpot[] = [
  {
    id: "btn-vs-bb-a5s-3street",
    tableType: "6-max 現金局 · BTN vs BB · 單挑底池",
    heroPosition: "BTN",
    heroCards: ["A♠", "5♠"],
    boardFlop: ["K♦", "7♣", "2♠"],
    turnCard: "9♥",
    riverCard: "3♣",
    pot: 4.5,
    effectiveStack: 36,
    difficulty: "easy",
    tags: ["SRP", "BTN vs BB", "cbet", "3street-line"],
    preflopDescription:
      "40BB 有效籌碼，你在 BTN 拿到 A♠5♠。前位全棄牌到你，標準做法是 open 2.5BB，BB 防守，進入單挑底池。",
    flop: {
      villainAction: "翻牌 K♦7♣2♠，BB check 給你行動。",
      actions: ["check-back", "small-bet", "overbet"],
      correctAction: "small-bet",
      explanation:
        "這個牌面大多數情況下對 BTN 比較有利，而你拿著 A♠5♠，有後門同花與順子的可能。用小注 cbet 可以同時爭取底池與保留轉牌、河牌的出路。check-back 並不是錯，但會讓你放棄很多直接贏下底池的機會；overbet 在這裡風險偏高，沒有必要。",
    },
    turn: {
      villainAction: "BB 跟注翻牌小注，轉牌 9♥，BB 再次 check。",
      actions: ["check-back", "small-bet", "big-bet"],
      correctAction: "check-back",
      explanation:
        "9♥ 這張牌對你來說不是特別好的牌，對手會多一些兩對或更強的組合。此時用 Check 把這手牌收斂成中途放棄是很合理的選擇，也能控制底池大小，避免在不利局面下放太多籌碼。",
    },
    river: {
      villainAction: "河牌 3♣，BB 第三次 check。",
      actions: ["give-up-check", "small-bluff", "big-bluff"],
      correctAction: "give-up-check",
      explanation:
        "這條線下來，你沒有形成明確的價值牌，對手也有不少 bluff 會自己放棄。這裡通常不需要硬撐一個大 bluff，Check 把這一手收尾就好。這樣的玩牌方式雖然看起來不華麗，但在長期對局裡是穩定且健康的選擇。",
    },
  },
  {
    id: "co-vs-btn-qq-3bet-3street",
    tableType: "6-max 現金局 · CO 3bet vs BTN",
    heroPosition: "CO",
    heroCards: ["Q♣", "Q♠"],
    boardFlop: ["T♥", "6♣", "3♦"],
    turnCard: "2♠",
    riverCard: "K♣",
    pot: 18,
    effectiveStack: 82,
    difficulty: "medium",
    tags: ["3bet pot", "overpair", "value-line"],
    preflopDescription:
      "BTN open，CO 持 Q♣Q♠ 做 3bet，BTN 跟注，形成 3bet pot，位置在你身上。",
    flop: {
      villainAction: "翻牌 T♥6♣3♦，你先行決策。",
      actions: ["check", "small-bet", "big-bet"],
      correctAction: "small-bet",
      explanation:
        "這個牌面整體還是偏向 3bet 方有優勢，而 QQ 在這裡通常是穩定的 value 牌。使用小注 cbet 就足夠達到保護與收集價值的目的，沒有必要在這種並不特別濕的牌面上打很大的注。",
    },
    turn: {
      villainAction: "BTN 跟注小注，轉牌 2♠，你再次行動。",
      actions: ["check", "small-bet", "big-bet"],
      correctAction: "small-bet",
      explanation:
        "2♠ 幾乎沒有改變雙方的牌力結構，對手如果有強牌在翻牌通常就會有一些進攻。這裡繼續用小注向較弱的一對或高張收集價值是合理的，下注過大反而容易讓更差的牌直接棄牌。",
    },
    river: {
      villainAction: "BTN 再次跟注，河牌 K♣ 到來，你先行。",
      actions: ["check", "thin-bet", "big-bet"],
      correctAction: "check",
      explanation:
        "K♣ 是對你比較不友善的牌，會讓對手多出不少超過 QQ 的組合。這裡選擇 Check，多數情況下可以透過對手過於激進的 bluff 或較小的下注來做防守，自己主動下注容易在被跟注時面對較強範圍。",
    },
  },
  {
    id: "sb-vs-bb-kjs-3street",
    tableType: "6-max 現金局 · SB vs BB",
    heroPosition: "SB",
    heroCards: ["K♠", "J♠"],
    boardFlop: ["9♠", "8♣", "2♦"],
    turnCard: "T♣",
    riverCard: "2♣",
    pot: 5,
    effectiveStack: 45,
    difficulty: "medium",
    tags: ["SRP", "SB vs BB", "draw-line"],
    preflopDescription:
      "你在 SB open，BB 跟注，形成 SB vs BB 單挑。你持有 K♠J♠，屬於有潛力的高張同花連結牌。",
    flop: {
      villainAction: "翻牌 9♠8♣2♦，BB check 給你。",
      actions: ["check-back", "small-bet", "big-bet"],
      correctAction: "check-back",
      explanation:
        "這個牌面對 BB 而言會有不少兩對、順子與強聽牌，你的整體範圍並沒有太大優勢。K♠J♠ 雖然有後門同花與順子潛力，但在這裡過於頻繁下注容易被 check-raise 給壓力。先 Check 保留 turn 的彈性會更穩健。",
    },
    turn: {
      villainAction: "轉牌 T♣，BB 再次 check。",
      actions: ["small-bet", "big-bet", "check-back"],
      correctAction: "small-bet",
      explanation:
        "T♣ 讓你多了一個明確的順子聽牌與更多強牌可能性。此時用小注攻擊可以同時爭取 fold equity，讓一些較弱的對子或沒有發展的牌直接棄掉，同時在你未來中到好牌時也比較容易拿到支付。",
    },
    river: {
      villainAction: "BB 跟注轉牌小注，河牌 2♣，BB 第三次 check。",
      actions: ["give-up-check", "small-bluff", "big-bluff"],
      correctAction: "small-bluff",
      explanation:
        "河牌補出 2♣，讓桌面成雙，部分對手的聽牌會失敗。你沒有完成順子或同花，但你代表的範圍仍然可以包含不少強牌。用小尺寸的 bluff，可以在對手棄掉中等實力的一對或較弱組合時獲利，同時控制風險，不需要用到大注去硬塞壓力。",
    },
  },
];

export function getRandomAIBattleSpot(): AIBattleSpot {
  const idx = Math.floor(Math.random() * AIBATTLE_SPOTS.length);
  return AIBATTLE_SPOTS[idx];
}
