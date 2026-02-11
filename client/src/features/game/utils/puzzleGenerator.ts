// puzzleGenerator.ts

import { Puzzle, PuzzleType } from '../../../types/index.types';

// Simple seeded random number generator
const seededRandom = (seed: number) => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
};

export const generateDailyPuzzle = (dateStr: string): Puzzle => {
  const seed = parseInt(dateStr.split('-').join(''), 10);
  const rng = (offset: number) => seededRandom(seed + offset);

  // Rotate puzzle types based on day of week (0-6)
  const dayIndex = new Date(dateStr).getDay();
  const types: PuzzleType[] = ['math', 'logic', 'pattern', 'word', 'spatial'];
  const type = types[dayIndex % 5]; // Rotates daily

  let content = {};
  let solution = '';

  switch (type) {
    case 'math':
      const n1 = Math.floor(rng(1) * 50) + 1;
      const n2 = Math.floor(rng(2) * 50) + 1;
      content = { question: `Solve: ${n1} + ${n2} + ${Math.floor(rng(3)*10)}` };
      solution = (n1 + n2 + Math.floor(rng(3)*10)).toString();
      break;

    case 'pattern':
      const start = Math.floor(rng(4) * 10) + 1;
      const step = Math.floor(rng(5) * 5) + 2;
      content = { question: `Complete the sequence: ${start}, ${start+step}, ${start+(step*2)}, ?` };
      solution = (start + (step * 3)).toString();
      break;

    case 'word':
      const words = ['REACT', 'CODE', 'NODE', 'GAME', 'LOGIC'];
      const word = words[Math.floor(rng(6) * words.length)];
      const scrambled = word.split('').sort(() => 0.5 - rng(7)).join('');
      content = { question: `Unscramble this word: ${scrambled}` };
      solution = word;
      break;

    case 'logic':
      const isTrue = rng(8) > 0.5;
      content = { question: `Logic Gate: If TRUE == ${isTrue ? 'FALSE' : 'TRUE'}, type "1". Else type "0".` };
      solution = isTrue ? '0' : '1';
      break;

    case 'spatial':
      const sides = Math.floor(rng(9) * 4) + 3; // 3 to 6
      content = { question: `How many sides does a polygon with ${sides} corners have?` };
      solution = sides.toString();
      break;
  }

  return {
    id: `daily-${dateStr}`,
    date: dateStr,
    type,
    difficulty: 'medium',
    content: JSON.stringify(content),
    solution: solution,
    seed
  };
};