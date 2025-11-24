"use client";

import { useEffect, useState } from "react";
import {
  AiTableSpot,
  getRandomAiTableSpot,
} from "../../lib/practice/aiTableSpots";

type PlayerAction =
  | "fold"
  | "call"
  | "raise"
  | "check-back"
  | "small-bet"
  | "big-bet"
  | "overbet";

function renderActionLabel(action: PlayerAction): string {
  switch (action) {
    case "fold":
      return "Fold";
    case "call":
      return "Call / Check-call";
    case "raise":
      return "Raise / Check-raise";
    case "check-back":
      return "Check back";
    case "small-bet":
      return "小注 1/3 pot";
    case "big-bet":
      return "大注 2/3–3/4 pot";
    case "overbet":
      return "Overbet";
    default:
      return action;
  }
}

export default function AITable() {
  const [spot, setSpot] = useState<AiTableSpot | null>(null);
  const [selected, setSelected] = useState<PlayerAction | null>(null);
  const [showResult, setShowResult] = useState(false);

  // 只在 client 抽局面
  useEffect(() => {
    setSpot(getRandomAiTableSpot());
  }, []);

  function handleSelect(action: PlayerAction) {
    if (!spot || showResult) return;
    setSelected(action);
  }

  function handleSubmit() {
    if (!spot || !selected) return;
    setShowResult(true);
  }

  function handleNext() {
    setSpot(getRandomAiTableSpot());
    setSelected(null);
    setShowResult(false);
  }

  if (!spot) {
    return (
      <div className="bg-[#11131a] border border-[#262938] rounded-2xl p-5 md:p-6 text-sm text-gray-300">
        載入牌桌局面中…
      </div>
    );
  }

  const isCorrect =
    selected && selected === (spot.correctAction as PlayerAction);

  return (
    <div className="bg-[#11131a] border border-[#262938] rounded-2xl p-5 md:p-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-base md:text-lg font-semibold text-yellow-400">
            AI 實戰牌桌 · 單手局面訓練
          </h2>
          <p className="text-[11px] md:text-xs text-gray-400">
            以局面為單位，模擬實戰決策，適合作為每日主練內容。
          </p>
        </div>
        <div className="text-right text-[11px] text-gray-400">
          <div>{spot.tableType}</div>
          <div>難度：{spot.difficulty.toUpperCase()}</div>
        </div>
      </div>

      {/* 牌桌示意 */}
      <div className="bg-[#070811] rounded-2xl border border-[#262938] px-4 py-4 mb-4">
        <div className="flex flex-col items-center gap-3">
          {/* 對手區 */}
          <div className="flex items-center justify-center gap-4 text-xs md:text-sm">
            <div className="px-3 py-2 rounded-xl bg-[#141824] border border-[#303341]">
              <div className="text-gray-400">{spot.villainPosition}</div>
              <div className="text-gray-100 font-semibold">Villain</div>
              <div className="text-[10px] text-gray-400 mt-1">
                {spot.villainAction}
              </div>
            </div>
          </div>

          {/* 公共牌 */}
          <div className="flex items-center justify-center gap-2 mt-1">
            {spot.board.map((card) => (
              <div
                key={card}
                className="w-10 h-14 md:w-11 md:h-16 rounded-lg border border-[#3a3e4f] bg-[#11131f] flex items-center justify-center text-sm md:text-base font-semibold text-gray-100"
              >
                {card}
              </div>
            ))}
          </div>

          {/* pot 與桌面資訊 */}
          <div className="mt-2 text-[11px] md:text-xs text-gray-400 flex flex-col items-center gap-1">
            <div>目前底池：約 {spot.pot.toFixed(1)} BB</div>
            <div>有效籌碼：約 {spot.effectiveStack} BB</div>
          </div>

          {/* Hero 區 */}
          <div className="mt-4 flex flex-col items-center gap-2">
            <div className="px-3 py-1 rounded-full bg-[#141824] border border-[#303341] text-[11px] text-gray-300">
              Hero · {spot.heroPosition}
            </div>
            <div className="flex items-center gap-2">
              {spot.heroCards.map((card) => (
                <div
                  key={card}
                  className="w-10 h-14 md:w-11 md:h-16 rounded-lg border border-yellow-400/70 bg-[#181b27] flex items-center justify-center text-sm md:text-base font-semibold text-yellow-100"
                >
                  {card}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 描述 */}
      <div className="text-xs md:text-sm text-gray-300 mb-3 leading-relaxed">
        {spot.description}
      </div>

      {/* 操作按鈕 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {spot.actions.map((act) => {
          const action = act as PlayerAction;
          const active = selected === action;
          return (
            <button
              key={action}
              type="button"
              onClick={() => handleSelect(action)}
              className={
                "px-3 py-2 rounded-lg border text-xs md:text-sm transition " +
                (active
                  ? "border-yellow-400 bg-[#1b1d25] text-yellow-100"
                  : "border-[#303341] bg-[#14161f] text-gray-200 hover:border-yellow-400/70")
              }
            >
              {renderActionLabel(action)}
            </button>
          );
        })}
      </div>

      {/* 結果與解析 */}
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
          查看 AI 解析
        </button>
      ) : (
        <div className="mt-3 text-xs md:text-sm">
          <p
            className={
              "font-semibold mb-1 " +
              (isCorrect ? "text-green-400" : "text-red-400")
            }
          >
            {isCorrect
              ? "這一手的方向與標準策略相近。"
              : "這一手在標準 GTO 策略中會有更好的選擇。"}
          </p>
          <p className="text-gray-300 mb-3 leading-relaxed">
            {spot.explanation}
          </p>
          <button
            type="button"
            onClick={handleNext}
            className="px-4 py-2 rounded-lg text-xs md:text-sm font-semibold bg-[#1f222f] border border-[#3a3e4f] text-gray-100 hover:border-yellow-400/80 hover:text-yellow-300 transition"
          >
            下一手局面
          </button>
        </div>
      )}
    </div>
  );
}
