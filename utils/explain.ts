// utils/explain.ts

// 統一用 CoachResult 這個型別產出文字說明
import type { CoachResult } from "./coachEngine";

export function generateExplanation(result: CoachResult): string {
  const {
    heroPosition,
    villainPosition,
    combo,
    gtoAction,
    heroAction,
    leakCategory,
    evDiff,
    notes,
  } = result;

  const lines: string[] = [];

  lines.push(`▶ 英雄位置：${heroPosition}`);
  if (villainPosition) {
    lines.push(`▶ 對手位置：${villainPosition}`);
  }
  lines.push(`▶ 手牌：${combo}`);
  lines.push(`▶ GTO 推薦動作：${gtoAction}`);
  lines.push(`▶ 你的實際動作：${heroAction}`);

  lines.push("");

  switch (leakCategory) {
    case "TOO_TIGHT":
      lines.push("分析：你在這個位置上的棄牌過於保守，導致錯失可盈利的防守或進攻機會。");
      break;
    case "TOO_LOOSE":
      lines.push("分析：你在這個 spot 過於鬆，持續用過弱範圍繼續投入籌碼，長期會嚴重拖累 winrate。");
      break;
    case "OVER_AGGRO":
      lines.push("分析：你在這裡太過激進，超出了 GTO 建議的進攻頻率。");
      break;
    case "OVER_PASSIVE":
      lines.push("分析：你在這個應該進攻的情境下選擇太被動，導致少賺很多 value。");
      break;
    case "OK":
      lines.push("分析：這個決策與 GTO 建議相當接近，屬於可接受甚至不錯的操作。");
      break;
  }

  lines.push("");

  if (evDiff === 0) {
    lines.push("EV 差異：理論上與 GTO 幾乎無差異，長期來看不會造成明顯損失。");
  } else if (evDiff < 0) {
    lines.push(
      `EV 差異：此操作相較於 GTO 約損失 ${Math.abs(evDiff).toFixed(
        2
      )} bb，屬於需要修正的 leak。`
    );
  } else {
    lines.push(`EV 差異：此操作相較於 GTO 反而多賺約 ${evDiff.toFixed(2)} bb（偏 exploit）。`);
  }

  if (notes && notes.length > 0) {
    lines.push("");
    lines.push("補充說明：");
    for (const n of notes) {
      lines.push(`- ${n}`);
    }
  }

  return lines.join("\n");
}
