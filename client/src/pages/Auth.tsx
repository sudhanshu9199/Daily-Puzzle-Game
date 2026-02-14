// src/pages/Auth.tsx
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LogIn,Loader2, Puzzle } from 'lucide-react';

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
    <div className="flex h-screen w-full items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[#D9E2FF] rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-[#BFCFE7] rounded-full blur-3xl opacity-30" />

      <div className="w-full max-w-md space-y-8 rounded-[2.5rem] bg-[#FFFFFF] p-10 shadow-xl border border-[#D9E2FF] relative z-10">
        <div className="text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-[#DDF2FD] rounded-2xl flex items-center justify-center mb-6 rotate-3">
             <Puzzle className="w-8 h-8 text-[#414BEA]" />
          </div>
          <h2 className="text-4xl font-extrabold text-[#222222] tracking-tight">
            Daily<span className="text-[#414BEA]">Puzzle</span>
          </h2>
          <p className="mt-3 text-[#3D3B40] font-medium">
            Challenge your mind, every single day.
          </p>
        </div>

        <button
          onClick={handleLogin}
          disabled={isLoggingIn}
          className="group relative flex w-full justify-center rounded-2xl bg-[#414BEA] px-4 py-4 text-base font-bold text-white transition-all hover:bg-[#190482] hover:shadow-lg hover:shadow-[#414BEA]/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
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