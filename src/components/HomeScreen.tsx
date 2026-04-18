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
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-300">

      {/* --- TOP NAVBAR --- */}
      <header className="flex-none border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md px-4 py-4 z-30 shadow-sm">
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
              className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full flex flex-col md:flex-row gap-6 p-4 md:p-8">

          {/* LEFT SIDE */}
          <div className="flex-none w-full md:w-80 space-y-6">

            {editingShop && (
              <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 p-4 rounded-3xl backdrop-blur-sm animate-in zoom-in-95 duration-300 shadow-xl">
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
                    <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold">Save</Button>
                    <Button type="button" variant="ghost" onClick={() => setEditingShop(false)} className="rounded-xl">Cancel</Button>
                  </div>
                </form>
              </div>
            )}

            {/* Total Balance Card */}
            {/* --- PREMIUM TOTAL BALANCE CARD --- */}
            {/* --- SIMPLE PREMIUM TOTAL BALANCE CARD --- */}
            <div className="bg-blue-600 dark:bg-blue-700 rounded-[2rem] p-8 text-white shadow-lg relative overflow-hidden">
              {/* Bohat halka sa design element jo "cheap" na lage */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10" />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2 opacity-80">
                  <Wallet className="w-4 h-4" />
                  <p className="text-xs font-bold uppercase tracking-widest">Kul Udhar</p>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-medium opacity-70">Rs</span>
                  <h2 className="text-5xl font-black tracking-tight">
                    {totalUdhar.toLocaleString()}
                  </h2>
                </div>

                {/* Ek saaf sutri line jo bata rahi hai k ye balance hai */}
                <div className="mt-6 h-1 w-full bg-white/20 rounded-full">
                  <div className="h-full bg-white w-full rounded-full opacity-40" />
                </div>
              </div>
            </div>

            {/* Actions & Search */}
            <div className="space-y-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <Input
                  placeholder="Customer dhunndien..."
                  className="pl-12 h-14 rounded-2xl bg-white dark:bg-slate-800/30 border-slate-200 dark:border-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 focus-visible:ring-blue-500/50 transition-all shadow-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <Button
                onClick={onAddCustomer}
                className="w-full h-14 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-blue-50 text-lg font-bold shadow-xl active:scale-[0.98] transition-all flex gap-3 items-center justify-center group"
              >
                <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                Naya Customer
              </Button>
            </div>
          </div>

          {/* RIGHT SIDE: List */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-6 px-2">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Users className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest">
                  Customers ({filtered.length})
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-24 md:pb-6">
              {filtered.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center bg-white dark:bg-white/5 rounded-[3rem] border border-dashed border-slate-200 dark:border-white/10 shadow-sm">
                  <p className="text-slate-400 font-medium">Koi customer nahi mila</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filtered.map(c => {
                    const total = getCustomerTotal(c);
                    return (
                      <button
                        key={c.id}
                        onClick={() => onSelectCustomer(c.id)}
                        className="w-full bg-white dark:bg-slate-800/30 rounded-[2rem] p-5 border border-slate-100 dark:border-white/5 hover:border-blue-500/30 dark:hover:bg-slate-800/50 flex items-center justify-between transition-all duration-300 group active:scale-[0.98] shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-center gap-4 text-left">
                          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-gradient-to-br dark:from-slate-700 dark:to-slate-800 flex items-center justify-center border border-slate-200 dark:border-white/10 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                            <span className="text-xl font-black text-slate-700 dark:text-white group-hover:text-white">
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
                            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white" />
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