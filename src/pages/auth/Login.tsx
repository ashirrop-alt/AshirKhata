import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from "sonner";

export default function Login() {
  const [phone, setPhone] = useState(''); // Mobile number login state
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Login par default hidden hi behtar hai

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formattedEmail = `${phone.trim()}@khatify.local`;

    const { error } = await supabase.auth.signInWithPassword({
      email: formattedEmail,
      password
    });

    if (error) {
      // Purana alert khatam, naya professional toast chalu!
      toast.error("Mobile number ya password theek nahi hai!");
    } else {
      window.location.href = '/';
    }
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
            Khush Aamdeed! Log in karke apna khata chalayein.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Mobile Number Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">Mobile Number</label>
            <Input
              type="tel"
              placeholder="03001234567"
              className="h-12 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all rounded-xl"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          {/* Password Field with Custom Support Trigger */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-sm font-bold text-slate-700">Password</label>
              {/* WhatsApp Help Intent link— 100% Free aur Reliable */}
              <a
                href={`whatsapp://send?phone=923172428057&text=Hi%20Khatify%20Support%2C%20main%20apna%20password%20bhool%20gaya%20hoon.%20Mera%20number%20${phone || '_______'}%20hai.%20Help%20kardein.`}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline transition-all active:scale-95"
              >
                Password bhool gaye?
              </a>
            </div>

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
          Account nahi hai?{' '}
          <Link
            to="/signup"
            className="text-indigo-600 font-bold hover:underline ml-1 cursor-pointer"
          >
            Naya account banayein
          </Link>
        </p>
      </div>
    </div>
  );
}