'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  getCurrentUser,
  type User,
  upgradeToPremium,
} from '@/lib/auth/user'

export default function PricingPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    try {
      const u = getCurrentUser()
      setUser(u)
    } catch (e) {
      console.error(e)
    }
  }, [])

  const role = user?.role ?? 'guest'
  const isPremium = role === 'premium'
  const isGuest = role === 'guest'

  const handleUpgrade = () => {
    if (isGuest) {
      // 未登入 → 先導到註冊
      router.push('/auth/register')
      return
    }

    const upgraded = upgradeToPremium()
    setUser(upgraded)
  }

  return (
    <main className="min-h-screen bg-[#0D0F15] text-white px-4 py-24">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold text-yellow-300">
            方案與收費
          </h1>
          <p className="text-sm text-zinc-400">
            先從 Free 方案體驗訓練流程，當你準備好要認真提升勝率時，再升級 Premium。
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Guest */}
          <div className="bg-black/40 border border-zinc-700 rounded-2xl p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-zinc-200">Guest（未登入）</h2>
              <div className="text-3xl font-bold text-zinc-400">免費</div>
              <ul className="mt-3 text-xs text-zinc-400 space-y-1">
                <li>・可瀏覽首頁與方案介紹</li>
                <li>・無法使用訓練模式</li>
                <li>・無法使用 AI 教練</li>
                <li>・無複盤與戰報紀錄</li>
              </ul>
            </div>
            <button
              onClick={() => router.push('/auth/register')}
              className="mt-6 w-full border border-zinc-600 text-zinc-300 py-2 rounded-xl text-sm hover:border-yellow-300 hover:text-yellow-300 transition"
            >
              建立帳號
            </button>
          </div>

          {/* Free */}
          <div className="bg-black/60 border border-zinc-600 rounded-2xl p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-zinc-100">Free 會員</h2>
              <div className="text-3xl font-bold text-zinc-200">免費</div>
              <ul className="mt-3 text-xs text-zinc-400 space-y-1">
                <li>・每日 3 題 GTO 訓練題</li>
                <li>・部分複盤紀錄（最近 3 手）</li>
                <li>・可體驗訓練流程與介面</li>
                <li>・適合剛接觸 GTO 的玩家</li>
              </ul>
            </div>
            <button
              onClick={() =>
                router.push(role === 'guest' ? '/auth/register' : '/practice')
              }
              className="mt-6 w-full bg-zinc-700 text-white py-2 rounded-xl text-sm hover:bg-zinc-600 transition"
            >
              {role === 'guest' ? '免費註冊開始' : '前往訓練'}
            </button>
          </div>

          {/* Premium */}
          <div className="bg-gradient-to-b from-yellow-500/10 to-yellow-600/5 border border-yellow-400 rounded-2xl p-6 flex flex-col justify-between shadow-[0_0_40px_rgba(234,179,8,0.25)]">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-yellow-300">Premium 會員</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-400 text-black font-semibold">
                  推薦
                </span>
              </div>
              <div className="text-3xl font-bold text-yellow-300">
                NT$ xxx / 月
              </div>
              <ul className="mt-3 text-xs text-zinc-100 space-y-1">
                <li>・無限制 GTO 訓練題練習</li>
                <li>・完整 AI 教練複盤（Coach）</li>
                <li>・完整複盤紀錄搜尋與篩選</li>
                <li>・個人戰報 Dashboard（開發中）</li>
                <li>・長期更新題庫與戰術模組</li>
              </ul>
            </div>
            <button
              onClick={handleUpgrade}
              className={`mt-6 w-full py-2 rounded-xl text-sm font-semibold transition ${
                isPremium
                  ? 'bg-zinc-700 text-zinc-300 cursor-default'
                  : 'bg-yellow-400 text-black hover:bg-yellow-300'
              }`}
            >
              {isPremium
                ? '你已是 Premium 會員'
                : isGuest
                ? '登入 / 註冊後升級 Premium'
                : '立即升級 Premium'}
            </button>
          </div>
        </div>

        <div className="text-xs text-zinc-500 text-center mt-4">
          實際價格、金流與發票流程日後接入第三方金流服務（例如藍新、Stripe）。目前為 Demo 環境，僅模擬方案與權限。
        </div>
      </div>
    </main>
  )
}
