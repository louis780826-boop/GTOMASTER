"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function PracticerPage() {
  // ===== 每日任務狀態 =====
  const DAILY_TARGET = 10;

  const [completed, setCompleted] = useState(0);
  const [streak, setStreak] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    const storedDate = localStorage.getItem("practice_date");
    const storedCompleted = Number(
      localStorage.getItem("practice_completed") || 0,
    );
    const storedStreak = Number(
      localStorage.getItem("practice_streak") || 0,
    );
    const storedAccuracy = Number(
      localStorage.getItem("practice_accuracy") || 0,
    );

    if (storedDate === today) {
      setCompleted(storedCompleted);
      setStreak(storedStreak);
      setAccuracy(storedAccuracy);
    } else {
      localStorage.setItem("practice_date", today);
      localStorage.setItem("practice_completed", "0");
      localStorage.setItem("practice_accuracy", "0");

      if (storedCompleted >= DAILY_TARGET) {
        localStorage.setItem(
          "practice_streak",
          String(storedStreak + 1),
        );
        setStreak(storedStreak + 1);
      } else {
        localStorage.setItem("practice_streak", "0");
        setStreak(0);
      }

      setCompleted(0);
      setAccuracy(0);
    }
  }, []);

  const progress = Math.min((completed / DAILY_TARGET) * 100, 100);
  const isDone = completed >= DAILY_TARGET;

  return (
    <div className="w-full max-w-3xl mx-auto mt-10 mb-16 px-4 text-white">
      {/* 標題 */}
      <h1 className="text-2xl font-semibold text-[#d5b26e] mb-6">
        訓練模式
      </h1>

      {/* ===== 每日任務卡片 ===== */}
      <div className="mb-8 rounded-2xl border border-[#d5b26e40] bg-[#0b0c10] p-6 shadow-[0_0_18px_rgba(0,0,0,0.6)]">
        <h2 className="text-lg font-semibold text-[#d5b26e] mb-2">
          每日任務
        </h2>

        <div className="text-gray-300 text-sm space-y-1 mb-4">
          <p>
            今日題量：{completed} / {DAILY_TARGET}
          </p>
          <p>今日正確率：{accuracy}%（示意，可接後端）</p>
          <p>連續練習天數：{streak} 天</p>
          <p>今日狀態：{isDone ? "已完成" : "未完成"}</p>
        </div>

        {/* 進度條 */}
        <div className="w-full h-3 bg-[#1a1a1a] rounded-lg border border-[#d5b26e40] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#d5b26e] to-[#f1ce88] shadow-[0_0_10px_rgba(255,215,130,0.4)] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-xs text-gray-500 mt-2">
          完成每日 10 題可提升連勝天數（Streak）。
        </p>
      </div>

      {/* 說明卡片 */}
      <div className="mb-8 rounded-2xl border border-[#d5b26e40] bg-[#0b0c10] p-6 shadow-[0_0_18px_rgba(0,0,0,0.6)]">
        <p className="text-gray-300 leading-relaxed">
          選擇你想練習的模式：題目訓練、GTO 情境練習，或 AI 教練模式的強化題。
        </p>
      </div>

      {/* 三大功能卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 題庫練習 */}
        <div className="rounded-2xl border border-[#d5b26e40] bg-[#0b0c10] p-6 shadow-[0_0_18px_rgba(0,0,0,0.6)]">
          <h2 className="text-lg font-semibold text-[#d5b26e] mb-2">
            題庫練習
          </h2>
          <p className="text-gray-300 text-sm mb-4 leading-relaxed">
            學習 GTO 理論、情境題與出牌決策，增強你的決策架構。
          </p>
          <Link
            href="/quiz"
            className="
              block text-center py-2 rounded-lg
              bg-[#0F1117] text-[#d5b26e] border border-[#d5b26e40]
              hover:border-[#d5b26e80] hover:shadow-[0_0_12px_rgba(255,215,130,0.2)]
              transition-all
            "
          >
            開始題庫訓練
          </Link>
        </div>

        {/* GTO 情境練習 */}
        <div className="rounded-2xl border border-[#d5b26e40] bg-[#0b0c10] p-6 shadow-[0_0_18px_rgba(0,0,0,0.6)]">
          <h2 className="text-lg font-semibold text-[#d5b26e] mb-2">
            GTO 情境練習
          </h2>
          <p className="text-gray-300 text-sm mb-4 leading-relaxed">
            從常見牌局情境切入，學習 solver 強制性決策邏輯。
          </p>
          <Link
            href="/practice/scenarios"
            className="
              block text-center py-2 rounded-lg
              bg-[#0F1117] text-[#d5b26e] border border-[#d5b26e40]
              hover:border-[#d5b26e80] hover:shadow-[0_0_12px_rgba(255,215,130,0.2)]
              transition-all
            "
          >
            開始情境練習
          </Link>
        </div>

        {/* AI 教練強化題 */}
        <div className="rounded-2xl border border-[#d5b26e40] bg-[#0b0c10] p-6 shadow-[0_0_18px_rgba(0,0,0,0.6)]">
          <h2 className="text-lg font-semibold text-[#d5b26e] mb-2">
            AI 教練強化題
          </h2>
          <p className="text-gray-300 text-sm mb-4 leading-relaxed">
            根據你最近的教練模式分析，提供針對弱點的特別訓練題。
          </p>
          <Link
            href="/practice/coach-drills"
            className="
              block text-center py-2 rounded-lg
              bg-[#0F1117] text-[#d5b26e] border border-[#d5b26e40]
              hover:border-[#d5b26e80] hover:shadow-[0_0_12px_rgba(255,215,130,0.2)]
              transition-all
            "
          >
            進入強化訓練
          </Link>
        </div>
      </div>
    </div>
  );
}
