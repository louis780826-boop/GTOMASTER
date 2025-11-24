// /utils/quizSession.ts

export type SessionCategory = "preflop" | "flop" | "turn" | "river";

export type SessionAnswer = {
  questionId: string;
  category: SessionCategory;
  isCorrect: boolean;
};

type RawSession = {
  timestamp: number;
  answers: SessionAnswer[];
};

const KEY = "gto_master_quiz_session_v1";

function getRawSession(): RawSession | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as RawSession;
  } catch {
    return null;
  }
}

export function resetSession() {
  if (typeof window === "undefined") return;
  const session: RawSession = {
    timestamp: Date.now(),
    answers: [],
  };
  localStorage.setItem(KEY, JSON.stringify(session));
}

export function addSessionAnswer(answer: SessionAnswer) {
  if (typeof window === "undefined") return;

  const existing =
    getRawSession() ?? ({ timestamp: Date.now(), answers: [] } as RawSession);

  existing.answers.push(answer);
  localStorage.setItem(KEY, JSON.stringify(existing));
}

export type QuizSessionSummary = {
  timestamp: number;
  total: number;
  correct: number;
  answers: SessionAnswer[];
  byCategory: { [cat: string]: { total: number; correct: number } };
};

export function getLastSessionSummary(): QuizSessionSummary | null {
  if (typeof window === "undefined") return null;

  const raw = getRawSession();
  if (!raw || !raw.answers || raw.answers.length === 0) return null;

  const total = raw.answers.length;
  const correct = raw.answers.filter((a) => a.isCorrect).length;

  const byCategory: { [cat: string]: { total: number; correct: number } } = {};

  for (const a of raw.answers) {
    if (!byCategory[a.category]) {
      byCategory[a.category] = { total: 0, correct: 0 };
    }
    byCategory[a.category].total += 1;
    if (a.isCorrect) byCategory[a.category].correct += 1;
  }

  return {
    timestamp: raw.timestamp,
    total,
    correct,
    answers: raw.answers,
    byCategory,
  };
}
