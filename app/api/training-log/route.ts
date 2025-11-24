import { NextRequest, NextResponse } from 'next/server'
import { saveTrainingLog, getTrainingLogs } from '@/lib/training/log'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    saveTrainingLog(data)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ ok: false, error: 'failed' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const logs = getTrainingLogs(200)
    return NextResponse.json({ ok: true, logs })
  } catch (err) {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
