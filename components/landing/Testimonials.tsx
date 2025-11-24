const fakeTestimonials = [
  {
    name: "現役 MTT 玩家",
    label: "週末戰士",
    content:
      "以前都是看國外影片零碎吸收，現在有結構化題庫 + AI 教練，可以把常見 Spot 集中練，打牌前熱身 30 分鐘感覺很有用。",
  },
  {
    name: "現金局常客",
    label: "NL200 玩家",
    content:
      "最有感的是自己在 BTN / CO 的開局與防守越來越有邏輯，不會像以前一樣看牌打牌，範圍與頻率越來越清楚。",
  },
  {
    name: "剛學不久的新手",
    label: "休閒玩家",
    content:
      "一開始看到 GTO 兩個字其實有點怕，但這裡的說明跟課程都還滿白話的，加上題目也有中文解析，不會看不懂。",
  },
];

export default function Testimonials() {
  return (
    <section className="border-t border-yellow-500/10 bg-[#05060a] pb-12">
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <h2 className="text-xl md:text-2xl font-semibold text-yellow-200 mb-2">
          這套工具最想服務的，是像你一樣認真對待牌局的人
        </h2>
        <p className="text-sm md:text-base text-gray-300 mb-6 max-w-2xl">
          以下是一些典型使用者的情境，正式上線後也會陸續加入真實用戶的回饋。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {fakeTestimonials.map((t) => (
            <figure
              key={t.name}
              className="rounded-2xl border border-yellow-500/20 bg-black/40 p-4 flex flex-col justify-between"
            >
              <p className="text-xs md:text-sm text-gray-200 mb-3">
                “{t.content}”
              </p>
              <figcaption className="text-xs text-gray-400">
                <span className="block text-yellow-200 font-semibold">
                  {t.name}
                </span>
                <span className="block text-[11px] text-gray-500">
                  {t.label}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
