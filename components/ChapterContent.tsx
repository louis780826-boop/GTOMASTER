
import type { Chapter } from "../lib/chapters/chapters";

export default function ChapterContent({ ch }: { ch: Chapter }) {
  return (
    <div className="chapter-content">
      <h1 className="title-gold mb-4">{ch.title}</h1>

      <div className="chapter-section">
        <h2 className="section-title">章節概要</h2>
        <p className="section-body">{ch.summary}</p>
      </div>

      <div className="chapter-section">
        <h2 className="section-title">重點解析</h2>
        <ul className="bullet-list">
          {ch.key_points.map((k, i) => (
            <li key={i}>{k}</li>
          ))}
        </ul>
      </div>

      <div className="chapter-section">
        <h2 className="section-title">自我訓練</h2>
        <ul className="bullet-list">
          {ch.practice.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
