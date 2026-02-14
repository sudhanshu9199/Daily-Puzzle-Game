import type { PuzzleGenerator } from "./generator.types";

export const generateMathPuzzle: PuzzleGenerator = ({ rng }) => {
  const n1 = Math.floor(rng(1) * 50) + 1;
  const n2 = Math.floor(rng(2) * 50) + 1;
  const extra = Math.floor(rng(3) * 10);
  
  return {
    type: 'math',
    content: JSON.stringify({ question: `Solve: ${n1} + ${n2} + ${extra}` }),
    solution: (n1 + n2 + extra).toString(),
    hint: `Try adding ${n1} and ${n2} first, then add the rest.`,
  };
};