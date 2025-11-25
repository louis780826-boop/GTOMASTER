"use client";

import React, { useState } from "react";
import RangeGrid from "./RangeGrid";

const POSITIONS = ["UTG", "HJ", "CO", "BTN", "SB", "BB"];

export default function RangePage() {
  const [position, setPosition] = useState<string>("BTN");

  return (
    <main className="min-h-screen bg-[#05060a] text-white">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          GTO 開局範圍表
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          目前為簡化版本示意圖，之後會逐步更新各位置的精準 GTO 範圍。
        </p>

        {/* 位置切換 */}
        <div className="flex flex-wrap gap-2 mb-6">
          {POSITIONS.map((pos) => (
            <button
              key={pos}
              onClick={() => setPosition(pos)}
              className={`px-3 py-1 rounded-full border text-sm transition
                ${
                  position === pos
                    ? "bg-yellow-500 text-black border-yellow-500"
                    : "border-gray-600 text-gray-300 hover:border-yellow-500 hover:text-yellow-300"
                }`}
            >
              {pos}
            </button>
          ))}
        </div>

        <div className="mb-3 text-sm text-gray-300">
          目前顯示位置：<span className="text-yellow-400 font-semibold">{position}</span>
        </div>

        {/* 範圍表格（單純 UI，使用 RangeGrid） */}
        <div className="bg-black/40 rounded-xl border border-yellow-500/40 p-3 md:p-4">
          <RangeGrid />
        </div>
      </div>
    </main>
  );
}
