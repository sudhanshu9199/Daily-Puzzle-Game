// src/pages/Home.tsx
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-8 p-4">
      <h1 className="text-5xl font-extrabold text-blue-600 tracking-tight">
        Daily Puzzle
      </h1>
      <p className="text-slate-500 text-lg text-center max-w-md">
        Solve a new challenge every day. Keep your streak alive! 🔥
      </p>
      
      <Link 
        to="/auth" 
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105"
      >
        <Play size={20} fill="currentColor" />
        Start Playing
      </Link>
    </div>
  );
}