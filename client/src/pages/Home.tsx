// src/pages/Home.tsx
import { GameInterface } from '../features/game/components/GameInterface';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      {/* Top Bar */}
      <header className="px-4 py-4 flex justify-between items-center bg-white border-b border-slate-100">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">DP</div>
           <span className="font-bold text-slate-700 hidden sm:block">Daily Puzzle</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500 hidden sm:block">Welcome, {user?.displayName || 'Player'}</span>
          <button 
            onClick={() => signOut()}
            className="text-sm text-red-500 hover:text-red-600 font-medium"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="mt-6">
        <GameInterface />
      </main>
    </div>
  );
}