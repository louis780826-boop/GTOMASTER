import React from "react";

const ranks = ["A","K","Q","J","T","9","8","7","6","5","4","3","2"];

export default function RangeGrid() {
  return (
    <div className="grid grid-cols-13 gap-[2px] p-2 bg-[#111] rounded-lg border border-[#333]">
      {ranks.map((rowRank) =>
        ranks.map((colRank) => {
          const label =
            rowRank === colRank
              ? `${rowRank}${colRank}`
              : `${rowRank}${colRank}s`;

          return (
            <div
              key={rowRank + colRank}
              className="w-8 h-8 flex items-center justify-center text-xs border border-[#222] bg-black/40 text-white"
            >
              {label}
            </div>
          );
        })
      )}
    </div>
  );
}
