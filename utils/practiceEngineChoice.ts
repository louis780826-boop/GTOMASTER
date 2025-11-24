// utils/practiceEngineChoice.ts
// GTO 三選一題型：RAISE / CALL / FOLD

import { TRAINING_SPOTS } from "../lib/training/trainingSpots";
import { POSITION_RANGES } from "../lib/range/rangeData";

type Action = "RAISE" | "CALL" | "FOLD";

export function generateChoiceQuestion() {
  const useTraining = Math.random() < 0.5;

  if (useTraining && TRAINING_SPOTS.length > 0) {
    const idx = Math.floor(Math.random() * TRAINING_SPOTS.length);
    const spot = TRAINING_SPOTS[idx];

    const prompt = `${spot.heroPos} 對 ${spot.villainPos} · ${spot.stack}bb\n手牌：${spot.combo}\n在這個情境下，GTO 建議的主要動作是？`;

    return {
      type: "choice",
      source: "training",
      heroPos: spot.heroPos,
      villainPos: spot.villainPos,
      combo: spot.combo,
      stack: spot.stack,
      prompt,
      correctAnswer: spot.correctAction as Action,
      explanation: spot.explanation,
      check: (ans: string) => ans === spot.correctAction
    };
  }

  // 用 13×13 範圍隨機抽一手牌
  const posIndex = Math.floor(Math.random() * POSITION_RANGES.length);
  const pos = POSITION_RANGES[posIndex];

  const rowIdx = Math.floor(Math.random() * pos.grid.length);
  const colIdx = Math.floor(Math.random() * pos.grid[0].length);
  const cell = pos.grid[rowIdx][colIdx];

  let correct: Action = "FOLD";
  if (cell.variant === "strong") correct = "RAISE";
  else if (cell.variant === "mix") correct = Math.random() < 0.5 ? "RAISE" : "CALL";

  const prompt = `${pos.name} 開局 · 100bb\n手牌：${cell.label}\n在這個位置，這手牌的主要 GTO 動作是？`;

  const explanation =
    cell.variant === "strong"
      ? `${cell.label} 在 ${pos.name} 屬於高頻開局 / 進攻手牌，因此 GTO 以主動出手為主。`
      : cell.variant === "mix"
      ? `${cell.label} 在 ${pos.name} 屬於混合策略手牌，會在不同情境下選擇進攻或跟注。`
      : `${cell.label} 在 ${pos.name} 幾乎不會主動參與底池，GTO 以棄牌為主。`;

  return {
    type: "choice",
    source: "range",
    heroPos: pos.name,
    villainPos: "",
    combo: cell.label,
    stack: 100,
    prompt,
    correctAnswer: correct,
    explanation,
    check: (ans: string) => ans === correct
  };
}
