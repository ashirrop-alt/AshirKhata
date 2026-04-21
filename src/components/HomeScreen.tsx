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
      <header className="flex-none border-b border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl px-4 md:px-6 py-3 md:py-3.5 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {editingShop ? (
            <form onSubmit={handleSaveShopName} className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1.5 px-3 rounded-xl border border-blue-500/30 shadow-sm animate-in slide-in-from-left-2 duration-300">
              <input value={tempName} onChange={e => setTempName(e.target.value)} className="h-8 w-32 md:w-48 bg-transparent border-none outline-none text-sm font-bold text-slate-900 dark:text-white" autoFocus />
              <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-700 pl-1">
                <button type="submit" className="p-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-emerald-600 rounded-lg transition-colors"><Check className="w-4 h-4" /></button>
                <button type="button" onClick={() => { setEditingShop(false); setTempName(shopName); }} className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-500 rounded-lg transition-colors"><X className="w-4 h-4" /></button>
              </div>
            </form>
          ) : (
            <button onClick={() => setEditingShop(true)} className="flex items-center gap-2.5 group active:scale-95 transition-all text-left">
              <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/30">
                <Store className="w-4 h-4 md:w-4.5 md:h-4.5 text-white" />
              </div>
              <h1 className="text-lg md:text-xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                {shopName || "Apni Dukaan"}
              </h1>
            </button>
          )}

          <div className="flex items-center gap-2 md:gap-3">
            <ModeToggle />
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 p-1.5 h-auto transition-colors">
              <LogOut className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* --- MAIN --- */}
      <main className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full flex flex-col md:flex-row gap-4 md:gap-6 p-4 md:p-6">

          {/* LEFT SIDE (Bank-App Style Card) */}
          <div className="flex-none w-full md:w-80 space-y-4 md:space-y-5">
            <div className="bg-blue-600 dark:bg-blue-700 rounded-[2.5rem] p-6 text-white shadow-2xl shadow-blue-600/20 relative overflow-hidden group transition-all">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700" />
              
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full backdrop-blur-md">
                    <Wallet className="w-3 h-3" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Total Balance</span>
                  </div>
                  <Store className="w-5 h-5 opacity-40" />
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-medium opacity-70 ml-1">Kul Udhar Baqi Hai</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold opacity-60">Rs</span>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">
                      {totalUdhar.toLocaleString()}
                    </h2>
                  </div>
                </div>

                <div className="pt-5 border-t border-white/10 grid grid-cols-3 gap-2">
                  <div className="text-left">
                    <p className="text-[8px] uppercase font-bold opacity-60 mb-1">Is Mahine</p>
                    <p className="text-xs font-black">+{thisMonthTotal.toLocaleString()}</p>
                  </div>
                  <div className="text-center border-x border-white/10">
                    <p className="text-[8px] uppercase font-bold opacity-60 mb-1">Aaj</p>
                    <p className="text-xs font-black">+{todayTotal.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] uppercase font-bold opacity-60 mb-1">Accounts</p>
                    <p className="text-xs font-black">{customers.length}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors z-10" />
                <Input placeholder="Customer dhunndien..." className="pl-10 h-11 rounded-xl bg-white dark:bg-slate-800 border-slate-200 dark:border-white/10 shadow-sm focus:ring-2 focus:ring-blue-500 transition-all dark:text-white" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Button onClick={onAddCustomer} className="w-full h-11 rounded-xl bg-blue-600 dark:bg-white text-white dark:text-slate-950 font-bold shadow-lg shadow-blue-500/10 active:scale-[0.98] transition-all hover:bg-blue-700 dark:hover:bg-slate-200">
                <Plus className="w-4 h-4 mr-2" />
                Naya Customer
              </Button>
            </div>
          </div>

          {/* RIGHT SIDE (Customer List Container) */}
          <div className="flex-1 flex flex-col min-h-0 bg-slate-200/40 dark:bg-slate-900/50 rounded-[2.5rem] p-4 md:p-6 shadow-inner relative border border-slate-200 dark:border-white/5 overflow-hidden">
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-2 mb-4 px-1">
                <Users className="w-4 h-4 text-slate-400" />
                <span className="text-[10px] md:text-[10.5px] font-black uppercase tracking-widest text-slate-400">Total Customers ({filtered.length})</span>
              </div>

              <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar pb-24 md:pb-4 px-1">
                {filtered.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center bg-white/30 dark:bg-slate-900/40 rounded-[2rem] border-2 border-dashed border-slate-200/60 dark:border-white/5 animate-in fade-in duration-500">
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
                        <button key={c.id} onClick={() => onSelectCustomer(c.id)} className="w-full bg-white dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200/60 dark:border-white/5 hover:border-blue-500/50 dark:hover:bg-slate-800 hover:shadow-md transition-all duration-300 group active:scale-[0.99] flex items-center justify-between">
                          <div className="flex items-center gap-4 text-left">
                            <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-slate-700/50 flex items-center justify-center border border-slate-100 dark:border-white/5 group-hover:bg-blue-600 transition-all shadow-sm">
                              <span className="text-lg font-black text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors">{c.name.charAt(0).toUpperCase()}</span>
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 dark:text-slate-100 text-base leading-tight group-hover:text-blue-500 transition-colors">{c.name}</p>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{c.transactions.length} entries</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className={`text-xl font-black tracking-tight leading-none ${total > 0 ? "text-rose-500" : "text-emerald-600 dark:text-emerald-400"}`}>
                                {total > 0 ? "+" : ""} {Math.abs(total).toLocaleString()}
                              </p>
                              <p className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 mt-1">Balance</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                              <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-white" />
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

      <button onClick={onAddCustomer} className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-xl shadow-2xl flex items-center justify-center active:scale-90 transition-all z-50 border border-white/20">
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}