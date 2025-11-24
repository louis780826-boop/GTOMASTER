import type { ReactNode } from "react";

interface PremiumCardProps {
  children: ReactNode;
  className?: string;
}

export default function PremiumCard({ children, className }: PremiumCardProps) {
  return (
    <div
      className={
        "rounded-2xl border border-[#2b2e3c] bg-[#050813]/90 px-5 py-4 " +
        "shadow-[0_0_20px_rgba(0,0,0,0.6)] " +
        (className ?? "")
      }
    >
      {children}
    </div>
  );
}
