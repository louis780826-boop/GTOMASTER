"use client";

import Link from "next/link";
import { useTier } from "../lib/tier/useTier";

export default function Navbar() {
  const { tier } = useTier();

  const tierLabel =
    tier === "FREE" ? "FREE+" : tier === "PRO" ? "PRO" : "MASTER";

  return (
    <nav className="w-full border-b border-[#222533] bg-[#05060a]/80 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="h-7 w-7 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-700 shadow-lg" />
          <span>GTO+ MASTER</span>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/practice">練習模式</Link>
          <Link href="/coach">AI 教練</Link>
          <Link href="/range">GTO 範圍表</Link>
          <Link href="/chapters">GTO 課程</Link>
          <Link href="/pricing">方案與升級</Link>
          <span className="ml-3 px-3 py-1 rounded-full border border-gold text-gold text-xs font-bold">
            {tierLabel}
          </span>
        </div>
      </div>
    </nav>
  );
}
