
import { chapters } from "../../lib/chapters/chapters";
import ChapterCard from "../../components/ChapterCard";
import "../../styles/chapters.css";

export default function ChaptersPage() {
  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h1 className="title-gold mb-4">GTO+ MASTER｜50 章完整 GTO 課程</h1>
      <p className="text-gray-300 mb-6 text-sm">
        從基礎概念到 river 決策，依序學習、搭配練習與 AI 教練複盤，可以系統性地建立屬於你的 GTO 思維。
      </p>

      <div className="chapter-grid">
        {chapters.map((ch) => (
          <ChapterCard key={ch.id} ch={ch} />
        ))}
      </div>
    </div>
  );
}
