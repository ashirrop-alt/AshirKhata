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
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top Header */}
      <div className="flex-none bg-card shadow-sm border-b px-4 py-4 z-30">
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

      {/* Main Body Area */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-6xl mx-auto h-full flex flex-col md:flex-row gap-6 p-4">
          
          {/* LEFT COLUMN: Info & Buttons (Desktop pe fixed) */}
          <div className="flex-none w-full md:w-80 space-y-4">
            <div className={`rounded-xl p-5 shadow-sm border ${total > 0 ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}>
              <p className="text-sm font-medium text-gray-600">Total Udhar</p>
              <p className={`text-3xl font-bold mt-1 ${total > 0 ? "text-red-600" : "text-green-600"}`}>
                Rs {Math.abs(total).toLocaleString()}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
              <Button
                onClick={() => { setEntryType("udhar"); setEntryOpen(true); }}
                className="h-14 md:h-12 text-base font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md transition-transform active:scale-95"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Udhar Diya"}
              </Button>
              <Button
                onClick={() => { setEntryType("payment"); setEntryOpen(true); }}
                className="h-14 md:h-12 text-base font-bold bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md transition-transform active:scale-95"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Paisa Mila"}
              </Button>
            </div>

            {customer.phone && total > 0 && (
              <Button
                onClick={sendReminder}
                variant="outline"
                className="w-full h-12 text-base font-medium rounded-xl border-2 border-green-500 text-green-600 gap-2 hover:bg-green-50 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp Reminder
              </Button>
            )}
          </div>

          {/* RIGHT COLUMN: Transactions List (Independent Scroll) */}
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar border-t md:border-t-0 pt-4 md:pt-0">
            {/* Sticky Header Fix: Added background and higher z-index */}
            <div className="sticky top-0 bg-background z-20 py-2 mb-1">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Hisaab Kitab ({transactions.length})
              </h2>
            </div>

            {transactions.length === 0 ? (
              <div className="text-center py-12 bg-card/50 rounded-2xl border border-dashed mt-4">
                <p className="text-muted-foreground">Abhi tak koi entry nahi hui hai</p>
              </div>
            ) : (
              <div className="space-y-3 pb-20">
                {[...transactions].reverse().map(tx => (
                  <div key={tx.id} className="bg-card rounded-xl p-4 shadow-sm border flex items-center justify-between hover:border-primary/30 hover:shadow-md transition-all">
                    <div>
                      <p className={`text-lg font-bold ${tx.type === "udhar" ? "text-red-600" : "text-green-600"}`}>
                        {tx.type === "udhar" ? "+" : "-"} Rs {tx.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 font-medium">
                        {tx.type === "udhar" ? "Udhar Diya" : "Paisa Mila"} • {formatDate(tx.date)}
                      </p>
                    </div>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-full transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Entry?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Kya aap waqai ye entry khatam karna chahte hain? Ye wapas nahi aa sakegi.
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

      <AddEntryDialog
        open={entryOpen}
        type={entryType}
        onClose={() => setEntryOpen(false)}
        onAdd={handleAddEntry}
      />
    </div>
  );
}