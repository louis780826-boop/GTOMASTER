// lib/coach/handParser.ts

export interface ParsedHand {
  heroHand: string
}

/**
 * 極寬鬆的手牌解析：
 * - 允許 AKs / AKo / AK / AhKh / 99 / JT / T9s 等
 * - 自動去掉空白，全部轉成大寫
 * - 只要長度 >= 2 就當作合法，不再狂丟錯誤
 *
 * 之後如果你要做更精細的牌格式檢查，再來這邊加規則即可。
 */
export function parseHand(input: string): ParsedHand | null {
  if (!input) return null

  const cleaned = input.replace(/\s+/g, '').toUpperCase()

  // 太短的當作沒輸入
  if (cleaned.length < 2) {
    return null
  }

  // 目前先不強制檢查是否真的是合法撲克牌表示
  // 直接把整理過的字串當作 heroHand，交給 GTO 引擎去做最佳匹配
  return {
    heroHand: cleaned,
  }
}
