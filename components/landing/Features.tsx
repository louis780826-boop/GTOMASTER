export default function Features() {
  const items = [
    {
      title: "結構化 GTO 題庫",
      desc: "依照位置、籌碼深度、對手行為設計的練習題，刻意訓練常見高頻 Spot。",
    },
    {
      title: "AI 教練即時解析",
      desc: "輸入你的實戰牌局，AI 直接從 GTO 思維角度分析決策與可能被剝削的點。",
    },
    {
      title: "完整範圍表視覺化",
      desc: "UTG / CO / BTN / SB / BB 等位置，一眼看出 GTO 建議的 Raise / Call / Fold 比例。",
    },
    {
      title: "50 章課程路線圖",
      desc: "從基礎理論到三街實戰，全中文內容，按章節循序漸進建立你的決策框架。",
    },
    {
      title: "FREE+ 友善起步",
      desc: "不用綁卡、不用一開始就付費，也能體驗核心功能與基礎課程內容。",
    },
    {
      title: "為長時間專注優化",
      desc: "黑金霧面風格、低干擾排版，把注意力留在每一次思考與每一手決策。",
    },
  ];

  return (
    <section className="border-t border-yellow-500/10 bg-[#05060a]">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-xl md:text-2xl font-semibold text-yellow-200 mb-2">
          為「想認真變強」的撲克玩家設計
        </h2>
        <p className="text-sm md:text-base text-gray-300 mb-6 max-w-2xl">
          我和許多牌友一樣走過大量試錯、看影片卻無法落地的階段。GTO+ MASTER
          想做的是：把理論變成你每天可以打開 30 分鐘就能練的工具。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-yellow-500/20 bg-black/40 p-4 hover:border-yellow-400/70 hover:shadow-lg hover:shadow-yellow-500/20 transition"
            >
              <h3 className="text-sm md:text-base font-semibold text-yellow-200">
                {f.title}
              </h3>
              <p className="mt-2 text-xs md:text-sm text-gray-300">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
