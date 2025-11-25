// lib/range/types.ts

// GTO 純動作類型
export type PureAction = "RAISE" | "CALL" | "FOLD" | "MIX";

// 每一個牌型在範圍裡的資料結構
export interface RangeEntry {
  pure: PureAction;   // 主力動作（之後你補真實 range 時用）
  raiseFreq?: number; // 混頻：加注比例 0~1
  callFreq?: number;  // 跟注比例 0~1
  foldFreq?: number;  // 棄牌比例 0~1
  note?: string;      // 任何補充文字
}

// 整張範圍表：key = "AKs" / "QQ" / "JTo" ...
export type RangeTable = Record<string, RangeEntry>;

// 支援的位置
export const POSITIONS = ["UTG", "HJ", "CO", "BTN", "SB", "BB"] as const;
export type Position = (typeof POSITIONS)[number];
