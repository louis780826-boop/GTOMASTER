"use client";

import Link from "next/link";
import PremiumCard from "../components/PremiumCard";
import PremiumTitle from "../components/PremiumTitle";

const categories = [
  { key: "preflop", name: "Preflop" },
  { key: "flop", name: "Flop" },
  { key: "turn", name: "Turn" },
  { key: "river", name: "River" },
];

export default function QuizHome() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-white">
      <PremiumTitle text="題庫分類" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {categories.map((c) => (
          <PremiumCard key={c.key} className="text-center">
            <h2 className="text-lg font-semibold text-[#d5b26e] mb-2">
              {c.name}
            </h2>

            <Link
              href={`/quiz/page?cat=${c.key}`}
              className="
                inline-block px-4 py-2 mt-2 rounded-lg border
                text-[#d5b26e] border-[#d5b26e60] bg-[#0f1117]
                hover:border-[#d5b26e] hover:shadow-[0_0_10px_rgba(255,215,130,0.3)]
                transition-all
              "
            >
              開始練習
            </Link>
          </PremiumCard>
        ))}
      </div>
    </div>
  );
}
