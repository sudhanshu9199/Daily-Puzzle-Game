// src/features/game/utils/validator.ts
import type { Puzzle } from "../../../types/index.types";

export const validateSolution = (puzzle: Puzzle, userInput: string): boolean => {
  if (!userInput) return false;

  const normalize = (str: string) => str.trim().toLowerCase();

  switch (puzzle.type) {
    case 'math':
      // For math, exact match usually required
      return normalize(userInput) === normalize(puzzle.solution);
      
    case 'word':
      // For word puzzles, case insensitive
      return normalize(userInput) === normalize(puzzle.solution);

    case 'logic':
    case 'pattern':
    case 'spatial':
      // Basic string matching for now, can be expanded for complex JSON objects later
      return normalize(userInput) === normalize(puzzle.solution);
      
    default:
      return false;
  }
};