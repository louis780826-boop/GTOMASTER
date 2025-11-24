// components/practice/PracticeCard.tsx
"use client";

import React from "react";

interface PracticeCardProps {
  mode: "choice" | "mix" | "range";
  question: any;
  submitAnswer: (ans: string) => void;
  onBack: () => void;
}

export default function PracticeCard({
  mode,
  question,
  submitAnswer,
  onBack
}: PracticeCardProps) {
  const isChoice = mode === "choice" || mode === "mix";
  const isRange = mode === "range";

  const title =
    mode === "choice"
      ? "GTO 三選一題型"
      : mode === "mix"
      ? "MIX% 百分比題"
      : "範圍識別題（13×13）";

  return (
    <div className="mt-6 space-y-4">
      {/* 標題列 */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-[#FFD966] font-semibold">{title}</div>
        <button
          onClick={onBack}
          className="text-xs text-gray-400 hover:text-[#FFD966]"
        >
          ← 返回題型選擇
        </button>
      </div>

      {/* 題目卡 */}
      <div className="rounded-xl border border-[#2a2a2a] bg-[#111113] p-5 shadow-[0_0_12px_rgba(0,0,0,0.6)] space-y-4">
        {/* 上方資訊 */}
        <div className="flex justify-between text-xs text-gray-400">
          <div>
            {question.heroPos && (
              <div>
                位置：{question.heroPos}
                {question.villainPos ? ` vs ${question.villainPos}` : ""}
              </div>
            )}
            {question.position && <div>位置：{question.position}</div>}
            {question.stack && <div>Stack：{question.stack}bb</div>}
          </div>
          <div className="text-right">
            {question.combo && (
              <>
                <div className="text-[11px] text-gray-500">手牌</div>
                <div className="text-xl font-bold text-[#F5E6B0]">
                  {question.combo}
                </div>
              </>
            )}
          </div>
        </div>

        {/* 題目文字 */}
        <div className="mt-2 text-sm whitespace-pre-line text-gray-200">
          {question.prompt}
        </div>

        {/* 按鈕區 */}
        <div className="mt-4 flex flex-wrap gap-3">
          {isChoice && (
            <>
              <button
                onClick={() => submitAnswer("RAISE")}
                className="flex-1 min-w-[90px] py-2 rounded-md bg-gradient-to-br from-[#FFD966] to-[#CFA63A] text-black text-xs font-bold shadow-[0_0_8px_rgba(255,215,100,0.5)]"
              >
                RAISE
              </button>
              <button
                onClick={() => submitAnswer("CALL")}
                className="flex-1 min-w-[90px] py-2 rounded-md bg-[#1a1a1c] border border-[#CFA63A] text-[#F5E6B0] text-xs"
              >
                CALL
              </button>
              <button
                onClick={() => submitAnswer("FOLD")}
                className="flex-1 min-w-[90px] py-2 rounded-md bg-[#111113] border border-[#444] text-gray-200 text-xs"
              >
                FOLD
              </button>
            </>
          )}

          {isRange && (
            <>
              <button
                onClick={() => submitAnswer("strong")}
                className="flex-1 min-w-[110px] py-2 rounded-md bg-gradient-to-br from-[#FFD966] to-[#CFA63A] text-black text-xs font-bold shadow-[0_0_8px_rgba(255,215,100,0.5)]"
              >
                強勢範圍（strong）
              </button>
              <button
                onClick={() => submitAnswer("mix")}
                className="flex-1 min-w-[110px] py-2 rounded-md bg-[#1a1a1c] border border-[#CFA63A] text-[#F5E6B0] text-xs"
              >
                混合 / 邊緣（mix）
              </button>
              <button
                onClick={() => submitAnswer("fold")}
                className="flex-1 min-w-[110px] py-2 rounded-md bg-[#111113] border border-[#444] text-gray-200 text-xs"
              >
                棄牌 / 低頻（fold）
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
