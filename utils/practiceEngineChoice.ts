// utils/practiceEngineChoice.ts
// 修正版：配合 lib/range/types.ts 的 RangeEntry 欄位（raiseFreq/callFreq/foldFreq）

import { TRAINING_SPOTS } from "../lib/training/trainingSpots";
import { getRangeForPosition } from "../lib/range/rangeLoader";

type Action = "RAISE" | "CALL" | "FOLD";

export interface PracticeResult {
  correctAction: Action;
  suggestion: string;
  rangeInfo: string;
}

export function evaluatePractice(
  position: string,
  combo: string
): PracticeResult {
  const range = getRangeForPosition(position);
  const entry = range[combo.toUpperCase()];

  let correctAction: Action = "FOLD";

  if (entry) {
    const r = entry.raiseFreq ?? 0;
    const c = entry.callFreq ?? 0;
    const f = entry.foldFreq ?? 0;

    if (r > c && r > f) {
      correctAction = "RAISE";
    } else if (c > r && c > f) {
      correctAction = "CALL";
    } else {
      correctAction = "FOLD";
    }

    return {
      correctAction,
      suggestion: `在 ${position.toUpperCase()} 位置，${combo.toUpperCase()} 的 GTO 傾向動作是 ${correctAction}。`,
      rangeInfo: `R:${r.toFixed(2)} C:${c.toFixed(2)} F:${f.toFixed(2)}`,
    };
  }

  // 沒有 range 資料時的 fallback
  return {
    correctAction,
    suggestion: `在 ${position.toUpperCase()} 位置，${combo.toUpperCase()} 沒有對應的範圍資料，預設為 FOLD。`,
    rangeInfo: "無範圍資料",
  };
}

export function getRandomTrainingSpot() {
  const idx = Math.floor(Math.random() * TRAINING_SPOTS.length);
  return TRAINING_SPOTS[idx];
}
