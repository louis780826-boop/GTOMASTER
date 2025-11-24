
import { getChapter } from "../../../lib/chapters/chapters";
import ChapterContent from "../../../components/ChapterContent";
import "../../../styles/chapters.css";

interface Props {
  params: { id: string };
}

export default function ChapterDetailPage({ params }: Props) {
  const ch = getChapter(Number(params.id));

  if (!ch) {
    return (
      <div className="max-w-3xl mx-auto mt-10 px-4 text-red-400">
        找不到此章節（ID: {params.id}）
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <ChapterContent ch={ch} />
    </div>
  );
}
