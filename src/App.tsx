import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { Toaster } from "sonner";
import ActivityLog from './pages/ActivityLog';
import { ThemeProvider } from "./components/theme-provider";
import PublicCustomerView from './components/PublicCustomerView';

import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Index from './pages/Index';

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Khatify";
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return null;

  return (
    // --- Step 3: ThemeProvider se poori app ko wrap kar diya ---
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <BrowserRouter>
        <Toaster
          richColors
          position={window.innerWidth > 640 ? "bottom-right" : "bottom-center"}
          visibleToasts={1}
        />

        <Routes>
          {/* 1. Ye hai wo PUBLIC route jo bina login ke khulega */}
          <Route path="/view/:shareId" element={<PublicCustomerView />} />

          {/* 2. Auth Routes */}
          <Route path="/login" element={!session ? <Login /> : <Navigate to="/" />} />
          <Route path="/signup" element={!session ? <Signup /> : <Navigate to="/" />} />

          {/* 3. Protected Routes (Jo sirf login ke baad khulein) */}
          <Route path="/" element={session ? <Index /> : <Navigate to="/login" />} />
          <Route path="/customer/:id" element={session ? <Index /> : <Navigate to="/login" />} />
          <Route path="/activity" element={session ? <ActivityLog /> : <Navigate to="/login" />} />

          {/* 4. Catch-all (Ye hamesha AKHIR mein honi chahiye) */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;