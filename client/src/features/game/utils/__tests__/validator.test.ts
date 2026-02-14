import { describe, it, expect } from 'vitest';
import { validateSolution } from '../validator';
import type { Puzzle } from '../../../../types/index.types';

describe('validateSolution', () => {
  // Mock puzzle object generator helper
  const createMockPuzzle = (type: Puzzle['type'], solution: string): Puzzle => ({
    id: 'test-id',
    date: '2024-01-01',
    type,
    content: '{}',
    solution,
    hint: 'test hint',
    seed: 123,
    difficulty: 'medium'
  });

  describe('Math Puzzles', () => {
    it('should validate correct exact matches', () => {
      const puzzle = createMockPuzzle('math', '42');
      expect(validateSolution(puzzle, '42')).toBe(true);
    });

    it('should handle whitespace trimming', () => {
      const puzzle = createMockPuzzle('math', '100');
      expect(validateSolution(puzzle, ' 100 ')).toBe(true);
    });

    it('should reject incorrect answers', () => {
      const puzzle = createMockPuzzle('math', '50');
      expect(validateSolution(puzzle, '49')).toBe(false);
    });
  });

  describe('Word Puzzles', () => {
    it('should be case insensitive', () => {
      const puzzle = createMockPuzzle('word', 'React');
      expect(validateSolution(puzzle, 'react')).toBe(true);
      expect(validateSolution(puzzle, 'REACT')).toBe(true);
    });

    it('should reject incorrect words', () => {
      const puzzle = createMockPuzzle('word', 'Java');
      expect(validateSolution(puzzle, 'JavaScript')).toBe(false);
    });
  });

  describe('Logic/Pattern/Spatial Puzzles', () => {
    it('should validate string matches correctly', () => {
      const puzzle = createMockPuzzle('pattern', '15');
      expect(validateSolution(puzzle, '15')).toBe(true);
    });

    it('should return false for empty input', () => {
      const puzzle = createMockPuzzle('logic', '1');
      expect(validateSolution(puzzle, '')).toBe(false);
    });
  });

  it('should return false for unknown puzzle types', () => {
    // Force an invalid type for testing robustness
    const puzzle = createMockPuzzle('unknown' as any, 'answer');
    expect(validateSolution(puzzle, 'answer')).toBe(false);
  });
});