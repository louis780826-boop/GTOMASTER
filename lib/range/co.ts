
import { RangeMatrix } from "./types";
import { buildRange, RuleParams } from "./generator";

function coRule(p: RuleParams) {
  const { pair, suited, offsuit, hiRank, loRank, highIndex, lowIndex } = p;

  if (pair) {
    if (["A","K","Q","J","T","9","8","7","6","5"].includes(hiRank)) {
      return { action: "raise" };
    }
    if (["4","3"].includes(hiRank)) {
      return { action: "mix", freq: 0.5 };
    }
    return { action: "fold" };
  }

  if (suited) {
    if (hiRank === "A") {
      if (["K","Q","J","T","9","8"].includes(loRank)) {
        return { action: "raise" };
      }
      return { action: "mix", freq: 0.6 };
    }

    if (hiRank === "K") {
      if (["Q","J","T"].includes(loRank)) {
        return { action: "raise" };
      }
      if (["9","8","7","6"].includes(loRank)) {
        return { action: "mix", freq: 0.6 };
      }
      return { action: "fold" };
    }

    if (hiRank === "Q") {
      if (["J","T"].includes(loRank)) {
        return { action: "raise" };
      }
      if (["9","8"].includes(loRank)) {
        return { action: "mix", freq: 0.6 };
      }
      return { action: "fold" };
    }

    const isConnector = lowIndex === highIndex + 1;
    if (isConnector && highIndex <= 7 && hiRank !== "A") {
      return { action: "raise" };
    }

    const oneGap = lowIndex === highIndex + 2;
    const twoGap = lowIndex === highIndex + 3;
    if (oneGap && highIndex <= 8) {
      return { action: "mix", freq: 0.6 };
    }
    if (twoGap && highIndex <= 7) {
      return { action: "mix", freq: 0.4 };
    }

    return { action: "fold" };
  }

  if (offsuit) {
    if (hiRank === "A") {
      if (["K","Q","J","T"].includes(loRank)) {
        return { action: "raise" };
      }
      if (loRank === "9") {
        return { action: "mix", freq: 0.5 };
      }
      return { action: "fold" };
    }

    if (hiRank === "K") {
      if (["Q","J"].includes(loRank)) {
        return { action: "raise" };
      }
      if (loRank === "T") {
        return { action: "mix", freq: 0.5 };
      }
      return { action: "fold" };
    }

    if (hiRank === "Q") {
      if (loRank === "J") {
        return { action: "raise" };
      }
      if (loRank === "T") {
        return { action: "mix", freq: 0.5 };
      }
      return { action: "fold" };
    }

    return { action: "fold" };
  }

  return { action: "fold" };
}

export const coRange: RangeMatrix = buildRange(coRule);
