import type { PuzzleGenerator } from "./generator.types";

// Production Note: In a real app, this list should be much larger or compressed in a separate JSON file.
const WORD_BANK = ["REACT", "CODE", "NODE", "GAME", "LOGIC", "JAVA", "VITE", "TYPESCRIPT", "PRISMA", "NEXTJS"];

export const generateWordPuzzle: PuzzleGenerator = ({ rng }) => {
  const wordIndex = Math.floor(rng(6) * WORD_BANK.length);
  const word = WORD_BANK[wordIndex];
  
  const scrambled = word
    .split("")
    .sort(() => 0.5 - rng(7))
    .join("");

  return {
    type: 'word',
    content: JSON.stringify({ question: `Unscramble this word: ${scrambled}` }),
    solution: word,
    hint: `It starts with the letter "${word[0]}".`,
  };
};