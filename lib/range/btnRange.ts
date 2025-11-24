// lib/range/btnRange.ts
// BTN：最寬，mix 與 strong 最多

export const BTN_RANGE: Record<string, "strong" | "mix" | "fold"> = {
  "AA": "strong",
  "KK": "strong",
  "QQ": "strong",
  "JJ": "strong",
  "TT": "strong",

  "AKs": "strong",
  "AQs": "strong",
  "AJs": "strong",
  "ATs": "mix",
  "KQs": "strong",
  "KJs": "strong",
  "QJs": "strong",
  "JTs": "mix",

  "AKo": "strong",
  "AQo": "mix",
  "AJo": "mix",
  "ATo": "mix",

  "99": "strong",
  "88": "strong",
  "77": "mix",
  "66": "mix",
  "55": "mix",

  "A9s": "strong",
  "A8s": "mix",
  "A7s": "mix",
  "A5s": "mix",

  "T9s": "mix",
  "98s": "mix",
  "87s": "mix",
  "76s": "fold"
};
