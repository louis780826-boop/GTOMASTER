
import Link from "next/link";
import type { Chapter } from "../lib/chapters/chapters";

export default function ChapterCard({ ch }: { ch: Chapter }) {
  return (
    <Link href={`/chapters/${ch.id}`}>
      <div className="chapter-card">
        <p className="chapter-id">CH{ch.id}</p>
        <h2 className="chapter-title">{ch.title}</h2>
        <p className="chapter-summary">{ch.summary}</p>
      </div>
    </Link>
  );
}
