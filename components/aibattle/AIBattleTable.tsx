"use client";

import { useEffect, useState } from "react";
import {
  AIBattleSpot,
  getRandomAIBattleSpot,
} from "../../lib/aibattle/spots";

type Street = "flop" | "turn" | "river";

export default function AIBattleTable() {
  const [spot, setSpot] = useState<AIBattleSpot | null>(null);
  const [street, setStreet] = useState<Street>("flop");
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const s = getRandomAIBattleSpot();
    setSpot(s);
    setStreet("flop");
    setSelected(null);
    setShowResult(false);
  }, []);

  if (!spot) {
    return (
      <div className="bg-[#11131a] border border-[#262938] rounded-2xl p-5 md:p-6 text-sm text-gray-300">
        載入牌局中…
      </div>
    );
  }

  const currentStreetConfig =
    street === "flop" ? spot.flop : street === "turn" ? spot.turn : spot.river;

  const boardCards =
    street === "flop"
      ? spot.boardFlop
      : street === "turn"
      ? [...spot.boardFlop, spot.turnCard]
      : [...spot.boardFlop, spot.turnCard, spot.riverCard];

  const isLastStreet = street === "river";

  function handleSelect(action: string) {
    if (showResult) return;
    setSelected(action);
  }

  function handleShowResult() {
    if (!selected) return;
    setShowResult(true);
  }

function handleNextStreetOrHand() {
  // 先不要強制要求一定要看解析才能進下一街
  if (!isLastStreet) {
    const nextStreet: Street = street === "flop" ? "turn" : "river";
    setStreet(nextStreet);
    setSelected(null);
    setShowResult(false);
    return;
  }

  // 已經是 River，就換下一手牌
  const s = getRandomAIBattleSpot();
  setSpot(s);
  setStreet("flop");
  setSelected(null);
  setShowResult(false);
}

  const isCorrect =
    selected && selected === currentStreetConfig.correctAction;

  return (
    <div className="bg-[#0B0C10] border border-[#2A2C3A] rounded-2xl p-4 md:p-6 shadow-[0_0_40px_rgba(0,0,0,0.6)]">
      {/* 上方：桌型與街次資訊 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-base md:text-lg font-semibold text-[#D6AF7B]">
            {spot.tableType}
          </h2>
          <p className="text-[11px] md:text-xs text-gray-400 mt-1">
            難度：{spot.difficulty.toUpperCase()} · 三街完整決策訓練
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] md:text-xs text-gray-400">
          <span className="px-2 py-1 rounded-full bg-[#12131a] border border-[#2f3140]">
            現在街次：{" "}
            <span className="text-[#D6AF7B] font-semibold">
              {street === "flop"
                ? "Flop"
                : street === "turn"
                ? "Turn"
                : "River"}
            </span>
          </span>
          <span className="px-2 py-1 rounded-full bg-[#12131a] border border-[#2f3140]">
            Hero · {spot.heroPosition}
          </span>
        </div>
      </div>

      {/* 牌桌區：桌機／手機自適應 */}
      <div className="bg-gradient-to-br from-[#05060a] to-[#11131a] rounded-2xl border border-[#3b3d4b] px-3 md:px-6 py-4 md:py-6 mb-4">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-center lg:items-stretch">
          {/* 左側：牌桌畫面 */}
          <div className="flex-1 flex flex-col items-center gap-3">
            {/* Villain 區 */}
            <div className="flex items-center justify-center gap-3 text-xs md:text-sm">
              <div className="px-3 py-2 rounded-xl bg-[#141620] border border-[#343647] shadow-[0_0_20px_rgba(0,0,0,0.5)] min-w-[150px] text-center">
                <div className="text-gray-400 text-[11px]">
                  對手位置 · {spot.heroPosition === "BTN" ? "BB" : "未知"}
                </div>
                <div className="text-gray-100 font-semibold">Villain</div>
                <div className="text-[10px] text-gray-400 mt-1">
                  {currentStreetConfig.villainAction}
                </div>
              </div>
            </div>

            {/* 公共牌 */}
            <div className="flex items-center justify-center gap-2 mt-1">
              {boardCards.map((card) => (
                <div
                  key={card}
                  className="w-10 h-14 md:w-12 md:h-16 rounded-lg border border-[#D6AF7B]/60 bg-[#151725] flex items-center justify-center text-sm md:text-base font-semibold text-gray-100 shadow-[0_0_18px_rgba(0,0,0,0.7)]"
                >
                  {card}
                </div>
              ))}
            </div>

            {/* pot 與有效籌碼 */}
            <div className="mt-2 text-[11px] md:text-xs text-gray-400 flex flex-col items-center gap-1">
              <div>目前底池：約 {spot.pot.toFixed(1)} BB</div>
              <div>有效籌碼：約 {spot.effectiveStack} BB</div>
            </div>

            {/* Hero 區 */}
            <div className="mt-4 flex flex-col items-center gap-2">
              <div className="px-3 py-1 rounded-full bg-[#141620] border border-[#343647] text-[11px] text-gray-300">
                Hero · {spot.heroPosition}
              </div>
              <div className="flex items-center gap-2">
                {spot.heroCards.map((card) => (
                  <div
                    key={card}
                    className="w-10 h-14 md:w-12 md:h-16 rounded-lg border border-[#D6AF7B] bg-[#1B1D2B] flex items-center justify-center text-sm md:text-base font-semibold text-[#F5E3BD] shadow-[0_0_22px_rgba(214,175,123,0.35)]"
                  >
                    {card}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 右側：說明與操作（在手機會被排到下方） */}
          <div className="flex-1 w-full bg-[#10121c]/80 border border-[#333648] rounded-2xl px-3 py-3 md:px-4 md:py-4 shadow-[0_0_26px_rgba(0,0,0,0.65)]">
            <div className="text-xs md:text-sm text-gray-300 mb-3 leading-relaxed">
              <p className="text-[11px] md:text-xs text-gray-400 mb-1">
                Preflop 簡介
              </p>
              <p>{spot.preflopDescription}</p>
            </div>

            <div className="mt-2 mb-2">
              <p className="text-[11px] md:text-xs text-gray-400 mb-1">
                目前局面
              </p>
              <p className="text-xs md:text-sm text-gray-200">
                {currentStreetConfig.villainAction}
              </p>
            </div>

            {/* 操作按鈕 */}
            <div className="mt-3 mb-4">
              <p className="text-[11px] md:text-xs text-gray-400 mb-2">
                選擇你覺得這一街最合理的做法：
              </p>
              <div className="flex flex-wrap gap-2">
                {currentStreetConfig.actions.map((action) => {
                  const active = selected === action;
                  return (
                    <button
                      key={action}
                      type="button"
                      onClick={() => handleSelect(action)}
                      className={
                        "px-3 py-2 rounded-lg border text-xs md:text-sm transition " +
                        (active
                          ? "border-[#D6AF7B] bg-[#1B1D28] text-[#F5E3BD] shadow-[0_0_18px_rgba(214,175,123,0.4)]"
                          : "border-[#3a3d4f] bg-[#161823] text-gray-200 hover:border-[#D6AF7B]/70 hover:text-[#F5E3BD]")
                      }
                    >
                      {action}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 結果與 AI 解說 */}
            {!showResult ? (
              <button
                type="button"
                onClick={handleShowResult}
                disabled={!selected}
                className={
                  "w-full md:w-auto px-4 py-2 rounded-lg text-xs md:text-sm font-semibold mt-1 " +
                  (selected
                    ? "bg-[#D6AF7B] text-black hover:opacity-90 shadow-[0_0_20px_rgba(214,175,123,0.55)]"
                    : "bg-[#343646] text-gray-500 cursor-not-allowed")
                }
              >
                查看這一街的 AI 建議
              </button>
            ) : (
              <div className="mt-3 text-xs md:text-sm">
                <p
                  className={
                    "font-semibold mb-1 " +
                    (isCorrect ? "text-emerald-400" : "text-red-400")
                  }
                >
                  {isCorrect
                    ? "方向不錯，這一街的選擇是合理的。"
                    : "這一街還有更穩健、長期更賺錢的選擇。"}
                </p>
                <p className="text-gray-200 mb-3 leading-relaxed">
                  {currentStreetConfig.explanation}
                </p>
                <button
                  type="button"
                  onClick={handleNextStreetOrHand}
                  className="w-full md:w-auto px-4 py-2 rounded-lg text-xs md:text-sm font-semibold bg-[#1B1D28] border border-[#D6AF7B]/70 text-[#F5E3BD] hover:border-[#F3D39A] hover:text-white hover:shadow-[0_0_22px_rgba(214,175,123,0.55)] transition"
                >
                  {isLastStreet ? "下一手牌局" : "進入下一街"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
