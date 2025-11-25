// utils/practiceEngineMix.ts
// MIX% 題型：問「這手牌 GTO 的主力動作傾向」
// 改版：不再使用已刪除的 rangeData，改用 lib/range/rangeLoader

import { getRangeForPosition } from "../lib/range/rangeLoader";
import type { RangeTable } from "../lib/range/types";

type MainAction = "RAISE" | "CALL" | "FOLD";

export interface MixQuestion {
  position: string;
  combo: string;
  correctMainAction: MainAction;
  raiseFreq: number;
  callFreq: number;
  foldFreq: number;
  explanation: string;
}

/**
 * 從一個 RangeTable 中隨機抽一個有資料的牌型
 */
function pickRandomCombo(range: RangeTable): [string, RangeTable[string]] | null {
  const entries = Object.entries(range);
  if (entries.length === 0) return null;
  const idx = Math.floor(Math.random() * entries.length);
  return entries[idx];
}

/**
 * 根據三個頻率決定主力動作
 */
function getMainAction(r: number, c: number, f: number): MainAction {
  if (r >= c && r >= f) return "RAISE";
  if (c >= r && c >= f) return "CALL";
  return "FOLD";
}

/**
 * 產生一題 MIX 題目：
 * - 給定 position（UTG / HJ / CO / BTN / SB / BB）
 * - 從該位置的 range 中抓一手牌
 * - 問：這手牌 GTO 主力動作是哪一個
 */
export function generateMixQuestion(position: string): MixQuestion {
  const pos = position.toUpperCase().trim();
  const rangeTable = getRangeForPosition(pos);

  const picked = pickRandomCombo(rangeTable);

  // 如果現在 rangeTable 還是空的（沒有真實資料），就用預設示意題
  if (!picked) {
    const fallbackCombo = "AKs";
    const r = 0.7;
    const c = 0.2;
    const f = 0.1;
    const main = getMainAction(r, c, f);

    return {
      position: pos,
      combo: fallbackCombo,
      correctMainAction: main,
      raiseFreq: r,
      callFreq: c,
      foldFreq: f,
      explanation: `目前 ${pos} 的實際範圍資料尚未載入，先以示意手牌 ${fallbackCombo} 當範例題，假設其 GTO 為 R:${r} / C:${c} / F:${f}。`,
    };
  }

  const [combo, entry] = picked;
  const r = entry.raiseFreq ?? 0;
  const c = entry.callFreq ?? 0;
  const f = entry.foldFreq ?? 0;
  const main = getMainAction(r, c, f);

  const explanationLines: string[] = [];

  explanationLines.push(`位置：${pos}，手牌：${combo}`);
  explanationLines.push(`GTO 頻率約為：Raise ${r.toFixed(2)}，Call ${c.toFixed(2)}，Fold ${f.toFixed(2)}。`);
  explanationLines.push(`因此主力動作為：${main}。`);

  return {
    position: pos,
    combo,
    correctMainAction: main,
    raiseFreq: r,
    callFreq: c,
    foldFreq: f,
    explanation: explanationLines.join("\n"),
  };
}
