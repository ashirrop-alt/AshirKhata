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

  // --- DYNAMIC CALCULATIONS ---
  const now = new Date();

  // 1. Is Mahine ka Logic
  const thisMonthTotal = customers.reduce((acc, customer) => {
    const monthSum = customer.transactions
      .filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && (t.type as string) === 'udhar';
      })
      .reduce((sum, t) => sum + t.amount, 0);
    return acc + monthSum;
  }, 0);

  // 2. Aaj Ka Din ka Logic
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
    if (!isLoading && !shopName) {
      setEditingShop(true);
    } else {
      setEditingShop(false);
    }
  }, [shopName, isLoading]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  useEffect(() => {
    const channel = supabase
      .channel('db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions' },
        () => { window.location.reload(); }
      )
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
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 overflow-hidden transition-all duration-500 ease-in-out">

      {/* --- TOP NAVBAR --- */}
      <header className="flex-none border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md px-4 py-4 z-30 shadow-sm transition-all duration-500">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={() => setEditingShop(true)} className="flex items-center gap-3 group transition-transform active:scale-95 text-left">
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
              <Store className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {shopName || "Apni Dukaan"}
            </h1>
          </button>

          <div className="flex items-center gap-3">
            <ModeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 overflow-hidden transition-all duration-500">
        <div className="max-w-7xl mx-auto h-full flex flex-col md:flex-row gap-6 p-4 md:p-8">

          {/* LEFT SIDE */}
          <div className="flex-none w-full md:w-80 space-y-6">

            {editingShop && (
              <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 p-4 rounded-3xl backdrop-blur-sm animate-in zoom-in-95 duration-300 shadow-xl transition-all">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (tempName.trim()) {
                    onSetShopName(tempName.trim());
                    setEditingShop(false);
                  }
                }} className="space-y-3">
                  <Input
                    value={tempName}
                    onChange={e => setTempName(e.target.value)}
                    placeholder="Dukaan ka naam"
                    className="h-11 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all">Save</Button>
                    <Button type="button" variant="ghost" onClick={() => setEditingShop(false)} className="rounded-xl">Cancel</Button>
                  </div>
                </form>
              </div>
            )}

            {/* --- TOTAL CARD --- */}
            <div className="bg-blue-600 dark:bg-blue-700 rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden transition-all duration-500">
              <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1 opacity-70">
                  <Wallet className="w-3.5 h-3.5" />
                  <p className="text-[10px] font-bold uppercase tracking-widest leading-none">Kul Udhar</p>
                </div>

                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-medium opacity-60">Rs</span>
                  <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-none">
                    {totalUdhar.toLocaleString()}
                  </h2>
                </div>

                <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between gap-1">
                  <div className="flex flex-col">
                    <span className="text-[8px] uppercase font-bold opacity-60 tracking-wider mb-1 leading-none">Is Mahine</span>
                    <span className="text-xs font-black whitespace-nowrap">+ Rs {thisMonthTotal.toLocaleString()}</span>
                  </div>

                  <div className="w-px h-6 bg-white/10" />

                  <div className="flex flex-col px-1">
                    <span className="text-[8px] uppercase font-bold opacity-60 tracking-wider mb-1 leading-none">Aaj</span>
                    <span className="text-xs font-black whitespace-nowrap">+ Rs {todayTotal.toLocaleString()}</span>
                  </div>

                  <div className="w-px h-6 bg-white/10" />

                  <div className="flex flex-col text-right">
                    <span className="text-[8px] uppercase font-bold opacity-60 tracking-wider mb-1 leading-none">Active</span>
                    <span className="text-xs font-black">{customers.length} Accounts</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions & Search */}
            <div className="space-y-4 transition-all duration-500">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <Input
                  placeholder="Dhunndien..."
                  className="pl-12 h-14 rounded-2xl bg-white dark:bg-slate-900/50 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus-visible:ring-blue-500/50 transition-all shadow-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <Button
                onClick={onAddCustomer}
                className="w-full h-14 rounded-2xl bg-blue-600 dark:bg-white text-white dark:text-slate-950 hover:bg-blue-700 dark:hover:bg-slate-50 text-lg font-bold shadow-lg shadow-blue-500/20 dark:shadow-none active:scale-[0.98] transition-all flex gap-3 items-center justify-center group border-none"
              >
                <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                Naya Customer
              </Button>
            </div>
          </div>

          {/* RIGHT SIDE: List */}
          <div className="flex-1 flex flex-col min-h-0 transition-all duration-500">
            <div className="flex items-center justify-between mb-6 px-4 md:px-2">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Users className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest">
                  Customers ({filtered.length})
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-24 md:pb-6">
              {filtered.length === 0 ? (
                <div className="mx-4 h-64 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-900/20 rounded-[3rem] border border-dashed border-slate-200 dark:border-white/10 shadow-sm">
                  <p className="text-slate-400 font-medium">Koi customer nahi mila</p>
                </div>
              ) : (
                /* Grid with Mobile Padding Fix */
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-4 md:px-0">
                  {filtered.map(c => {
                    const total = getCustomerTotal(c);
                    return (
                      <button
                        key={c.id}
                        onClick={() => onSelectCustomer(c.id)}
                        className="w-full bg-white dark:bg-slate-900/40 rounded-[1.5rem] p-5 border border-slate-100 dark:border-white/[0.08] hover:border-blue-500/30 dark:hover:border-blue-500/20 backdrop-blur-sm flex items-center justify-between transition-all duration-300 group active:scale-[0.98] shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-center gap-4 text-left">
                          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-white/10 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                            <span className="text-xl font-black text-blue-600 dark:text-white group-hover:text-white">
                              {c.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-lg leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{c.name}</p>
                            <p className="text-xs text-slate-500 mt-1 font-medium">{c.transactions.length} entries</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className={`text-xl font-black ${total > 0 ? "text-rose-500" : "text-emerald-600 dark:text-emerald-500"}`}>
                              {total > 0 ? "+" : ""} {Math.abs(total).toLocaleString()}
                            </p>
                            <p className="text-[10px] uppercase font-bold text-slate-400">Balance</p>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                             <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-white" />
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

      {/* Mobile Floating Button */}
      <button
        onClick={onAddCustomer}
        className="md:hidden fixed bottom-8 right-8 w-16 h-16 bg-blue-600 text-white rounded-2xl shadow-2xl flex items-center justify-center active:scale-90 transition-all z-50 border border-white/20"
      >
        <Plus className="w-8 h-8" />
      </button>
    </div>
  );
}