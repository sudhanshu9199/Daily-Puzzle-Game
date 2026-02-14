// src/App.tsx
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { PageLoader } from "./components/ui/Loader";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "./components/PageTransition";
import { ApiService } from "./services/apiServices";
import { StorageService } from "./services/storageServices";

const Home = lazy(() => import("./pages/Home"));
const AuthPage = lazy(() => import("./pages/Auth"));

const DataSyncer = () => {
  const { user } = useAuth();

  // Global Sync Logic: Runs whenever the user logs in
  useEffect(() => {
    const syncData = async () => {
      if (user) {
        try {
          const token = await user.getIdToken();

          const localData = await StorageService.getItem<any>('user_progress', 'user');

          const payload = {
            displayName: user.displayName,
            // Required fields: Use local data OR default to 0 (Fixes 400 Error)
            currentStreak: localData?.currentStreak || 0,
            maxStreak: localData?.maxStreak || 0,
            totalSolved: localData?.totalSolved || 0,
            // Optional fields
            history: localData?.history || {},
            lastPlayedDate: localData?.lastPlayedDate || null,
          };

          await ApiService.syncProgress(token, payload);
          console.log("Sync success ✅");
        } catch (err) {
          console.error("Sync failed ❌:", err);
        }
      }
    };
    syncData();
  }, [user]);
  return null;
};

// 1. Only allow access if user is logged in
const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  return user ? <Outlet /> : <Navigate to="/auth" replace />;
};

// 2. Only allow access if user is logged OUT (prevent login page loop)
const PublicRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  return user ? <Navigate to="/" replace /> : <Outlet />;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Route definitions... */}
        <Route element={<PublicRoute />}>
          <Route
            path="/auth"
            element={
              <PageTransition>
                <AuthPage />
              </PageTransition>
            }
          />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route
            path="/"
            element={
              <PageTransition>
                <Home />
              </PageTransition>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <BrowserRouter>
      <DataSyncer />
      <div className="min-h-screen bg-[#F6F5F5] text-[#222222] font-sans overflow-x-hidden relative">
        <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#D9E2FF]/40 via-transparent to-transparent opacity-70" />
        <div className="relative z-10">
          <Suspense fallback={<PageLoader />}>
            <AnimatedRoutes />
          </Suspense>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
