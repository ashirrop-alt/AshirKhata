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

  useEffect(() => {
    const channel = supabase
      .channel('db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => { window.location.reload(); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const filtered = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#f8fafc] dark:bg-[#020617] text-slate-900 dark:text-slate-100 overflow-hidden">

      {/* --- NAVBAR --- */}
      <header className="flex-none border-b border-slate-200/60 dark:border-white/[0.05] bg-white/80 backdrop-blur-md dark:bg-[#0f172a]/80 px-4 md:px-6 py-3 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {editingShop ? (
            <form onSubmit={handleSaveShopName} className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1.5 px-3 rounded-xl border border-blue-500 shadow-sm animate-in slide-in-from-left-2">
              <input value={tempName} onChange={e => setTempName(e.target.value)} className="h-8 w-32 md:w-48 bg-transparent border-none outline-none text-sm font-bold" autoFocus />
              <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-700 pl-1">
                <button type="submit" className="p-1.5 text-emerald-600"><Check className="w-4 h-4" /></button>
                <button type="button" onClick={() => { setEditingShop(false); setTempName(shopName); }} className="p-1.5 text-rose-500"><X className="w-4 h-4" /></button>
              </div>
            </form>
          ) : (
            <button onClick={() => setEditingShop(true)} className="flex items-center gap-3 group active:scale-95 transition-all">
              <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
                <Store className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-black tracking-tight group-hover:text-blue-600 transition-colors">
                {shopName || "Apni Dukaan"}
              </h1>
            </button>
          )}

          <div className="flex items-center gap-3">
            <ModeToggle />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout} 
              className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* --- MAIN --- */}
      <main className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full flex flex-col md:flex-row gap-6 p-4 md:p-6">

          {/* LEFT SIDE (Stat Cards) */}
          <div className="flex-none w-full md:w-72 flex flex-col space-y-5">
            <div className="bg-blue-600 rounded-[2rem] p-6 text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden flex flex-col justify-center">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-3xl" />
              <div className="relative z-10 space-y-5">
                <div className="flex items-center gap-2 opacity-80">
                  <Wallet className="w-4 h-4" />
                  <p className="text-[11px] font-bold uppercase tracking-widest">Kul Udhar</p>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-medium opacity-70 font-sans">Rs</span>
                  <h2 className="text-4xl font-black tracking-tighter">{totalUdhar.toLocaleString()}</h2>
                </div>
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase font-bold opacity-60">Is Mahine</span>
                    <span className="text-sm font-black">+{thisMonthTotal.toLocaleString()}</span>
                  </div>
                  <div className="w-px h-6 bg-white/20" />
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] uppercase font-bold opacity-60">Aaj</span>
                    <span className="text-sm font-black">+{todayTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <Input placeholder="Customer dhunndien..." className="pl-11 h-12 rounded-2xl bg-white dark:bg-[#0f172a] border-slate-200 dark:border-white/10 shadow-sm focus:ring-2 focus:ring-blue-500/20" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Button onClick={onAddCustomer} className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 dark:bg-white dark:text-slate-950 font-bold shadow-lg shadow-blue-500/10 active:scale-[0.98] transition-all">
                <Plus className="w-5 h-5 mr-2" />
                Naya Customer
              </Button>
            </div>
          </div>

          {/* RIGHT SIDE (Customer List Container) */}
          <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-[#0f172a] rounded-[2rem] shadow-sm border border-slate-200 dark:border-white/5 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.01]">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Customers ({filtered.length})</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 space-y-3">
              {filtered.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-40 py-20">
                  <Search className="w-12 h-12 mb-4" />
                  <p className="font-bold">Koi customer nahi mila</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filtered.map(c => {
                    const total = getCustomerTotal(c);
                    return (
                      <button key={c.id} onClick={() => onSelectCustomer(c.id)} className="w-full bg-white dark:bg-white/[0.02] rounded-2xl p-4 border border-slate-100 dark:border-white/5 hover:border-blue-200 dark:hover:border-blue-500/30 hover:shadow-md transition-all group flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200/50 dark:border-white/5 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                            <span className="text-lg font-black">{c.name.charAt(0).toUpperCase()}</span>
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-slate-900 dark:text-white text-base group-hover:text-blue-600 transition-colors">{c.name}</p>
                            <p className="text-[11px] text-slate-500 font-medium">{c.transactions.length} Transactions</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className={`text-xl font-black tracking-tight ${total > 0 ? "text-rose-500" : "text-emerald-600"}`}>
                              {total > 0 ? "+" : ""} {Math.abs(total).toLocaleString()}
                            </p>
                            <p className="text-[9px] uppercase font-bold text-slate-400">Balance</p>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <ChevronRight className="w-4 h-4" />
                          </div>
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

      <button onClick={onAddCustomer} className="md:hidden fixed bottom-8 right-6 w-16 h-16 bg-blue-600 text-white rounded-2xl shadow-2xl flex items-center justify-center active:scale-90 transition-all z-50 border-4 border-white dark:border-[#020617]">
        <Plus className="w-8 h-8" />
      </button>
    </div>
  );
}