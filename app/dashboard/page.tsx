"use client";

import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#05060a] text-white px-4 md:px-6 py-8">
      <section className="max-w-6xl mx-auto">
        {/* Title */}
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[#D6AF7B]">
            GTO+ MASTER · 控制台
          </h1>
          <p className="text-sm md:text-base text-gray-300 mt-1">
            從這裡快速進入你的訓練模式、三街實戰、範圍表與課程。
          </p>
        </header>

        {/* Top summary row */}
        <div className="grid gap-4 md:gap-5 md:grid-cols-3 mb-6">
          <div className="bg-[#0B0C10] border border-[#262938] rounded-2xl p-4">
            <p className="text-xs text-gray-400 mb-1">今日答題數</p>
            <p className="text-2xl font-semibold text-[#F5E3BD]">—</p>
            <p className="text-[11px] text-gray-500 mt-1">
              （之後可接資料）目前先當展示用。
            </p>
          </div>

          <div className="bg-[#0B0C10] border border-[#262938] rounded-2xl p-4">
            <p className="text-xs text-gray-400 mb-1">AI 實戰練習手數</p>
            <p className="text-2xl font-semibold text-[#F5E3BD]">—</p>
            <p className="text-[11px] text-gray-500 mt-1">
              你可以從下方「三街 AI 實戰」開始累積。
            </p>
          </div>

          <div className="bg-[#0B0C10] border border-[#262938] rounded-2xl p-4">
            <p className="text-xs text-gray-400 mb-1">目前會員等級</p>
            <p className="text-lg font-semibold text-[#D6AF7B]">FREE</p>
            <p className="text-[11px] text-gray-500 mt-1">
              之後可接 Tier 檢查，目前先固定顯示。
            </p>
          </div>
        </div>

        {/* Main navigation cards */}
        <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {/* 題庫練習 */}
          <Link
            href="/practice"
            className="group bg-[#0B0C10] border border-[#262938] hover:border-[#D6AF7B]/70 rounded-2xl p-5 flex flex-col justify-between transition shadow-[0_0_30px_rgba(0,0,0,0.55)] hover:shadow-[0_0_35px_rgba(214,175,123,0.35)]"
          >
            <div>
              <p className="text-[11px] text-gray-400 mb-1">練習模式</p>
              <h2 className="text-lg md:text-xl font-semibold text-white mb-2">
                題庫練習
              </h2>
              <p className="text-xs md:text-sm text-gray-300">
                隨機題目、單手決策與 AI 解析，適合作為每日熱身。
              </p>
            </div>
            <div className="mt-4 text-[11px] text-[#D6AF7B]">
              前往 /practice &rarr;
            </div>
          </Link>

          {/* ✅ 三街 AI 實戰 入口卡片 */}
          <Link
            href="/practice/aibattle"
            className="group bg-[#0B0C10] border border-[#D6AF7B]/60 hover:border-[#F3D39A] rounded-2xl p-5 flex flex-col justify-between transition shadow-[0_0_40px_rgba(214,175,123,0.25)] hover:shadow-[0_0_45px_rgba(214,175,123,0.55)]"
          >
            <div>
              <p className="text-[11px] text-[#D6AF7B] mb-1">
                實戰核心 · 三街完整
              </p>
              <h2 className="text-lg md:text-xl font-semibold text-[#F5E3BD] mb-2">
                三街 AI 實戰牌桌
              </h2>
              <p className="text-xs md:text-sm text-gray-200">
                從 Flop 一路玩到 River，每一街都有簡單好懂的 AI
                說明，幫你建立完整一條線的思考習慣。
              </p>
            </div>
            <div className="mt-4 text-[11px] text-[#F3D39A]">
              前往 /practice/aibattle &rarr;
            </div>
          </Link>

          {/* 範圍表 */}
          <Link
            href="/range"
            className="group bg-[#0B0C10] border border-[#262938] hover:border-[#D6AF7B]/70 rounded-2xl p-5 flex flex-col justify-between transition shadow-[0_0_30px_rgba(0,0,0,0.55)] hover:shadow-[0_0_35px_rgba(214,175,123,0.35)]"
          >
            <div>
              <p className="text-[11px] text-gray-400 mb-1">GTO 工具</p>
              <h2 className="text-lg md:text-xl font-semibold text-white mb-2">
                GTO 範圍表
              </h2>
              <p className="text-xs md:text-sm text-gray-300">
                依位置查詢標準開局與防守範圍，搭配實戰牌桌一起使用效果最佳。
              </p>
            </div>
            <div className="mt-4 text-[11px] text-[#D6AF7B]">
              前往 /range &rarr;
            </div>
          </Link>

          {/* 50 章課程 */}
          <Link
            href="/chapters"
            className="group bg-[#0B0C10] border border-[#262938] hover:border-[#D6AF7B]/70 rounded-2xl p-5 flex flex-col justify-between transition shadow-[0_0_30px_rgba(0,0,0,0.55)] hover:shadow-[0_0_35px_rgba(214,175,123,0.35)]"
          >
            <div>
              <p className="text-[11px] text-gray-400 mb-1">系統化學習</p>
              <h2 className="text-lg md:text-xl font-semibold text-white mb-2">
                50 章 GTO 課程
              </h2>
              <p className="text-xs md:text-sm text-gray-300">
                從基礎概念到進階實戰，拆成小章節，讓你有系統地補完所有觀念。
              </p>
            </div>
            <div className="mt-4 text-[11px] text-[#D6AF7B]">
              前往 /chapters &rarr;
            </div>
          </Link>

          {/* 預留：之後 PRO / 總覽… */}
          <div className="bg-[#0B0C10] border border-dashed border-[#343648] rounded-2xl p-5 flex flex-col justify-center text-center text-xs md:text-sm text-gray-500">
            這裡之後可以放 PRO 會員專屬功能、戰績統計或客製教練方案入口。
          </div>
        </div>
      </section>
    </main>
  );
}
