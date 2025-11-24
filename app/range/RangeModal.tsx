// app/range/RangeModal.tsx
"use client";

interface RangeModalProps {
  hand: string | null;
  onClose: () => void;
}

export default function RangeModal({ hand, onClose }: RangeModalProps) {
  if (!hand) return null;

  const description = `${hand}：這是一個標準的開局手牌，應該根據對手的風格與場面進行調整。`;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#0D0F15] border border-[#2A2E38] rounded-xl p-6 w-[90%] max-w-md shadow-[0_0_40px_rgba(212,175,55,0.2)]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[#D4AF37] text-xl font-bold">{hand} 策略解說</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
