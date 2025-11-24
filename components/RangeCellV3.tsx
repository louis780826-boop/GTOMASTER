
import React from "react";

interface Props {
  combo: string;
  data: { raise: number; call: number; fold: number };
  onHover: (c: string, d: {raise:number;call:number;fold:number}) => void;
}

export default function RangeCellV3({ combo, data, onHover }: Props) {
  const r = data.raise;
  const c = data.call;
  const f = data.fold;

  const bg = `linear-gradient(
    to bottom,
    rgba(255,215,0,${r}) 0%,
    rgba(30,144,255,${c}) ${r*100}%,
    rgba(0,0,0,${f}) 100%
  )`;

  return (
    <div
      className="range-cell"
      style={{ background: bg }}
      onMouseEnter={() => onHover(combo, data)}
    >
      <span className="cell-label">{combo}</span>
    </div>
  );
}
