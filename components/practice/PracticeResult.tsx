// components/practice/PracticeResult.tsx
"use client";

import React from "react";

interface PracticeResultProps {
  result: {
    correct: boolean;
    explanation: string;
    correctAnswer: string;
  };
  onNext: () => void;
  onBack: () => void;
}

export default function PracticeResult({
  result,
  onNext,
  onBack
}: PracticeResultProps) {
  return (
    <div className="mt-6 space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-[#FFD966] font-semibold">答題結果</div>
        <button
          onClick={onBack}
          className="text-xs text-gray-400 hover:text-[#FFD966]"
        >
          ← 返回題型選擇
        </button>
      </div>

      <div className="rounded-xl border border-[#2a2a2a] bg-[#111113] p-5 shadow-[0_0_12px_rgba(0,0,0,0.6)] space-y-4">
        <div
          className={`text-lg font-bold ${
            result.correct ? "text-[#FFD966]" : "text-red-400"
          }`}
        >
          {result.correct ? "✔ 回答正確" : "✘ 回答錯誤"}
        </div>

        <div className="text-sm text-gray-200">
          正確答案：{" "}
          <span className="font-semibold text-[#F5E6B0]">
            {result.correctAnswer}
          </span>
        </div>

        <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
          {result.explanation}
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <button
            onClick={onNext}
            className="px-4 py-2 rounded-md bg-gradient-to-br from-[#FFD966] to-[#CFA63A] text-black text-xs font-bold shadow-[0_0_8px_rgba(255,215,100,0.5)]"
          >
            下一題 →
          </button>
        </div>
      </div>
    </div>
  );
}
