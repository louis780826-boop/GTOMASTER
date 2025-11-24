"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="
        mt-12 border-t border-[#1e1f25]/70
        bg-[#0d0f15]/95 backdrop-blur-sm
        text-gray-400 text-sm
      "
    >
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        
        {/* 上方 LOGO + 標語 */}
        <div className="flex flex-col items-center justify-center gap-2 mb-4">
          {/* 小 Logo */}
          <div className="
            flex h-8 w-8 items-center justify-center 
            rounded-lg 
            bg-gradient-to-br from-[#f5d38c] to-[#d7b768] 
            shadow-[0_0_12px_rgba(255,215,140,0.28)]
          ">
            <span className="text-black font-extrabold text-lg">G+</span>
          </div>

          <span className="text-[#d5b26e] tracking-wide font-semibold">
            GTO+ MASTER
          </span>
        </div>

        {/* 底部連結 */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-4 text-gray-300">
          <Link href="/practice" className="hover:text-[#d5b26e] transition">
            訓練模式
          </Link>
          <Link href="/review" className="hover:text-[#d5b26e] transition">
            複盤系統
          </Link>
          <Link href="/coach" className="hover:text-[#d5b26e] transition">
            AI 教練
          </Link>
          <Link href="/gto50" className="hover:text-[#d5b26e] transition">
            GTO 50 章
          </Link>
          <Link href="/dashboard" className="hover:text-[#d5b26e] transition">
            儀表板
          </Link>
        </div>

        {/* 分隔線 */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#d5b26e30] to-transparent mb-4"></div>

        {/* 版權區塊 */}
        <div className="text-center text-xs text-gray-500">
          © {new Date().getFullYear()} GTO+ MASTER | All Rights Reserved
        </div>
      </div>
    </footer>
  );
}
