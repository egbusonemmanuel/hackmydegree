// src/App.js
// ─────────────────────────────────────────────────────
// Install dependencies:
// npm install @supabase/supabase-js react-router-dom
// ─────────────────────────────────────────────────────
import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { getProfile, onAuthChange, signOut } from './lib/supabase';

// Page imports
import AuthPage from './pages/AuthPage';
import UploadPage from './pages/UploadPage';
import BookingPage from './pages/BookingPage';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import ResourcesPage from './pages/ResourcesPage';
import ResourceDetailPage from './pages/ResourceDetailPage';
import TutorsPage from './pages/TutorsPage';
import LegalPage from './pages/LegalPage';
import TutorRegistrationPage from './pages/TutorRegistrationPage';

// Component imports
import Navbar from './components/Navbar';
import PageLoader from './components/PageLoader';

// ─── THEME CONTEXT ─────────────────────────────────────
const ThemeContext = React.createContext();
export const useTheme = () => React.useContext(ThemeContext);

// ─── AUTH CONTEXT ─────────────────────────────────────
export const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[Auth] Provider mounted, initializing listener...');
    let mounted = true;

    // Safety timeout: if Supabase fails to respond within 7s, stop the loading screen
    const backupTimeout = setTimeout(() => {
      setLoading(currentLoading => {
        if (currentLoading && mounted) {
          console.warn('[Auth Debug] Timeout reached (12s). Profile might still be loading...');
          return false;
        }
        return currentLoading;
      });
    }, 12000);

    const { data: { subscription } } = onAuthChange(async (event, session) => {
      console.log('[Auth] Event received:', event, session?.user?.email);
      if (!mounted) return;

      setUser(session?.user ?? null);
      setSession(session ?? null);
      if (session?.user) {
        try {
          const { data } = await getProfile(session.user.id);
          if (mounted) {
            setProfile(data);
          }
        } catch (err) {
          console.error('[Auth] Profile load error:', err);
        }
      } else {
        setProfile(null);
      }

      if (mounted) {
        setLoading(false);
        clearTimeout(backupTimeout);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(backupTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = async () => {
    if (user) {
      const { data } = await getProfile(user.id);
      setProfile(data);
    }
  };

  const handleProviderSignOut = async () => {
    console.log('[Auth] Provider signOut triggered - clearing state immediately');

    // Clear state IMMEDIATELY for instant UI feedback
    setUser(null);
    setSession(null);
    setProfile(null);
    localStorage.removeItem('supabase.auth.token'); // Safety clear

    try {
      await signOut();
      console.log('[Auth] Provider signOut library call finished');
    } catch (err) {
      console.error('[Auth] Provider signOut library error:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, refreshProfile, signOut: handleProviderSignOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// ─── THEME PROVIDER ──────────────────────────────────
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = React.useState(() => localStorage.getItem('theme') || 'dark');

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ─── PAGES INSTANTIATED FROM IMPORTS ───────────────────────────────

// ─── APP ─────────────────────────────────────────────
export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppInner />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

const AppInner = () => {
  const { session, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.split('/')[1];
    const baseTitle = 'HackMyDegree';
    if (!path) document.title = `${baseTitle} — Ace Every Exam.`;
    else {
      const formatted = path.charAt(0).toUpperCase() + path.slice(1);
      document.title = `${formatted} | ${baseTitle}`;
    }
    window.scrollTo(0, 0);
  }, [location]);

  if (loading) return <PageLoader />;
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main key={location.pathname} className="animate-fade-in" style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={!session ? <AuthPage /> : <Navigate to="/dashboard" />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/resources/:id" element={<ResourceDetailPage />} />
          <Route path="/tutors" element={<TutorsPage />} />
          <Route path="/legal" element={<LegalPage />} />
          <Route path="/upload" element={session ? <UploadPage /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={session ? <DashboardPage /> : <Navigate to="/login" />} />
          <Route path="/book/:tutorId" element={session ? <BookingPage /> : <Navigate to="/login" />} />
          <Route path="/become-a-tutor" element={session ? <TutorRegistrationPage /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
};
