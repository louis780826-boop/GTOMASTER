// utils/handParser.ts
// AI Coach v3 — 手牌解析（旗艦版）
// 可直接放進你的 GTO+ MASTER 專案，無需任何修改。

export interface ParsedHand {
  position: string;       // Hero 位置 - BTN / CO / UTG / SB / BB
  combo: string;          // AKo / QJs / 88
  rank1: string;          // A / K / Q / etc.
  rank2: string;          // A / K / Q / etc.
  suited: boolean;        // 是否同花
  stack: number;          // 以 bb 為單位
  villainPos?: string;    // 對手位置
  raw: string;            // 原始輸入
}

const POSITIONS = ["BTN", "CO", "HJ", "UTG", "SB", "BB"];

export function parseHand(input: string): ParsedHand | null {
  if (!input) return null;

  let str = input.trim().toUpperCase().replace(/,/g, "").replace(/\s+/g, " ");
  const raw = str;

  // ------------------------------
  // 抓 Hero 位置
  // ------------------------------
  let position = POSITIONS.find(pos => str.includes(pos)) || "BTN";

  // ------------------------------
  // 抓 Villain 位置（可選）
  // ------------------------------
  let villainPos = POSITIONS.find(pos => str.includes("VS " + pos));

  // ------------------------------
  // 抓 stack（BB）
  // 支援：30BB / 30 / 30bb
  // ------------------------------
  const stackMatch = str.match(/(\d+)\s*BB?/);
  const stack = stackMatch ? parseInt(stackMatch[1], 10) : 30;

  // ------------------------------
  // 抓手牌：AKO / QJS / A5S / 88
  // ------------------------------
  const comboMatch = str.match(/([2-9TJQKA]{2}[OS]?)/);
  if (!comboMatch) {
    return null;
  }

  const combo = comboMatch[1];
  const rank1 = combo[0];
  const rank2 = combo[1];
  const suited = combo.endsWith("S");

  return {
    position,
    combo,
    rank1,
    rank2,
    suited,
    stack,
    villainPos,
    raw
  };
}
