// useGameLogic.ts

import { useState, useEffect, useCallback } from 'react';
import { StorageService } from '../../../services/storageServices';
import { Puzzle, GameState } from '../../../types/index.types';
import { generateDailyPuzzle } from '../utils/puzzleGenerator';

const getTodayDateString = () => new Date().toISOString().split('T')[0];

const INITIAL_STATE: GameState = {
  currentDate: getTodayDateString(), // Helper needed
  puzzles: [],
  loading: true,
};

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [userSolution, setUserSolution] = useState<string>("");
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle');

  // Load Game State on Mount
  useEffect(() => {
    const initGame = async () => {
      const today = getTodayDateString();
      
      // 1. Try to get today's puzzle from Cache (Offline First)
      let puzzle = await StorageService.getItem<Puzzle>(`puzzle_${today}`, 'puzzle');

      // 2. If not in cache, generate it locally (Client-side generation)
      if (!puzzle) {
        console.log("Generating new puzzle for:", today);
        puzzle = generateDailyPuzzle(today);
        // Cache it immediately
        await StorageService.setItem(`puzzle_${today}`, puzzle, 'puzzle');
      }

      setCurrentPuzzle(puzzle);
      setGameState(prev => ({ ...prev, loading: false }));
    };

    initGame();
  }, []);

  const submitSolution = useCallback(async () => {
    if (!currentPuzzle) return;

    if (userSolution.trim().toLowerCase() === currentPuzzle.solution.toLowerCase()) {
      setFeedback('success');
      // Save progress
      await StorageService.setItem(`solved_${currentPuzzle.id}`, true, 'user');
    } else {
      setFeedback('error');
      setTimeout(() => setFeedback('idle'), 2000);
    }
  }, [currentPuzzle, userSolution]);

  return {
    currentPuzzle,
    userSolution,
    setUserSolution,
    submitSolution,
    feedback,
    isLoading: gameState.loading
  };
};