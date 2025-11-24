"use client";

import React from "react";
import { RangeMatrix } from "../lib/range/types";

const ranks = ["A","K","Q","J","T","9","8","7","6","5","4","3","2"];

const actionColor: Record<string, string> = {
  raise: "bg-gradient-to-br from-yellow-400 to-yellow-600 text-black",
  call: "bg-blue-600",
  fold: "bg-gray-800",
  mix: "bg-purple-600",
};

export default function RangeGrid({ range }: { range: RangeMatrix }) {
  return (
    <div className="inline-block">
      {/* 頂部標籤列 */}
      <div className="grid grid-cols-[2rem,repeat(13,2rem)] gap-[2px] mb-1">
        <div /> {/* 左上角空白 */}
        {ranks.map((r) => (
          <div
            key={`col-${r}`}
            className="h-6 flex items-center justify-center text-[10px] text-gray-400"
          >
            {r}
          </div>
        ))}
      </div>

      {/* 左側標籤 + 13x13 矩陣 */}
      <div className="grid grid-cols-[2rem,repeat(13,2rem)] gap-[2px] p-2 bg-[#0A0B0E] rounded-xl border border-[#2c2e35] card-glow">
        {ranks.map((r1, i) => (
          <React.Fragment key={`row-${r1}`}>
            {/* 行標籤 */}
            <div className="h-8 flex items-center justify-center text-[10px] text-gray-400">
              {r1}
            </div>

            {/* 該行 13 格 */}
            {ranks.map((r2, j) => {
              const pair =
                i === j ? `${r1}${r2}` :
                i < j ? `${r1}${r2}s` :
                `${r2}${r1}o`;

              const cell = range[pair] || { action: "fold" };

              return (
                <div
                  key={`${i}-${j}`}
                  className={`h-8 w-8 flex items-center justify-center text-[10px] font-bold rounded ${actionColor[cell.action]}`}
                >
                  {pair}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
