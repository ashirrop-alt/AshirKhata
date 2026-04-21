import { ModeToggle } from "./mode-toggle";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { Customer, getCustomerTotal, getTotalUdhar } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Store, ChevronRight, Search, LogOut, Loader2, Users, Wallet, Check, X } from "lucide-react";

interface Props {
  shopName: string;
  customers: Customer[];
  isLoading?: boolean;
  onSetShopName: (name: string) => void;
  onSelectCustomer: (id: string) => void;
  onAddCustomer: () => void;
}

export function HomeScreen({ shopName, customers, isLoading, onSetShopName, onSelectCustomer, onAddCustomer }: Props) {
  const [editingShop, setEditingShop] = useState(false);
  const [tempName, setTempName] = useState(shopName);
  const [search, setSearch] = useState("");
  const totalUdhar = getTotalUdhar(customers);
  const now = new Date();

  const thisMonthTotal = customers.reduce((acc, customer) => {
    const monthSum = customer.transactions
      .filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && (t.type as string) === 'udhar';
      })
      .reduce((sum, t) => sum + t.amount, 0);
    return acc + monthSum;
  }, 0);

  const todayTotal = customers.reduce((acc, customer) => {
    const daySum = customer.transactions
      .filter(t => {
        const d = new Date(t.date);
        return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && (t.type as string) === 'udhar';
      })
      .reduce((sum, t) => sum + t.amount, 0);
    return acc + daySum;
  }, 0);

  useEffect(() => { setTempName(shopName); }, [shopName]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const handleSaveShopName = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (tempName.trim()) {
      onSetShopName(tempName.trim());
      setEditingShop(false);
    }
  };

  const filtered = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-500">

      {/* --- NAVBAR --- */}
      <header className="flex-none border-b border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl px-4 md:px-6 py-3 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {editingShop ? (
            <form onSubmit={handleSaveShopName} className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1 rounded-xl border border-blue-500/30">
              <input value={tempName} onChange={e => setTempName(e.target.value)} className="h-7 w-32 md:w-48 bg-transparent border-none outline-none text-sm font-bold text-slate-900 dark:text-white px-2" autoFocus />
              <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-700 pl-1">
                <button type="submit" className="p-1 hover:bg-emerald-50 text-emerald-600 rounded-lg"><Check className="w-4 h-4" /></button>
                <button type="button" onClick={() => { setEditingShop(false); setTempName(shopName); }} className="p-1 hover:bg-rose-50 text-rose-500 rounded-lg"><X className="w-4 h-4" /></button>
              </div>
            </form>
          ) : (
            <button onClick={() => setEditingShop(true)} className="flex items-center gap-2 group transition-all">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Store className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-base md:text-lg font-black tracking-tight text-slate-900 dark:text-white group-hover:text-blue-500">
                {shopName || "Apni Dukaan"}
              </h1>
            </button>
          )}

          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-500 hover:text-rose-500 p-1.5 h-auto">
              <LogOut className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* --- MAIN --- */}
      <main className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full flex flex-col md:flex-row gap-4 p-4 md:p-6">

          {/* LEFT SIDE (Compact Stats Card) */}
          <div className="flex-none w-full md:w-72 space-y-4">
            <div className="bg-blue-600 dark:bg-blue-700 rounded-[1.8rem] p-5 text-white shadow-xl shadow-blue-600/10 relative overflow-hidden transition-all">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
              
              <div className="relative z-10 space-y-4">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Kul Udhar Baqi Hai</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-bold opacity-60">Rs</span>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tighter leading-tight">
                      {totalUdhar.toLocaleString()}
                    </h2>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-[8px] uppercase font-bold opacity-60">Is Mahine</p>
                    <p className="text-xs font-black">+{thisMonthTotal.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] uppercase font-bold opacity-60">Aaj</p>
                    <p className="text-xs font-black">+{todayTotal.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                <Input placeholder="Search..." className="pl-9 h-10 rounded-xl bg-white dark:bg-slate-800 border-slate-200 dark:border-white/10 shadow-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Button onClick={onAddCustomer} className="w-full h-10 rounded-xl bg-blue-600 dark:bg-white text-white dark:text-slate-950 font-bold active:scale-[0.98] transition-all">
                <Plus className="w-4 h-4 mr-2" />
                Naya Customer
              </Button>
            </div>
          </div>

          {/* RIGHT SIDE (Customer List) */}
          <div className="flex-1 flex flex-col min-h-0 bg-slate-200/40 dark:bg-slate-900/50 rounded-[2rem] p-4 md:p-5 shadow-inner border border-slate-200 dark:border-white/5 overflow-hidden">
            <div className="flex items-center gap-2 mb-3 px-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Customers ({filtered.length})</span>
            </div>

            <div className="flex-1 overflow-y-auto pb-20 md:pb-4 px-1">
              {filtered.length === 0 ? (
                <div className="h-40 flex flex-col items-center justify-center">
                  <p className="text-slate-400 text-xs font-bold italic">Koi nahi mila</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
                  {filtered.map(c => {
                    const total = getCustomerTotal(c);
                    return (
                      <button key={c.id} onClick={() => onSelectCustomer(c.id)} className="w-full bg-white dark:bg-slate-800/80 rounded-xl p-3.5 border border-slate-200/60 dark:border-white/5 hover:border-blue-500/50 transition-all flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-slate-700/50 flex items-center justify-center font-black text-blue-600 dark:text-blue-400">
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">{c.name}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className={`text-sm font-black ${total > 0 ? "text-rose-500" : "text-emerald-600 dark:text-emerald-400"}`}>
                              {total > 0 ? "+" : ""} {Math.abs(total).toLocaleString()}
                            </p>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <button onClick={onAddCustomer} className="md:hidden fixed bottom-6 right-6 w-12 h-12 bg-blue-600 text-white rounded-xl shadow-lg flex items-center justify-center active:scale-90 z-50 border border-white/20">
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
}