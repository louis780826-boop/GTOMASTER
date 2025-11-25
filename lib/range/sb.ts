// @ts-nocheck


import { RangeMatrix } from "./types";
import { buildRange, RuleParams } from "./generator";

function sbRule(p: RuleParams) {
  const { pair, suited, offsuit, hiRank, loRank, highIndex, lowIndex } = p;

  if (pair) {
    if (["A","K","Q","J","T","9","8","7","6","5"].includes(hiRank)) {
      return { action: "raise" };
    }
    return { action: "mix", freq: 0.7 };
  }

  if (suited) {
    if (hiRank === "A") {
      if (["K","Q","J","T","9","8","7"].includes(loRank)) {
        return { action: "raise" };
      }
      return { action: "mix", freq: 0.7 };
    }

    if (hiRank === "K") {
      if (["Q","J","T","9","8"].includes(loRank)) {
        return { action: "raise" };
      }
      return { action: "mix", freq: 0.6 };
    }

    if (hiRank === "Q") {
      if (["J","T","9"].includes(loRank)) {
        return { action: "raise" };
      }
      return { action: "mix", freq: 0.6 };
    }

    const isConnector = lowIndex === highIndex + 1;
    const oneGap = lowIndex === highIndex + 2;
    const twoGap = lowIndex === highIndex + 3;

    if (isConnector && highIndex <= 10) {
      return { action: "raise" };
    }
    if (oneGap && highIndex <= 10) {
      return { action: "mix", freq: 0.7 };
    }
    if (twoGap && highIndex <= 9) {
      return { action: "mix", freq: 0.5 };
    }

    return { action: "fold" };
  }

  if (offsuit) {
    if (hiRank === "A") {
      if (["K","Q","J","T"].includes(loRank)) {
        return { action: "raise" };
      }
      if (["9","8","7","6","5"].includes(loRank)) {
        return { action: "mix", freq: 0.6 };
      }
      return { action: "fold" };
    }

    if (hiRank === "K") {
      if (["Q","J"].includes(loRank)) {
        return { action: "raise" };
      }
      if (["T","9","8"].includes(loRank)) {
        return { action: "mix", freq: 0.5 };
      }
      return { action: "fold" };
    }

    if (hiRank === "Q") {
      if (loRank === "J") {
        return { action: "raise" };
      }
      if (["T","9"].includes(loRank)) {
        return { action: "mix", freq: 0.5 };
      }
      return { action: "fold" };
    }

    if (hiRank === "J") {
      if (loRank === "T") {
        return { action: "raise" };
      }
      if (["9","8"].includes(loRank)) {
        return { action: "mix", freq: 0.5 };
      }
      return { action: "fold" };
    }

    return { action: "fold" };
  }

  return { action: "fold" };
}

export const sbRange: RangeMatrix = buildRange(sbRule);
