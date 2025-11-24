
import utg from "../../ranges/utg.json";
import hj from "../../ranges/hj.json";
import co from "../../ranges/co.json";
import btn from "../../ranges/btn.json";
import sb from "../../ranges/sb.json";
import bb from "../../ranges/bb.json";

export const positions = ["UTG","HJ","CO","BTN","SB","BB"] as const;

export type Position = typeof positions[number];

export function loadRange(position: Position) {
  const map = {
    UTG: utg,
    HJ: hj,
    CO: co,
    BTN: btn,
    SB: sb,
    BB: bb
  };
  return map[position] as Record<string,{raise:number;call:number;fold:number}>;
}
