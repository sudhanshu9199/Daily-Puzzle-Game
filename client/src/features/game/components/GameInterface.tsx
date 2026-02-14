// src/features/game/components/GameInterface.tsx
import { useEffect } from "react";
import { triggerSideCannons } from "../../../utils/confetti.utils";
import { useGameLogic } from "../hooks/useGameLogic";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Flame,
  Trophy,
  HelpCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { StreakHeatmap } from "./StreakHeatmap";

export const GameInterface = () => {
  const {
    currentPuzzle,
    userSolution,
    setUserSolution,
    submitSolution,
    feedback,
    isLoading,
    progress,
    showHint,
    revealHint,
    // ...rest,
  } = useGameLogic();

  useEffect(() => {
    if (feedback === 'success') {
      triggerSideCannons();
    }
  }, [feedback]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-blue-500 w-8 h-8" />
      </div>
    );
  }

  if (!currentPuzzle) {
    return (
      <div className="text-center text-red-500 p-4">
        Error loading puzzle. Please refresh.
      </div>
    );
  }

  let content;
  try {
    content = JSON.parse(currentPuzzle.content);
  } catch (error) {
    console.error("Puzzle Content Error:", error);
    return (
      <div className="text-red-500">
        Error loading puzzle data. Clear cache.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-4 space-y-6"
    >
      {/* 1. Header & Stats */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4">
        
        {/* Top Row: Title and Counters */}
        <div className="flex justify-between items-center">
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">
                {currentPuzzle.type} Puzzle
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex items-center gap-1 text-orange-500 font-bold">
                <Flame className={progress.currentStreak > 0 ? "fill-orange-500" : ""} />
                <span>{progress.currentStreak}</span>
              </div>
              <div className="flex items-center gap-1 text-yellow-600 font-bold">
                <Trophy />
                <span>{progress.totalSolved}</span>
              </div>
            </div>
        </div>

        {/* Bottom Row: Heatmap (Full Width) */}
        <div className="pt-2 border-t border-slate-50 w-full">
            <StreakHeatmap history={progress.history} /> 
        </div>

      </div>

      {/* 2. Puzzle Board (Animated) */}
      <motion.div
        key={currentPuzzle.id} // Re-animate when puzzle changes
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden min-h-[300px] flex flex-col"
      >
        <div className="bg-slate-50 p-8 text-center border-b border-slate-100">
          <h3 className="text-3xl font-medium text-slate-800 leading-tight">
            {content.question}
          </h3>
        </div>
        <div className="flex-1 p-8 flex flex-col items-center justify-center bg-slate-50/50">
          {/* Visual Placeholder */}
          <div className="opacity-20 text-6xl select-none">
            {currentPuzzle.type === "math" && "∑"}
            {currentPuzzle.type === "word" && "ABC"}
            {currentPuzzle.type === "logic" && "IF"}
            {currentPuzzle.type === "spatial" && "⬡"}
            {currentPuzzle.type === "pattern" && "∞"}
          </div>

          <div className="mt-8 text-center h-8">
            {!showHint ? (
              <button
                onClick={revealHint}
                className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-600 transition-colors mx-auto"
              >
                <HelpCircle className="w-4 h-4" /> Need a hint?
              </button>
            ) : (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-slate-600 font-medium bg-yellow-50 px-3 py-1 rounded-lg border border-yellow-100 inline-block"
              >
                💡 Hint: {currentPuzzle.hint}
              </motion.p>
            )}
          </div>
        </div>
      </motion.div>

      {/* 3. Input Controls */}
      <div className="bg-white p-4 rounded-2xl shadow-lg border border-slate-100 sticky bottom-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={userSolution}
            onChange={(e) => setUserSolution(e.target.value)}
            placeholder="Answer..."
            disabled={feedback === "success"}
            onKeyDown={(e) => e.key === "Enter" && submitSolution()}
            className="flex-1 p-4 rounded-xl bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:outline-none font-medium text-lg"
          />
          <button
            onClick={submitSolution}
            disabled={!userSolution || feedback === "success"}
            className={`px-8 rounded-xl font-bold text-white transition-all ${feedback === "success" ? "bg-green-500" : feedback === "error" ? "bg-red-500" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {feedback === "success" ? (
              <CheckCircle />
            ) : feedback === "error" ? (
              <XCircle />
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
