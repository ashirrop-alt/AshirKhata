import { useState } from "react";
import { Customer } from "@/lib/store";
import { AddEntryDialog } from "./AddEntryDialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle, Trash2, History, Phone, WalletCards } from "lucide-react";
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
      const { error } = await supabase.from('customers').update({ transactions: updatedTransactions }).eq('id', customer.id);
      if (error) throw error;
      setTransactions(updatedTransactions);
      toast.success("Hisaab save ho gaya!");
      setEntryOpen(false);
    } catch (error: any) {
      toast.error("Save nahi hua");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntry = async (txId: string) => {
    try {
      const updatedTransactions = transactions.filter(t => t.id !== txId);
      const { error } = await supabase.from('customers').update({ transactions: updatedTransactions }).eq('id', customer.id);
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
    const message = `Assalam o Alaikum! Aapka udhar Rs ${total} baqi hai. Meharbani kar ke ada kar dein.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="h-screen flex flex-col bg-[#f8fafc] overflow-hidden">
      {/* 1. HEADER */}
      <header className="flex-none bg-white border-b px-3 sm:px-4 py-2 sm:py-3 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={onBack} className="p-1.5 sm:p-2 rounded-xl hover:bg-slate-100 transition-all active:scale-90">
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600" />
            </button>
            <div>
              <h1 className="text-base sm:text-xl font-black text-slate-800 leading-tight">{customer.name}</h1>
              <div className="flex items-center gap-1 text-slate-500">
                <Phone className="w-2.5 h-2.5" />
                <span className="text-[10px] sm:text-xs font-semibold">{customer.phone || "No Number"}</span>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex bg-slate-100 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-600 items-center gap-1">
             <WalletCards className="w-3.5 h-3.5" /> Customer Profile
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto sm:overflow-hidden">
        <div className="max-w-7xl mx-auto h-full flex flex-col md:flex-row gap-4 sm:gap-6 p-3 sm:p-6">
          
          {/* SIDEBAR: Actions */}
          <div className="w-full md:w-80 space-y-3 sm:space-y-4">
            {/* Balance Card - Compact on Mobile */}
            <div className={`rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 shadow-md border-b-4 sm:border-b-8 transition-all duration-300 bg-white ${total > 0 ? "border-red-500" : "border-emerald-500"}`}>
              <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Baqaya Rakam</p>
              <h2 className={`text-2xl sm:text-4xl font-black tracking-tighter ${total > 0 ? "text-red-600" : "text-emerald-600"}`}>
                Rs {Math.abs(total).toLocaleString()}
              </h2>
            </div>

            {/* Buttons Grid - Smaller Height for Mobile */}
            <div className="grid grid-cols-2 md:grid-cols-1 gap-2.5">
              <Button 
                onClick={() => { setEntryType("udhar"); setEntryOpen(true); }} 
                className="h-12 sm:h-16 bg-red-600 hover:bg-red-700 text-white rounded-xl sm:rounded-2xl shadow-sm font-black text-xs sm:text-lg"
              >
                + Udhar Diya
              </Button>
              <Button 
                onClick={() => { setEntryType("payment"); setEntryOpen(true); }} 
                className="h-12 sm:h-16 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl sm:rounded-2xl shadow-sm font-black text-xs sm:text-lg"
              >
                - Paisa Mila
              </Button>
              
              <Button 
                onClick={sendReminder}
                variant="outline"
                className="col-span-2 md:col-span-1 h-12 sm:h-16 bg-emerald-50/50 hover:bg-emerald-100/50 text-emerald-700 border-emerald-100 rounded-xl sm:rounded-2xl font-bold flex items-center justify-center gap-2 text-xs sm:text-base"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-emerald-600 text-emerald-50" />
                <span>WhatsApp Reminder</span>
              </Button>
            </div>
          </div>

          {/* LIST: History */}
          <div className="flex-1 bg-white rounded-2xl sm:rounded-[2.5rem] border shadow-sm overflow-hidden flex flex-col min-h-[400px]">
            <div className="px-4 sm:px-6 py-3 sm:py-5 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                <h2 className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-500">
                  Hisaab Kitab ({transactions.length})
                </h2>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-2.5">
              {[...transactions].reverse().map(tx => (
                <div key={tx.id} className="bg-slate-50/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-transparent hover:border-slate-200 transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center font-black text-lg sm:text-xl shadow-inner ${
                      tx.type === "udhar" ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-500"
                    }`}>
                      {tx.type === "udhar" ? "+" : "-"}
                    </div>
                    <div>
                      <p className={`font-black text-base sm:text-xl ${tx.type === "udhar" ? "text-red-600" : "text-emerald-600"}`}>
                        Rs {tx.amount.toLocaleString()}
                      </p>
                      <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                        {tx.type === "udhar" ? "Udhar Diya" : "Paisa Mila"} • {new Date(tx.date).toLocaleDateString("en-PK")}
                      </p>
                    </div>
                  </div>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg sm:rounded-xl transition-all md:opacity-0 md:group-hover:opacity-100">
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-3xl max-w-[90vw]">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-lg sm:text-xl font-black">Entry Delete Karein?</AlertDialogTitle>
                        <AlertDialogDescription className="text-sm">
                          Kya aap waqai is entry ko hamesha ke liye khatam karna chahte hain?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="gap-2">
                        <AlertDialogCancel className="rounded-xl font-bold">Nahi</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteEntry(tx.id)} 
                          className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-black"
                        >
                          Haan, Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <AddEntryDialog 
        open={entryOpen} 
        onClose={() => setEntryOpen(false)} 
        type={entryType} 
        onAdd={handleAddEntry} 
      />
    </div>
  );
}