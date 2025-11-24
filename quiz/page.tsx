"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import PremiumCard from "../components/PremiumCard";
import PremiumTitle from "../components/PremiumTitle";
import Button from "../components/Button";

import { quizQuestions } from "../data/quiz";
import { addQuizRecord } from "../utils/quizStorage";

export default function QuizPage() {
  const params = useSearchParams();
  const category = params.get("cat") as
    | "preflop"
    | "flop"
    | "turn"
    | "river"
    | null;

  const list = category
    ? quizQuestions.filter((q) => q.category === category)
    : quizQuestions;

  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");

  const q = list[idx];

  function toggleSelect(opt: string) {
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
    if (selected.length === 0) return;

    const correct =
      selected.length === q.answer.length &&
      selected.every((s) => q.answer.includes(s));

    addQuizRecord({
      timestamp: Date.now(),
      isCorrect: correct,
      questionId: q.id,
    });

    setFeedback(
      correct
        ? "正確！"
        : `錯誤，正確答案：${q.answer.join(", ")}`
    );

    setTimeout(() => {
      setSelected([]);
      setFeedback("");

      // 下一題
      setIdx((i) => (i + 1) % list.length);
    }, 1500);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-white">
      <PremiumTitle
        text={
          category
            ? `題庫練習：${category.toUpperCase()}`
            : "題庫練習（所有分類）"
        }
      />

      <PremiumCard>
        <p className="text-gray-300 mb-4 text-base">{q.question}</p>

        {q.imageUrl && (
          <img
            src={q.imageUrl}
            alt="quiz"
            className="w-full rounded-lg mb-4 border border-[#d5b26e30]"
          />
        )}

        <div className="space-y-3 mb-4">
          {q.options?.map((opt: string) => {
            const isActive = selected.includes(opt);

            return (
              <div
                key={opt}
                onClick={() => toggleSelect(opt)}
                className={`
                  px-4 py-2 rounded-lg cursor-pointer border transition-all
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

        <Button onClick={check}>提交答案</Button>

        {feedback && (
          <p className="mt-4 text-[#d5b26e] font-semibold">{feedback}</p>
        )}
      </PremiumCard>
    </div>
  );
}
