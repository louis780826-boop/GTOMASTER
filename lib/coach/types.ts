
export type Street = "preflop" | "flop" | "turn" | "river";
export type Position = "UTG" | "HJ" | "CO" | "BTN" | "SB" | "BB" | "Unknown";
export type ActionType = "fold" | "call" | "raise" | "check" | "bet";
export type Tier = "FREE" | "PRO" | "MASTER";

export interface SpotInput {
  heroPosition: Position;
  street: Street;
  potSize: number;      // 當前底池
  effectiveStack: number; // 有效籌碼
  spr: number;          // stack to pot ratio
  heroHand: string;     // 例如 "AhKd"
  board: string;        // 例如 "Ts8d2c" 或空字串
  heroAction: ActionType;
  villainAggression: "low" | "normal" | "high";
  notes?: string;       // 玩家補充描述
}

export interface StreetPlan {
  street: Street;
  recommendation: ActionType;
  comment: string;
}

export interface LeakItem {
  id: string;
  label: string;
  severity: "low" | "medium" | "high";
  description: string;
  advice: string;
}

export interface CoachSummary {
  recommendedAction: ActionType;
  confidence: number; // 0~1
  rationale: string;
  gtoTendency: string;
  exploitHint: string;
}

export interface TierView {
  basicSummary: CoachSummary;
  streets: StreetPlan[];
  leaks: LeakItem[];
  gtoScore: number;  // 0~100
  exploitScore: number; // 0~100
}

export interface CoachResult {
  tier: Tier;
  input: SpotInput;
  result: TierView;
}
