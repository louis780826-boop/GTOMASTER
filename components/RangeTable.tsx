"use client";

import React, { useState } from "react";

const positions = ["UTG", "HJ", "CO", "BTN", "SB", "BB"] as const;
type Position = (typeof positions)[number];

// 目前先用示意範圍，之後可以換成真實 solver 輸出
const sampleRange: Record<Position, string[]> = {
  UTG: ["AA", "KK", "QQ", "JJ", "TT", "AKs", "AQs", "AJs", "KQs", "99"],
  HJ: ["AA", "KK", "QQ", "JJ", "TT", "99", "AKs", "AQs", "AJs", "ATs", "KQs", "88"],
  CO: ["AA", "KK", "QQ", "JJ", "TT", "99", "88", "AKs", "AQs", "AJs", "ATs", "KQs", "KJs", "QJs", "AJo"],
  BTN: [
    "Any Pair",
    "Any Suited Ace",
    "K9s+",
    "Q9s+",
    "J9s+",
    "T9s",
    "98s",
    "AJo+",
    "KQo",
  ],
  SB: ["AA–77", "AKs–ATs", "A5s–A2s", "KQs–KTs", "QJs–QTs", "JTs", "AKo–AQo"],
  BB: ["防守範圍會依對手 size 調整，之後可細分 vs 2.5x / 3x / SB open"],
};

export default function RangeTable() {
  const [activePos, setActivePos] = useState<Position>("UTG");

  return (
    <div className="w-full">
      {/* 位置切換按鈕列 */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-6">
        {positions.map((pos) => (
          <button
            key={pos}
            onClick={() => setActivePos(pos)}
            className={`py-2 rounded-lg text-sm font-medium transition-all
              ${
                activePos === pos
                  ? "bg-[#d5b26e] text-black shadow-[0_0_10px_rgba(213,178,110,0.5)]"
                  : "bg-[#0F1117] border border-[#d5b26e40] text-[#d5b26e] hover:border-[#d5b26e80]"
              }
            `}
          >
            {pos}
          </button>
        ))}
      </div>

      {/* 範圍內容格子 */}
      <div
        className="
          grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2
          bg-[#0F1117]/70 p-4 rounded-xl border border-[#d5b26e30]
        "
      >
        {sampleRange[activePos].map((hand, i) => (
          <div
            key={i}
            className="
              text-center py-2 rounded-lg
              bg-[#1A1C23]
              border border-[#d5b26e40]
              text-[#d5b26e]
              text-sm
              hover:border-[#d5b26e80] hover:shadow-[0_0_10px_rgba(213,178,110,0.25)]
              transition-all
            "
          >
            {hand}
          </div>
        ))}
      </div>

      {/* 小提示 */}
      <p className="mt-4 text-xs text-gray-400 leading-relaxed">
        目前為示意版範圍：BTN / SB / BB 等位置實戰會依對手風格、盲注大小與桌況進一步調整。
        之後可以將這個模組接上真實 solver 輸出，或依你自訂的 exploit 策略替換數據。
      </p>
    </div>
  );
}
