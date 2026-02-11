// src/pages/Home.tsx
import { GameInterface } from '../features/game/components/GameInterface';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Simple Header */}
      <nav className="bg-white border-b border-slate-100 px-4 py-3 flex justify-between items-center sticky top-0 z-10">
        <div className="font-bold text-xl tracking-tight text-blue-600">
            Puzzle<span className="text-slate-900">Day</span>
        </div>
        <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 hidden sm:inline">{user?.displayName}</span>
            <button 
                onClick={signOut}
                className="text-sm font-medium text-slate-500 hover:text-red-500 transition-colors"
            >
                Sign Out
            </button>
        </div>
      </nav>

      {/* Game Container */}
      <main className="container mx-auto max-w-lg mt-6">
        <GameInterface />
      </main>
    </div>
  );
}