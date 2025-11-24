import { RangeMatrix, ComboDetail, ComboAction } from "./types";
import { buildRange, RuleParams } from "./generator";

function bbRule(p: RuleParams): ComboDetail {
  const { pair, suited, offsuit, hiRank, loRank, highIndex, lowIndex } = p;

  // 口袋對：全部至少防守，強對可 3bet
  if (pair) {
    if (["A", "K", "Q", "J"].includes(hiRank)) {
      return { action: "raise" as ComboAction };
    }
    if (["T", "9", "8", "7", "6", "5"].includes(hiRank)) {
      return { action: "call" as ComboAction };
    }
    return { action: "mix" as ComboAction, freq: 0.6 };
  }

  // Suited
  if (suited) {
    // Axs：全部防守，小張混頻 3bet
    if (hiRank === "A") {
      if (["K", "Q", "J"].includes(loRank)) {
        return { action: "raise" as ComboAction }; // 3bet / 防守
      }
      return { action: "call" as ComboAction };
    }

    // Kxs、Qxs：大多防守，強一點可以混 3bet
    if (hiRank === "K") {
      if (["Q", "J", "T"].includes(loRank)) {
        return { action: "mix" as ComboAction, freq: 0.6 };
      }
      return { action: "call" as ComboAction };
    }

    if (hiRank === "Q") {
      if (["J", "T", "9"].includes(loRank)) {
        return { action: "mix" as ComboAction, freq: 0.6 };
      }
      return { action: "call" as ComboAction };
    }

    // 各種 suited connectors / one-gap 幾乎全部防守
    const isConnector = lowIndex === highIndex + 1;
    const oneGap = lowIndex === highIndex + 2;
    const twoGap = lowIndex === highIndex + 3;

    if (isConnector && highIndex <= 11) {
      return { action: "call" as ComboAction };
    }
    if (oneGap && highIndex <= 11) {
      return { action: "call" as ComboAction };
    }
    if (twoGap && highIndex <= 10) {
      return { action: "call" as ComboAction };
    }

    // 最差的一些可以直接 fold
    if (hiRank === "3" || hiRank === "2") {
      if (["5", "4", "3", "2"].includes(loRank)) {
        return { action: "fold" as ComboAction };
      }
    }

    return { action: "call" as ComboAction };
  }

  // Offsuit
  if (offsuit) {
    // ATo+ 防守，AKo, AQo 混 3bet
    if (hiRank === "A") {
      if (["K", "Q"].includes(loRank)) {
        return { action: "mix" as ComboAction, freq: 0.6 }; // 3bet / call
      }
      if (["J", "T", "9"].includes(loRank)) {
        return { action: "call" as ComboAction };
      }
      return { action: "fold" as ComboAction };
    }

    // KQo, KJo, QJo 防守，KTo, QTo 部分防守
    if (hiRank === "K") {
      if (["Q", "J"].includes(loRank)) {
        return { action: "call" as ComboAction };
      }
      if (loRank === "T") {
        return { action: "mix" as ComboAction, freq: 0.5 };
      }
      return { action: "fold" as ComboAction };
    }

    if (hiRank === "Q") {
      if (loRank === "J") {
        return { action: "call" as ComboAction };
      }
      if (loRank === "T") {
        return { action: "mix" as ComboAction, freq: 0.5 };
      }
      return { action: "fold" as ComboAction };
    }

    // 一些 JTo, T9o 可以少量防守
    if (hiRank === "J" && loRank === "T") {
      return { action: "mix" as ComboAction, freq: 0.5 };
    }
    if (hiRank === "T" && loRank === "9") {
      return { action: "mix" as ComboAction, freq: 0.4 };
    }

    // 其餘大部分 offsuit 垃圾 fold
    return { action: "fold" as ComboAction };
  }

  return { action: "fold" as ComboAction };
}

export const bbRange: RangeMatrix = buildRange(bbRule);
