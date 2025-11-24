
import { RangeMatrix } from "./types";
import { buildRange, RuleParams } from "./generator";

function hjRule(p: RuleParams) {
  const { pair, suited, offsuit, hiRank, loRank, highIndex, lowIndex } = p;

  if (pair) {
    if (["A","K","Q","J","T","9","8","7","6"].includes(hiRank)) {
      return { action: "raise" };
    }
    if (hiRank === "5") {
      return { action: "mix", freq: 0.5 };
    }
    return { action: "fold" };
  }

  if (suited) {
    if (hiRank === "A") {
      if (["K","Q","J","T","9"].includes(loRank)) {
        return { action: "raise" };
      }
      return { action: "mix", freq: 0.5 };
    }

    if (hiRank === "K") {
      if (["Q","J","T"].includes(loRank)) {
        return { action: "raise" };
      }
      if (["9","8"].includes(loRank)) {
        return { action: "mix", freq: 0.5 };
      }
      return { action: "fold" };
    }

    if (hiRank === "Q") {
      if (["J","T"].includes(loRank)) {
        return { action: "raise" };
      }
      if (loRank === "9") {
        return { action: "mix", freq: 0.5 };
      }
      return { action: "fold" };
    }

    const isConnector = lowIndex === highIndex + 1;
    if (isConnector && highIndex <= 6 && hiRank !== "A") {
      return { action: "raise" };
    }

    const oneGap = lowIndex === highIndex + 2;
    if (oneGap && highIndex <= 7) {
      return { action: "mix", freq: 0.4 };
    }

    return { action: "fold" };
  }

  if (offsuit) {
    if (hiRank === "A") {
      if (["K","Q","J"].includes(loRank)) {
        return { action: "raise" };
      }
      if (loRank === "T") {
        return { action: "mix", freq: 0.5 };
      }
      return { action: "fold" };
    }

    if (hiRank === "K") {
      if (loRank === "Q") {
        return { action: "raise" };
      }
      if (loRank === "J") {
        return { action: "mix", freq: 0.4 };
      }
      return { action: "fold" };
    }

    return { action: "fold" };
  }

  return { action: "fold" };
}

export const hjRange: RangeMatrix = buildRange(hjRule);
