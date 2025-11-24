"use client";

import React from "react";
import clsx from "clsx";

interface PokerTableProps {
  board?: string[]; // ['Ah', 'Ks', '8d']
  heroHand?: string[]; // ['Qc', 'Qd']
  villainHand?: string[]; // ['Jh', 'Th']
  className?: string;
}

/**
 * PokerTable (Premium Black-Gold Version)
 * - 黑金霧面卡片風格
 * - 金色邊框
 * - 套用柔光、陰影
 * - 使用簡潔的牌面方框
 */

export default function PokerTable({
  board = [],
  heroHand = [],
  villainHand = [],
  className,
}: PokerTableProps) {
  return (
    <div
      className={clsx(
        "rounded-xl p-6",
        "bg-[#0D0F15]/80 border border-[#323843]/70",
        "shadow-[0_0_20px_rgba(255,215,130,0.07)]",
        "backdrop-blur-sm",
        className
      )}
    >
      {/* Hero Hand */}
      <div className="mb-6">
        <h3 className="text-[#d5b26e] font-semibold mb-2">Hero 手牌</h3>
        <div className="flex gap-3">
          {heroHand?.length > 0 ? (
            heroHand.map((c, idx) => <Card key={idx} card={c} />)
          ) : (
            <p className="text-gray-400 text-sm">尚未提供</p>
          )}
        </div>
      </div>

      {/* Board Cards */}
      <div className="mb-6">
        <h3 className="text-[#d5b26e] font-semibold mb-2">Board</h3>
        <div className="flex gap-3">
          {board?.length > 0 ? (
            board.map((c, idx) => <Card key={idx} card={c} />)
          ) : (
            <p className="text-gray-400 text-sm">尚未揭示公牌</p>
          )}
        </div>
      </div>

      {/* Villain Hand */}
      <div>
        <h3 className="text-[#d5b26e] font-semibold mb-2">對手可能範圍</h3>
        <div className="flex gap-3">
          {villainHand?.length > 0 ? (
            villainHand.map((c, idx) => <Card key={idx} card={c} />)
          ) : (
            <p className="text-gray-400 text-sm">未提供</p>
          )}
        </div>
      </div>
    </div>
  );
}

/** 單張撲克牌元件：黑金緊緻版 */
function Card({ card }: { card: string }) {
  return (
    <div
      className="
        w-12 h-16 rounded-lg flex items-center justify-center
        bg-gradient-to-b from-[#1a1d24] to-[#0f1117]
        border border-[#d5b26e30]
        shadow-[0_0_6px_rgba(255,215,130,0.15)]
        text-white font-bold text-lg tracking-wide
      "
    >
      {card}
    </div>
  );
}
