import { ModeToggle } from "./mode-toggle";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { Customer, getCustomerTotal, getTotalUdhar } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Store, ChevronRight, Search, LogOut, Loader2, Users } from "lucide-react";

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


  // --- REALTIME UPDATE CODE ---
  useEffect(() => {
    const channel = supabase
      .channel('db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions' // <--- Confirm karlein table ka name yehi hai
        },
        () => {
          // Jaise hi database badlega, page refresh ho jayega
          window.location.reload();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  // ----------------------------

  const filtered = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden transition-colors duration-500 ease-in-out">
      {/* --- TOP NAVBAR --- */}
      <header className="flex-none bg-white dark:bg-card border-b dark:border-border px-4 py-3 z-30 shadow-sm transition-all duration-500">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={() => setEditingShop(true)} className="flex items-center gap-2 group">
            <div className="bg-primary p-2 rounded-lg text-primary-foreground">
              <Store className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black tracking-tight group-hover:underline dark:text-white">
              {shopName || "Apni Dukaan"}
            </h1>
          </button>

          <div className="flex items-center gap-2">
            {/* --- Naya Dark Mode Button --- */}
            <ModeToggle />

            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground gap-2 dark:hover:text-white">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full flex flex-col md:flex-row gap-6 p-4 md:p-6">

          {/* LEFT SIDE: Stats & Actions (Laptop pe side pe, Mobile pe top pe) */}
          <div className="flex-none w-full md:w-80 space-y-4">

            {/* Shop Name Editor (If active) */}
            {editingShop && (
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-primary/20 animate-in fade-in slide-in-from-top-2">
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
                    className="h-10 text-sm"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1 h-9 text-xs">Save</Button>
                    <Button type="button" variant="ghost" onClick={() => setEditingShop(false)} className="h-9 text-xs">Cancel</Button>
                  </div>
                </form>
              </div>
            )}

            {/* Total Balance Card */}
            <div className="bg-primary rounded-[2rem] p-6 text-primary-foreground shadow-2xl shadow-primary/20 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full" />
              <p className="text-xs font-bold uppercase tracking-widest opacity-70">Kul Udhar</p>
              <h2 className="text-4xl font-black mt-2">Rs {totalUdhar.toLocaleString()}</h2>
            </div>

            {/* Actions & Search */}
            <div className="space-y-3">
              <Button
                onClick={onAddCustomer}
                className="w-full h-14 rounded-2xl bg-white dark:bg-card border-2 border-primary/10 text-primary hover:bg-primary hover:text-white text-lg font-bold shadow-sm transition-all duration-300 active:scale-95 flex gap-2 items-center justify-center group"
              >
                <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                Naya Customer
              </Button>

              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Customer dhunndien..."
                  className="pl-12 h-14 rounded-2xl bg-white dark:bg-card border border-transparent dark:border-white/10 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/30 dark:text-slate-100 transition-all duration-300"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Scrollable Customer List */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Customers ({filtered.length})
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-24 md:pb-6">
              {filtered.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-20 bg-white/50 rounded-[2rem] border-2 border-dashed">
                  <p className="text-muted-foreground font-medium">Koi customer nahi mila</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {filtered.map(c => {
                    const total = getCustomerTotal(c);
                    return (
                      <button
                        key={c.id}
                        onClick={() => onSelectCustomer(c.id)}
                        /* Is className ko poora replace karein */
                        className="w-full bg-white dark:bg-card rounded-2xl p-4 shadow-sm border border-transparent dark:border-white/10 hover:border-primary/20 flex items-center justify-between hover:shadow-md dark:hover:bg-white/[0.02] transition-all duration-300 text-left group active:scale-[0.97]"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center transition-colors group-hover:bg-primary group-hover:text-white text-primary">
                            <span className="text-lg font-bold">
                              {c.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-bold text-foreground dark:text-slate-100 text-lg">{c.name}</p>
                            <p className="text-xs text-muted-foreground">{c.transactions.length} entries</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-lg font-black ${total > 0 ? "text-destructive" : "text-success"}`}>
                            Rs {Math.abs(total).toLocaleString()}
                          </span>
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
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

      {/* Mobile-Only Plus Button (Sirf tab dikhega jab screen choti ho) */}
      <button
        onClick={onAddCustomer}
        className="md:hidden fixed bottom-6 right-6 w-16 h-16 bg-primary text-primary-foreground rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform z-50"
      >
        <Plus className="w-8 h-8" />
      </button>
    </div>
  );
}