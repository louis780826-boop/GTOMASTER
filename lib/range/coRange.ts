// lib/range/coRange.ts
// CO：中間寬度，mix 較多

export const CO_RANGE: Record<string, "strong" | "mix" | "fold"> = {
  "AA": "strong",
  "KK": "strong",
  "QQ": "strong",
  "JJ": "strong",
  "TT": "strong",

  "AKs": "strong",
  "AQs": "strong",
  "AJs": "mix",
  "ATs": "mix",
  "KQs": "strong",
  "KJs": "mix",
  "QJs": "mix",

  "AKo": "strong",
  "AQo": "mix",
  "AJo": "mix",

  "99": "strong",
  "88": "mix",
  "77": "mix",
  "66": "mix",
  "55": "fold",

  "A9s": "mix",
  "A8s": "mix",
  "A5s": "mix",
  "A4s": "mix",

  "JTs": "mix",
  "T9s": "mix",
  "98s": "fold",
  "87s": "fold"
};
