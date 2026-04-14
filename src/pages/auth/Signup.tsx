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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-50 text-slate-900">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-xl border border-slate-100 transition-all">
        
        {/* Logo & Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black tracking-tighter">
            Khati<span className="text-indigo-600">fy</span>
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">
            Create your free account in seconds.
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
            <Input
              type="email"
              placeholder="you@example.com"
              className="h-12 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all rounded-xl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">Password (min. 6 chars)</label>
            <Input
              type="password"
              placeholder="••••••••"
              className="h-12 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all rounded-xl"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button 
            disabled={loading} 
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all mt-2 active:scale-95"
          >
            {loading ? 'Account ban raha hai...' : 'Create Free Account →'}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-100"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-slate-400 font-semibold tracking-widest">OR</span>
          </div>
        </div>

        {/* Link back to Login */}
        <p className="text-center text-sm text-slate-600 font-medium">
          Already have an account?{' '}
          <Link 
            to="/login" 
            className="text-indigo-600 font-bold hover:underline ml-1 cursor-pointer"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}