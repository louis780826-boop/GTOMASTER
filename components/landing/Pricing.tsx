const plans = [
  {
    name: "FREE+",
    highlight: "適合剛開始接觸 GTO 的玩家",
    price: "免費",
    badge: "入門推薦",
    features: [
      "每日固定數量練習題",
      "AI 教練每日有限次解析",
      "解鎖前 5 章 GTO 課程",
      "基礎 GTO 範圍表瀏覽",
    ],
  },
  {
    name: "PRO",
    highlight: "適合固定打牌、希望明顯提升勝率的玩家",
    price: "NT$？ / 月",
    badge: "主力方案",
    featured: true,
    features: [
      "大幅提高每日練習與 AI 解析次數",
      "解鎖最多 30 章 GTO 課程",
      "完整 Preflop 範圍表",
      "進階數據與訓練報告",
    ],
  },
  {
    name: "MASTER",
    highlight: "適合長期打牌、想打到理論頂標的玩家",
    price: "NT$？ / 月",
    badge: "高階玩家",
    features: [
      "所有練習與 AI 解析無上限（合理範圍內）",
      "解鎖全部 50 章 GTO 課程",
      "進階實戰模組與客製化建議",
      "未來新功能優先內測資格",
    ],
  },
];

export default function Pricing() {
  return (
    <section className="border-t border-yellow-500/10 bg-[#05060a]">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-yellow-200 mb-2">
              從 FREE+ 開始，往 PRO / MASTER 穩定升級
            </h2>
            <p className="text-sm md:text-base text-gray-300 max-w-xl">
              你可以完全用 FREE+ 熟悉系統，真的感覺到「有幫助」再考慮升級。所有方案都會維持簡單明瞭、沒有藏條款。
            </p>
          </div>
          <p className="text-[11px] md:text-xs text-gray-500">
            價格為示意，正式上線時依實際公告為準。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`rounded-2xl border bg-black/40 p-5 flex flex-col ${
                p.featured
                  ? "border-yellow-400 shadow-lg shadow-yellow-500/30"
                  : "border-yellow-500/20"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-400">{p.badge}</p>
                  <h3 className="text-lg font-semibold text-yellow-200">
                    {p.name}
                  </h3>
                </div>
                {p.featured && (
                  <span className="px-2 py-1 rounded-full bg-yellow-500/10 text-[11px] text-yellow-200 border border-yellow-400/60">
                    多數玩家選擇
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-300 mb-2">{p.highlight}</p>
              <p className="text-xl font-bold text-yellow-300 mb-4">
                {p.price}
              </p>
              <ul className="space-y-1 text-xs md:text-sm text-gray-300 flex-1">
                {p.features.map((f) => (
                  <li key={f}>· {f}</li>
                ))}
              </ul>
              <button className="mt-4 w-full py-2 rounded-xl border border-yellow-500/60 text-xs md:text-sm text-yellow-200 hover:bg-yellow-500/10 transition">
                之後在系統內升級
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
