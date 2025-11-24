export interface CoachReport {
  summary: string;
  preflop: string;
  flop: string;
  turn: string;
  river: string;
  leaks: string[];
  recommendedChapters: Lesson[];
  recommendedQuizzes: Quiz[];

  // 新增的欄位
  score: number;
}
