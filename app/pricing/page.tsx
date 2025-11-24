"use client";

import { useState } from "react";

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState<null | "PRO" | "MASTER">(null);

  const tiers = [
    {
      name: "FREE+",
      price: "免費",
      tag: "先體驗再決定",
      desc: "適合剛開始接觸 GTO 的玩家。",
      highlight: [
        "每日固定題數練習（約 10 題）",
        "AI 教練每日 3 次解析",
        "解鎖前 5 章 GTO 課程",
        "基礎 GTO 範圍表瀏覽",
      ],
      cta: "目前使用中",
      plan: null,
      featured: false,
    },
    {
      name: "PRO",
      price: "NT$ 299 / 月（建議）",
      tag: "主要變現方案",
      desc: "固定打牌、想穩定提升勝率的玩家。",
      highlight: [
        "每日可練習 200 題以上",
        "AI 教練解析次數大幅提高",
        "解鎖最多 30 章 GTO 課程",
        "完整 Preflop 範圍表",
      ],
      cta: "升級為 PRO",
      plan: "pro",
      featured: true,
    },
    {
      name: "MASTER",
      price: "NT$ 799 / 月",
      tag: "高階玩家",
      desc: "長期打牌、想把 GTO 打到頂標。",
      highlight: [
        "練習與 AI 解析幾乎無上限（合理使用）",
        "解鎖全部 50 章 GTO 課程",
        "進階實戰模組與客製化建議（之後擴充）",
        "未來新功能優先內測資格",
      ],
      cta: "升級為 MASTER",
      plan: "master",
      featured: false,
    },
  ] as const;

  const goCheckout = async (plan: "pro" | "master") => {
    try {
      setLoadingPlan(plan === "pro" ? "PRO" : "MASTER");
      const res = await fetch(`/api/payment/checkout?plan=${plan}`, {
        method: "GET",
      });
      if (res.redirected) {
        // 在瀏覽器中，Next API redirect 會自動導向
        window.location.href = res.url;
      } else {
        const data = await res.json();
        if (!data.ok) {
          alert(data.error || "建立結帳連結失敗，請稍後再試。");
        }
      }
    } catch (err) {
      console.error(err);
      alert("建立結帳連結時發生錯誤。");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#05060a] text-white px-4 md:px-6 py-10">
      <section className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-yellow-200 mb-2">
            方案與升級
          </h1>
          <p className="text-sm md:text-base text-gray-300 max-w-2xl">
            先用 FREE+ 熟悉系統，真的感覺有幫助，再升級成 PRO / MASTER。
            價格之後可以再調整，現在的重點是先把金流跑通、系統可以開始收費。
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`rounded-2xl border bg-black/40 p-5 flex flex-col ${
                t.featured
                  ? "border-yellow-400 shadow-lg shadow-yellow-500/30"
                  : "border-yellow-500/20"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-400">{t.tag}</p>
                  <h2 className="text-lg font-semibold text-yellow-200">
                    {t.name}
                  </h2>
                </div>
                {t.featured && (
                  <span className="px-2 py-1 rounded-full bg-yellow-500/10 text-[11px] text-yellow-200 border border-yellow-400/60">
                    多數玩家選擇
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-300 mb-1">{t.desc}</p>
              <p className="text-xl font-bold text-yellow-300 mb-3">
                {t.price}
              </p>

              <ul className="space-y-1 text-xs md:text-sm text-gray-300 flex-1 mb-4">
                {t.highlight.map((f) => (
                  <li key={f}>· {f}</li>
                ))}
              </ul>

              {t.plan === null ? (
                <button
                  disabled
                  className="mt-auto w-full py-2 rounded-xl border border-yellow-500/40 text-xs md:text-sm text-gray-400 cursor-default"
                >
                  目前使用 FREE+ 方案
                </button>
              ) : (
                <button
                  onClick={() => goCheckout(t.plan!)}
                  disabled={
                    loadingPlan === "PRO"
                      ? t.plan === "pro"
                      : loadingPlan === "MASTER"
                      ? t.plan === "master"
                      : false
                  }
                  className="mt-auto w-full py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-xs md:text-sm text-black font-semibold disabled:opacity-60 disabled:cursor-wait"
                >
                  {loadingPlan &&
                  ((loadingPlan === "PRO" && t.plan === "pro") ||
                    (loadingPlan === "MASTER" && t.plan === "master"))
                    ? "建立結帳連結中…"
                    : t.cta}
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
