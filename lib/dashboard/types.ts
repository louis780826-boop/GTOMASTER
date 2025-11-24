
export interface WeeklyVolume {
  day: string;
  hands: number;
}

export interface LeakSummary {
  id: string;
  label: string;
  description: string;
  priority: "low" | "medium" | "high";
}

export interface PositionFocus {
  position: string;
  reason: string;
  suggestedHands: number;
}
