// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { AuthService } from '../services/firebaseServices';
import { StorageService } from '../services/storageServices';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const unsubscribe = AuthService.subscribe(async (currentUser) => {
            setUser(currentUser);
            setLoading(false);
      
      if (currentUser) {
        await StorageService.setItem('user_profile', {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName
        });
      }
      
    });
    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    await AuthService.loginWithGoogle();
  };

  const signOut = async () => {
    await AuthService.logout();
    await StorageService.clearUserData(); // Privacy: Clear local data on logout
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};