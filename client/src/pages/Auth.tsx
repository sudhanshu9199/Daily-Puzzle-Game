// src/pages/Auth.tsx
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LogIn,Loader2 } from 'lucide-react';

export default function Auth() {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Redirect to Home if already logged in
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await signIn();
    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-xl border border-slate-100">
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
            Daily Puzzle
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Sign in to track your stats and keep your streak alive.
          </p>
        </div>

        <button
          onClick={handleLogin}
          disabled={isLoggingIn}
          className="group relative flex w-full justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-all hover:bg-blue-700 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoggingIn ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <LogIn className="mr-2 h-5 w-5" />
          )}
          {isLoggingIn ? 'Signing in...' : 'Sign in with Google'}
        </button>
      </div>
    </div>
  );
}