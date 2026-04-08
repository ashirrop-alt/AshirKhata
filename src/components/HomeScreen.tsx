import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { Customer, getCustomerTotal, getTotalUdhar } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Store, ChevronRight, Search, LogOut, Loader2 } from "lucide-react";

interface Props {
  shopName: string;
  customers: Customer[];
  isLoading?: boolean; // Naya prop loading state ke liye
  onSetShopName: (name: string) => void;
  onSelectCustomer: (id: string) => void;
  onAddCustomer: () => void;
}

export function HomeScreen({ shopName, customers, isLoading, onSetShopName, onSelectCustomer, onAddCustomer }: Props) {
  // Shuru mein editingShop ko false rakhein
  const [editingShop, setEditingShop] = useState(false);
  const [tempName, setTempName] = useState(shopName);
  const [search, setSearch] = useState("");
  const totalUdhar = getTotalUdhar(customers);

  // Jab shopName database se load ho jaye, tab update karein
  useEffect(() => {
    setTempName(shopName);
    // Agar loading khatam ho gayi aur naam phir bhi khali hai, toh input dikhao
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

  const filtered = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  // Agar data load ho raha hai toh professional loader dikhayein
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto p-4 space-y-4 pb-24">
        {/* Shop Header Card */}
        <div className="bg-primary rounded-2xl p-6 shadow-lg">
          {editingShop ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <Store className="w-4 h-4" />
                <span className="text-sm font-medium">Apni dukaan ka naam likhein</span>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                if (tempName.trim()) {
                  onSetShopName(tempName.trim());
                  setEditingShop(false);
                }
              }}>
                <Input
                  value={tempName}
                  onChange={e => setTempName(e.target.value)}
                  placeholder="Dukaan ka naam"
                  className="h-12 text-base bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 mb-3"
                  autoFocus
                />
                <Button
                  type="submit"
                  variant="secondary"
                  className="w-full h-10 font-semibold"
                >
                  Save
                </Button>
              </form>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-start">
                <button onClick={() => setEditingShop(true)} className="text-left group">
                  <div className="flex items-center gap-2 text-primary-foreground/70 mb-1">
                    <Store className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-wide">Aapki Dukaan</span>
                  </div>
                  <h1 className="text-2xl font-bold text-primary-foreground group-hover:underline">{shopName || "N/A"}</h1>
                </button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-primary-foreground hover:bg-white/10"
                >
                  <LogOut className="w-4 h-4 mr-1" /> Logout
                </Button>
              </div>
              
              <div className="mt-4 pt-4 border-t border-primary-foreground/20">
                <p className="text-sm text-primary-foreground/70">Total Udhar</p>
                <p className="text-3xl font-bold text-primary-foreground">Rs {totalUdhar.toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>

        {/* Baki ka code (Search aur List) same rahega... */}
        {/* Search */}
        {customers.length > 3 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Customer dhundein..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-11 pl-10 text-base rounded-xl"
            />
          </div>
        )}

        {/* Customer List */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Customers ({customers.length})
          </h2>
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg">Koi customer nahi hai</p>
              <p className="text-sm mt-1">Neeche "+" button dabao</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map(c => {
                const total = getCustomerTotal(c);
                return (
                  <button
                    key={c.id}
                    onClick={() => onSelectCustomer(c.id)}
                    className="w-full bg-card rounded-xl p-4 shadow-sm border flex items-center justify-between hover:shadow-md transition-shadow text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">
                          {c.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.transactions.length} entries</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-bold ${total > 0 ? "text-destructive" : "text-success"}`}>
                        Rs {Math.abs(total).toLocaleString()}
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={onAddCustomer}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow active:scale-95"
      >
        <Plus className="w-7 h-7" />
      </button>
    </div>
  );
}