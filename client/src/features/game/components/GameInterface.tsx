// src/features/game/components/GameInterface.tsx
import { useGameLogic } from "../hooks/useGameLogic";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export const GameInterface = () => {
  const { 
    currentPuzzle, 
    userSolution, 
    setUserSolution, 
    submitSolution, 
    feedback, 
    isLoading 
  } = useGameLogic();

  if (isLoading) {
    return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;
  }

  if (!currentPuzzle) {
    return <div className="text-center p-10 text-red-500">Failed to load puzzle.</div>;
  }

  // Parse content safely
  const puzzleContent = JSON.parse(currentPuzzle.content);

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      {/* Header / Date */}
      <div className="text-center">
        <span className="text-xs font-bold tracking-wider text-blue-500 uppercase">Daily Challenge</span>
        <h2 className="text-2xl font-bold text-slate-800">{currentPuzzle.date}</h2>
      </div>

      {/* Puzzle Display Area */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-h-[200px] flex flex-col items-center justify-center">
        <p className="text-xl font-medium text-slate-700 mb-4">{puzzleContent.question}</p>
        
        {/* Placeholder for Game Board / Tiles */}
        <div className="p-4 bg-slate-50 rounded-lg w-full text-center text-slate-400 text-sm">
           (Visual Puzzle Grid will go here in Phase 3)
        </div>
      </div>

      {/* Input Area */}
      <div className="space-y-3">
        <input
          type="text"
          value={userSolution}
          onChange={(e) => setUserSolution(e.target.value)}
          placeholder="Enter your answer..."
          className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors text-lg text-center"
          disabled={feedback === 'success'}
        />
        
        <button
          onClick={submitSolution}
          disabled={!userSolution || feedback === 'success'}
          className={`w-full p-4 rounded-xl font-bold text-white transition-all transform active:scale-95
            ${feedback === 'success' ? 'bg-green-500' : 
              feedback === 'error' ? 'bg-red-500' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {feedback === 'success' ? (
            <span className="flex items-center justify-center gap-2"><CheckCircle /> Solved!</span>
          ) : feedback === 'error' ? (
            <span className="flex items-center justify-center gap-2"><XCircle /> Try Again</span>
          ) : (
            "Submit Answer"
          )}
        </button>
      </div>
    </div>
  );
};