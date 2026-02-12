// src/services/firebaseServices.ts
import { initializeApp, type FirebaseApp, getApp, getApps } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  type User,
  type Auth
} from "firebase/auth";

// Strict type checking for env variables to prevent runtime crashes
const getEnvVar = (key: string): string => {
  const value = import.meta.env[key];
  if (!value) {
    console.error(`CRITICAL ERROR: Missing environment variable ${key}`);
    throw new Error(`Missing env var: ${key}`);
  }
  return value;
};

const firebaseConfig = {
  apiKey: getEnvVar("VITE_FIREBASE_API_KEY"),
  authDomain: getEnvVar("VITE_FIREBASE_AUTH_DOMAIN"),
  projectId: getEnvVar("VITE_FIREBASE_PROJECT_ID"),
  storageBucket: getEnvVar("VITE_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: getEnvVar("VITE_FIREBASE_MESSAGING_SENDER_ID"),
  appId: getEnvVar("VITE_FIREBASE_APP_ID"),
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth: Auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Service Object
export const AuthService = {
  loginWithGoogle: async (): Promise<User> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error: any) {
      console.error("Auth Error:", error.code, error.message);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    return signOut(auth);
  },

  subscribe: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  },

  getCurrentUser: (): User | null => {
    return auth.currentUser;
  }
};