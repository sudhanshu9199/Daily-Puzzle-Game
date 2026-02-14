// src/pages/Home.tsx
import { GameInterface } from '../features/game/components/GameInterface';
import { useAuth } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';

export default function Home() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen pb-20">
      {/* Simple Header */}
      <nav className="bg-[#FFFFFF]/80 backdrop-blur-md border-b border-[#D9E2FF] px-6 py-4 flex justify-between items-center sticky top-0 z-50 transition-all">
        <div className="font-bold text-2xl tracking-tighter flex items-center gap-1">
            <span className="text-[#414BEA]">Puzzle</span>
            <span className="text-[#222222]">Day</span>
        </div>

        <div className="flex items-center gap-4">
            {user?.displayName && (
              <div className="hidden sm:flex items-center gap-2 bg-[#F6F5F5] px-3 py-1.5 rounded-full border border-[#BFCFE7]">
                <User size={14} className="text-[#414BEA]" />
                <span className="text-xs font-bold text-[#3D3B40] uppercase tracking-wide">{user.displayName}</span>
              </div>
            )}
            <button 
                onClick={signOut}
                className="text-sm font-bold text-[#3D3B40] hover:text-[#F05537] transition-colors flex items-center gap-1"
            >
                <LogOut size={16} />
                <span className="hidden sm:inline">Sign Out</span>
            </button>
        </div>
      </nav>

      {/* Game Container */}
      <main className="container mx-auto max-w-lg mt-2 px-4">
        <GameInterface />
      </main>
    </div>
  );
}