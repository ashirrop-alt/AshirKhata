import { useState } from "react";
import { Customer } from "@/lib/store";
import { AddEntryDialog } from "./AddEntryDialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle, Trash2, History, Phone, WalletCards, MoreVertical, PhoneCall } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  const makeCall = (type: 'phone' | 'whatsapp') => {
    if (!customer.phone) return;
    const cleanPhone = customer.phone.replace(/^0/, "92");
    
    if (type === 'phone') {
      window.open(`tel:${customer.phone}`, "_self");
    } else {
      // Laptop par Desktop App trigger karne ke liye 'send?phone=' best hai
      const waLink = `whatsapp://send?phone=${cleanPhone}`;
      window.location.href = waLink;

      // Fallback: Agar 2 second tak app nahi khulti, toh web open kar de (Optional)
      setTimeout(() => {
        if (document.hasFocus()) {
           // Agar user abhi bhi isi page par hai, matlab app nahi khuli
           // window.open(`https://web.whatsapp.com/send?phone=${cleanPhone}`, "_blank");
        }
      }, 2000);
    }
  };

  const sendReminder = () => {
    if (!customer.phone) return;
    const cleanPhone = customer.phone.replace(/^0/, "92");
    const message = encodeURIComponent(`Assalam o Alaikum! Aapka udhar Rs ${total} baqi hai.`);
    
    // Desktop App direct protocol with message
    const waLink = `whatsapp://send?phone=${cleanPhone}&text=${message}`;
    window.location.href = waLink;
  };

  return (
    <div className="h-screen flex flex-col bg-[#f8fafc] overflow-hidden">
      {/* 1. HEADER - CLEAN & SPACIOUS */}
      <header className="flex-none bg-white border-b px-4 py-3 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-all active:scale-90">
              <ArrowLeft className="w-6 h-6 text-slate-600" />
            </button>
            <div className="flex flex-col">
              <h1 className="text-lg sm:text-xl font-black text-slate-800 leading-none mb-1">{customer.name}</h1>
              {customer.phone && (
                <span className="text-[11px] sm:text-xs font-bold text-slate-400 tracking-tight">{customer.phone}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Call Action with Dropdown */}
            {customer.phone && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                    <PhoneCall className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2 shadow-xl border-slate-100">
                  <DropdownMenuItem onClick={() => makeCall('phone')} className="rounded-xl py-3 cursor-pointer gap-3 font-bold text-slate-700">
                    <Phone className="w-4 h-4 text-blue-500" /> Phone Call
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => makeCall('whatsapp')} className="rounded-xl py-3 cursor-pointer gap-3 font-bold text-slate-700">
                    <MessageCircle className="w-4 h-4 text-emerald-500" /> WhatsApp Call
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <div className="hidden sm:flex bg-slate-100 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-600 items-center gap-1">
              <WalletCards className="w-3.5 h-3.5" /> Profile
            </div>
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto sm:overflow-hidden">
        <div className="max-w-7xl mx-auto h-full flex flex-col md:flex-row gap-4 sm:gap-6 p-4 sm:p-6">

          {/* SIDEBAR: Actions */}
          <div className="w-full md:w-80 space-y-4">
            <div className={`rounded-3xl p-6 sm:p-8 shadow-md border-b-8 transition-all duration-300 bg-white ${total > 0 ? "border-red-500" : "border-emerald-500"}`}>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Baqaya Rakam</p>
              <h2 className={`text-4xl sm:text-5xl font-black tracking-tighter ${total > 0 ? "text-red-600" : "text-emerald-600"}`}>
                Rs {Math.abs(total).toLocaleString()}
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
              <Button
                onClick={() => { setEntryType("udhar"); setEntryOpen(true); }}
                className="h-14 sm:h-16 bg-red-600 hover:bg-red-700 text-white rounded-2xl shadow-sm font-black text-sm sm:text-lg"
              >
                + Udhar Diya
              </Button>
              <Button
                onClick={() => { setEntryType("payment"); setEntryOpen(true); }}
                className="h-14 sm:h-16 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-sm font-black text-sm sm:text-lg"
              >
                - Paisa Mila
              </Button>

              <Button
                onClick={sendReminder}
                variant="outline"
                className="col-span-2 md:col-span-1 h-14 sm:h-16 bg-emerald-50/50 hover:bg-emerald-100/50 text-emerald-700 border-emerald-100 rounded-2xl font-bold flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5 fill-emerald-600 text-emerald-50" />
                <span>WhatsApp Reminder</span>
              </Button>
            </div>
          </div>

          {/* LIST: History */}
          <div className="flex-1 bg-white rounded-3xl border shadow-sm overflow-hidden flex flex-col min-h-[400px]">
            <div className="px-6 py-5 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-slate-400" />
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">
                  Hisaab Kitab ({transactions.length})
                </h2>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
              {[...transactions].reverse().map(tx => (
                <div key={tx.id} className="bg-slate-50/50 rounded-2xl p-4 border border-transparent hover:border-slate-200 transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl shadow-inner ${tx.type === "udhar" ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-500"
                      }`}>
                      {tx.type === "udhar" ? "+" : "-"}
                    </div>
                    <div>
                      <p className={`font-black text-xl ${tx.type === "udhar" ? "text-red-600" : "text-emerald-600"}`}>
                        Rs {tx.amount.toLocaleString()}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                        {tx.type === "udhar" ? "Udhar Diya" : "Paisa Mila"} • {new Date(tx.date).toLocaleDateString("en-PK")}
                      </p>
                    </div>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all md:opacity-0 md:group-hover:opacity-100 focus:opacity-100">
                        <Trash2 className="w-5 h-5 sm:w-4 sm:h-4" />
                      </button>
                    </AlertDialogTrigger>

                    {/* Standard Sizing: Laptop par chota (max-w-[380px]) aur Mobile par centered compact card */}
                    <AlertDialogContent className="w-[92%] max-w-[380px] rounded-[24px] p-5 sm:p-6 border-none shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-lg font-bold text-slate-900 leading-tight">
                          Delete Entry?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-500 font-medium pt-1 text-sm">
                          Is hisaab ko khatam kar dein? Ye wapas nahi ayega.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter className="mt-5 flex flex-row gap-3">
                        {/* Buttons side-by-side even on mobile for a tighter look */}
                        <AlertDialogCancel className="flex-1 rounded-xl h-10 sm:h-11 font-bold border-slate-100 text-slate-600 hover:bg-slate-50 mt-0">
                          Nahi
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteEntry(tx.id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl h-10 sm:h-11 font-bold shadow-sm"
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