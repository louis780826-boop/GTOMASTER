import { getTrainingLogs } from '@/lib/training/log'
import { getCoachLogs } from '@/lib/coach/coachLog'

type AnyLog = any

function buildStats(logs: AnyLog[]) {
  const total = logs.length
  if (total === 0) {
    return {
      total,
      correct: 0,
      accuracy: 0,
      byPosition: [],
      byFacing: [],
      byStage: [],
    }
  }

  const isCorrect = (row: AnyLog) =>
    row.correct === 1 || row.correct === true || row.correct === '1'

  const correctCount = logs.filter(isCorrect).length
  const accuracy = (correctCount / total) * 100

  const agg = <T extends string>(
    key: keyof AnyLog,
  ): { key: string; total: number; correct: number; accuracy: number }[] => {
    const map = new Map<string, { total: number; correct: number }>()
    for (const row of logs) {
      const k = String(row[key] ?? '未知')
      const bucket = map.get(k) ?? { total: 0, correct: 0 }
      bucket.total += 1
      if (isCorrect(row)) bucket.correct += 1
      map.set(k, bucket)
    }
    return Array.from(map.entries())
      .map(([k, v]) => ({
        key: k,
        total: v.total,
        correct: v.correct,
        accuracy: v.total === 0 ? 0 : (v.correct / v.total) * 100,
      }))
      .sort((a, b) => b.total - a.total)
  }

  return {
    total,
    correct: correctCount,
    accuracy,
    byPosition: agg('position'),
    byFacing: agg('facingAction'),
    byStage: agg('stage'),
  }
}

function StatBar({
  label,
  accuracy,
  total,
}: {
  label: string
  accuracy: number
  total: number
}) {
  const width = Math.max(4, Math.min(100, Math.round(accuracy)))
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-zinc-400">
        <span>{label}</span>
        <span>
          {accuracy.toFixed(1)}%（{total} 題）
        </span>
      </div>
      <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-yellow-300"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
}

export default async function ReportPage() {
  // 之後可以加上 userId 過濾，現在先看全體紀錄
  const trainingLogs = (await getTrainingLogs(1000)) as AnyLog[]
  const coachLogs = (await getCoachLogs(500)) as AnyLog[]

  const trainingStats = buildStats(trainingLogs)
  const coachCount = coachLogs.length

  return (
    <div className="min-h-screen bg-[#0D0F15] text-white px-4 py-10 flex justify-center">
      <div className="w-full max-w-4xl space-y-8">

        {/* 標題 */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-yellow-300">
              個人戰報 Dashboard（Beta）
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              依照目前所有訓練紀錄，初步整理出的 GTO 習慣與漏洞檢視。
            </p>
          </div>

          <div className="text-right text-xs text-zinc-500">
            訓練紀錄共 {trainingStats.total} 題，AI 教練諮詢 {coachCount} 次
          </div>
        </div>

        {/* 總覽數據卡 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-black/40 border border-zinc-700 rounded-2xl p-4 space-y-1">
            <div className="text-xs text-zinc-400">累積作答題數</div>
            <div className="text-2xl font-semibold">
              {trainingStats.total}
            </div>
          </div>

          <div className="bg-black/40 border border-zinc-700 rounded-2xl p-4 space-y-1">
            <div className="text-xs text-zinc-400">整體正確率</div>
            <div className="text-2xl font-semibold text-yellow-300">
              {trainingStats.accuracy.toFixed(1)}%
            </div>
          </div>

          <div className="bg-black/40 border border-zinc-700 rounded-2xl p-4 space-y-1">
            <div className="text-xs text-zinc-400">AI 教練使用次數</div>
            <div className="text-2xl font-semibold">{coachCount}</div>
          </div>
        </div>

        {/* 依位置分析 */}
        <div className="bg-black/40 border border-zinc-700 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">依位置分析（Position）</div>
            <div className="text-xs text-zinc-500">
              觀看哪些位置是目前的強項 / 弱點
            </div>
          </div>

          <div className="space-y-3">
            {trainingStats.byPosition.map((p) => (
              <StatBar
                key={p.key}
                label={p.key}
                accuracy={p.accuracy}
                total={p.total}
              />
            ))}

            {trainingStats.byPosition.length === 0 && (
              <div className="text-xs text-zinc-500">
                尚無足夠資料，先在訓練模式多作幾題吧。
              </div>
            )}
          </div>
        </div>

        {/* 依 Facing Action 分析 */}
        <div className="bg-black/40 border border-zinc-700 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">
              依對手行動分析（Facing Action）
            </div>
            <div className="text-xs text-zinc-500">
              例如 3bet / 4bet Spot 是否明顯較弱。
            </div>
          </div>

          <div className="space-y-3">
            {trainingStats.byFacing.map((f) => (
              <StatBar
                key={f.key}
                label={f.key}
                accuracy={f.accuracy}
                total={f.total}
              />
            ))}

            {trainingStats.byFacing.length === 0 && (
              <div className="text-xs text-zinc-500">
                尚無足夠資料，先累積一些訓練紀錄。
              </div>
            )}
          </div>
        </div>

        {/* 依 Stage 分析 */}
        <div className="bg-black/40 border border-zinc-700 rounded-2xl p-5 space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">依牌輪分析（Stage）</div>
            <div className="text-xs text-zinc-500">
              目前以 preflop 題目為主，之後擴充 flop/turn/river 可共用這區塊。
            </div>
          </div>

          <div className="space-y-3">
            {trainingStats.byStage.map((s) => (
              <StatBar
                key={s.key}
                label={s.key}
                accuracy={s.accuracy}
                total={s.total}
              />
            ))}

            {trainingStats.byStage.length === 0 && (
              <div className="text-xs text-zinc-500">
                尚無足夠資料。
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
