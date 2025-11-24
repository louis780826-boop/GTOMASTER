// app/dashboard/page.tsx
"use client";

import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 儀表板首頁卡片 */}
        <div className="card-frame">
          <div className="card-inner bg-surface-elevated p-4">
            <h3 className="text-xl text-white font-semibold">今日訓練進度</h3>
            <div className="mt-4 text-sm text-gray-400">
              <div className="flex justify-between">
                <span>已完成題目</span>
                <span className="font-semibold text-amber-200">15 / 30</span>
              </div>
              <div className="h-1.5 rounded-full bg-black/60">
                <div className="h-full w-2/3 bg-gradient-to-r from-amber-200 to-amber-400" />
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-400">
              <div className="flex justify-between">
                <span>連續訓練天數</span>
                <span className="font-semibold text-amber-200">7 天</span>
              </div>
            </div>

            <Link
              href="/practice"
              className="text-xs mt-4 inline-block px-4 py-2 text-amber-50 bg-gradient-to-r from-amber-300/50 to-amber-200/10 rounded-full hover:from-amber-300/60 hover:to-amber-200/20"
            >
              立即進入訓練
            </Link>
          </div>
        </div>

        {/* 其他卡片 */}
        <div className="card-frame">
          <div className="card-inner bg-surface-elevated p-4">
            <h3 className="text-xl text-white font-semibold">你的 GTO 訓練統計</h3>
            <div className="mt-4 text-sm text-gray-400">
              <div className="flex justify-between">
                <span>訓練完成度</span>
                <span className="font-semibold text-emerald-300">75%</span>
              </div>
              <div className="h-1.5 rounded-full bg-black/60">
                <div className="h-full w-3/4 bg-gradient-to-r from-emerald-300 to-emerald-500" />
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-400">
              <div className="flex justify-between">
                <span>最近訓練時間</span>
                <span className="font-semibold text-amber-200">2 小時</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
