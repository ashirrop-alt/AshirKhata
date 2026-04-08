import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { Toaster } from "sonner"; // Step 1: Import Toaster

// 1. Pages ko mangwana (Imports)
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Index from './pages/Index';

function App() {
  // 2. Auth State Check
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Current session check karein
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Login ya Logout hone par status update karein
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Jab tak check ho raha ho, screen khali rakho
  if (loading) return null;

  return (
    <BrowserRouter>
      {/* Step 2: Toaster ko yahan rakha hai taake ye har page ke upar dikh sake */}
      <Toaster richColors position="top-center" /> 

      <Routes>
        <Route path="/login" element={!session ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!session ? <Signup /> : <Navigate to="/" />} />

        {/* Main Home Page */}
        <Route path="/" element={session ? <Index /> : <Navigate to="/login" />} />

        {/* Naya Dynamic Route */}
        <Route path="/customer/:id" element={session ? <Index /> : <Navigate to="/login" />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;