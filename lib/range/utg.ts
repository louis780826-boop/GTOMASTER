
import { RangeMatrix } from "./types";
import { buildRange, RuleParams } from "./generator";

function utgRule(p: RuleParams) {
  const { pair, suited, offsuit, hiRank, loRank, highIndex, lowIndex } = p;

  if (pair) {
    if (["A","K","Q","J","T","9","8","7"].includes(hiRank)) {
      return { action: "raise" };
    }
    if (hiRank === "6") {
      return { action: "mix", freq: 0.5 };
    }
    return { action: "fold" };
  }

  if (suited) {
    if (hiRank === "A") {
      if (["K","Q","J","T"].includes(loRank)) {
        return { action: "raise" };
      }
      if (["9","8","7","6","5"].includes(loRank)) {
        return { action: "mix", freq: 0.5 };
      }
      return { action: "fold" };
    }

    if (hiRank === "K") {
      if (["Q","J"].includes(loRank)) {
        return { action: "raise" };
      }
      if (["T","9"].includes(loRank)) {
        return { action: "mix", freq: 0.4 };
      }
      return { action: "fold" };
    }

    if (hiRank === "Q") {
      if (loRank === "J") {
        return { action: "raise" };
      }
      if (["T","9"].includes(loRank)) {
        return { action: "mix", freq: 0.4 };
      }
      return { action: "fold" };
    }

    const isConnector = lowIndex === highIndex + 1;
    if (isConnector && highIndex <= 5 && hiRank !== "A") {
      if (["T","9","8","7"].includes(hiRank)) {
        return { action: "mix", freq: 0.5 };
      }
    }

    return { action: "fold" };
  }

  if (offsuit) {
    if (hiRank === "A") {
      if (loRank === "K" || loRank === "Q") {
        return { action: "raise" };
      }
      if (loRank === "J") {
        return { action: "mix", freq: 0.5 };
      }
      return { action: "fold" };
    }

    if (hiRank === "K" && loRank === "Q") {
      return { action: "mix", freq: 0.4 };
    }

    return { action: "fold" };
  }

  return { action: "fold" };
}

export const utgRange: RangeMatrix = buildRange(utgRule);
