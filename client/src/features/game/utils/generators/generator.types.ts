import type { Puzzle } from "../../../../types/index.types";

export interface GeneratorParams {
  dateStr: string;
  seed: number;
  rng: (offset: number) => number; // Deterministic random number generator
}

export type PuzzleGenerator = (params: GeneratorParams) => Partial<Puzzle>;