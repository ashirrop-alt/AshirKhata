import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Link } from 'react-router-dom';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Account ban gaya! Ab aap login kar sakte hain.");
      window.location.href = '/login';
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-2">Naya Account</h2>
        <h1 className="text-3xl font-black text-center text-primary tracking-tight">
          Khatify
        </h1>
        <p className="text-center text-muted-foreground mt-1 mb-8">
          Apna digital khata shuru karein
        </p>

        <form onSubmit={handleSignup} className="space-y-4">
          <Input
            type="email"
            placeholder="Email likhein"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password rakhein"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button disabled={loading} type="submit" className="w-full bg-indigo-600 h-12 text-lg mt-4">
            {loading ? 'Account ban raha hai...' : 'Register Karein'}
          </Button>
        </form>
        <p className="text-center mt-6 text-slate-600 text-sm">
          Pehle se account hai? <Link title="Login" to="/login" className="text-indigo-600 font-bold">Login Karein</Link>
        </p>
      </div>
    </div>
  );
}