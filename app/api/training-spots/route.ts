import { NextRequest, NextResponse } from 'next/server'
import { getAllTrainingSpots, getRandomTrainingSpot } from '@/lib/training/spotsRepo'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const mode = searchParams.get('mode') ?? 'all'

  if (mode === 'random') {
    const spot = getRandomTrainingSpot()
    return NextResponse.json({ ok: true, spot })
  }

  const spots = getAllTrainingSpots()
  return NextResponse.json({ ok: true, spots })
}
