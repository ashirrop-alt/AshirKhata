import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';

// 1. Pages ko mangwana (Imports)
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Index from './pages/Index';

function App() {
  // 2. Auth State Check: Yeh check karta hai banda login hai ya nahi
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

  // 3. Routing: Faisla karna ke kaunsa page dikhana hai
  // ... baki imports wese hi rahenge

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!session ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!session ? <Signup /> : <Navigate to="/" />} />

        {/* Main Home Page */}
        <Route path="/" element={session ? <Index /> : <Navigate to="/login" />} />

        {/* Naya Dynamic Route: Refresh karne par ye ID app ko batayegi kahan jana hai */}
        <Route path="/customer/:id" element={session ? <Index /> : <Navigate to="/login" />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;