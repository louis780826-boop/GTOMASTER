"use client";

import AIBattleTable from "../../../components/aibattle/AIBattleTable";

export default function AIBattlePage() {
  return (
    <main className="min-h-screen bg-[#05060a] text-white px-4 md:px-6 py-8">
      <section className="max-w-5xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[#D6AF7B]">
            AI 實戰牌桌 · 三街完整訓練
          </h1>
          <p className="text-sm md:text-base text-gray-300 mt-1">
            從 Flop、Turn 到 River，一條線看完一手牌的決策流程，用簡單好懂的說明帶你走過每一街。
          </p>
        </header>

        <AIBattleTable />
      </section>
    </main>
  );
}
