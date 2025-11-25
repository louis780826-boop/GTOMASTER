// utils/practiceEngineRange.ts
// 範圍識別題：問這手牌在某位置屬於 strong / mix / fold
// 改版：不再使用已刪除的 ../lib/range/rangeData，改用 rangeLoader + JSON range

import { getRangeForPosition } from "../lib/range/rangeLoader";
import type { RangeTable } from "../lib/range/types";

export type Variant = "strong" | "mix" | "fold";

export interface RangeQuestion {
  position: string;
  combo: string;
  correctVariant: Variant;
  explanation: string;
}

/**
 * 根據三個頻率把牌型分類成 strong / mix / fold
 */
function classifyVariant(raise: number, call: number, fold: number): Variant {
  const total = raise + call + fold || 1;

  const rRatio = raise / total;
  const cRatio = call / total;
  const fRatio = fold / total;

  // 高頻出現、積極持續投入的手牌 → strong
  if (rRatio + cRatio >= 0.7 && fRatio <= 0.3) {
    return "strong";
  }

  // 高棄牌比例 → fold
  if (fRatio >= 0.6) {
    return "fold";
  }

  // 介於中間 → mix
  return "mix";
}

/**
 * 從 RangeTable 裡挑一個有資料的 combo
 */
function pickRandomCombo(range: RangeTable): [string, RangeTable[string]] | null {
  const entries = Object.entries(range);
  if (entries.length === 0) return null;
  const idx = Math.floor(Math.random() * entries.length);
  return entries[idx];
}

/**
 * 產生一題「這手牌屬於 strong / mix / fold」題目
 */
export function generateRangeQuestion(position: string): RangeQuestion {
  const pos = position.toUpperCase().trim();
  const rangeTable = getRangeForPosition(pos);

  const picked = pickRandomCombo(rangeTable);

  // 如果目前還沒有實際 range 資料，就出一題示意題
  if (!picked) {
    const combo = "AKs";
    const raise = 0.6;
    const call = 0.25;
    const fold = 0.15;
    const variant = classifyVariant(raise, call, fold);

    const explanation = [
      `目前 ${pos} 的實際範圍資料尚未載入，先以示意手牌 ${combo} 當範例。`,
      `假設 GTO 頻率為：Raise ${raise.toFixed(2)}，Call ${call.toFixed(2)}，Fold ${fold.toFixed(2)}。`,
      `在這樣的情況下，這手牌屬於：${variant} 範圍。`,
    ].join("\n");

    return {
      position: pos,
      combo,
      correctVariant: variant,
      explanation,
    };
  }

  const [combo, entry] = picked;
  const raise = entry.raiseFreq ?? 0;
  const call = entry.callFreq ?? 0;
  const fold = entry.foldFreq ?? 0;

  const variant = classifyVariant(raise, call, fold);

  const explanationLines: string[] = [];

  explanationLines.push(`位置：${pos}，手牌：${combo}`);
  explanationLines.push(
    `GTO 頻率約為：Raise ${raise.toFixed(2)}，Call ${call.toFixed(2)}，Fold ${fold.toFixed(2)}。`
  );
  explanationLines.push(`依照這個分佈，這手牌被歸類為：${variant} 範圍。`);

  return {
    position: pos,
    combo,
    correctVariant: variant,
    explanation: explanationLines.join("\n"),
  };
}
