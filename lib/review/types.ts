export type Street = "Preflop" | "Flop" | "Turn" | "River";

export interface HandContext {
  heroPosition: string;
  heroHand: string;
  board: { flop?: string; turn?: string; river?: string };
  sprPreflop?: number;
  stackEffective: number;
  potPreflop: number;
  blind: string;
  villainType?: string;
  actions: any[];
}

export interface ReviewSpotAnalysis {
  street: Street;
  heroDecision: string;
  gtoRecommendation: string;
  exploitRecommendation: string;
  severity: "GOOD" | "OK" | "MISTAKE" | "BLUNDER";
  keyTakeaways: string[];
}

export interface ReviewResult {
  overallGrade: "A" | "B" | "C" | "D";
  summary: string;
  spots: ReviewSpotAnalysis[];
}
