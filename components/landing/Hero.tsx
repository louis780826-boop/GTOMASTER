export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b0c12] via-[#05060a] to-black" />
      <div className="absolute -top-32 -right-32 h-72 w-72 rounded-full bg-yellow-500/10 blur-3xl" />
      <div className="absolute top-40 -left-24 h-64 w-64 rounded-full bg-yellow-400/10 blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-4 pt-16 pb-14 flex flex-col md:flex-row items-center gap-10">
        {/* 左側文案 */}
        <div className="flex-1">
          <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-500/40 bg-black/40 text-[11px] md:text-xs tracking-[0.16em] text-yellow-300/80 uppercase">
            GTO+ MASTER · 華語撲克訓練系統
          </p>
          <h1 className="mt-4 text-3xl md:text-5xl font-bold leading-tight text-white">
            把 <span className="text-yellow-300">GTO 理論</span>{" "}
            變成你牌桌上的
            <span className="text-yellow-400">穩定優勢</span>
          </h1>
          <p className="mt-4 text-sm md:text-base text-gray-300 max-w-xl">
            GTO+ MASTER 專為德州撲克玩家設計，整合
            <span className="text-yellow-300"> 練習題庫、AI 教練、GTO 範圍表、50 章系統化課程 </span>
            ，一步步把你從「感覺打牌」帶向「有結構的決策」。
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="/practice"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-sm md:text-base font-semibold shadow-lg shadow-yellow-500/30 hover:brightness-110 transition"
            >
              立即開始免費練習
            </a>
            <a
              href="/chapters"
              className="px-4 py-2 rounded-xl border border-yellow-500/50 text-yellow-200 text-xs md:text-sm hover:bg-yellow-500/10 transition"
            >
              查看 50 章 GTO 課程
            </a>
            <p className="w-full md:w-auto text-[11px] md:text-xs text-gray-400 mt-1 md:mt-0">
              無需綁定信用卡 · FREE+ 方案即可體驗核心功能
            </p>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4 max-w-md text-center md:text-left md:max-w-none md:flex md:gap-10 text-xs md:text-sm">
            <div>
              <p className="text-yellow-300 font-semibold text-base md:text-lg">GTO 題庫</p>
              <p className="text-gray-400 mt-1">專為常見情境設計，重複練到內化為直覺。</p>
            </div>
            <div>
              <p className="text-yellow-300 font-semibold text-base md:text-lg">AI 教練</p>
              <p className="text-gray-400 mt-1">輸入牌局，即時給出 GTO 思路與漏洞標記。</p>
            </div>
            <div>
              <p className="text-yellow-300 font-semibold text-base md:text-lg">黑金界面</p>
              <p className="text-gray-400 mt-1">為長時間專注而設計的低干擾專業 UI。</p>
            </div>
          </div>
        </div>

        {/* 右側預覽卡 */}
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-md rounded-3xl bg-gradient-to-b from-[#161824] to-[#05060a] border border-yellow-500/30 shadow-2xl shadow-black/80 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-gray-400">當前等級</p>
                <p className="text-lg font-semibold text-yellow-300">FREE+ 玩家</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/40 text-[11px] text-yellow-200">
                GTO 控制台預覽
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div className="rounded-2xl bg-black/40 border border-yellow-500/40 p-3">
                <p className="text-xs font-semibold text-yellow-200">今日任務</p>
                <ul className="mt-2 space-y-1 text-gray-300">
                  <li>· 完成 10 題 Preflop 練習</li>
                  <li>· 上傳 1 手牌給 AI 教練</li>
                  <li>· 閱讀 1 章 GTO 課程</li>
                </ul>
              </div>
              <div className="rounded-2xl bg-black/40 border border-yellow-500/40 p-3">
                <p className="text-xs font-semibold text-yellow-200">近期表現</p>
                <div className="mt-2 h-16 rounded-xl bg-gradient-to-tr from-yellow-500/10 to-yellow-300/20 flex items-end gap-1 px-2 pb-1">
                  {[30, 55, 40, 70, 62].map((v, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-full bg-yellow-400/70"
                      style={{ height: `${30 + (v / 2)}%` }}
                    />
                  ))}
                </div>
                <p className="mt-1 text-[10px] text-gray-400">
                  最近 5 組練習平均正確率：<span className="text-yellow-200">64%</span>
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-black/50 border border-yellow-500/30 p-3 text-[11px]">
              <p className="text-xs font-semibold text-yellow-200 mb-1">
                最新 AI 教練提醒
              </p>
              <p className="text-gray-300">
                在 BTN 開局時，你的 3-bet 頻率略低於 GTO 建議，特別是在面對 SB
                3-bet 防守時，可增加部分 suited connector 與 Axs bluff 組合。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
