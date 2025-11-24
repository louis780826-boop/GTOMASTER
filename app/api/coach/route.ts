// app/api/coach/route.ts
import { NextRequest, NextResponse } from 'next/server'
import type { HandContext } from '@/lib/gtoTypes'
import { findBestGtoSpot } from '@/lib/gtoEngine'

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<HandContext>

    if (!body.position || !body.heroHand || !body.stage || body.spr == null || !body.facingAction) {
      return NextResponse.json(
        {
          ok: false,
          message: '請提供完整牌局資訊：位置、手牌、階段、SPR、面對行動。',
        },
        { status: 400 },
      )
    }

    const ctx: HandContext = {
      position: body.position,
      heroHand: body.heroHand,
      stage: body.stage,
      spr: Number(body.spr),
      facingAction: body.facingAction,
    }

    const spot = findBestGtoSpot(ctx)

    if (!spot) {
      return NextResponse.json(
        {
          ok: false,
          message: '目前題庫中還沒有對應這個情境的 GTO 策略，之後可以擴充題庫來覆蓋這類牌局。',
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      ok: true,
      spotId: spot.id,
      recommendedAction: spot.gtoAction,
      gtoReason: spot.gtoReason,
      exploit: spot.exploit,
      meta: {
        position: spot.position,
        heroHand: spot.heroHand,
        stage: spot.stage,
        spr: spot.spr,
        facingAction: spot.facingAction,
      },
    })
  } catch (error) {
    console.error('[API /coach] Error:', error)
    return NextResponse.json(
      {
        ok: false,
        message: '系統發生錯誤，請稍後再試。',
      },
      { status: 500 },
    )
  }
}
