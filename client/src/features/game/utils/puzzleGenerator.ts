// puzzleGenerator.ts

import { Puzzle, PuzzleType } from "../../../types/index.types";

// Simple seeded random number generator
const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

export const generateDailyPuzzle = (dateStr: string): Puzzle => {
  const seed = parseInt(dateStr.split("-").join(""), 10);
  const rng = (offset: number) => seededRandom(seed + offset);

  // Rotate puzzle types based on day of week (0-6)
  const dayIndex = new Date(dateStr).getDay();
  const types: PuzzleType[] = ["math", "logic", "pattern", "word", "spatial"];
  const type = types[dayIndex % 5]; // Rotates daily

  let content = {};
  let solution = "";
  let hint = '';

  switch (type) {
    case "math":
      const n1 = Math.floor(rng(1) * 50) + 1;
      const n2 = Math.floor(rng(2) * 50) + 1;
      const extra = Math.floor(rng(3) * 10);
      content = { question: `Solve: ${n1} + ${n2} + ${extra}` };
      solution = (n1 + n2 + extra).toString();
      // Add a simple hint
      hint = `Try adding ${n1} and ${n2} first, then add the rest.`;
      break;

    case "pattern":
      const start = Math.floor(rng(4) * 10) + 1;
      const step = Math.floor(rng(5) * 5) + 2;
      content = {
        question: `Complete the sequence: ${start}, ${start + step}, ${start + step * 2}, ?`,
      };
      solution = (start + step * 3).toString();
      hint = `The numbers are increasing by ${step} each time.`;
      break;

    case "word":
      const words = ["REACT", "CODE", "NODE", "GAME", "LOGIC", 'JAVA', 'VITE'];
      const word = words[Math.floor(rng(6) * words.length)];
      const scrambled = word
        .split("")
        .sort(() => 0.5 - rng(7))
        .join("");
      content = { question: `Unscramble this word: ${scrambled}` };
      solution = word;
      hint = `It starts with the letter "${word[0]}".`;
      break;

    case "logic":
      const isTrue = rng(8) > 0.5;
      content = {
        question: `Logic Gate: If TRUE == ${isTrue ? "FALSE" : "TRUE"}, type "1". Else type "0".`,
      };
      solution = isTrue ? "0" : "1";
      hint = isTrue ? "The condition is False." : "The condition is True.";
      break;

    case "spatial":
      const sides = Math.floor(rng(9) * 4) + 3; // 3 to 6
      const shapes = {3: 'Triangle', 4: 'Square', 5: 'Pentagon', 6: 'Hexagon'};
      content = { question: `How many corners does a ${shapes[sides as keyof typeof shapes]} have?` };
      solution = sides.toString();
      hint = "Count the vertices of the shape shown.";
      break;
  }

  return {
    id: `daily-${dateStr}`,
    date: dateStr,
    type,
    difficulty: "medium",
    content: JSON.stringify(content),
    solution: solution,
    seed,
    hint: hint || "No hint available for this puzzle."
  };
};
