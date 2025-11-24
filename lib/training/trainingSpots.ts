// lib/training/trainingSpots.ts
// Practice 用 GTO 題庫（正式可用版）

export interface TrainingSpot {
  id: number;
  heroPos: string;
  villainPos: string;
  combo: string;          
  stack: number;

  // GTO 動作
  correctAction: "RAISE" | "CALL" | "FOLD";

  // 教學文字
  explanation: string;
}

export const TRAINING_SPOTS: TrainingSpot[] = [
  {
    id: 1,
    heroPos: "BTN",
    villainPos: "BB",
    combo: "AKo",
    stack: 30,
    correctAction: "RAISE",
    explanation: "BTN 對 BB 時，AKo 屬於純 3bet，長期 EV 表現最佳。"
  },
  {
    id: 2,
    heroPos: "CO",
    villainPos: "BTN",
    combo: "QJs",
    stack: 40,
    correctAction: "CALL",
    explanation: "CO 面對 BTN 時，QJs 多為平跟，作為中段強牌。"
  },
  {
    id: 3,
    heroPos: "BTN",
    villainPos: "SB",
    combo: "A5s",
    stack: 50,
    correctAction: "RAISE",
    explanation: "A5s 在 BTN 為高頻率進攻手牌，可壓制 SB defend range。"
  },
  {
    id: 4,
    heroPos: "UTG",
    villainPos: "CO",
    combo: "88",
    stack: 100,
    correctAction: "CALL",
    explanation: "UTG 88 通常進入冷跟，避免過度擴張 3bet range。"
  }
];
