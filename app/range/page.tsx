// app/range/page.tsx
import RangeGridV3 from '@/components/RangeGridV3';

export default function RangePage() {
  return (
    <div className="min-h-screen bg-[#05060A] text-slate-50">
      <main className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-2">
          GTO Money – 簡化 Preflop 範圍
        </h1>
        <p className="text-sm text-slate-400 mb-8">
          此頁先提供簡化的範圍視覺化，之後你可以再接上真實 GTO 範圍資料。
        </p>

        <RangeGridV3 />
      </main>
    </div>
  );
}
