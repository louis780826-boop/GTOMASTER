export type QuizQuestion = {
  id: string;
  type: "single" | "multi" | "image";
  question: string;
  options?: string[];          // 單選、多選用
  answer: string[];            // 正確答案（單選也用 array）
  imageUrl?: string;           // 圖片題用
  explanation?: string;        // 解析
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: "Q1",
    type: "single",
    question: "BTN 拿 A5s 對 UTG open，標準動作是？",
    options: ["3bet", "call", "fold"],
    answer: ["3bet"],
    explanation: "A5s 是標準 bluff 3bet range。",
  },
  {
    id: "Q2",
    type: "multi",
    question: "以下哪些牌通常會在 SB vs BB 單挑中選擇 check？",
    options: ["A2o", "K7o", "T9o", "22"],
    answer: ["K7o", "T9o", "22"],
    explanation: "中低 equity hand 通常會偏向 check。",
  },
  {
    id: "Q3",
    type: "image",
    question: "以下情境，最佳動作是？",
    imageUrl: "/quiz/flop_kk7.png",
    options: ["bet 1/3", "check", "overbet"],
    answer: ["bet 1/3"],
    explanation: "在 K K 7 靜態面，range bet 是標準策略。",
  },
];
