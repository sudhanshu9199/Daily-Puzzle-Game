import type { Puzzle, PuzzleType } from "../../../types/index.types";
import { createRNG } from "./rng";
import { generateMathPuzzle } from "./generators/mathGenerator";
import { generateWordPuzzle } from "./generators/wordGenerator";

const generatePatternPuzzle = ({ rng }: any) => {
    const start = Math.floor(rng(4) * 10) + 1;
    const step = Math.floor(rng(5) * 5) + 2;
    return {
        type: 'pattern' as PuzzleType,
        content: JSON.stringify({ question: `Complete the sequence: ${start}, ${start + step}, ${start + step * 2}, ?` }),
        solution: (start + step * 3).toString(),
        hint: `The numbers are increasing by ${step} each time.`
    };
};

const generateLogicPuzzle = ({ rng }: any) => {
    const isTrue = rng(8) > 0.5;
    return {
        type: 'logic' as PuzzleType,
        content: JSON.stringify({ question: `Logic Gate: If TRUE == ${isTrue ? "FALSE" : "TRUE"}, type "1". Else type "0".` }),
        solution: isTrue ? "0" : "1",
        hint: isTrue ? "The condition is False." : "The condition is True."
    };
};

const generateSpatialPuzzle = ({ rng }: any) => {
    const sides = Math.floor(rng(9) * 4) + 3;
    const shapes: Record<number, string> = {3: 'Triangle', 4: 'Square', 5: 'Pentagon', 6: 'Hexagon'};
    return {
        type: 'spatial' as PuzzleType,
        content: JSON.stringify({ question: `How many corners does a ${shapes[sides]} have?` }),
        solution: sides.toString(),
        hint: "Count the vertices of the shape shown."
    };
};

// --- Factory Registry ---
const GENERATORS: Record<string, Function> = {
  math: generateMathPuzzle,
  word: generateWordPuzzle,
  pattern: generatePatternPuzzle,
  logic: generateLogicPuzzle,
  spatial: generateSpatialPuzzle,
};

export const getPuzzle = (type: PuzzleType, dateStr: string): Puzzle => {
  const seed = parseInt(dateStr.split("-").join(""), 10);
  const rng = createRNG(seed);
  
  const generator = GENERATORS[type];
  if (!generator) throw new Error(`Puzzle type ${type} not implemented`);

  const puzzleData = generator({ dateStr, seed, rng });

  return {
    id: `daily-${dateStr}`,
    date: dateStr,
    difficulty: "medium",
    seed,
    ...puzzleData,
    hint: puzzleData.hint || "No hint available."
  };
};

export const generateDailyPuzzle = (dateStr: string): Puzzle => {
  // Rotate puzzle types based on day of week
  const dayIndex = new Date(dateStr).getDay();
  const types: PuzzleType[] = ["math", "logic", "pattern", "word", "spatial"];
  const type = types[dayIndex % types.length]; 

  return getPuzzle(type, dateStr);
};