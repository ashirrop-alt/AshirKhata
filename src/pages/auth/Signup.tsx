import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Link } from 'react-router-dom';
// Icons import karein (agar install nahi hai toh text button bhi use kar sakte hain)
import { Eye, EyeOff } from 'lucide-react'; 

export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Naya state password dikhane ke liye
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords aapas mein nahi mil rahe!");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });

    if (error) alert("Error: " + error.message);
    else {
      alert("Account ban gaya!");
      window.location.href = '/login';
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-50 text-slate-900 overflow-y-auto sm:overflow-hidden">
      <div className="w-full max-w-md p-6 sm:p-8 bg-white rounded-3xl shadow-xl border border-slate-100 transition-all my-4 sm:my-0">
        
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tighter">
            Khati<span className="text-indigo-600">fy</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Create your free account in seconds.
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-3 sm:space-y-4">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 ml-1">Full Name</label>
            <Input
              type="text"
              placeholder="e.g. Rahul Sharma"
              className="h-10 sm:h-12 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all rounded-xl text-sm"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 ml-1">Email Address</label>
            <Input
              type="email"
              placeholder="you@example.com"
              className="h-10 sm:h-12 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all rounded-xl text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password with Eye Icon */}
          <div className="space-y-1 relative">
            <label className="text-xs font-bold text-slate-700 ml-1">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="h-10 sm:h-12 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all rounded-xl text-sm pr-10"
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

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 ml-1">Confirm Password</label>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="h-10 sm:h-12 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all rounded-xl text-sm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <Button 
            disabled={loading} 
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-700 h-10 sm:h-12 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all mt-4 active:scale-95 text-sm sm:text-base"
          >
            {loading ? 'Sabar karein...' : 'Create Free Account →'}
          </Button>
        </form>

        <div className="relative my-6 sm:my-8">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
          <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-white px-3 text-slate-400 font-semibold tracking-widest">OR</span></div>
        </div>

        <p className="text-center text-xs sm:text-sm text-slate-600 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-bold hover:underline ml-1">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}