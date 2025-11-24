// lib/range/utgRange.ts
// UTG：偏緊、核心牌多 Strong

export const UTG_RANGE: Record<string, "strong" | "mix" | "fold"> = {
  "AA": "strong",
  "KK": "strong",
  "QQ": "strong",
  "JJ": "strong",
  "TT": "strong",

  "AKs": "strong",
  "AQs": "strong",
  "AJs": "strong",
  "KQs": "mix",

  "AKo": "strong",
  "AQo": "mix",
  "AJo": "mix",
  "KQo": "mix",

  "99": "mix",
  "88": "mix",
  "77": "mix",
  "66": "fold",
  "55": "fold",

  "KJs": "mix",
  "QJs": "mix",
  "JTs": "mix",
  "KTs": "fold",
  "QTs": "fold",

  "ATs": "mix",
  "A9s": "fold",
  "A8s": "fold",
  "A5s": "mix",
  "A4s": "mix",

  "T9s": "fold",
  "98s": "fold",
  "87s": "fold"
};
