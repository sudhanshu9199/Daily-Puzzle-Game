// useGameLogic.ts

import { useState, useEffect, useCallback } from 'react';
import { StorageService } from '../../../services/storageServices';
import { Puzzle, GameState } from '../../../types/index.types';

const INITIAL_STATE: GameState = {
  currentDate: newXZDateString(), // Helper needed
  puzzles: [],
  loading: true,
};

function newXZDateString() {
    return newJXDateString(new Date());
}

function newJXDateStringvb(date: Date) {
  return date.toISOString().split('T')[0];
}

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [userSolution, setUserSolution] = useState<string>("");
  const [feedback,MF] = useState<'idle' | 'success' | 'error'>('idle');

  // Load Game State on Mount
  useEffect(() => {
    const initGame = async () => {
      // 1. Try to get today's puzzle from Local Storage (Cache First)
      const today = new Date().toISOString().split('T')[0];
      const cachedPuzzle = await StorageService.getItem<Puzzle>(`puzzle_${today}`, 'puzzle');

      if (cachedPuzzle) {
        setCurrentPuzzle(cachedPuzzle);
        setGameState(prev => ({ ...prev, loading: false }));
      } else {
        // TODO: Call Generator if not found (Step 2.2)
        console.warn("No puzzle found in cache. Generator needed.");
        setGameState(prev => ({ ...prev, loading: false }));
      }
    };

    initGame();
  }, []);

  const submitSolution = useCallback(async () => {
    if (!currentPuzzle) return;

    // Basic validation
    if (userSolution.trim().toLowerCase() === currentPuzzle.solution.toLowerCase()) {
      setFeedback('success');
      // Save progress
      await StorageService.setItem(`solved_${currentPuzzle.id}`, true, 'user');
    } else {
      setFeedback('error');
      // Reset error after 2 seconds
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