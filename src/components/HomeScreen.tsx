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

  // Stats logic same rkha hai
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
      <header className="flex-none border-b border-slate-200 dark:border-white/[0.05] bg-white dark:bg-[#0f172a] px-4 md:px-6 py-3 md:py-4 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {editingShop ? (
            <form onSubmit={handleSaveShopName} className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1.5 px-3 rounded-xl border border-blue-500/30 shadow-sm">
              <input value={tempName} onChange={e => setTempName(e.target.value)} className="h-8 w-32 md:w-48 bg-transparent border-none outline-none text-sm font-bold text-slate-900 dark:text-white" autoFocus />
              <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-700 pl-1">
                <button type="submit" className="p-1.5 hover:bg-emerald-50 text-emerald-600 rounded-lg"><Check className="w-4 h-4" /></button>
                <button type="button" onClick={() => { setEditingShop(false); setTempName(shopName); }} className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-lg"><X className="w-4 h-4" /></button>
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
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-500 hover:text-rose-500 p-1.5 h-auto">
              <LogOut className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* --- MAIN --- */}
      <main className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full flex flex-col md:flex-row gap-4 md:gap-6 p-4 md:p-6">

          {/* Stats Cards */}
          <div className="flex-none w-full md:w-72 space-y-4 md:space-y-5">
            <div className="bg-blue-600 rounded-3xl p-5 md:p-6 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-1.5 opacity-90">
                  <Wallet className="w-3.5 h-3.5" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Kul Udhar</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-medium opacity-70">Rs</span>
                  <h2 className="text-3xl md:text-4xl font-black tracking-tighter leading-none">{totalUdhar.toLocaleString()}</h2>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                <Input placeholder="Dhunndien..." className="pl-10 h-11 rounded-xl bg-white dark:bg-[#0f172a] border-slate-200 dark:border-white/10" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Button onClick={onAddCustomer} className="w-full h-11 rounded-xl bg-blue-600 text-white font-bold">
                <Plus className="w-4 h-4 mr-2" /> Naya Customer
              </Button>
            </div>
          </div>

          {/* Customer List Container */}
          <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-[#0f172a] rounded-3xl shadow-sm border border-slate-200 dark:border-white/[0.05] overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-white/[0.05] flex items-center gap-2 bg-slate-50/50 dark:bg-white/[0.02]">
              <Users className="w-4 h-4 text-slate-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Customers ({filtered.length})</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {filtered.map(c => {
                  const total = getCustomerTotal(c);
                  return (
                    <button key={c.id} onClick={() => onSelectCustomer(c.id)} className="w-full bg-slate-50 dark:bg-white/[0.03] rounded-2xl p-4 border border-transparent hover:border-slate-200 dark:hover:border-white/[0.05] flex items-center justify-between group transition-all">
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-slate-700/50 flex items-center justify-center border border-slate-100 dark:border-white/5 group-hover:bg-blue-600 transition-all">
                          <span className="text-base font-black text-blue-600 dark:text-blue-400 group-hover:text-white">{c.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-tight group-hover:text-blue-500">{c.name}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{c.transactions.length} entries</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-right">
                        <div>
                          <p className={`text-base md:text-xl font-black tracking-tight leading-none ${total > 0 ? "text-rose-500" : "text-emerald-600"}`}>
                            {total > 0 ? "+" : ""} {Math.abs(total).toLocaleString()}
                          </p>
                          <p className="text-[8px] uppercase font-bold text-slate-400 mt-1">Balance</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}