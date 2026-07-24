export interface Flashcard {
  id: string;
  topic: string;
  question: string;
  answer: string;
  /** Optional longer explanation shown after grading / on the study-mode flip card */
  explanation?: string;
  createdAt: number;
}

export interface Topic {
  name: string;
  color: string;
}

export interface QuizAttempt {
  date: string; // YYYY-MM-DD
  correct: number;
  total: number;
}

/** A single completed "Take Quiz" round, kept as its own timestamped log entry. */
export interface QuizHistoryEntry {
  id: string;
  timestamp: number;
  correct: number;
  total: number;
}

export interface StudyData {
  cards: Flashcard[];
  attempts: QuizAttempt[];
  quizHistory: QuizHistoryEntry[];
  streak: {
    current: number;
    longest: number;
    lastStudyDate: string | null;
  };
}

export const TOPIC_COLORS = [
  "var(--color-coral)",
  "var(--color-teal)",
  "var(--color-mustard)",
  "#5C6BC0",
  "#8D6E63",
  "#4E8D7C",
];
