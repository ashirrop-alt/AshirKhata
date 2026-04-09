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
      <div className="flex-none bg-card shadow-sm border-b px-4 py-4 z-10">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 rounded-lg hover:bg-secondary">
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
                className="h-14 md:h-12 text-base font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl"
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin" /> : "Udhar Diya"}
              </Button>
              <Button
                onClick={() => { setEntryType("payment"); setEntryOpen(true); }}
                className="h-14 md:h-12 text-base font-bold bg-green-600 hover:bg-green-700 text-white rounded-xl"
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin" /> : "Paisa Mila"}
              </Button>
            </div>

            {customer.phone && total > 0 && (
              <Button
                onClick={sendReminder}
                variant="outline"
                className="w-full h-12 text-base font-medium rounded-xl border-2 border-green-500 text-green-600 gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp Reminder
              </Button>
            )}
          </div>

          {/* RIGHT COLUMN: Transactions List (Independent Scroll) */}
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar border-t md:border-t-0 pt-4 md:pt-0">
            <h2 className="text-xs font-bold text-gray-500 uppercase mb-3 sticky top-0 bg-background py-2">Hisaab Kitab</h2>
            {transactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Koi entry nahi hai</p>
            ) : (
              <div className="space-y-2 pb-10">
                {[...transactions].reverse().map(tx => (
                  <div key={tx.id} className="bg-card rounded-xl p-4 shadow-sm border flex items-center justify-between hover:border-primary/20 transition-colors">
                    <div>
                      <p className={`text-lg font-bold ${tx.type === "udhar" ? "text-red-600" : "text-green-600"}`}>
                        {tx.type === "udhar" ? "+" : "-"} Rs {tx.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {tx.type === "udhar" ? "Udhar Diya" : "Paisa Mila"} • {formatDate(tx.date)}
                      </p>
                    </div>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Entry?</AlertDialogTitle>
                          <AlertDialogDescription>Kya aap waqai ye entry khatam karna chahte hain?</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Nahi</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteEntry(tx.id)} className="bg-red-600 text-white">Haan, Delete</AlertDialogAction>
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