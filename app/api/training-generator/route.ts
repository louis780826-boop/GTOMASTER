import { NextRequest, NextResponse } from 'next/server'
import { getAllTrainingSpots, getRandomTrainingSpot } from '@/lib/training/spotsRepo'
import type { TrainingSpot } from '@/lib/gtoTypes'

// 這支 API 現在改成「從 DB 題庫抽題」，不再呼叫 OpenAI

// 取得隨機多題
function getRandomMany(count: number): TrainingSpot[] {
  const all = getAllTrainingSpots()
  if (count >= all.length) return all

  const shuffled = [...all].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

// 支援 GET: /api/training-generator?count=10
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const countParam = searchParams.get('count')
  const count = Math.max(1, Math.min(50, Number(countParam || '1')))

  const spots = getRandomMany(count)
  return NextResponse.json({ ok: true, spots })
}

// 也支援 POST: { count: 10 }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const count = Math.max(1, Math.min(50, Number(body.count || '1')))

    const spots = getRandomMany(count)
    return NextResponse.json({ ok: true, spots })
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: '產生題目時發生錯誤' },
      { status: 500 },
    )
  }
}
