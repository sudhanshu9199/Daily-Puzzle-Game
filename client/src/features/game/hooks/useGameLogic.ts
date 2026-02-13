// useGameLogic.ts

import { useState, useEffect, useCallback } from 'react';
import { StorageService } from '../../../services/storageServices';
import { ApiService } from '../../../services/apiServices';
import { useAuth } from '../../../context/AuthContext';
import type { Puzzle, GameState, UserProgress } from '../../../types/index.types';
import { generateDailyPuzzle } from '../utils/puzzleGenerator';
import { validateSolution } from '../utils/validator';

const getTodayDateString = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().split('T')[0];
};


const INITIAL_GAME_STATE: GameState = {
  currentDate: getTodayDateString(), // Helper needed
  puzzles: [],
  loading: true,
};

const INITIAL_PROGRESS: UserProgress = {
  userId: 'local-user', // Replace with Auth ID in Phase 3
  currentStreak: 0,
  maxStreak: 0,
  lastPlayedDate: null,
  totalSolved: 0,
  history: {},
};

export const useGameLogic = () => {
  const { user } = useAuth();
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [userSolution, setUserSolution] = useState<string>("");
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState<UserProgress>(INITIAL_PROGRESS);
  const [showHint, setShowHint] = useState(false);


  // Load Game State on Mount
  useEffect(() => {
    const initGame = async () => {
      const today = getTodayDateString();

      let currentProgress =
        (await StorageService.getItem<UserProgress>('user_progress', 'user')) ||
        INITIAL_PROGRESS;

        if (user) {
        try {
          const token = await user.getIdToken();
          const { data: cloudProgress } = await ApiService.getUserProgress(token);

          if (
            cloudProgress &&
            cloudProgress.totalSolved > currentProgress.totalSolved
          ) {
            currentProgress = { ...currentProgress, ...cloudProgress };
            await StorageService.setItem('user_progress', currentProgress, 'user');
          }
        } catch (err) {
          console.warn("Cloud fetch failed → using local", err);
        }
      }

      setProgress(currentProgress);
      
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
     setShowHint(false); 

      if (currentProgress.history[today]?.solved) {
        setFeedback('success');
        setUserSolution(puzzle.solution); // Optional: Reveal answer
      }

      setGameState(prev => ({ ...prev, loading: false }));
    };

    initGame();
  }, [user]);

  const revealHint = () => setShowHint(true);


  const submitSolution = useCallback(async () => {
    if (!currentPuzzle || feedback === 'success') return;

    const isCorrect = validateSolution(currentPuzzle, userSolution);
    const today = getTodayDateString();

    if (isCorrect) {
      setFeedback('success');

      // Update Progress Logic (Phase 2 Requirement)
      setProgress(prev => {
        if (prev.history[today]?.solved) return prev;

        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        const isConsecutive = prev.lastPlayedDate === yesterday;
        const newStreak = isConsecutive ? prev.currentStreak + 1 : 1;
        
        const newProgress: UserProgress = {
          ...prev,
          userId: user?.uid || 'local-user',
          currentStreak: newStreak,
          maxStreak: Math.max(prev.maxStreak, newStreak),
          lastPlayedDate: today,
          totalSolved: prev.totalSolved + 1,
          history: {
            ...prev.history,
            [today]: {
              solved: true,
              attempts: 1,
              timeTaken: 0, // Implement timer later
              usedHint: showHint
            }
          }
        };
        
        // Async Save
        StorageService.setItem('user_progress', newProgress, 'user');

        if (user) {
          user.getIdToken().then(token => {
             ApiService.syncProgress(token, {
                 ...newProgress,
                 displayName: user.displayName // Optional: Update name on sync
             }).catch(err => console.error("Cloud Sync Failed:", err));
          });
        }
        return newProgress;
      });

    } else {
      setFeedback('error');
      setTimeout(() => setFeedback('idle'), 2000);
    }
  }, [currentPuzzle, userSolution, feedback, showHint, user]);

  return {
    currentPuzzle,
    userSolution,
    setUserSolution,
    submitSolution,
    feedback,
    progress,
    isLoading: gameState.loading,
    showHint,
    revealHint
  };
};