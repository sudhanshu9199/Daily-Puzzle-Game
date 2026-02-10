// src/services/firebaseServices.ts
import { initializeApp, FirebaseApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User,
  Auth
} from "firebase/auth";

// Strict type checking for env variables to prevent runtime crashes
const getEnvVar = (key: string): string => {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
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
};

// Initialize Firebase only once
let app: FirebaseApp;
let auth: Auth;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
} catch (error) {
  console.error("Firebase initialization error:", error);
}

const googleProvider = new GoogleAuthProvider();

// Service Object
export const AuthService = {
  loginWithGoogle: async (): Promise<User> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error: any) {
      console.error("Auth Error:", error);
      throw new Error(error.message || "Login failed");
    }
  },

  logout: async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message || "Logout failed");
    }
  },

  subscribe: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  },

  getCurrentUser: (): User | null => {
    return auth.currentUser;
  }
};