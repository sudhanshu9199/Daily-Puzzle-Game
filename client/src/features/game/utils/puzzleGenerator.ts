// puzzleGenerator.ts

import { Puzzle, PuzzleType } from '../../../types/index.types';

// Simple seeded random number generator
const seededRandom = (seed: number) => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
};

export const generateDailyPuzzle = (dateStr: string): Puzzle => {
  // Convert "2023-10-27" into a unique seed integer
  const seed = dateStr.split('-').join(''); 
  const seedNum = parseInt(seed, 10);
  const rng = seededRandom(seedNum);

  // Example: Generate a simple math puzzle
  // In production, you would switch logic based on 'type'
  const num1 = Math.floor(rng * 20) + 1; // 1-20
  const num2 = Math.floor(seededRandom(seedNum + 1) * 20) + 1;
  const answer = num1 + num2;

  return {
    id: `daily-${dateStr}`,
    date: dateStr,
    type: 'math', // Hardcoded for Phase 2 start
    difficulty: 'medium',
    content: JSON.stringify({ question: `What is ${num1} + ${num2}?` }),
    solution: answer.toString(),
    seed: seedNum
  };
};