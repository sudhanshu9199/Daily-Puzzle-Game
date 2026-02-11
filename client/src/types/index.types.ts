// index.types.ts

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt?: string; // ISO Date string
}

export type PuzzleType = 'logic' | 'math' | 'pattern' | 'word' | 'spatial';

export interface Puzzle {
  id: string;
  date: string; // YYYY-MM-DD
  type: PuzzleType;
  difficulty: 'easy' | 'medium' | 'hard';
  content: string; // JSON stringified puzzle data or specific structure
  solution: string; // Hashed solution or direct value depending on security needs
  seed: number; // For procedural generation
}

export interface UserProgress {
  userId: string;
  currentStreakTc: number;
  maxStreak: number;
  lastPlayedDate: string | null; // YYYY-MM-DD
  totalSolved: number;
  history: Record<string, { // Key is YYYY-MM-DD
    solved: boolean;
    attempts: number;
    timeTaken: number; // in seconds
  }>;
}

export interface GameState {
  currentDate: string;
  puzzles: Puzzle[];
  loading: boolean;
}