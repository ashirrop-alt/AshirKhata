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
      <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-300">

      {/* --- NAVBAR --- */}
      <header className="flex-none bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-white/[0.05] px-4 py-2 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-12">
          {editingShop ? (
            <form onSubmit={handleSaveShopName} className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 p-1 px-3 rounded-xl border border-blue-500/30 shadow-sm">
              <input value={tempName} onChange={e => setTempName(e.target.value)} className="h-8 w-32 md:w-48 bg-transparent border-none outline-none text-sm font-bold text-slate-900 dark:text-white" autoFocus />
              <button type="submit" className="text-emerald-600"><Check className="w-4 h-4" /></button>
            </form>
          ) : (
            <button onClick={() => setEditingShop(true)} className="flex items-center gap-3 group active:scale-95 transition-all text-left">
              <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
                <Store className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
                {shopName || "Apni Dukaan"}
              </h1>
            </button>
          )}

          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full w-9 h-9 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-all">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* --- MAIN --- */}
      <main className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full flex flex-col md:flex-row gap-4 sm:gap-6 p-4 sm:p-5">

          {/* LEFT SIDE (Stats & Search) */}
          <div className="w-full md:w-80 space-y-4">
            <div className="relative rounded-[2.5rem] p-6 shadow-lg bg-blue-600 text-white overflow-hidden">
               <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-2xl" />
               <div className="flex items-center gap-1.5 opacity-80 mb-1.5">
                 <Wallet className="w-3.5 h-3.5" />
                 <p className="text-[10px] font-bold uppercase tracking-widest">Kul Udhar</p>
               </div>
               <div className="flex items-baseline gap-1">
                 <span className="text-base font-bold opacity-70">Rs</span>
                 <h2 className="text-3xl sm:text-4xl font-black tracking-tighter leading-none">{totalUdhar.toLocaleString()}</h2>
               </div>
               <div className="mt-5 pt-4 border-t border-white/20 grid grid-cols-3 gap-1 text-center">
                  <div className="flex flex-col"><span className="text-[7px] font-bold opacity-60 uppercase">Mahina</span><span className="text-[11px] font-black">+{thisMonthTotal.toLocaleString()}</span></div>
                  <div className="flex flex-col border-x border-white/10"><span className="text-[7px] font-bold opacity-60 uppercase">Aaj</span><span className="text-[11px] font-black">+{todayTotal.toLocaleString()}</span></div>
                  <div className="flex flex-col"><span className="text-[7px] font-bold opacity-60 uppercase">Log</span><span className="text-[11px] font-black">{customers.length}</span></div>
               </div>
            </div>

            <div className="space-y-3">
              <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors z-10" />
                <Input placeholder="Search customer..." className="pl-10 h-12 rounded-2xl bg-white dark:bg-[#0f172a] border-slate-200 dark:border-white/[0.05] shadow-sm focus:ring-2 focus:ring-blue-500 transition-all dark:text-white" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Button onClick={onAddCustomer} className="w-full h-12 sm:h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-md font-black text-xs sm:text-sm active:scale-95 transition-all">
                <Plus className="w-4 h-4 mr-2" /> Naya Customer
              </Button>
            </div>
          </div>

          {/* RIGHT SIDE (Customer List) */}
          <div className="flex-1 bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-white/[0.05] shadow-sm overflow-hidden flex flex-col min-h-[400px]">
            <div className="px-5 py-3 border-b border-slate-100 dark:border-white/[0.05] flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400" />
                <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Total Customers ({filtered.length})</h2>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5">
              {filtered.map(c => {
                const total = getCustomerTotal(c);
                return (
                  <button key={c.id} onClick={() => onSelectCustomer(c.id)} className="w-full bg-slate-50 dark:bg-white/[0.03] rounded-2xl p-3.5 border border-transparent hover:border-slate-200 dark:hover:border-white/[0.05] transition-all flex items-center justify-between group text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center font-black text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 dark:text-slate-100 text-sm md:text-base leading-tight group-hover:text-blue-500 transition-colors">{c.name}</p>
                        <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight mt-0.5">{c.transactions.length} entries</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className={`flex items-baseline gap-0.5 font-black ${total > 0 ? "text-red-500 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                          <span className="text-[10px]">Rs</span>
                          <p className="text-lg">{Math.abs(total).toLocaleString()}</p>
                        </div>
                        <p className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">Balance</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-all" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}