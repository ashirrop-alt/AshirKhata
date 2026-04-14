import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Link } from 'react-router-dom';
// Eye icons import karein
import { Eye, EyeOff } from 'lucide-react'; 

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  // Password dikhane ke liye state
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else window.location.href = '/';
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-50 text-slate-900">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-xl border border-slate-100 transition-all">

        {/* Logo Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black tracking-tighter">
            Khati<span className="text-indigo-600">fy</span>
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">
            Welcome back! Sign in to continue.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
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
            <div className="flex justify-between items-center px-1">
              <label className="text-sm font-bold text-slate-700">Password</label>
              <button
                type="button"
                onClick={() => alert("Password reset feature jald aa raha hai! Filhal naya account bana lein ya purana password yaad karein. 😊")}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline transition-all active:scale-95"
              >
                Forgot?
              </button>
            </div>
            
            {/* Input ke sath Eye Icon ki wrapper div */}
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="h-12 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all rounded-xl pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-95"
          >
            {loading ? 'Sabar karein...' : 'Sign In →'}
          </Button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-3 text-slate-400 font-semibold tracking-widest">OR</span></div>
        </div>

        <p className="text-center text-sm text-slate-600 font-medium">
          No account?{' '}
          <Link
            to="/signup"
            className="text-indigo-600 font-bold hover:underline ml-1 cursor-pointer"
          >
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}