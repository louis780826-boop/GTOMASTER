
"use client";

import dynamic from "next/dynamic";
import "../../styles/range.css";

const RangeGridV3 = dynamic(()=>import("../../components/RangeGridV3"),{ssr:false});

export default function RangePage() {
  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h1 className="title-gold mb-4">GTO 範圍表 RangeGrid V3</h1>
      <p className="text-gray-300 mb-6">可視化顯示 Raise / Call / Fold 比例，支援六位置切換。</p>
      <RangeGridV3 />
    </div>
  );
}
