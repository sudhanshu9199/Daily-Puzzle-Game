import { describe, it, expect } from 'vitest';
import { getPuzzle, generateDailyPuzzle } from '../puzzleGenerator';

// We can mock specific generators if we want to isolate the factory logic,
// but for a unit test of the factory, verifying the output structure is usually sufficient.

describe('puzzleGenerator', () => {
  describe('getPuzzle', () => {
    it('should generate a pattern puzzle with correct structure', () => {
      const puzzle = getPuzzle('pattern', '2025-01-01');
      
      expect(puzzle).toHaveProperty('id', 'daily-2025-01-01');
      expect(puzzle).toHaveProperty('type', 'pattern');
      expect(puzzle).toHaveProperty('solution');
      expect(puzzle).toHaveProperty('content');
      expect(typeof puzzle.content).toBe('string');
      // Verify content is valid JSON
      expect(() => JSON.parse(puzzle.content)).not.toThrow();
    });

    it('should generate a logic puzzle correctly', () => {
      const puzzle = getPuzzle('logic', '2025-01-02');
      expect(puzzle.type).toBe('logic');
      expect(['0', '1']).toContain(puzzle.solution);
    });

    it('should generate a spatial puzzle correctly', () => {
      const puzzle = getPuzzle('spatial', '2025-01-03');
      expect(puzzle.type).toBe('spatial');
      // Solution should be a number string between 3 and 6 (Triangle to Hexagon)
      const sides = parseInt(puzzle.solution);
      expect(sides).toBeGreaterThanOrEqual(3);
      expect(sides).toBeLessThanOrEqual(6);
    });

    it('should be deterministic based on date string', () => {
      const date = '2025-05-20';
      const puzzle1 = getPuzzle('pattern', date);
      const puzzle2 = getPuzzle('pattern', date);
      
      expect(puzzle1).toEqual(puzzle2);
    });

    it('should throw error for unimplemented types', () => {
      expect(() => getPuzzle('invalid-type' as any, '2025-01-01')).toThrow();
    });
  });

  describe('generateDailyPuzzle', () => {
    it('should rotate puzzle types based on the day', () => {
      // Create dates that correspond to different days of the week
      // Sunday (0) -> math
      // Monday (1) -> logic
      // Tuesday (2) -> pattern
      // Wednesday (3) -> word
      // Thursday (4) -> spatial
      
      // Note: Javascript new Date('YYYY-MM-DD') treats it as UTC. 
      // Ensure the test date strings result in deterministic day indexes.
      
      const logicDay = '2026-02-16'; // A Monday
      const puzzle = generateDailyPuzzle(logicDay);
      expect(puzzle.type).toBe('logic');
    });
  });
});