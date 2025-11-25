// utils/handParser.ts

export interface ParsedHand {
  holeCards: string[];
  board: string[];
  actions: string[];
}

/**
 * 簡化版手牌解析器（只保留必用欄位）
 */
export function parseHand(raw: string): ParsedHand {
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);

  const holeCards: string[] = [];
  const board: string[] = [];
  const actions: string[] = [];

  for (const line of lines) {
    if (line.startsWith("HoleCards:")) {
      const cards = line.replace("HoleCards:", "").trim();
      holeCards.push(...cards.split(" "));
    }
    if (line.startsWith("Board:")) {
      const cards = line.replace("Board:", "").trim();
      board.push(...cards.split(" "));
    }
    if (line.startsWith("Action:")) {
      const act = line.replace("Action:", "").trim();
      actions.push(act);
    }
  }

  return {
    holeCards,
    board,
    actions,
  };
}
