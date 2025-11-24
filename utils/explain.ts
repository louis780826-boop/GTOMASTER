// utils/explain.ts
// AI Coach v3 — 教練講解生成器（旗艦黑金版）
// 可直接使用、無須任何修改

import { CoachResult } from "./coachEngine";

export function generateExplanation(result: CoachResult): string {
  const { heroPosition, villainPosition, combo, gtoAction, heroAction, leakCategory, evDiff } = result;

  let explanation = "";

  // ---------- 位置描述 ----------
  const posText = villainPosition
    ? `${heroPosition} 對抗 ${villainPosition}`
    : `${heroPosition}`;

  // ---------- 手牌描述 ----------
  const handText = combo.replace("O", "o").replace("S", "s");

  // ---------- 動作中文 ----------
  const actionMap: Record<string, string> = {
    RAISE: "進攻（Raise）",
    CALL: "平跟（Call）",
    FOLD: "棄牌（Fold）",
    MIX: "混合策略（Mix）"
  };

  const gtoText = actionMap[gtoAction];
  const heroText = actionMap[heroAction];

  // ======================================================
  // 主要解說模板（根據錯誤程度切換）
  // ======================================================
  switch (leakCategory) {
    case "完全正解":
      explanation = `在 ${posText} 情境下，${handText} 屬於標準的 ${gtoText}。你的操作完全符合 GTO 策略，是最高 EV 的決策。保持這種穩定度非常關鍵。`;
      break;

    case "微小偏差":
      explanation = `在 ${posText}，${handText} 主要採用 ${gtoText}。你選擇了 ${heroText}，這會帶來些許 EV 流失（約 ${evDiff}%）。
這種偏差雖小，但若長期累積，仍會對整體勝率造成影響。`;
      break;

    case "中度偏差":
      explanation = `在 ${posText}，${handText} 屬於 GTO 上較明確的 ${gtoText}。你此次選擇了 ${heroText}，導致中度 EV 損失（${evDiff}%）。
你的策略頻率在此點需要稍作調整，以避免面對對手 exploit。`;
      break;

    case "嚴重偏差":
      explanation = `這個情境 (${posText}) 中，${handText} 幾乎是純粹的 ${gtoText}。你卻選擇了 ${heroText}，導致嚴重 EV 損失（${evDiff}%）。
這通常代表：你對該位置的 GTO Range 理解不足，建議優先強化此節點。`;
      break;

    case "重大策略錯誤":
      explanation = `在 ${posText}，${handText} 的 GTO 策略是非常明確的：${gtoText}。然而你此次選擇了 ${heroText}。
此決策屬於重大偏差（損失約 ${evDiff}% EV），可能會在實戰中被對手大幅 exploit。
強烈建議你針對此類手牌重新建立完整策略框架。`;
      break;

    default:
      explanation = `此手牌在 ${posText} 中的 GTO 策略屬於 ${gtoText}，而你選擇了 ${heroText}。建議優化此節點的策略頻率。`;
  }

  return explanation;
}
