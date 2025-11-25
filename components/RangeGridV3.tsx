// components/RangeGridV3.tsx
'use client';

import React from 'react';

const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

type CellType = 'pair' | 'suited' | 'offsuit';

function getCellType(row: number, col: number): CellType {
  if (row === col) return 'pair';
  if (row < col) return 'suited';
  return 'offsuit';
}

function getLabel(row: number, col: number): string {
  const r1 = RANKS[row];
  const r2 = RANKS[col];

  if (row === col) return `${r1}${r2}`; // AA, KK, …

  if (row < col) {
    // 上三角：同花
    return `${r1}${r2}s`;
  }

  // 下三角：不同花
  return `${r2}${r1}o`;
}

function getCellClass(type: CellType): string {
  // Tailwind 顏色你可以之後再微調
  switch (type) {
    case 'pair':
      return 'bg-yellow-500/80 text-black';
    case 'suited':
      return 'bg-emerald-500/70 text-black';
    case 'offsuit':
      return 'bg-slate-700 text-slate-100';
  }
}

export default function RangeGridV3() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-100">
          Preflop 簡化範圍表（展示用）
        </h2>
        <p className="text-xs text-slate-400">
          上三角 = 同花， 下三角 = 不同花，對角線 = 口袋對
        </p>
      </div>

      <div className="overflow-auto rounded-xl border border-slate-800 bg-slate-950/60 p-2">
        <div className="inline-grid grid-cols-[auto_1fr] gap-1">
          {/* 左上角空白 */}
          <div />

          {/* 欄標：橫向 rank */}
          <div className="grid grid-cols-13 gap-1">
            {RANKS.map((r) => (
              <div
                key={`col-${r}`}
                className="h-6 flex items-center justify-center text-xs font-semibold text-slate-300"
              >
                {r}
              </div>
            ))}
          </div>

          {/* 列 */}
          {RANKS.map((rowRank, rowIdx) => (
            <React.Fragment key={`row-${rowRank}`}>
              {/* 列標：縱向 rank */}
              <div className="h-6 flex items-center justify-center text-xs font-semibold text-slate-300">
                {rowRank}
              </div>

              {/* 13x13 格子 */}
              <div className="grid grid-cols-13 gap-1">
                {RANKS.map((_, colIdx) => {
                  const type = getCellType(rowIdx, colIdx);
                  const label = getLabel(rowIdx, colIdx);
                  const cellClass = getCellClass(type);

                  return (
                    <div
                      key={`cell-${rowIdx}-${colIdx}`}
                      className={`h-6 w-6 flex items-center justify-center rounded-[4px] text-[10px] font-semibold ${cellClass}`}
                    >
                      {label}
                    </div>
                  );
                })}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
