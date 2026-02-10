// src/pages/Auth.tsx
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { LogIn } from 'lucide-react';

export default function Auth() {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();

  // Redirect to Home if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    try {
      await signIn();
    } catch (error) {
      alert("Failed to log in. Check console for details.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h2>
        <p className="text-slate-500 mb-8">Sign in to save your daily puzzle progress.</p>
        
        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white py-3 px-4 rounded-xl font-semibold hover:bg-slate-800 transition-all transform hover:scale-[1.02]"
        >
          <LogIn size={20} />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}