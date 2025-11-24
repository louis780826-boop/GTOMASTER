"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getLastSessionSummary,
  QuizSessionSummary,
} from "../../../utils/quizSession";

const SESSION_SIZE = 10;

export default function QuizResultPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<QuizSessionSummary | null>(null);

  useEffect(() => {
    const s = getLastSessionSummary();
    setSummary(s);
  }, []);

  if (!summary || summary.total === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-white">
        <h1 className="text-2xl font-semibold text-[#d5b26e] mb-4">
          測驗結算
        </h1>
        <p className="text-gray-300 text-sm mb-6">
          尚未找到最近的 10 題測驗結果。請先在題庫頁完成一組 10 題練習。
        </p>
        <button
          onClick={() => router.push("/quiz")}
          className="
            px-4 py-2 rounded-lg text-sm font-semibold
            bg-[#d5b26e] text-black
            hover:bg-[#f1ce88] transition
          "
        >
          前往題庫開始練習
        </button>
      </div>
    );
  }

  const accuracy = Math.round((summary.correct / summary.total) * 100);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-white">
      <h1 className="text-2xl font-semibold text-[#d5b26e] mb-2">
        本次測驗結果
      </h1>
      <p className="text-xs text-gray-400 mb-6">
        本次測驗目標題量：{SESSION_SIZE} 題，實際完成：{summary.total} 題
      </p>

      {/* 總結卡片 */}
      <div className="mb-6 rounded-2xl border border-[#d5b26e40] bg-[#0b0c10] p-6 shadow-[0_0_18px_rgba(0,0,0,0.6)]">
        <p className="text-lg mb-2">
          正確題數：{" "}
          <span className="text-[#d5b26e] font-semibold">
            {summary.correct} / {summary.total}
          </span>
        </p>
        <p className="text-sm text-gray-300 mb-2">
          整體正確率：{" "}
          <span className="text-[#d5b26e] font-semibold">
            {accuracy}%
          </span>
        </p>
        <p className="text-xs text-gray-400">
          建議：長期穩定維持在 80% 以上，代表你對目前級別的 GTO 概念掌握良好。
        </p>
      </div>

      {/* 各分類統計 */}
      <div className="mb-6 rounded-2xl border border-[#d5b26e40] bg-[#0b0c10] p-6 shadow-[0_0_18px_rgba(0,0,0,0.6)]">
        <h2 className="text-lg font-semibold text-[#d5b26e] mb-3">
          各分類表現
        </h2>
        <div className="space-y-2 text-sm text-gray-300">
          {Object.entries(summary.byCategory).map(([cat, stat]) => {
            const acc =
              stat.total > 0
                ? Math.round((stat.correct / stat.total) * 100)
                : 0;
            return (
              <div
                key={cat}
                className="flex items-center justify-between text-xs md:text-sm"
              >
                <span className="capitalize">
                  {cat.toUpperCase()}：{stat.correct}/{stat.total}
                </span>
                <span className="text-[#d5b26e]">{acc}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 題目列表（只顯示對 / 錯 + 類別 + 題號） */}
      <div className="mb-8 rounded-2xl border border-[#d5b26e40] bg-[#0b0c10] p-6 shadow-[0_0_18px_rgba(0,0,0,0.6)]">
        <h2 className="text-lg font-semibold text-[#d5b26e] mb-3">
          題目作答記錄
        </h2>

        <ul className="space-y-1 text-xs md:text-sm text-gray-300">
          {summary.answers.map((a, i) => (
            <li key={i} className="flex items-center justify-between">
              <span>
                第 {i + 1} 題：{a.questionId}（{a.category.toUpperCase()}）
              </span>
              <span className={a.isCorrect ? "text-[#d5b26e]" : "text-red-400"}>
                {a.isCorrect ? "正確" : "錯誤"}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* 按鈕區 */}
      <div className="flex gap-3">
        <button
          onClick={() => router.push("/quiz")}
          className="
            px-4 py-2 rounded-lg text-sm font-semibold
            bg-[#d5b26e] text-black
            hover:bg-[#f1ce88] transition
          "
        >
          再來一組 10 題
        </button>
        <button
          onClick={() => router.push("/dashboard")}
          className="
            px-4 py-2 rounded-lg text-sm font-semibold
            bg-[#0f1117] text-[#d5b26e]
            border border-[#d5b26e60]
            hover:border-[#d5b26e] transition
          "
        >
          回 Dashboard
        </button>
      </div>
    </div>
  );
}
