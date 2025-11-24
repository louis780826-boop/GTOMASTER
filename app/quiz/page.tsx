"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { quizQuestions } from "../../data/quiz";
import { addQuizRecord } from "../../utils/quizStorage";
import {
  addSessionAnswer,
  resetSession,
} from "../../utils/quizSession";

type Category = "all" | "preflop" | "flop" | "turn" | "river";

const SESSION_SIZE = 10;

export default function QuizPage() {
  const router = useRouter();

  const [category, setCategory] = useState<Category>("preflop");
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");
  const [answeredCount, setAnsweredCount] = useState(0);

  // 初次進入頁面 → 開一個新的 session
  useEffect(() => {
    resetSession();
    setAnsweredCount(0);
  }, []);

  const list =
    category === "all"
      ? quizQuestions
      : quizQuestions.filter((q) => q.category === category);

  const hasQuestion = list.length > 0;
  const q = hasQuestion ? list[idx] : null;

  function changeCategory(cat: Category) {
    setCategory(cat);
    setIdx(0);
    setSelected([]);
    setFeedback("");
  }

  function toggleSelect(opt: string) {
    if (!q) return;

    if (q.type === "single") {
      setSelected([opt]);
      return;
    }

    if (selected.includes(opt)) {
      setSelected(selected.filter((x) => x !== opt));
    } else {
      setSelected([...selected, opt]);
    }
  }

  function check() {
    if (!q || selected.length === 0) return;

    const correct =
      selected.length === q.answer.length &&
      selected.every((s) => q.answer.includes(s));

    // 總題庫紀錄（給 Dashboard 用）
    addQuizRecord({
      timestamp: Date.now(),
      isCorrect: correct,
      questionId: q.id,
    });

    // 本次 10 題測驗紀錄
    addSessionAnswer({
      questionId: q.id,
      category: q.category,
      isCorrect: correct,
    });

    const newCount = answeredCount + 1;
    setAnsweredCount(newCount);

    setFeedback(
      correct
        ? "正確！"
        : `錯誤，正確答案：${q.answer.join(", ")}`
    );

    // 如果已經作滿 10 題 → 跳轉結算頁
    if (newCount >= SESSION_SIZE) {
      setTimeout(() => {
        router.push("/quiz/result");
      }, 700);
      return;
    }

    // 繼續下一題
    setTimeout(() => {
      setSelected([]);
      setFeedback("");
      setIdx((i) => (i + 1) % list.length);
    }, 700);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-white">
      {/* 標題 */}
      <h1 className="text-2xl font-semibold text-[#d5b26e] mb-2">
        題庫練習（分類版）
      </h1>
      <p className="text-xs text-gray-400 mb-4">
        本次測驗固定 10 題，目前進度：{answeredCount} / {SESSION_SIZE}
      </p>

      {/* 分類 Tab */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "preflop", label: "Preflop" },
          { key: "flop", label: "Flop" },
          { key: "turn", label: "Turn" },
          { key: "river", label: "River" },
          { key: "all", label: "全部" },
        ].map((c) => (
          <button
            key={c.key}
            onClick={() => changeCategory(c.key as Category)}
            className={`
              px-3 py-1.5 rounded-full text-xs border transition
              ${
                category === c.key
                  ? "bg-[#d5b26e] text-black border-[#d5b26e]"
                  : "bg-[#0f1117] text-gray-300 border-[#d5b26e40] hover:border-[#d5b26e]"
              }
            `}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* 題目卡片 */}
      <div className="rounded-2xl border border-[#d5b26e40] bg-[#0b0c10] p-6 shadow-[0_0_18px_rgba(0,0,0,0.6)]">
        {!hasQuestion && (
          <p className="text-gray-400 text-sm">
            此分類目前尚未建立題目，請先選擇其他分類（例如 Preflop / Flop）或選擇「全部」。
          </p>
        )}

        {hasQuestion && q && (
          <>
            <p className="text-gray-300 mb-4 text-base">{q.question}</p>

            {/* 選項 */}
            <div className="space-y-3 mb-4">
              {q.options?.map((opt: string) => {
                const isActive = selected.includes(opt);

                return (
                  <div
                    key={opt}
                    onClick={() => toggleSelect(opt)}
                    className={`
                      px-4 py-2 rounded-lg cursor-pointer border transition-all text-sm
                      ${
                        isActive
                          ? "bg-[#d5b26e30] border-[#d5b26e]"
                          : "bg-[#0f1117] border-[#d5b26e30] hover:border-[#d5b26e]"
                      }
                    `}
                  >
                    {opt}
                  </div>
                );
              })}
            </div>

            {/* 提交按鈕 */}
            <button
              onClick={check}
              className="
                px-4 py-2 rounded-lg text-sm font-semibold
                bg-[#d5b26e] text-black
                hover:bg-[#f1ce88] transition
              "
            >
              提交答案
            </button>

            {feedback && (
              <p className="mt-4 text-[#d5b26e] font-semibold">
                {feedback}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
