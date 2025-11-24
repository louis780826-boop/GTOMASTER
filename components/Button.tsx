"use client";

import React from "react";
import clsx from "clsx";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

/**
 * Premium Button
 * - 黑金霧面主體
 * - 金色邊框 + 柔光
 * - 高級 hover 效果（不浮誇）
 */

export default function Button({
  children,
  className,
  onClick,
  disabled,
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "w-full py-3 rounded-lg font-semibold tracking-wide transition-all",
        "bg-[#0F1117] text-[#d5b26e]",
        "border border-[#d5b26e40]",
        "shadow-[0_0_10px_rgba(255,215,140,0.1)]",
        "hover:border-[#d5b26e80] hover:shadow-[0_0_15px_rgba(255,215,140,0.2)]",
        disabled && "opacity-40 cursor-not-allowed",
        className
      )}
    >
      {children}
    </button>
  );
}
