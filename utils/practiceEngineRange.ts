// utils/practiceEngineRange.ts
// 範圍識別題：問這手牌在某位置屬於 strong / mix / fold

import { POSITION_RANGES } from "../lib/range/rangeData";

type Variant = "strong" | "mix" | "fold";

export function generateRangeQuestion() {
  const posIndex = Math.floor(Math.random() * POSITION_RANGES.length);
  const pos = POSITION_RANGES[posIndex];

  const rowIdx = Math.floor(Math.random() * pos.grid.length);
  const colIdx = Math.floor(Math.random() * pos.grid[0].length);
  const cell = pos.grid[rowIdx][colIdx];

  const variant = cell.variant as Variant;

  const prompt = `${pos.name} 開局 · 100bb\n手牌：${cell.label}\n\n在 ${pos.name} 的開局範圍中，這手牌比較接近：\n- 強勢核心範圍（strong）\n- 混合 / 邊緣範圍（mix）\n- 低頻參與 / 棄牌（fold）？`;

  const explanation =
    variant === "strong"
      ? `${cell.label} 在 ${pos.name} 屬於核心開局範圍，多數情況會主動進入底池。`
      : variant === "mix"
      ? `${cell.label} 在 ${pos.name} 屬於邊緣或混合範圍，會根據對手與動作決定是否加入。`
      : `${cell.label} 在 ${pos.name} 幾乎不會出現在開局範圍，GTO 以棄牌為主。`;

  return {
    type: "range",
    position: pos.name,
    combo: cell.label,
    prompt,
    correctAnswer: variant,
    explanation,
    check: (ans: string) => ans === variant
  };
}
