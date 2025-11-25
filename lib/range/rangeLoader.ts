// lib/range/rangeLoader.ts

import { POSITIONS, Position, RangeTable } from "./types";

// 目前沒有實際 GTO JSON 的情況下，先給「可運作的空表」
// 之後你要接回完整 GTO range，只要把下面的 EMPTY_RANGE 換成實際資料即可。
const EMPTY_RANGE: RangeTable = {};

// 每個位置對應一張範圍表（現在先全部用 EMPTY_RANGE 占位）
const RANGE_BY_POSITION: Record<Position, RangeTable> = {
  UTG: EMPTY_RANGE,
  HJ: EMPTY_RANGE,
  CO: EMPTY_RANGE,
  BTN: EMPTY_RANGE,
  SB: EMPTY_RANGE,
  BB: EMPTY_RANGE,
};

/**
 * 外部使用的介面：
 * utils/coachEngine.ts 會呼叫 getRangeForPosition()
 *
 * 這裡故意讓參數是 string，
 * 這樣你的 analyzeHandV4(pos: string, ...) 就可以直接丟進來，
 * 不會再出現「Argument of type 'string' is not assignable to ...」那種型別錯誤。
 */
export function getRangeForPosition(position: string): RangeTable {
  const upper = position.toUpperCase();

  // 檢查是不是合法位置，不是就 fallback 成 CO
  const isValid = (POSITIONS as readonly string[]).includes(upper);
  const validPos: Position = (isValid ? upper : "CO") as Position;

  return RANGE_BY_POSITION[validPos];
}
