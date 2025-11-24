
export type ComboAction = "raise" | "call" | "fold" | "mix";

export interface ComboDetail {
  action: ComboAction;
  freq?: number; // 混頻，例如 0.5 = 50%
}

export type RangeMatrix = {
  [combo: string]: ComboDetail;
};
