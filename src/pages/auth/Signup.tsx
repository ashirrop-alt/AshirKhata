import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react'; 

export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState(''); // Mobile number state
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  // Target audience ke liye shuru mein password UNHIDE (true) rakha hai
  const [showPassword, setShowPassword] = useState(true);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Supabase standard email auth use karta hai, toh hum number ke aage dummy domain laga kar backend bypass kar rahe hain
    // Is se email field ka jhanjhat frontend par khatam ho gaya!
    const formattedEmail = `${phone.trim()}@khatify.local`;

    const { data, error } = await supabase.auth.signUp({
      email: formattedEmail,
      password,
      options: { 
        data: { 
          full_name: fullName,
          phone_number: phone 
        } 
      }
    });

    if (error) {
      alert("Misaal: " + error.message);
      setLoading(false);
    } else {
      // Direct Login Feature: Signup hote hi dobara login na karna pare, seedha entry!
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: formattedEmail,
        password
      });

      if (loginError) {
        window.location.href = '/login'; // Agar koi masla ho toh safe side login par bhej do
      } else {
        window.location.href = '/'; // Seedha software ke andar!
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-50 text-slate-900 overflow-y-auto sm:overflow-hidden">
      <div className="w-full max-w-md p-6 sm:p-8 bg-white rounded-3xl shadow-xl border border-slate-100 transition-all my-4 sm:my-0">
        
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tighter">
            Khati<span className="text-indigo-600">fy</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Apna muft khata account banayein seconds mein.
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-3 sm:space-y-4">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 ml-1">Dukaan / Full Name</label>
            <Input
              type="text"
              placeholder="Maslan: Ali General Store"
              className="h-10 sm:h-12 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all rounded-xl text-sm"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          {/* Mobile Number */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 ml-1">Mobile Number</label>
            <Input
              type="tel"
              placeholder="03001234567"
              className="h-10 sm:h-12 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all rounded-xl text-sm"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          {/* Password - Single input wrapper */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 ml-1">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Kam az kam 6 hifz"
                className="h-10 sm:h-12 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all rounded-xl text-sm pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button 
            disabled={loading} 
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-700 h-10 sm:h-12 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all mt-4 active:scale-95 text-sm sm:text-base"
          >
            {loading ? 'Sabar karein...' : 'Khata Shuru Karein →'}
          </Button>
        </form>

        <div className="relative my-6 sm:my-8">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
          <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-white px-3 text-slate-400 font-semibold tracking-widest">OR</span></div>
        </div>

        <p className="text-center text-xs sm:text-sm text-slate-600 font-medium">
          Pehle se account hai?{' '}
          <Link to="/login" className="text-indigo-600 font-bold hover:underline ml-1">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}