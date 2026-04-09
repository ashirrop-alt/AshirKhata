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
      
      {/* 1. TOP NAVBAR (Modernized) */}
      <header className="flex-none bg-white border-b px-4 py-3 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 rounded-xl hover:bg-slate-100 transition-all active:scale-90">
              <ArrowLeft className="w-6 h-6 text-slate-600" />
            </button>
            <div>
              <h1 className="text-xl font-black text-slate-800 leading-tight">{customer.name}</h1>
              {customer.phone && (
                <div className="flex items-center gap-1 text-slate-500">
                  <Phone className="w-3 h-3" />
                  <span className="text-xs font-semibold">{customer.phone}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-slate-600">
             <WalletCards className="w-4 h-4" />
             <span className="text-xs font-bold uppercase tracking-wider">Customer Profile</span>
          </div>
        </div>
      </header>

      {/* 2. MAIN LAYOUT AREA */}
      <main className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full flex flex-col md:flex-row gap-6 p-4 md:p-6">
          
          {/* LEFT SIDEBAR: Stats & Quick Actions */}
          <div className="flex-none w-full md:w-80 space-y-6">
            
            {/* Balance Card */}
            <div className={`rounded-[2rem] p-8 shadow-2xl relative overflow-hidden transition-all duration-500 ${
              total > 0 ? "bg-white border-b-8 border-red-500 text-slate-800" : "bg-white border-b-8 border-emerald-500 text-slate-800"
            }`}>
              <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 ${total > 0 ? "bg-red-500" : "bg-emerald-500"}`} />
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Baqaya Rakam</p>
              <h2 className={`text-4xl font-black tracking-tight ${total > 0 ? "text-red-600" : "text-emerald-600"}`}>
                Rs {Math.abs(total).toLocaleString()}
              </h2>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
              <Button
                onClick={() => { setEntryType("udhar"); setEntryOpen(true); }}
                className="h-16 text-lg font-black bg-red-600 hover:bg-red-700 text-white rounded-2xl shadow-xl shadow-red-200 active:scale-95 transition-all group"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl group-hover:translate-x-1 transition-transform">+</span>
                    Udhar Diya
                  </div>
                )}
              </Button>
              
              <Button
                onClick={() => { setEntryType("payment"); setEntryOpen(true); }}
                className="h-16 text-lg font-black bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-xl shadow-emerald-200 active:scale-95 transition-all group"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl group-hover:-translate-x-1 transition-transform">-</span>
                    Paisa Mila
                  </div>
                )}
              </Button>
            </div>

            {/* WhatsApp Reminder Button */}
            {customer.phone && total > 0 && (
              <Button
                onClick={sendReminder}
                variant="outline"
                className="w-full h-14 text-base font-bold rounded-2xl border-2 border-emerald-500 text-emerald-600 gap-3 hover:bg-emerald-50 transition-colors shadow-sm"
              >
                <MessageCircle className="w-6 h-6 fill-emerald-600 text-white" />
                WhatsApp Reminder
              </Button>
            )}
          </div>

          {/* RIGHT SIDE: Transaction History List */}
          <div className="flex-1 flex flex-col min-h-0 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            
            {/* List Header */}
            <div className="flex-none bg-white px-8 py-6 border-b flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-800">
                <History className="w-5 h-5 text-slate-400" />
                <h2 className="text-sm font-black uppercase tracking-widest">
                  Hisaab Kitab ({transactions.length})
                </h2>
              </div>
            </div>

            {/* Scrollable Transactions */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              {transactions.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-20 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4 text-slate-400">
                    <History className="w-8 h-8" />
                  </div>
                  <p className="text-slate-500 font-bold">Abhi tak koi entry nahi hui</p>
                  <p className="text-slate-400 text-sm">Udhar ya Payment add karein</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {[...transactions].reverse().map(tx => (
                    <div 
                      key={tx.id} 
                      className="bg-white rounded-3xl p-5 border border-slate-50 hover:border-slate-200 hover:shadow-lg transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner ${
                          tx.type === "udhar" ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-500"
                        }`}>
                          {tx.type === "udhar" ? "+" : "-"}
                        </div>
                        <div>
                          <p className={`text-xl font-black ${tx.type === "udhar" ? "text-red-600" : "text-emerald-600"}`}>
                            Rs {tx.amount.toLocaleString()}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                              {tx.type === "udhar" ? "Udhar Diya" : "Paisa Mila"}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400">
                              {formatDate(tx.date)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="p-3 text-slate-200 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-3xl p-8 border-none shadow-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-2xl font-black">Entry Delete Karein?</AlertDialogTitle>
                            <AlertDialogDescription className="text-slate-500 font-medium pt-2">
                              Kya aap waqai is entry ko khatam karna chahte hain? Ye wapas nahi ayegi.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="mt-6 gap-3">
                            <AlertDialogCancel className="rounded-2xl h-12 font-bold border-2">Nahi, Rehne Dein</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteEntry(tx.id)} 
                              className="bg-red-600 text-white hover:bg-red-700 rounded-2xl h-12 font-black"
                            >
                              Haan, Delete Kar Dein
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* Entry Dialog Component */}
      <AddEntryDialog
        open={entryOpen}
        type={entryType}
        onClose={() => setEntryOpen(false)}
        onAdd={handleAddEntry}
      />
    </div>
  );
}