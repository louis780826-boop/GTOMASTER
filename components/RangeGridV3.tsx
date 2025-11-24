
"use client";
import React, { useState } from "react";
import RangeCellV3 from "./RangeCellV3";
import { loadRange, positions, Position } from "../lib/range/rangeLoader";

export default function RangeGridV3() {
  const [pos, setPos] = useState<Position>("BTN");
  const [hoverInfo, setHoverInfo] = useState<{combo:string; data:any}|null>(null);

  const range = loadRange(pos);

  const ranks = ["A","K","Q","J","T","9","8","7","6","5","4","3","2"];

  const combos: string[] = [];
  for (let i=0;i<13;i++){
    for (let j=0;j<13;j++){
      if (i===j) combos.push(ranks[i]+ranks[j]);
      else if (i<j) combos.push(ranks[i]+ranks[j]+"s");
      else combos.push(ranks[j]+ranks[i]+"o");
    }
  }

  return (
    <div className="range-wrapper">
      <div className="pos-tabs">
        {positions.map(p=>(
          <button
            key={p}
            className={`pos-btn ${p===pos?"active":""}`}
            onClick={()=>setPos(p)}
          >
            {p}
          </button>
        ))}
      </div>

      {hoverInfo && (
        <div className="hover-box">
          <div>{hoverInfo.combo}</div>
          <div>Raise: {(hoverInfo.data.raise*100).toFixed(1)}%</div>
          <div>Call: {(hoverInfo.data.call*100).toFixed(1)}%</div>
          <div>Fold: {(hoverInfo.data.fold*100).toFixed(1)}%</div>
        </div>
      )}

      <div className="grid-169">
        {combos.map(c=>(
          <RangeCellV3
            key={c}
            combo={c}
            data={range[c] || {raise:0,call:0,fold:1}}
            onHover={(combo,data)=>setHoverInfo({combo,data})}
          />
        ))}
      </div>
    </div>
  );
}
