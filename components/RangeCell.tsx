// components/RangeCell.tsx
"use client";

import clsx from "clsx";

interface RangeCellProps {
  label: string;                    // AA / AKo / QJs...
  variant: "strong" | "mix" | "fold";
}

export default function RangeCell({ label, variant }: RangeCellProps) {
  return (
    <div
      className={clsx(
        "w-9 h-9 flex items-center justify-center text-[10px] font-semibold rounded-[4px] select-none",
        "border-[1.2px] transition-all duration-150",
        variant === "strong" &&
          "bg-gradient-to-br from-[#FFD966] to-[#CFA63A] border-[#E2BB53] text-black shadow-[0_0_8px_rgba(255,215,100,0.5)]",
        variant === "mix" &&
          "bg-gradient-to-br from-[#8C6E3D] to-[#4A3A21] border-[#AA8A59] text-[#F7E7C0] shadow-[0_0_6px_rgba(180,140,70,0.35)]",
        variant === "fold" &&
          "bg-gradient-to-br from-[#1A1A1A] to-[#111111] border-[#2A2A2A] text-[#555] shadow-inner"
      )}
    >
      {label}
    </div>
  );
}
