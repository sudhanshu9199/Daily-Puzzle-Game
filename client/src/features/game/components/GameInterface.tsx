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
  Sparkles,
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
    if (feedback === "success") {
      triggerSideCannons();
    }
  }, [feedback]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-[#414BEA] w-10 h-10" />
      </div>
    );
  }

  if (!currentPuzzle) {
    return (
      <div className="text-center text-[#F05537] p-6 font-medium bg-[#F6F5F5] rounded-2xl">
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
      <div className="text-[#F05537] font-medium text-center">
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
      <div className="bg-[#FFFFFF] p-5 rounded-[2rem] shadow-sm border border-[#C2D9FF] flex flex-col gap-5">
        {/* Top Row: Title and Counters */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-[#DDF2FD] text-[#190482] text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider border border-[#BFCFE7]">
              {currentPuzzle.type} Puzzle
            </span>
          </div>

          <div className="flex gap-5">
            <div className="flex items-center gap-1.5 text-[#F05537] font-bold bg-[#F6F5F5] px-3 py-1 rounded-full border border-[#F6F5F5]">
              <Flame
                className={progress.currentStreak > 0 ? "fill-[#F05537]" : ""}
              />
              <span className="text-[#222222]">{progress.currentStreak}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#7752FE] font-bold bg-[#F8EDFF] px-3 py-1 rounded-full border border-[#D9E2FF]">
              <Trophy size={18} />
              <span className="text-[#222222]">{progress.totalSolved}</span>
            </div>
          </div>
        </div>

        {/* Bottom Row: Heatmap (Full Width) */}
        <div className="pt-2 border-tborder-[#F6F5F5] w-full">
          <StreakHeatmap history={progress.history} />
        </div>
      </div>

      {/* 2. Puzzle Board (Animated) */}
      <motion.div
        key={currentPuzzle.id} // Re-animate when puzzle changes
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#FFFFFF] rounded-[2.5rem] shadow-md border border-[#D9E2FF] overflow-hidden min-h-[340px] flex flex-col relative"
      >
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#F8EDFF] to-transparent opacity-50 pointer-events-none" />
        <div className="p-10 text-center relative z-10">
          <h3 className="text-3xl md:text-4xl font-bold text-[#222222] leading-tight tracking-tight">
            {content.question}
          </h3>
        </div>
        <div className="flex-1 px-8 pb-8 flex flex-col items-center justify-center relative z-10">
          {/* Visual Placeholder */}
          <div className="opacity-10 text-8xl select-none font-black text-transparent bg-clip-text bg-gradient-to-tr from-[#414BEA] to-[#7752FE] transform -rotate-12 mb-6">
            {currentPuzzle.type === "math" && "∑"}
            {currentPuzzle.type === "word" && "ABC"}
            {currentPuzzle.type === "logic" && "IF"}
            {currentPuzzle.type === "spatial" && "⬡"}
            {currentPuzzle.type === "pattern" && "∞"}
          </div>

          <div className="text-center h-10 w-full">
            <motion.div layout>
              {!showHint ? (
                <button
                  onClick={revealHint}
                  className="group flex items-center justify-center gap-2 text-sm font-semibold text-[#525CEB] bg-[#DDF2FD] hover:bg-[#C2D9FF] transition-all px-4 py-2 rounded-xl mx-auto"
                >
                  <Sparkles className="w-4 h-4 text-[#7752FE] group-hover:rotate-12 transition-transform" />{" "}
                  Need a hint?
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-[#190482] font-medium bg-[#DDF2FD] px-4 py-2 rounded-xl border border-[#BFCFE7] inline-flex items-center gap-2 shadow-sm"
                >
                  <HelpCircle className="w-4 h-4 text-[#414BEA]" />
                  {currentPuzzle.hint}
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* 3. Input Controls */}
      <div className="bg-[#FFFFFF] p-3 rounded-[1.5rem] shadow-xl border border-[#D9E2FF] sticky bottom-6 z-20">
        <div className="flex gap-2 relative">
          <input
            type="text"
            value={userSolution}
            onChange={(e) => setUserSolution(e.target.value)}
            placeholder="Answer..."
            disabled={feedback === "success"}
            onKeyDown={(e) => e.key === "Enter" && submitSolution()}
            className="flex-1 p-4 pl-6 w-45 rounded-2xl bg-[#F6F5F5] border-2 border-[#F6F5F5] text-[#222222] placeholder:text-[#BFCFE7] focus:bg-[#FFFFFF] focus:border-[#414BEA] focus:outline-none font-bold text-lg transition-all"
          />
          <button
            onClick={submitSolution}
            disabled={!userSolution || feedback === "success"}
            className={`px-8 rounded-2xl font-bold text-white transition-all shadow-md active:scale-95 flex items-center gap-2
              ${feedback === "success" 
                ? "bg-[#525CEB]" // Using palette 'success' tone
                : feedback === "error" 
                  ? "bg-[#F05537]" // Using palette 'error' tone
                  : "bg-[#414BEA] hover:bg-[#190482]" // Primary Blue -> Dark Blue
              }
              ${(!userSolution && feedback !== "success") ? "opacity-50 cursor-not-allowed" : "opacity-100"}
            `}
          >
            {feedback === "success" ? (
              <CheckCircle className="w-6 h-6" />
            ) : feedback === "error" ? (
              <XCircle className="w-6 h-6" />
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
