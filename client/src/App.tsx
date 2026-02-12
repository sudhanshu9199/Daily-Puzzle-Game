// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PageLoader } from './components/ui/Loader';
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from './components/PageTransition';
import { ApiService } from './services/apiServices';

const Home = lazy(() => import('./pages/Home'));
const AuthPage = lazy(() => import('./pages/Auth'));

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

  const { user } = useAuth();

  // Global Sync Logic: Runs whenever the user logs in
  useEffect(() => {
    if (user) {
      ApiService.syncProgress(user.uid, {
        email: user.email,
        displayName: user.displayName, // Send display name too
        currentStreak: 5, // Example data
        history: {} 
      })
      .then((res) => console.log("Sync success:", res))
      .catch((err) => console.error("Sync failed:", err));
    }
  }, [user]);
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
         {/* Route definitions... */}
         <Route element={<PublicRoute />}>
            <Route path="/auth" element={
              <PageTransition><AuthPage /></PageTransition>
            } />
         </Route>

         <Route element={<ProtectedRoute />}>
            <Route path="/" element={
              <PageTransition><Home /></PageTransition>
            } />
         </Route>

         <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans overflow-x-hidden">
        <Suspense fallback={<PageLoader />}>
          <AnimatedRoutes />
        </Suspense>
      </div>
    </BrowserRouter>
  )
}

export default App;