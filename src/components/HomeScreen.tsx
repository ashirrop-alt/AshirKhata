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
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-500">

      {/* --- NAVBAR --- */}
      <header className="flex-none h-16 md:h-[68px] border-b border-slate-200 dark:border-white/[0.05] bg-white dark:bg-[#0f172a] px-4 md:px-6 z-30 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          {editingShop ? (
            <form onSubmit={handleSaveShopName} className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1.5 px-3 rounded-xl border border-indigo-500/30 shadow-sm animate-in slide-in-from-left-2 duration-300">
              <input value={tempName} onChange={e => setTempName(e.target.value)} className="h-8 w-32 md:w-48 bg-transparent border-none outline-none text-sm font-bold text-slate-900 dark:text-white" autoFocus />
              <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-700 pl-1">
                <button type="submit" className="p-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-emerald-600 rounded-lg transition-colors"><Check className="w-4 h-4" /></button>
                <button type="button" onClick={() => { setEditingShop(false); setTempName(shopName); }} className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-500 rounded-lg transition-colors"><X className="w-4 h-4" /></button>
              </div>
            </form>
          ) : (
            <button onClick={() => setEditingShop(true)} className="flex items-center gap-2.5 group active:scale-95 transition-all text-left">
              <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/30">
                <Store className="w-4 h-4 md:w-4.5 md:h-4.5 text-white" />
              </div>
              <h1 className="text-lg md:text-xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                {shopName || "Apni Dukaan"}
              </h1>
            </button>
          )}

         <div className="flex items-center gap-1">
  {/* Ab ye ModeToggle bilkul transparent aur minimalist dikhega */}
  <ModeToggle />
  
  {/* LogOut button jo ab phone icon ki tarah clean hai */}
  <button 
  onClick={handleLogout} 
  className="p-2.5 rounded-xl bg-transparent text-black/60 dark:text-white/70 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all active:scale-95 flex items-center justify-center"
>
  <LogOut className="w-[18.5px] h-[18.5px]" strokeWidth={2.2} />
</button>
</div>
        </div>
      </header>

      {/* --- MAIN --- */}
      <main className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full flex flex-col md:flex-row gap-4 md:gap-6 p-4 md:p-6">

          {/* LEFT SIDE (Stat Cards) */}
          <div className="flex-none w-full md:w-72 flex flex-col space-y-4">
            <div className="bg-indigo-600 rounded-3xl p-5 md:p-6 text-white shadow-xl shadow-indigo-500/10 relative overflow-hidden min-h-[145px] flex flex-col justify-center transition-all">
              <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-2xl" />
              <div className="relative z-10 space-y-4 md:space-y-5">
                <div className="flex items-center gap-1.5 opacity-90">
                  <Wallet className="w-3.5 h-3.5" />
                  <p className="text-[10px] md:text-[10.5px] font-black uppercase tracking-[0.1em]">Kul Udhar</p>
                </div>
                <div className="flex items-baseline gap-1 md:gap-1.5">
                  <span className="text-sm md:text-base font-medium opacity-70">Rs</span>
                  <h2 className="text-3xl md:text-4xl font-black tracking-tighter leading-none">{totalUdhar.toLocaleString()}</h2>
                </div>
                <div className="pt-4 border-t border-white/20 flex items-center justify-between text-center gap-1">
                  <div className="flex flex-col items-start flex-1">
                    <span className="text-[7px] md:text-[7.5px] uppercase font-bold opacity-70 mb-0.5">Is Mahine</span>
                    <span className="text-[11px] md:text-[13px] font-black leading-none">+ {thisMonthTotal.toLocaleString()}</span>
                  </div>
                  <div className="w-px h-5 bg-white/20" />
                  <div className="flex flex-col items-center flex-1 px-1">
                    <span className="text-[7px] md:text-[7.5px] uppercase font-bold opacity-70 mb-0.5">Aaj</span>
                    <span className="text-[11px] md:text-[13px] font-black leading-none">+ {todayTotal.toLocaleString()}</span>
                  </div>
                  <div className="w-px h-5 bg-white/20" />
                  <div className="flex flex-col items-end flex-1">
                    <span className="text-[7px] md:text-[7.5px] uppercase font-bold opacity-70 mb-0.5">Accounts</span>
                    <span className="text-[11px] md:text-[13px] font-black leading-none">{customers.length}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors z-10" />
                <Input placeholder="Customer dhunndien..." className="pl-10 h-11 rounded-xl bg-white dark:bg-[#0f172a] border-slate-200 dark:border-white/10 shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Button onClick={onAddCustomer} className="w-full h-11 rounded-xl bg-indigo-600 dark:bg-white text-white dark:text-slate-950 font-bold shadow-lg shadow-indigo-500/10 active:scale-[0.98] transition-all hover:bg-indigo-700 dark:hover:bg-slate-200">
                <Plus className="w-4 h-4 mr-2" />
                Naya Customer
              </Button>
            </div>
          </div>

          {/* RIGHT SIDE (Customer List Container) */}
          <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-[#0f172a] rounded-3xl shadow-sm border border-slate-200 dark:border-white/[0.05] overflow-hidden transition-all">
            <div className="flex flex-col h-full">
              <div className="px-6 py-5 border-b border-slate-100 dark:border-white/[0.05] flex items-center gap-2 bg-slate-50/50 dark:bg-white/[0.02]">
                <Users className="w-4 h-4 text-slate-400" />
                <span className="text-[10px] md:text-[10.5px] font-black uppercase tracking-widest text-slate-400">Total Customers ({filtered.length})</span>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar pb-24 md:pb-4 p-4 space-y-3">
                {filtered.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center bg-white/30 dark:bg-slate-900/40 rounded-3xl border-2 border-dashed border-slate-200/60 dark:border-white/5">
                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-4 shadow-inner">
                      <Search className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold italic tracking-wide">
                      Koi customer nahi mila
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {filtered.map(c => {
                      const total = getCustomerTotal(c);
                      return (
                        <button key={c.id} onClick={() => onSelectCustomer(c.id)} className="w-full bg-slate-50 dark:bg-white/[0.03] rounded-2xl p-4 border border-transparent hover:border-slate-200 dark:hover:border-white/[0.05] transition-all duration-300 group active:scale-[0.99] flex items-center justify-between">
                          <div className="flex items-center gap-3 md:gap-4 text-left">
                            <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-indigo-50 dark:bg-slate-700/50 flex items-center justify-center border border-slate-100 dark:border-white/5 group-hover:bg-indigo-600 transition-all shadow-sm">
                              <span className="text-base md:text-lg font-black text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors">{c.name.charAt(0).toUpperCase()}</span>
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 dark:text-slate-100 text-sm md:text-base leading-tight group-hover:text-indigo-600 transition-colors">{c.name}</p>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{c.transactions.length} entries</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 md:gap-4">
                            <div className="text-right">
                              <p className={`text-base md:text-xl font-black tracking-tight leading-none ${total > 0 ? "text-rose-500" : "text-emerald-600 dark:text-emerald-400"}`}>
                                {total > 0 ? "+" : ""} {Math.abs(total).toLocaleString()}
                              </p>
                              <p className="text-[8px] md:text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 mt-1">Balance</p>
                            </div>
                            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                              <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 group-hover:text-white" />
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
        </div>
      </main>

      <button onClick={onAddCustomer} className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-xl shadow-2xl flex items-center justify-center active:scale-90 transition-all z-50 border border-white/20">
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}