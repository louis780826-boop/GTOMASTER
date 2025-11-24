export default function PricingCancelPage() {
  return (
    <main className="min-h-screen bg-[#05060a] text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full border border-yellow-500/30 rounded-2xl bg-black/40 p-6 text-center">
        <p className="text-lg font-semibold text-yellow-200 mb-2">
          已取消結帳流程
        </p>
        <p className="text-sm text-gray-300 mb-4">
          如果只是想再想一下沒關係，你可以隨時回到方案頁重新升級。
        </p>
        <a
          href="/pricing"
          className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-yellow-500/60 text-yellow-200 text-sm hover:bg-yellow-500/10 transition"
        >
          回到方案與升級
        </a>
      </div>
    </main>
  );
}
