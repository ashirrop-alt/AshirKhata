import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Link } from 'react-router-dom'; // Link import kiya

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else window.location.href = '/';
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg border border-slate-100">
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">Ashir Khata Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input 
            type="email" 
            placeholder="Email Address" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <Input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <Button type="submit" disabled={loading} className="w-full bg-indigo-600 h-12">
            {loading ? 'Sabar karein...' : 'Login Karo'}
          </Button>
        </form>

        {/* Yeh neechay wala hissa naya dala hai */}
        <p className="mt-6 text-center text-sm text-slate-600">
          Account nahi hai?{' '}
          <Link to="/signup" className="text-indigo-600 font-bold hover:underline">
            Register Karein
          </Link>
        </p>
      </div>
    </div>
  );
}