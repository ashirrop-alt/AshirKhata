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
      <div className="h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#020617]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#f8fafc] dark:bg-[#020617] text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-500 font-sans">
      
      {/* --- PREMIUM NAVBAR --- */}
      <header className="flex-none bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/[0.05] px-4 py-2 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-12">
          {editingShop ? (
            <form onSubmit={handleSaveShopName} className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 p-1 px-2 rounded-xl border border-blue-500/30">
              <input value={tempName} onChange={e => setTempName(e.target.value)} className="h-7 w-32 md:w-48 bg-transparent border-none outline-none text-sm font-bold text-slate-900 dark:text-white" autoFocus />
              <div className="flex items-center gap-1">
                <button type="submit" className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-md"><Check className="w-4 h-4" /></button>
                <button type="button" onClick={() => { setEditingShop(false); setTempName(shopName); }} className="p-1 text-red-500 hover:bg-red-50 rounded-md"><X className="w-4 h-4" /></button>
              </div>
            </form>
          ) : (
            <button onClick={() => setEditingShop(true)} className="flex items-center gap-3 group active:scale-95 transition-all">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 rounded-xl shadow-lg shadow-blue-500/20">
                <Store className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-base sm:text-lg font-black tracking-tight leading-tight">{shopName || "Apni Dukaan"}</h1>
            </button>
          )}

          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full w-9 h-9 bg-slate-100 dark:bg-white/5 text-slate-500">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* --- MAIN --- */}
      <main className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full flex flex-col md:flex-row gap-6 p-4 sm:p-6">
          
          {/* STATS & SEARCH */}
          <div className="w-full md:w-80 space-y-5">
            <div className="relative rounded-[2.5rem] p-7 shadow-2xl bg-gradient-to-br from-blue-600 to-indigo-800 text-white overflow-hidden">
               <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-3xl animate-pulse" />
               <div className="flex items-center gap-2 opacity-70 mb-2">
                 <Wallet className="w-4 h-4" />
                 <p className="text-[10px] font-black uppercase tracking-[0.2em]">Kul Udhar Baqi</p>
               </div>
               <div className="flex items-baseline gap-1.5">
                 <span className="text-lg font-bold opacity-60">Rs</span>
                 <h2 className="text-4xl sm:text-5xl font-black tracking-tighter">{totalUdhar.toLocaleString()}</h2>
               </div>
               <div className="mt-6 pt-5 border-t border-white/10 flex justify-between items-center">
                  <div className="text-center">
                    <span className="block text-[8px] font-black opacity-50 uppercase mb-1">Is Mahine</span>
                    <span className="text-xs font-black">+{thisMonthTotal.toLocaleString()}</span>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div className="text-center">
                    <span className="block text-[8px] font-black opacity-50 uppercase mb-1">Customers</span>
                    <span className="text-xs font-black">{customers.length}</span>
                  </div>
               </div>
            </div>

            <div className="space-y-3">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <Input placeholder="Search name..." className="pl-11 h-13 rounded-2xl bg-white dark:bg-[#0f172a] border-slate-200 dark:border-white/[0.05] shadow-sm focus:ring-4 focus:ring-blue-500/10 transition-all dark:text-white" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Button onClick={onAddCustomer} className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.25rem] shadow-xl shadow-blue-500/20 font-black tracking-wide active:scale-95 transition-all">
                <Plus className="w-5 h-5 mr-2" /> Naya Customer
              </Button>
            </div>
          </div>

          {/* CUSTOMER GRID */}
          <div className="flex-1 bg-white dark:bg-[#0f172a] rounded-[2.5rem] border border-slate-200 dark:border-white/[0.05] shadow-sm flex flex-col overflow-hidden">
            <div className="px-7 py-5 border-b border-slate-100 dark:border-white/[0.05] flex items-center gap-2 bg-slate-50/50 dark:bg-white/[0.02]">
                <Users className="w-4 h-4 text-blue-500" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Sab Customers ({filtered.length})</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filtered.map(c => {
                  const total = getCustomerTotal(c);
                  return (
                    <button key={c.id} onClick={() => onSelectCustomer(c.id)} className="group bg-slate-50 dark:bg-white/[0.03] rounded-3xl p-5 border border-transparent hover:border-blue-500/20 hover:bg-white dark:hover:bg-white/[0.06] hover:shadow-xl transition-all flex items-center justify-between text-left active:scale-[0.98]">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 flex items-center justify-center font-black text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 dark:text-slate-100 text-base leading-tight group-hover:text-blue-600 transition-colors">{c.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{c.transactions.length} entries</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className={`flex items-baseline gap-0.5 font-black ${total > 0 ? "text-red-500" : "text-emerald-600"}`}>
                            <span className="text-[10px]">Rs</span>
                            <p className="text-xl">{Math.abs(total).toLocaleString()}</p>
                          </div>
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Baqaya</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 group-hover:text-blue-500 transition-all" />
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