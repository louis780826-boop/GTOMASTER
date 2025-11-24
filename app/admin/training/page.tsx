'use client'

import { useEffect, useMemo, useState } from 'react'
import type { TrainingSpot, Position, FacingAction } from '@/lib/gtoTypes'

export default function AdminTrainingPage() {
  const [positionFilter, setPositionFilter] = useState<'ALL' | Position>('ALL')
  const [facingFilter, setFacingFilter] = useState<'ALL' | FacingAction>('ALL')
  const [search, setSearch] = useState('')

  const [spots, setSpots] = useState<TrainingSpot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // 從 /api/training-spots 抓 DB 題庫
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/training-spots')
        const data = await res.json()
        if (!data.ok) {
          setError('載入題庫失敗')
          return
        }
        setSpots(data.spots ?? [])
      } catch (e) {
        setError('載入題庫時發生錯誤')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const totalCount = spots.length

  const filtered = useMemo(() => {
    return spots.filter((spot) => {
      if (positionFilter !== 'ALL' && spot.position !== positionFilter) return false
      if (facingFilter !== 'ALL' && spot.facingAction !== facingFilter) return false

      if (search.trim()) {
        const key = search.trim().toLowerCase()
        const target = (
          spot.id +
          spot.heroHand +
          spot.position +
          spot.stage +
          spot.gtoAction
        ).toLowerCase()
        if (!target.includes(key)) return false
      }

      return true
    })
  }, [spots, positionFilter, facingFilter, search])

  return (
    <div className="min-h-screen bg-[#0D0F15] text-white px-4 py-10 flex justify-center">
      <div className="w-full max-w-5xl space-y-6">
        {/* 標題列 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-yellow-300">
              GTO+ MASTER｜題庫後台（Admin）
            </h1>
            <div className="text-sm text-zinc-400 mt-1">
              總題數：{totalCount} 題，符合條件：{filtered.length} 題
            </div>
          </div>
        </div>

        {/* 載入 / 錯誤訊息 */}
        {loading && (
          <div className="text-sm text-zinc-400">
            題庫載入中…
          </div>
        )}

        {error && (
          <div className="text-sm text-red-400">
            {error}
          </div>
        )}

        {/* 篩選列 */}
        <div className="bg-black/40 border border-zinc-700 rounded-2xl p-4 flex flex-wrap gap-4">
          {/* 位置篩選 */}
          <div className="space-y-1">
            <div className="text-xs text-zinc-400">位置（Position）</div>
            <select
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value as 'ALL' | Position)}
              className="bg-black/60 border border-zinc-700 rounded-xl px-3 py-1 text-sm"
            >
              <option value="ALL">全部</option>
              <option value="UTG">UTG</option>
              <option value="HJ">HJ</option>
              <option value="CO">CO</option>
              <option value="BTN">BTN</option>
              <option value="SB">SB</option>
              <option value="BB">BB</option>
            </select>
          </div>

          {/* FacingAction 篩選 */}
          <div className="space-y-1">
            <div className="text-xs text-zinc-400">對手行動（Facing Action）</div>
            <select
              value={facingFilter}
              onChange={(e) => setFacingFilter(e.target.value as 'ALL' | FacingAction)}
              className="bg-black/60 border border-zinc-700 rounded-xl px-3 py-1 text-sm"
            >
              <option value="ALL">全部</option>
              <option value="none">none</option>
              <option value="open">open</option>
              <option value="3bet">3bet</option>
              <option value="4bet">4bet</option>
            </select>
          </div>

          {/* 搜尋框 */}
          <div className="flex-1 min-w-[180px] space-y-1">
            <div className="text-xs text-zinc-400">搜尋（ID / 手牌 / 行動）</div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="輸入關鍵字，例如：AKs / BTN / all-in"
              className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3 py-1.5 text-sm"
            />
          </div>
        </div>

        {/* 題目列表 */}
        <div className="space-y-3">
          {filtered.map((spot: TrainingSpot) => (
            <div
              key={spot.id}
              className="bg-black/40 border border-zinc-700 rounded-2xl p-4 text-sm flex flex-col md:flex-row md:items-start md:justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="text-xs text-zinc-500">ID</div>
                <div className="font-mono text-xs text-yellow-300 break-all">
                  {spot.id}
                </div>

                <div className="flex flex-wrap gap-3 pt-2 text-xs">
                  <span className="px-2 py-1 rounded-full bg-zinc-800/80 border border-zinc-700">
                    位置：{spot.position}
                  </span>
                  <span className="px-2 py-1 rounded-full bg-zinc-800/80 border border-zinc-700">
                    手牌：{spot.heroHand}
                  </span>
                  <span className="px-2 py-1 rounded-full bg-zinc-800/80 border border-zinc-700">
                    階段：{spot.stage}
                  </span>
                  <span className="px-2 py-1 rounded-full bg-zinc-800/80 border border-zinc-700">
                    Facing：{spot.facingAction}
                  </span>
                  <span className="px-2 py-1 rounded-full bg-zinc-800/80 border border-zinc-700">
                    等級：{spot.level}
                  </span>
                  <span className="px-2 py-1 rounded-full bg-zinc-800/80 border border-zinc-700">
                    SPR：{spot.spr}
                  </span>
                </div>
              </div>

              <div className="md:w-1/2 space-y-2">
                <div>
                  <div className="text-xs text-zinc-500">GTO 行動</div>
                  <div className="text-yellow-300 font-semibold">
                    {spot.gtoAction}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-zinc-500">GTO 理由</div>
                  <div className="text-zinc-200 line-clamp-3">
                    {spot.gtoReason}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-zinc-500">Exploit 策略</div>
                  <div className="text-zinc-200 line-clamp-3">
                    {spot.exploit}
                  </div>
                </div>

                {/* 之後要做「編輯 / 刪除」可以放在這裡 */}
                {/* <div className="flex gap-2 pt-1">
                  <button className="px-3 py-1 rounded-lg bg-yellow-500 text-black text-xs">
                    編輯
                  </button>
                  <button className="px-3 py-1 rounded-lg bg-red-600 text-xs">
                    刪除
                  </button>
                </div> */}
              </div>
            </div>
          ))}

          {!loading && filtered.length === 0 && !error && (
            <div className="text-center text-sm text-zinc-500 py-10">
              找不到符合條件的題目。
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
