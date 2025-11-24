// utils/practiceEngineMix.ts
// MIX% 題型：問「這手牌 GTO 的主力動作傾向」

import { POSITION_RANGES } from "../lib/range/rangeData";

type MainAction = "RAISE" | "CALL" | "FOLD";

interface MixProfile {
  main: MainAction;
  raise: number;
  call: number;
  fold: number;
}

function profileFromVariant(variant: "strong" | "mix" | "fold"): MixProfile {
  if (variant === "strong") {
    return { main: "RAISE", raise: 70, call: 20, fold: 10 };
  }
  if (variant === "mix") {
    return { main: "CALL", raise: 35, call: 45, fold: 20 };
  }
  return { main: "FOLD", raise: 10, call: 15, fold: 75 };
}

export function generateMixQuestion() {
  // 從範圍表抽題
  const posIndex = Math.floor(Math.random() * POSITION_RANGES.length);
  const pos = POSITION_RANGES[posIndex];

  const rowIdx = Math.floor(Math.random() * pos.grid.length);
  const colIdx = Math.floor(Math.random() * pos.grid[0].length);
  const cell = pos.grid[rowIdx][colIdx];

  const prof = profileFromVariant(cell.variant);

  const prompt = `${pos.name} 開局 · 100bb\n手牌：${cell.label}\n\n假設 GTO 頻率為：\n- Raise：${prof.raise}%\n- Call：${prof.call}%\n- Fold：${prof.fold}%\n\n在實戰中，你會把這手牌當作哪一種「主力動作」？`;

  const explanation = `在 ${pos.name}，${cell.label} 的 GTO 行為大致是 Raise ${prof.raise}%，Call ${prof.call}%，Fold ${prof.fold}%。因此整體來說，它更偏向「${prof.main}」的角色。`;

  return {
    type: "mix",
    position: pos.name,
    combo: cell.label,
    prompt,
    correctAnswer: prof.main,
    explanation,
    check: (ans: string) => ans === prof.main
  };
}
