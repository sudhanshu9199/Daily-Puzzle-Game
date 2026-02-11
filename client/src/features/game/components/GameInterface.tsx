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
    progress 
  } = useGameLogic();

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-blue-500 w-8 h-8" /></div>;
  }

  if (!currentPuzzle) {
    return <div className="text-center text-red-500 p-4">Error loading puzzle. Please refresh.</div>;
  }

  const content = JSON.parse(currentPuzzle.content);

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6 animate-in fade-in duration-500">
      
      {/* 1. Header & Stats */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Daily Challenge</h2>
            <p className="text-slate-500 text-sm">{currentPuzzle.date}</p>
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

        {/* Visual Puzzle Area (Placeholder for Phase 3 Grid) */}
        <div className="flex-1 p-8 flex items-center justify-center bg-slate-50/50">
             {/* This is where your Grid/Tile components will live later */}
             <div className="w-full max-w-sm h-48 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400">
                Visual Puzzle Content Area
             </div>
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
              disabled={feedback === 'success'}
              onKeyDown={(e) => e.key === 'Enter' && submitSolution()}
              className="flex-1 p-4 rounded-xl bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:bg-white focus:outline-none transition-all font-medium text-lg"
            />
            <button
              onClick={submitSolution}
              disabled={!userSolution || feedback === 'success'}
              className={`px-8 rounded-xl font-bold text-white transition-all active:scale-95 flex items-center gap-2
                ${feedback === 'success' ? 'bg-green-500' : 
                  feedback === 'error' ? 'bg-red-500' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {feedback === 'success' ? <CheckCircle /> : feedback === 'error' ? <XCircle /> : "Submit"}
            </button>
        </div>
      </div>
    </div>
  );
};