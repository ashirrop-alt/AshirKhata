import { useState } from "react";
import { Customer } from "@/lib/store";
import { AddEntryDialog } from "./AddEntryDialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle, Trash2, Loader2, History, Phone, WalletCards } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Props {
  customer: Customer;
  onBack: () => void;
  onAddTransaction?: (customerId: string, type: "udhar" | "payment", amount: number) => void;
  onDeleteTransaction?: (customerId: string, txId: string) => void;
}

export function CustomerDetail({ customer, onBack }: Props) {
  const [entryType, setEntryType] = useState<"udhar" | "payment">("udhar");
  const [entryOpen, setEntryOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [transactions, setTransactions] = useState(customer.transactions || []);
  
  const total = transactions.reduce((acc, tx) => {
    return tx.type === "udhar" ? acc + tx.amount : acc - tx.amount;
  }, 0);

  const handleAddEntry = async (type: "udhar" | "payment", amount: number) => {
    setLoading(true);
    try {
      const newTransaction = {
        id: crypto.randomUUID(),
        type: type,
        amount: Number(amount),
        date: new Date().toISOString()
      };

      const updatedTransactions = [...transactions, newTransaction];

      const { error } = await supabase
        .from('customers')
        .update({ transactions: updatedTransactions })
        .eq('id', customer.id);

      if (error) throw error;

      setTransactions(updatedTransactions);
      toast.success("Hisaab save ho gaya!");
      setEntryOpen(false);

    } catch (error: any) {
      toast.error("Save nahi hua: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntry = async (txId: string) => {
    try {
      const updatedTransactions = transactions.filter(t => t.id !== txId);

      const { error } = await supabase
        .from('customers')
        .update({ transactions: updatedTransactions })
        .eq('id', customer.id);

      if (error) throw error;

      setTransactions(updatedTransactions);
      toast.success("Entry delete ho gayi!");

    } catch (error: any) {
      toast.error("Delete nahi ho saka");
    }
  };

  const sendReminder = () => {
    if (!customer.phone) return;
    const phone = customer.phone.replace(/^0/, "92");
    const message = `Assalam o Alaikum! Aapka udhar Rs ${total} baqi hai. Meharbani kar ke jaldi ada kar dein. Shukriya!`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <div className="h-screen flex flex-col bg-[#f8fafc] overflow-hidden font-sans">
      
      {/* 1. TOP NAVBAR */}
      <header className="flex-none bg-white border-b px-4 py-3 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <button onClick={onBack} className="p-1.5 sm:p-2 rounded-xl hover:bg-slate-100 transition-all active:scale-90">
              <ArrowLeft className="w-5 h-5 sm:w-6 h-6 text-slate-600" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-slate-800 leading-tight">{customer.name}</h1>
              {customer.phone && (
                <div className="flex items-center gap-1 text-slate-500">
                  <Phone className="w-3 h-3" />
                  <span className="text-[10px] sm:text-xs font-semibold">{customer.phone}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1 sm:py-1.5 bg-slate-100 rounded-full text-slate-600">
             <WalletCards className="w-3.5 h-3.5 sm:w-4 h-4" />
             <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Profile</span>
          </div>
        </div>
      </header>

      {/* 2. MAIN LAYOUT AREA */}
      <main className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full flex flex-col md:flex-row gap-4 sm:gap-6 p-3 sm:p-4 md:p-6 relative">
          
          {/* LEFT SIDEBAR: Stats & Quick Actions (Mobile pe center mein scroll ke upar) */}
          <div className="flex-none w-full md:w-80 space-y-4 sm:space-y-6 z-10 bg-[#f8fafc] md:bg-transparent pb-2 md:pb-0">
            
            {/* Balance Card */}
            <div className={`rounded-3xl md:rounded-[2rem] p-6 sm:p-8 shadow-md md:shadow-2xl relative overflow-hidden transition-all ${
              total > 0 ? "bg-white border-b-4 md:border-b-8 border-red-500 text-slate-800" : "bg-white border-b-4 md:border-b-8 border-emerald-500 text-slate-800"
            }`}>
              <div className={`absolute -right-4 -top-4 w-20 h-20 sm:w-24 h-24 rounded-full opacity-10 ${total > 0 ? "bg-red-500" : "bg-emerald-500"}`} />
              <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-1.5 sm:mb-2">Baqaya Rakam</p>
              <h2 className={`text-2xl sm:text-4xl font-black tracking-tight ${total > 0 ? "text-red-600" : "text-emerald-600"}`}>
                Rs {Math.abs(total).toLocaleString()}
              </h2>
            </div>

            {/* Action Buttons (Compact on Mobile) */}
            <div className="grid grid-cols-2 md:grid-cols-1 gap-3 sm:gap-4">
              <Button
                onClick={() => { setEntryType("udhar"); setEntryOpen(true); }}
                // shadow-md use kiya glow kam karne ke liye, mobile pe height kam ki
                className="h-12 sm:h-16 text-sm sm:text-lg font-black bg-red-600 hover:bg-red-700 text-white rounded-xl sm:rounded-2xl shadow-md shadow-red-100 active:scale-95 transition-all group"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-xl sm:text-2xl group-hover:translate-x-1 transition-transform">+</span>
                    Udhar Diya
                  </div>
                )}
              </Button>
              
              <Button
                onClick={() => { setEntryType("payment"); setEntryOpen(true); }}
                // shadow-md use kiya glow kam karne ke liye
                className="h-12 sm:h-16 text-sm sm:text-lg font-black bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl sm:rounded-2xl shadow-md shadow-emerald-100 active:scale-95 transition-all group"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-xl sm:text-2xl group-hover:-translate-x-1 transition-transform">-</span>
                    Paisa Mila
                  </div>
                )}
              </Button>
            </div>

            {/* WhatsApp Reminder Button (Compact on Mobile) */}
            {customer.phone && total > 0 && (
              <Button
                onClick={sendReminder}
                variant="ghost" // ghost design mobile compact ke liye
                className="w-full md:w-auto md:h-14 md:text-base md:font-bold md:rounded-2xl md:border-2 md:border-emerald-500 md:text-emerald-600 md:hover:bg-emerald-50 md:shadow-sm flex items-center justify-center gap-2 text-emerald-600 hover:bg-emerald-50/50 p-2 md:p-6 rounded-lg text-sm font-semibold"
              >
                <MessageCircle className="w-5 h-5 fill-emerald-600 text-white md:w-6 h-6" />
                WhatsApp Reminder
              </Button>
            )}
          </div>

          {/* RIGHT SIDE: Transaction History List */}
          <div className="flex-1 flex flex-col min-h-0 bg-white rounded-2xl md:rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden mt-2 md:mt-0 relative z-0">
            
            {/* List Header */}
            <div className="flex-none bg-white px-4 sm:px-8 py-4 sm:py-6 border-b flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-2 text-slate-800">
                <History className="w-4 h-4 sm:w-5 h-5 text-slate-400" />
                <h2 className="text-[10px] sm:text-sm font-black uppercase tracking-widest">
                  Hisaab Kitab ({transactions.length})
                </h2>
              </div>
            </div>

            {/* Scrollable Transactions */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 sm:p-6 pb-20 md:pb-6">
              {transactions.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 sm:py-20 bg-slate-50/50 rounded-2xl sm:rounded-[2rem] border-2 border-dashed border-slate-200">
                  <div className="w-12 h-12 sm:w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-3 sm:mb-4 text-slate-400">
                    <History className="w-6 h-6 sm:w-8 h-8" />
                  </div>
                  <p className="text-slate-500 font-bold text-sm sm:text-base">Abhi tak koi entry nahi hui</p>
                  <p className="text-slate-400 text-xs sm:text-sm">Udhar ya Payment add karein</p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {[...transactions].reverse().map(tx => (
                    <div 
                      key={tx.id} 
                      className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 border border-slate-50 hover:border-slate-200 hover:shadow-md transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className={`w-10 h-10 sm:w-12 h-12 rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-lg sm:text-xl shadow-inner ${
                          tx.type === "udhar" ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-500"
                        }`}>
                          {tx.type === "udhar" ? "+" : "-"}
                        </div>
                        <div>
                          <p className={`text-lg sm:text-xl font-black ${tx.type === "udhar" ? "text-red-600" : "text-emerald-600"}`}>
                            Rs {tx.amount.toLocaleString()}
                          </p>
                          <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
                            <span className="text-[9px] sm:text-[10px] font-black bg-slate-100 text-slate-500 px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-tighter">
                              {tx.type === "udhar" ? "Udhar Diya" : "Paisa Mila"}
                            </span>
                            <span className="text-[9px] sm:text-[10px] font-bold text-slate-400">
                              {formatDate(tx.date)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Delete logic remains same... */}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* Entry Dialog Component... */}
    </div>
  );
}