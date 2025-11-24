export function buildReviewPrompt(hand: any) {
  return `
你是一名專業撲克教練，請用繁體中文，產生複盤分析。
請務必回傳 JSON（不能有簡體字）。

JSON 結構：
{
  "overallGrade":"A|B|C|D",
  "summary":"字串",
  "spots":[
    {
      "street":"Preflop|Flop|Turn|River",
      "heroDecision":"字串",
      "gtoRecommendation":"字串",
      "exploitRecommendation":"字串",
      "severity":"GOOD|OK|MISTAKE|BLUNDER",
      "keyTakeaways":["重點1","重點2"]
    }
  ]
}

牌局資訊：
${JSON.stringify(hand, null, 2)}
`;
}
