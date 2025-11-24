
import type { WeeklyVolume, LeakSummary, PositionFocus } from "./types";

export function getMockWeeklyVolume(): WeeklyVolume[] {
  return [
    { day: "一", hands: 80 },
    { day: "二", hands: 60 },
    { day: "三", hands: 120 },
    { day: "四", hands: 40 },
    { day: "五", hands: 90 },
    { day: "六", hands: 150 },
    { day: "日", hands: 30 },
  ];
}

export function getMockLeaks(): LeakSummary[] {
  return [
    {
      id: "overcall_flop",
      label: "Flop 過度跟注",
      description: "在中等牌力與濕板情境下，跟注頻率偏高，容易被多街壓力榨乾。",
      priority: "high",
    },
    {
      id: "miss_cbet",
      label: "有範圍優勢卻錯失 c-bet",
      description: "在明顯 range 優勢的乾板，c-bet 頻率過低，導致整體 EV 流失。",
      priority: "medium",
    },
    {
      id: "no_3bet_bluff",
      label: "缺乏 3bet bluff",
      description: "在盲位與 CO/BTN 對抗時，3bet bluff 線過少，讓對手開局過於輕鬆。",
      priority: "low",
    },
  ];
}

export function getMockPositionFocus(): PositionFocus[] {
  return [
    {
      position: "BTN",
      reason: "你在 BTN 的勝率與 EV 明顯高於其他位置，適合進一步優化偷盲與防守頻率。",
      suggestedHands: 80,
    },
    {
      position: "SB",
      reason: "SB 出現較多 marginal spot，建議集中在防守與 3bet 範圍上做調整。",
      suggestedHands: 50,
    },
  ];
}
