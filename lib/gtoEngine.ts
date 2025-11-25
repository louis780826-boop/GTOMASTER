// @ts-nocheck


import type { HandContext } from '@/lib/gtoTypes'
import type { TrainingSpot } from '@/lib/gtoTypes'
import { trainingSpots } from '@/lib/training/trainingSpots'

/**
 * 計算某個題目與當前牌局的「相似度」分數
 * 分數越高代表越接近這個 Spot
 */
function computeMatchScore(spot: TrainingSpot, ctx: HandContext): number {
  let score = 0

  // 位置完全相同
  if (spot.position === ctx.position) score += 100

  // 手牌完全相同
  if (spot.heroHand.toUpperCase() === ctx.heroHand.toUpperCase()) score += 80

  // 牌輪相同
  if (spot.stage === ctx.stage) score += 40

  // Facing 行動相同
  if (spot.facingAction === ctx.facingAction) score += 30

  // SPR 接近
  const sprDiff = Math.abs(spot.spr - ctx.spr)
  if (sprDiff < 1) score += 15
  else if (sprDiff < 2) score += 10
  else if (sprDiff < 4) score += 5

  // 難度先不加權（你之後可以自己決定要不要放 Beginner / Advanced 權重）

  return score
}

/**
 * 從題庫中找出「最接近此 HandContext 的 GTO Spot」
 *
 * 設計原則：
 * - 一定會回傳一個題目（只要題庫不是空的）
 * - 儘量選擇：位置 / 手牌 / Facing / Stage 都接近的
 */
export function findBestGtoSpot(ctx: HandContext): TrainingSpot | null {
  if (!trainingSpots || trainingSpots.length === 0) {
    return null
  }

  let best: TrainingSpot | null = null
  let bestScore = -1

  for (const spot of trainingSpots) {
    const score = computeMatchScore(spot, ctx)

    if (score > bestScore) {
      bestScore = score
      best = spot
    }
  }

  // 理論上一定會有一題被選到
  return best
}
