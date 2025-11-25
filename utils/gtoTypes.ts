// utils/gtoTypes.ts

// -----------------------------
// 基礎型別
// -----------------------------

export type Street = "preflop" | "flop" | "turn" | "river";

export type SkillLevel = "basic" | "intermediate" | "advanced" | string;

export type Position =
  | "UTG"
  | "HJ"
  | "CO"
  | "BTN"
  | "SB"
  | "BB"
  | string;

// -----------------------------
// Lesson / Quiz 型別
// 這是這次關鍵：讓 Lesson / Quiz 被定義出來
// -----------------------------

export interface Lesson {
  id?: string;
  slug?: string;
  title?: string;
  chapterIndex?: number;
  sectionIndex?: number;
  description?: string;
  level?: SkillLevel;
  tags?: string[];
  estimatedMinutes?: number;
  // 保留彈性：其他欄位都允許存在
  [key: string]: unknown;
}

export interface Quiz {
  id?: string;
  lessonId?: string;
  question?: string;
  options?: string[];
  correctIndex?: number;
  explanation?: string;
  difficulty?: SkillLevel;
  // 同樣保留擴充空間
  [key: string]: unknown;
}

// -----------------------------
// GTO 漏洞總結 / 推薦結構
// -----------------------------

export interface StreetLeak {
  street: Street;
  summary: string;
  heroAction?: string;
  gtoAction?: string;
  comment?: string;
}

export interface GtoLeakSummary {
  // 你原本的欄位
  flop: string;
  turn: string;
  river: string;
  leaks: string[];

  // 這兩個就是報錯指到的欄位
  recommendedChapters: Lesson[];
  recommendedQuizzes: Quiz[];
}

// 如果有需要在別的地方用到「完整分析結果」，也可以用這個
export interface GtoAnalysisResult {
  spotId?: string;
  heroPosition: Position;
  villainPosition?: Position;
  combo?: string;
  spr?: number;
  preflopPlan?: string;
  postflopPlan?: string;
  leakSummary?: GtoLeakSummary;
  streets?: StreetLeak[];
}
