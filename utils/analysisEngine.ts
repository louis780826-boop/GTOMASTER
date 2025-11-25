// utils/analysisEngine.ts

import { parseHand, ParsedHand } from "./handParser";

export interface CoachReport {
  summary: string;
  leaks: string[];
  suggestions: string[];
}

/**
 * 主 AI 簡化分析引擎
 */
export function runAnalysis(rawHand: string): CoachReport {
  const parsed: ParsedHand = parseHand(rawHand);

  const leaks: string[] = [];
  const suggestions: string[] = [];

  // 假設：沒有翻牌資訊 → 判定為常見 leak
  if (parsed.board.length === 0) {
    leaks.push("未包含翻牌資訊，無法完整分析牌局。");
    suggestions.push("請補上 flop/turn/river 的公共牌資訊。");
  }

  // 假設：手牌格式亂 → 判定為需要補強
  if (parsed.holeCards.length === 0) {
    leaks.push("未偵測到有效的手牌資訊。");
    suggestions.push("請檢查 HoleCards 格式，例如：'HoleCards: Ah Kh'");
  }

  // 基本摘要
  const summary = `手牌解析成功：偵測到洞牌 ${parsed.holeCards.join(" ")}，公共牌 ${parsed.board.join(" ")}，動作共 ${parsed.actions.length} 筆。`;

  return {
    summary,
    leaks,
    suggestions,
  };
}
