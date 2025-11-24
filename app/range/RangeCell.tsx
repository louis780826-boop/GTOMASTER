// app/range/RangeCell.tsx
"use client";

export interface RangeCellProps {
  label: string;
  active: boolean;
  onClick?: () => void;
  styleOverride?: React.CSSProperties;
}

export default function RangeCell({
  label,
  active,
  onClick,
  styleOverride
}: RangeCellProps) {
  const base =
    "w-full aspect-square flex items-center justify-center text-[10px] font-bold rounded-md transition-all duration-150 select-none";

  return (
    <button
      type="button"
      onClick={onClick}
      className={base}
      style={styleOverride}
    >
      {label}
    </button>
  );
}
