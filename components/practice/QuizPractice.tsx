"use client";

import { useEffect, useState } from "react";

type Option = {
  value: string;
  label: string;
};

type QuizSpot = {
  id: string;
  title: string;
  description: string;
  options: Option[];
  correct: string;
  explanation: string;
};

const QUIZ_SPOTS: QuizSpot[] = [
  {
    id: "btn-open-a5s",
    title: "BTN 持 A5s · 未有人進池",
    description:
      "6-max 現金局，40BB 有效籌碼。你在 BTN 拿到 A5s，前位全棄牌到你，這裡 preflop 應該怎麼做？",
    options: [
      { value: "fold", label: "Fold" },
      { value: "call", label: "Limp / Call" },
      { value: "raise", label: "標準 Raise" },
    ],
    correct: "raise",
    explanation:
      "在大多數標準環境中，BTN 持 A5s 會是高頻開局手牌。可以做 blocker、具可玩性，且能在多數 flop 保持不錯的 equity。",
  },
  {
    id: "sb-vs-bb-kqs",
    title: "SB 持 KQs · 面對 BB 3bet",
    description:
      "6-max，SB open 2.5bb，BB 3bet 到 9bb，有效 100BB。你在 SB 持 KQs，標準理論建議是？",
    options: [
      { value: "fold", label: "Fold" },
      { value: "call", label: "Call 防守" },
      { value: "fourbet", label: "4bet Bluff / Merge" },
    ],
    correct: "call",
    explanation:
      "標準情況下，SB 對 BB 3bet 時，KQs 多數時間作為防守組合 Call，避免過度 4bet 或過度棄掉過強的手牌。",
  },
];

function getRandomSpot(): QuizSpot {
  const idx = Math.floor(Math.random() * QUIZ_SPOTS.length);
  return QUIZ_SPOTS[idx];
}

export default function QuizPractice() {
  const [spot, setSpot] = useState<QuizSpot | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  // 只在 client 抽題，避免 SSR / Hydration 不一致
  useEffect(() => {
    setSpot(getRandomSpot());
  }, []);

  function handleSelect(value: string) {
    if (!spot || showResult) return;
    setSelected(value);
  }

  function handleSubmit() {
    if (!spot || !selected) return;
    setShowResult(true);
  }

  function handleNext() {
    setSpot(getRandomSpot());
    setSelected(null);
    setShowResult(false);
  }

  if (!spot) {
    return (
      <div className="bg-[#11131a] border border-[#262938] rounded-2xl p-5 md:p-6 mb-6 text-sm text-gray-300">
        載入題目中…
      </div>
    );
  }

  const isCorrect = selected && selected === spot.correct;

  return (
    <div className="bg-[#11131a] border border-[#262938] rounded-2xl p-5 md:p-6 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base md:text-lg font-semibold text-yellow-400">
          題庫練習 · 單手決策
        </h2>
        <span className="text-[11px] text-gray-400">
          隨機題目 · 適合作為每日熱身
        </span>
      </div>

      <h3 className="text-sm md:text-base font-semibold mb-1">{spot.title}</h3>
      <p className="text-xs md:text-sm text-gray-300 mb-4 leading-relaxed">
        {spot.description}
      </p>

      <div className="flex flex-col gap-2 mb-4">
        {spot.options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => handleSelect(opt.value)}
            className={
              "w-full text-left px-3 py-2 rounded-lg border text-xs md:text-sm transition " +
              (selected === opt.value
                ? "border-yellow-400 bg-[#1b1d25]"
                : "border-[#303341] bg-[#14161f] hover:border-yellow-400/70")
            }
          >
            {opt.label}
          </button>
        ))}
      </div>

      {!showResult ? (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!selected}
          className={
            "px-4 py-2 rounded-lg text-xs md:text-sm font-semibold " +
            (selected
              ? "bg-yellow-400 text-black hover:opacity-90"
              : "bg-[#353845] text-gray-500 cursor-not-allowed")
          }
        >
          查看解析
        </button>
      ) : (
        <div className="mt-3 text-xs md:text-sm">
          <p
            className={
              "font-semibold mb-1 " +
              (isCorrect ? "text-green-400" : "text-red-400")
            }
          >
            {isCorrect ? "這一手的方向是對的。" : "這一手還有更好的選擇。"}
          </p>
          <p className="text-gray-300 mb-3 leading-relaxed">
            {spot.explanation}
          </p>
          <button
            type="button"
            onClick={handleNext}
            className="px-4 py-2 rounded-lg text-xs md:text-sm font-semibold bg-[#1f222f] border border-[#3a3e4f] text-gray-100 hover:border-yellow-400/80 hover:text-yellow-300 transition"
          >
            下一題
          </button>
        </div>
      )}
    </div>
  );
}
