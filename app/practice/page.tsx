"use client";

import { useState } from "react";
import QuizPractice from "../../components/practice/QuizPractice";
import AITable from "../../components/practice/AITable";

type PracticeMode = "quiz" | "table";

export default function PracticePage() {
  const [mode, setMode] = useState<PracticeMode>("quiz");

  return (
    <main className="min-h-screen bg-[#05060a] text-white px-4 md:px-6 py-8">
      <section className="max-w-5xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-yellow-400">
            Practice · 訓練模式
          </h1>
          <p className="text-sm md:text-base text-gray-300 mt-1">
            題庫練習與 AI 實戰牌桌，讓你從「單題」到「局面」全面提升。
          </p>
        </header>

        {/* 模式切換 */}
        <div className="inline-flex rounded-xl bg-[#11131a] border border-[#262938] p-1 text-xs md:text-sm mb-6">
          <button
            type="button"
            onClick={() => setMode("quiz")}
            className={
              "px-3 md:px-4 py-2 rounded-lg transition " +
              (mode === "quiz"
                ? "bg-yellow-400 text-black font-semibold"
                : "text-gray-300 hover:text-white")
            }
          >
            題庫練習
          </button>
          <button
            type="button"
            onClick={() => setMode("table")}
            className={
              "px-3 md:px-4 py-2 rounded-lg transition " +
              (mode === "table"
                ? "bg-yellow-400 text-black font-semibold"
                : "text-gray-300 hover:text-white")
            }
          >
            AI 實戰牌桌
          </button>
        </div>

        {/* 內容 */}
        <div className="mt-2">
          {mode === "quiz" ? <QuizPractice /> : <AITable />}
        </div>
      </section>
    </main>
  );
}
