"use client";

import React, { useState } from "react";
import RangeGrid from "../../components/RangeGrid";

import { utgRange } from "../../lib/range/utg";
import { hjRange } from "../../lib/range/hj";
import { coRange } from "../../lib/range/co";
import { btnRange } from "../../lib/range/btn";
import { sbRange } from "../../lib/range/sb";
import { bbRange } from "../../lib/range/bb";

const positions = [
  { key: "UTG", label: "UTG", data: utgRange },
  { key: "HJ", label: "HJ", data: hjRange },
  { key: "CO", label: "CO", data: coRange },
  { key: "BTN", label: "BTN", data: btnRange },
  { key: "SB", label: "SB", data: sbRange },
  { key: "BB", label: "BB", data: bbRange },
];

export default function RangePage() {
  const [current, setCurrent] = useState("BTN");
  const range = positions.find((p) => p.key === current)?.data || btnRange;

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h1 className="title-gold mb-2">GTO 範圍表</h1>
      <p className="text-gray-300 text-sm mb-4">
        上方橫列為高牌（列），左側縱列為低牌（行）。左上角對角線為口袋對角，右上區為同花，左下區為非同花。
      </p>

      <div className="flex gap-3 mb-6 flex-wrap">
        {positions.map((p) => (
          <button
            key={p.key}
            onClick={() => setCurrent(p.key)}
            className={`px-4 py-2 rounded-xl text-sm font-bold ${
              current === p.key
                ? "btn-gold"
                : "bg-[#1a1c24] text-white border border-[#2b2e3a]"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="overflow-auto">
        <RangeGrid range={range} />
      </div>
    </div>
  );
}
