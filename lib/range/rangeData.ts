// lib/range/rangeData.ts
// 13×13 範圍表資料結構（正式可用版）

export type CellVariant = "strong" | "mix" | "fold";

export interface RangeCellData {
  label: string;
  variant: CellVariant;
}

export interface PositionRange {
  name: string;
  grid: RangeCellData[][];
}

const RANKS = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];

// 示意用規則（之後你要可以換成真實 GTO）
function getVariant(row: number, col: number): CellVariant {
  // Pair
  if (row === col) {
    if (row <= 3) return "strong"; // AA~JJ
    if (row <= 6) return "mix";    // TT~77
    return "fold";                 // 66 以下
  }

  // 同花（上三角）
  if (row < col) {
    if (row <= 3 && col <= 7) return "strong";
    if (row <= 7 && col <= 9) return "mix";
    return "fold";
  }

  // 不同花（下三角）
  if (row > col) {
    if (row <= 2 && col <= 5) return "mix";
    return "fold";
  }

  return "fold";
}

function buildGrid(): RangeCellData[][] {
  const grid: RangeCellData[][] = [];

  for (let i = 0; i < RANKS.length; i++) {
    const row: RangeCellData[] = [];
    for (let j = 0; j < RANKS.length; j++) {
      const r1 = RANKS[i];
      const r2 = RANKS[j];

      let label = "";

      if (i === j) {
        label = `${r1}${r2}`; // Pair
      } else if (i < j) {
        label = `${r1}${r2}s`; // suited
      } else {
        label = `${r2}${r1}o`; // offsuit（反轉成標準寫法）
      }

      row.push({
        label,
        variant: getVariant(i, j)
      });
    }
    grid.push(row);
  }

  return grid;
}

const baseGrid = buildGrid();

// 目前三個位置先共用一份，之後要分開我再幫你拆
export const POSITION_RANGES: PositionRange[] = [
  { name: "UTG", grid: baseGrid },
  { name: "CO",  grid: baseGrid },
  { name: "BTN", grid: baseGrid }
];
