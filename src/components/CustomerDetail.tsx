import { useState } from "react";
import { Customer } from "@/lib/store";
import { AddEntryDialog } from "./AddEntryDialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle, Trash2, Loader2 } from "lucide-react";
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
    <div className="h-screen flex flex-col bg-background overflow-hidden font-sans">
      {/* 1. TOP HEADER (Fixed) */}
      <div className="flex-none bg-card shadow-sm border-b px-4 py-4 z-40">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 rounded-lg hover:bg-secondary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold">{customer.name}</h1>
            {customer.phone && <p className="text-sm text-muted-foreground">{customer.phone}</p>}
          </div>
        </div>
      </div>

      {/* 2. MAIN SCROLL AREA */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-6xl mx-auto h-full flex flex-col md:flex-row gap-6 p-4">
          
          {/* LEFT COLUMN: Fixed Balance & Buttons */}
          <div className="flex-none w-full md:w-80 space-y-4">
            <div className={`rounded-2xl p-6 shadow-sm border-2 ${total > 0 ? "bg-red-50 border-red-100" : "bg-green-50 border-green-100"}`}>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Baqaya Rakam</p>
              <p className={`text-3xl font-black mt-1 ${total > 0 ? "text-red-600" : "text-green-600"}`}>
                Rs {Math.abs(total).toLocaleString()}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
              <Button
                onClick={() => { setEntryType("udhar"); setEntryOpen(true); }}
                className="h-14 md:h-12 text-base font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg active:scale-95 transition-all"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Udhar Diya"}
              </Button>
              <Button
                onClick={() => { setEntryType("payment"); setEntryOpen(true); }}
                className="h-14 md:h-12 text-base font-bold bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg active:scale-95 transition-all"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Paisa Mila"}
              </Button>
            </div>

            {customer.phone && total > 0 && (
              <Button
                onClick={sendReminder}
                variant="outline"
                className="w-full h-12 text-base font-semibold rounded-xl border-2 border-green-500 text-green-600 gap-2 hover:bg-green-50"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp Reminder
              </Button>
            )}
          </div>

          {/* RIGHT COLUMN: Transactions with Clean Scroll */}
          <div className="flex-1 flex flex-col min-h-0 bg-card/30 rounded-2xl border overflow-hidden">
            {/* Sticky Header with Background to hide overlap */}
            <div className="flex-none bg-background px-4 py-3 border-b z-20">
              <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest">
                Hisaab Kitab ({transactions.length})
              </h2>
            </div>

            {/* Scrollable List Section */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
              {transactions.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-muted-foreground font-medium">Koi purani entry nahi mili</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {[...transactions].reverse().map(tx => (
                    <div key={tx.id} className="bg-background rounded-xl p-4 shadow-sm border flex items-center justify-between group hover:border-primary/40 transition-all">
                      <div>
                        <p className={`text-lg font-black ${tx.type === "udhar" ? "text-red-600" : "text-green-600"}`}>
                          {tx.type === "udhar" ? "+" : "-"} Rs {tx.amount.toLocaleString()}
                        </p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">
                          {tx.type === "udhar" ? "Udhar Diya" : "Paisa Mila"} • {formatDate(tx.date)}
                        </p>
                      </div>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-full transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Entry?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Kya aap waqai ye entry khatam karna chahte hain?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-xl">Nahi</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteEntry(tx.id)} 
                              className="bg-red-600 text-white hover:bg-red-700 rounded-xl"
                            >
                              Haan, Delete
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
      </div>

      <AddEntryDialog
        open={entryOpen}
        type={entryType}
        onClose={() => setEntryOpen(false)}
        onAdd={handleAddEntry}
      />
    </div>
  );
}