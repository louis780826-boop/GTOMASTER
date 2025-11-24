
"use client";

import { useState } from "react";
import { analyzeSpot } from "../../lib/coach/engine";
import type { SpotInput, CoachResult, Tier } from "../../lib/coach/types";
import { useTier } from "../../lib/tier/useTier";

const defaultSpot: SpotInput = {
  heroPosition: "BTN",
  street: "flop",
  potSize: 12,
  effectiveStack: 60,
  spr: 5,
  heroHand: "AhKd",
  board: "Ts8d2c",
  heroAction: "bet",
  villainAggression: "normal",
  notes: "",
};

export default function CoachPage() {
  const { tier } = useTier();
  const [spot, setSpot] = useState<SpotInput>(defaultSpot);
  const [result, setResult] = useState<CoachResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof SpotInput, value: unknown) => {
    setSpot((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAnalyze = () => {
    setLoading(true);
    try {
      const r = analyzeSpot(spot, tier as Tier);
      setResult(r);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h1 className="title-gold mb-2">AI 教練模式</h1>
      <p className="text-gray-200 mb-4">
        輸入一個牌局情境，AI 會依照 GTO 思維給出建議主線、可能漏洞與多街策略規劃。
        目前方案：<span className="text-gold font-bold ml-1">{tier}</span>
      </p>

      {/* 輸入區塊 */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="card card-glow space-y-3">
          <h2 className="font-bold mb-1">牌局設定</h2>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <label className="block text-gray-300 mb-1">位置</label>
              <select
                className="w-full bg-[#1a1c24] border border-[#2b2e3a] rounded-lg px-2 py-1"
                value={spot.heroPosition}
                onChange={(e) => handleChange("heroPosition", e.target.value as SpotInput["heroPosition"])}
              >
                <option value="UTG">UTG</option>
                <option value="HJ">HJ</option>
                <option value="CO">CO</option>
                <option value="BTN">BTN</option>
                <option value="SB">SB</option>
                <option value="BB">BB</option>
                <option value="Unknown">未知</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-1">街別</label>
              <select
                className="w-full bg-[#1a1c24] border border-[#2b2e3a] rounded-lg px-2 py-1"
                value={spot.street}
                onChange={(e) => handleChange("street", e.target.value as SpotInput["street"])}
              >
                <option value="preflop">Preflop</option>
                <option value="flop">Flop</option>
                <option value="turn">Turn</option>
                <option value="river">River</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-1">當前底池（BB）</label>
              <input
                type="number"
                className="w-full bg-[#1a1c24] border border-[#2b2e3a] rounded-lg px-2 py-1"
                value={spot.potSize}
                onChange={(e) => handleChange("potSize", Number(e.target.value || 0))}
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1">有效籌碼（BB）</label>
              <input
                type="number"
                className="w-full bg-[#1a1c24] border border-[#2b2e3a] rounded-lg px-2 py-1"
                value={spot.effectiveStack}
                onChange={(e) => {
                  const val = Number(e.target.value || 0);
                  handleChange("effectiveStack", val);
                  const spr = spot.potSize > 0 ? val / spot.potSize : 0;
                  handleChange("spr", spr);
                }}
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1">SPR</label>
              <input
                type="number"
                className="w-full bg-[#1a1c24] border border-[#2b2e3a] rounded-lg px-2 py-1"
                value={spot.spr.toFixed(1)}
                onChange={(e) => handleChange("spr", Number(e.target.value || 0))}
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1">對手風格</label>
              <select
                className="w-full bg-[#1a1c24] border border-[#2b2e3a] rounded-lg px-2 py-1"
                value={spot.villainAggression}
                onChange={(e) =>
                  handleChange(
                    "villainAggression",
                    e.target.value as SpotInput["villainAggression"]
                  )
                }
              >
                <option value="low">被動</option>
                <option value="normal">正常</option>
                <option value="high">高侵略</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <label className="block text-gray-300 mb-1">Hero 手牌</label>
              <input
                type="text"
                placeholder="例如 AhKd"
                className="w-full bg-[#1a1c24] border border-[#2b2e3a] rounded-lg px-2 py-1"
                value={spot.heroHand}
                onChange={(e) => handleChange("heroHand", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Board</label>
              <input
                type="text"
                placeholder="例如 Ts8d2c"
                className="w-full bg-[#1a1c24] border border-[#2b2e3a] rounded-lg px-2 py-1"
                value={spot.board}
                onChange={(e) => handleChange("board", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <label className="block text-gray-300 mb-1">Hero 動作</label>
              <select
                className="w-full bg-[#1a1c24] border border-[#2b2e3a] rounded-lg px-2 py-1"
                value={spot.heroAction}
                onChange={(e) => handleChange("heroAction", e.target.value as SpotInput["heroAction"])}
              >
                <option value="check">Check</option>
                <option value="bet">Bet</option>
                <option value="call">Call</option>
                <option value="raise">Raise</option>
                <option value="fold">Fold</option>
              </select>
            </div>
          </div>

          <div className="text-sm">
            <label className="block text-gray-300 mb-1">補充描述（選填）</label>
            <textarea
              rows={3}
              className="w-full bg-[#1a1c24] border border-[#2b2e3a] rounded-lg px-2 py-1"
              value={spot.notes || ""}
              onChange={(e) => handleChange("notes", e.target.value)}
            />
          </div>

          <button
            onClick={handleAnalyze}
            className="btn-gold mt-2"
            disabled={loading}
          >
            {loading ? "分析中..." : "開始分析這手牌"}
          </button>
        </div>

        {/* 基礎結果摘要 */}
        <div className="card card-glow text-sm">
          <h2 className="font-bold mb-2">解析摘要</h2>
          {result ? (
            <>
              <p className="mb-2">
                建議主線動作：
                <span className="text-gold font-bold ml-1">
                  {result.result.basicSummary.recommendedAction.toUpperCase()}
                </span>
              </p>
              <p className="mb-2">
                GTO 信心分數：
                <span className="text-gold font-bold ml-1">
                  {(result.result.basicSummary.confidence * 100).toFixed(0)} 分
                </span>
              </p>
              <p className="mb-2 text-gray-300">
                {result.result.basicSummary.rationale}
              </p>
              <p className="mb-2 text-gray-400">
                {result.result.basicSummary.gtoTendency}
              </p>
              {tier !== "FREE" && (
                <p className="mb-2 text-gray-400">
                  {result.result.basicSummary.exploitHint}
                </p>
              )}
              <p className="mt-3 text-xs text-gray-500">
                * 此為基於 GTO 概念的訓練輔助建議，不等同於牌局唯一正解。
              </p>
            </>
          ) : (
            <p className="text-gray-400">
              填寫左側牌局資訊後，點擊「開始分析這手牌」，即可看到建議主線與解析。
            </p>
          )}
        </div>
      </div>

      {/* 進階區域：多街規劃 + 漏洞解析 */}
      {result && (
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          <div className="card card-glow text-sm">
            <h2 className="font-bold mb-2">多街策略規劃</h2>
            <p className="text-xs text-gray-400 mb-2">
              依照 GTO 思路給出各街建議主線，適合作為之後實戰複盤時的參考模板。
            </p>
            <ul className="space-y-2">
              {result.result.streets.map((s) => (
                <li key={s.street} className="border border-[#2b2e3a] rounded-lg px-3 py-2">
                  <p className="font-bold mb-1">
                    {s.street.toUpperCase()}：{" "}
                    <span className="text-gold">{s.recommendation.toUpperCase()}</span>
                  </p>
                  <p className="text-gray-300">{s.comment}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="card card-glow text-sm">
            <h2 className="font-bold mb-2">漏洞與 exploit 建議</h2>
            <p className="text-xs text-gray-400 mb-2">
              系統會從你的實際動作與建議主線差距中，歸納出可能的長期漏洞。
            </p>

            <p className="mb-2">
              GTO 穩定度：
              <span className="text-gold font-bold ml-1">
                {result.result.gtoScore.toFixed(0)} 分
              </span>
            </p>
            <p className="mb-3">
              Exploit 風險：
              <span className="text-gold font-bold ml-1">
                {result.result.exploitScore.toFixed(0)} 分
              </span>
            </p>

            {result.result.leaks.length === 0 ? (
              <p className="text-gray-300">
                這手牌沒有偵測到明顯重大漏洞，可視為相對穩定的線路。
              </p>
            ) : (
              <ul className="space-y-2">
                {result.result.leaks.map((l) => (
                  <li
                    key={l.id}
                    className="border border-[#2b2e3a] rounded-lg px-3 py-2"
                  >
                    <p className="font-bold text-gold mb-1">
                      [{l.severity.toUpperCase()}] {l.label}
                    </p>
                    <p className="text-gray-300 mb-1">{l.description}</p>
                    <p className="text-xs text-gray-400">{l.advice}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
