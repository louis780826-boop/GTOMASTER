
import { RangeMatrix, ComboDetail } from "./types";

const ranks = ["A","K","Q","J","T","9","8","7","6","5","4","3","2"];

export interface RuleParams {
  i: number;
  j: number;
  highIndex: number;
  lowIndex: number;
  pair: boolean;
  suited: boolean;
  offsuit: boolean;
  hiRank: string;
  loRank: string;
}

export type RangeRule = (params: RuleParams) => ComboDetail;

export function buildRange(rule: RangeRule): RangeMatrix {
  const res: RangeMatrix = {};

  for (let i = 0; i < ranks.length; i++) {
    for (let j = 0; j < ranks.length; j++) {
      const r1 = ranks[i];
      const r2 = ranks[j];
      const highIndex = Math.min(i, j);
      const lowIndex = Math.max(i, j);
      const hiRank = ranks[highIndex];
      const loRank = ranks[lowIndex];

      let key: string;
      let pair = false;
      let suited = false;
      let offsuit = false;

      if (i === j) {
        pair = true;
        key = `${r1}${r2}`;
      } else if (i < j) {
        suited = true;
        key = `${r1}${r2}s`;
      } else {
        offsuit = true;
        key = `${r2}${r1}o`;
      }

      const detail = rule({
        i,
        j,
        highIndex,
        lowIndex,
        pair,
        suited,
        offsuit,
        hiRank,
        loRank,
      });

      res[key] = detail;
    }
  }

  return res;
}
