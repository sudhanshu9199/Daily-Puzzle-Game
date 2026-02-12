// src/features/game/components/GameInterface.tsx
import { useGameLogic } from "../hooks/useGameLogic";
import { Loader2, CheckCircle, XCircle, Flame, Trophy } from "lucide-react";

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
    revealHint
    // ...rest,
  } = useGameLogic();

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
    <div className="max-w-2xl mx-auto p-4 space-y-6 animate-in fade-in duration-500">
      {/* 1. Header & Stats */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Daily Challenge
            </h2>
            <div className="text-xs text-slate-400 uppercase tracking-wider">
              {currentPuzzle.type} Puzzle
            </div>
          </div>
          <p className="text-slate-500 text-sm">{currentPuzzle.date}</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-1 text-orange-500 font-bold">
            <Flame
              className={progress.currentStreak > 0 ? "fill-orange-500" : ""}
            />
            <span>{progress.currentStreak}</span>
          </div>
          <div className="flex items-center gap-1 text-yellow-600 font-bold">
            <Trophy />
            <span>{progress.totalSolved}</span>
          </div>
        </div>
      </div>

      {/* 2. Puzzle Board */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden min-h-[300px] flex flex-col">
        {/* Question Area */}
        <div className="bg-slate-50 p-8 text-center border-b border-slate-100">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wide mb-3">
            {currentPuzzle.type}
          </span>
          <h3 className="text-3xl font-medium text-slate-800 leading-tight">
            {content.question}
          </h3>
        </div>

        <div className="text-center mt-4 h-8">
          {!showHint ? (
            <button
              onClick={revealHint}
              className="text-sm text-blue-500 hover:underline"
            >
              Need a hint?
            </button>
          ) : (
            <p className="text-sm text-slate-500 animate-in fade-in">
              💡 Hint: {currentPuzzle.hint}
            </p>
          )}
        </div>

        {/* Visual Puzzle Area (Placeholder for Phase 3 Grid) */}
        <div className="flex-1 p-8 flex items-center justify-center bg-slate-50/50">
          {currentPuzzle.type === "color" ? (
            <div className="w-32 h-32 rounded bg-blue-500" />
          ) : (
            <div className="text-slate-400 font-mono text-sm">
              {/* Show visual hint if available, else generic icon */}
              {currentPuzzle.type.toUpperCase()} VISUAL
            </div>
          )}
        </div>
      </div>

      {/* 3. Input Controls */}
      <div className="bg-white p-4 rounded-2xl shadow-lg border border-slate-100 sticky bottom-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={userSolution}
            onChange={(e) => setUserSolution(e.target.value)}
            placeholder="Enter your answer..."
            disabled={feedback === "success"}
            onKeyDown={(e) => e.key === "Enter" && submitSolution()}
            className="flex-1 p-4 rounded-xl bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:bg-white focus:outline-none transition-all font-medium text-lg"
          />
          <button
            onClick={submitSolution}
            disabled={!userSolution || feedback === "success"}
            className={`px-8 rounded-xl font-bold text-white transition-all active:scale-95 flex items-center gap-2
                ${
                  feedback === "success"
                    ? "bg-green-500"
                    : feedback === "error"
                      ? "bg-red-500"
                      : "bg-blue-600 hover:bg-blue-700"
                }`}
          >
            {feedback === "success" ? (
              <span className="flex justify-center items-center gap-2">
                <CheckCircle /> Solved
              </span>
            ) : feedback === "error" ? (
              <span className="flex justify-center items-center gap-2">
                <XCircle /> Try Again
              </span>
            ) : (
              "Submit Answer"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
