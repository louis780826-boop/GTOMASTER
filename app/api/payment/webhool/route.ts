import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  // TODO: 之後在這裡驗證 Stripe / 綠界的 callback
  // 根據訂單結果，把對應 user 的 tier 設為 'premium'
  return NextResponse.json({ ok: true })
}
