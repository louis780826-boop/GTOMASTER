import { NextRequest, NextResponse } from 'next/server'
import { saveCoachLog, getCoachLogs } from '@/lib/coach/coachLog'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    saveCoachLog(data)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'failed' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const logs = getCoachLogs(200)
    return NextResponse.json({ ok: true, logs })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
