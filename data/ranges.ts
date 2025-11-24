// /data/ranges.ts

export type Position = "UTG" | "HJ" | "CO" | "BTN" | "SB" | "BB";

export type RangeBlock = {
  label: string;
  hands: string;
  note: string;
};

export const openingRanges: Record<Position, RangeBlock[]> = {
  UTG: [
    {
      label: "Premium / 強牌",
      hands: "AA–TT, AKs, AQs, AKo",
      note: "UTG 範圍最緊，主要以高對子與高 A 為主。",
    },
    {
      label: "中等口袋＋強同花連牌",
      hands: "99–77, KQs, QJs, JTs",
      note: "這些牌在多數 solver 中為混合開局，部分局況會棄牌。",
    },
    {
      label: "Bluff / 混合開局",
      hands: "A5s, KJs, T9s",
      note: "主要搭配 A5s 這類 wheel A 作為 bluff balance。",
    },
  ],
  HJ: [
    {
      label: "Value 開局",
      hands: "AA–99, AKs, AQs–ATs, AKo",
      note: "比 UTG 稍微寬一些，可以多加入 ATs、99。",
    },
    {
      label: "高頻開局",
      hands: "88–66, KQs, KJs, QJs, JTs, T9s",
      note: "這些牌在多數局況幾乎都會開。",
    },
    {
      label: "低頻 / 混合",
      hands: "A5s–A2s, KTo, QTs, 98s",
      note: "多為混合開局，視後位玩家風格與 blinds 而定。",
    },
  ],
  CO: [
    {
      label: "Value 開局",
      hands: "AA–88, AKs–ATs, AKo–AQo",
      note: "CO 開局範圍已經明顯變寬，但頂端 range 不變。",
    },
    {
      label: "標準開局範圍",
      hands: "77–55, KQs–KTs, QJs–QTs, JTs–T9s, 98s",
      note: "這是 CO 位置最常見、也是 solver 建議的主力開局牌。",
    },
    {
      label: "Bluff / 平衡",
      hands: "A9o–A2o(部分), K9s, 87s, 76s",
      note: "依對手實力與 blind 3bet 傾向調整頻率。",
    },
  ],
  BTN: [
    {
      label: "廣泛 Value 開局",
      hands: "AA–66, AK–AT(含 o 與 s), KQs–K9s",
      note: "BTN 為最有利位置，可以開得非常寬。",
    },
    {
      label: "寬範圍開局",
      hands: "55–22, QJs–Q9s, JTs–J8s, T9s–T8s, 98s–54s",
      note: "多數同花連牌、gapper 在 BTN 幾乎都可以開。",
    },
    {
      label: "邊緣 / exploit",
      hands: "A9o–A2o, KJo–K9o, QTo–Q9o, JTo",
      note: "標準 GTO 下部分手牌會混合開局，實戰可看 blinds 適度調整。",
    },
  ],
  SB: [
    {
      label: "標準 heads-up 開局",
      hands: "AA–任何對子, AK–A2, KQ–K5s, QJ–Q8s",
      note: "盲注戰 SB vs BB 時，solver 建議 open 極寬。",
    },
    {
      label: "同花連牌 / 一 gapper",
      hands: "JTs–54s, K9s–K5s, Q9s–Q6s",
      note: "這些牌具備良好 postflop 操作空間。",
    },
    {
      label: "邊緣牌",
      hands: "大多數 offsuit broadway, 一些中小 A-high",
      note: "實戰可依 BB 防守/3bet 頻率調整 open 頻率。",
    },
  ],
  BB: [
    {
      label: "對開局的 defend（示意）",
      hands: "多數同花牌, 大部分同花連牌, 各種對子",
      note: "BB 投入已經在池中，defend 範圍通常最廣。",
    },
    {
      label: "3bet for value",
      hands: "QQ+, AK, 部分 JJ–TT",
      note: "依對手位置與開局範圍決定 3bet 頻率。",
    },
    {
      label: "3bet bluff 候選",
      hands: "A5s–A2s, K9s, QTs, 76s–54s",
      note: "多以有 blocker 或可玩性高的同花連牌為主。",
    },
  ],
};
