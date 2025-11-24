// lib/auth/membership.ts

export type MembershipTier = 'guest' | 'free' | 'premium'

const COOKIE_NAME = 'gto_tier'

/**
 * 取得目前用戶的方案等級
 * - 先看 cookie: gto_tier = guest / free / premium
 * - 如果沒有就當作 guest
 */
export function getCurrentTier(): MembershipTier {
  if (typeof window === 'undefined') {
    // 在伺服器端先用 guest，真正判斷會在瀏覽器端執行
    return 'guest'
  }

  const match = document.cookie.match(
    /(?:^|; )gto_tier=(guest|free|premium)/,
  )

  if (match && (match[1] === 'guest' || match[1] === 'free' || match[1] === 'premium')) {
    return match[1] as MembershipTier
  }

  return 'guest'
}

/**
 * 練習模式每次 Session 題數上限
 * - premium: 無限制（回傳 null）
 * - free: 30 題
 * - guest: 10 題
 */
export function getPracticeLimit(tier: MembershipTier): number | null {
  switch (tier) {
    case 'premium':
      return null
    case 'free':
      return 30
    case 'guest':
    default:
      return 10
  }
}

/**
 * AI 教練每天可詢問次數（之後你要用可以直接接）
 * - premium: 無限制（回傳 null）
 * - free: 10 次
 * - guest: 3 次
 */
export function getCoachDailyLimit(tier: MembershipTier): number | null {
  switch (tier) {
    case 'premium':
      return null
    case 'free':
      return 10
    case 'guest':
    default:
      return 3
  }
}
