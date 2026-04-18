import { ModeToggle } from "./mode-toggle";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { Customer, getCustomerTotal, getTotalUdhar } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Store, ChevronRight, Search, LogOut, Loader2, Users, Wallet } from "lucide-react";

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

  // Monthly Logic
  const thisMonthTotal = customers.reduce((acc, customer) => {
    const monthSum = customer.transactions
      .filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && (t.type as string) === 'udhar';
      })
      .reduce((sum, t) => sum + t.amount, 0);
    return acc + monthSum;
  }, 0);

  // Today Logic
  const todayTotal = customers.reduce((acc, customer) => {
    const daySum = customer.transactions
      .filter(t => {
        const d = new Date(t.date);
        return d.getDate() === now.getDate() && 
               d.getMonth() === now.getMonth() && 
               d.getFullYear() === now.getFullYear() && 
               (t.type as string) === 'udhar';
      })
      .reduce((sum, t) => sum + t.amount, 0);
    return acc + daySum;
  }, 0);

  useEffect(() => {
    setTempName(shopName);
    if (!isLoading && !shopName) setEditingShop(true);
    else setEditingShop(false);
  }, [shopName, isLoading]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
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
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 overflow-hidden transition-all duration-500">

      {/* --- NAVBAR (Slightly taller) --- */}
      <header className="flex-none border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-slate-950/50 backdrop-blur-md px-5 py-4 z-30 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={() => setEditingShop(true)} className="flex items-center gap-3 group active:scale-95 transition-all text-left">
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
              <Store className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
              {shopName || "Apni Dukaan"}
            </h1>
          </button>
          <div className="flex items-center gap-3">
            <ModeToggle />
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-500 hover:text-rose-500 p-2 h-auto transition-colors">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* --- MAIN --- */}
      <main className="flex-1 overflow-hidden transition-all">
        <div className="max-w-7xl mx-auto h-full flex flex-col md:flex-row gap-6 p-5 md:p-8">

          {/* LEFT SIDE */}
          <div className="flex-none w-full md:w-80 space-y-6">

            {editingShop && (
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl animate-in zoom-in-95">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (tempName.trim()) {
                    onSetShopName(tempName.trim());
                    setEditingShop(false);
                  }
                }} className="space-y-4">
                  <Input value={tempName} onChange={e => setTempName(e.target.value)} placeholder="Dukaan ka naam" className="h-11 rounded-xl" autoFocus />
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1 bg-blue-600 text-white font-bold rounded-xl">Save</Button>
                    <Button type="button" variant="ghost" onClick={() => setEditingShop(false)}>Cancel</Button>
                  </div>
                </form>
              </div>
            )}

            {/* TOTAL BOX (Increased Padding & Font) */}
            <div className="bg-blue-600 dark:bg-blue-700 rounded-[2.5rem] p-7 text-white shadow-xl relative overflow-hidden transition-all hover:shadow-blue-500/10">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
              <div className="relative z-10 space-y-5">
                <div className="flex items-center gap-2 opacity-80">
                  <Wallet className="w-4 h-4" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.15em] leading-none">Kul Udhar</p>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-medium opacity-60">Rs</span>
                  <h2 className="text-4xl font-black tracking-tighter leading-none">{totalUdhar.toLocaleString()}</h2>
                </div>
                <div className="pt-5 border-t border-white/10 flex items-center justify-between text-center gap-2">
                  <div className="flex flex-col items-start flex-1">
                    <span className="text-[8px] uppercase font-bold opacity-60 mb-1">Is Mahine</span>
                    <span className="text-[13px] font-black leading-none text-blue-100">+ {thisMonthTotal.toLocaleString()}</span>
                  </div>
                  <div className="w-px h-6 bg-white/10" />
                  <div className="flex flex-col items-center flex-1 px-1">
                    <span className="text-[8px] uppercase font-bold opacity-60 mb-1">Aaj Ka Din</span>
                    <span className="text-[13px] font-black leading-none text-blue-100">+ {todayTotal.toLocaleString()}</span>
                  </div>
                  <div className="w-px h-6 bg-white/10" />
                  <div className="flex flex-col items-end flex-1">
                    <span className="text-[8px] uppercase font-bold opacity-60 mb-1">Accounts</span>
                    <span className="text-[13px] font-black leading-none text-blue-100">{customers.length}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <Input
                  placeholder="Customer dhunndien..."
                  className="pl-11 h-12 rounded-2xl bg-white dark:bg-slate-900/40 border-slate-200 dark:border-white/5 shadow-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button
                onClick={onAddCustomer}
                className="w-full h-12 rounded-2xl bg-blue-600 dark:bg-white text-white dark:text-slate-950 font-bold shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"
              >
                <Plus className="w-5 h-5 mr-2" />
                Naya Customer
              </Button>
            </div>
          </div>

          {/* RIGHT SIDE (Cards adjusted) */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center gap-2 mb-5 px-1">
              <Users className="w-5 h-5 text-slate-400" />
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Total Customers ({filtered.length})</span>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar pb-28 md:pb-6 px-1">
              {filtered.length === 0 ? (
                <div className="h-60 flex items-center justify-center bg-white dark:bg-slate-900/20 rounded-[2rem] border border-dashed border-slate-200 dark:border-white/10">
                  <p className="text-slate-400 text-sm font-medium">Koi customer nahi mila</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filtered.map(c => {
                    const total = getCustomerTotal(c);
                    return (
                      <button
                        key={c.id}
                        onClick={() => onSelectCustomer(c.id)}
                        className="w-full bg-white dark:bg-slate-900/40 rounded-2xl p-4 md:p-5 border border-slate-100 dark:border-white/[0.05] hover:border-blue-500/30 dark:hover:bg-slate-800/60 flex items-center justify-between transition-all duration-300 group active:scale-[0.99] shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-center gap-4 text-left">
                          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-white/5 group-hover:bg-blue-600 transition-all shadow-sm">
                            <span className="text-lg font-black text-blue-600 dark:text-white group-hover:text-white transition-colors">
                              {c.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-base leading-tight group-hover:text-blue-600 transition-colors">{c.name}</p>
                            <p className="text-xs text-slate-500 mt-1 font-medium">{c.transactions.length} transactions</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className={`text-lg font-black tracking-tight leading-none ${total > 0 ? "text-rose-500" : "text-emerald-600 dark:text-emerald-400"}`}>
                              {total > 0 ? "+" : ""} {Math.abs(total).toLocaleString()}
                            </p>
                            <p className="text-[9px] uppercase font-bold text-slate-400 mt-1.5">Balance</p>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-white" />
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

      <button
        onClick={onAddCustomer}
        className="md:hidden fixed bottom-8 right-8 w-16 h-16 bg-blue-600 text-white rounded-2xl shadow-2xl flex items-center justify-center active:scale-90 transition-all z-50 border border-white/20"
      >
        <Plus className="w-7 h-7" />
      </button>
    </div>
  );
}