import { useState } from "react";
import { Customer, getCustomerTotal } from "@/lib/store";
import { AddEntryDialog } from "./AddEntryDialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase"; // Supabase import kiya
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
  // In functions ko hum optional kar dete hain kyunke ab hum khud handle karenge
  onAddTransaction?: (customerId: string, type: "udhar" | "payment", amount: number) => void;
  onDeleteTransaction?: (customerId: string, txId: string) => void;
}

export function CustomerDetail({ customer, onBack }: Props) {
  const [entryType, setEntryType] = useState<"udhar" | "payment">("udhar");
  const [entryOpen, setEntryOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const total = getCustomerTotal(customer);

  // --- Naya Saving Logic ---
  const handleAddEntry = async (type: "udhar" | "payment", amount: number) => {
    setLoading(true);
    try {
      const newTransaction = {
        id: crypto.randomUUID(),
        type: type,
        amount: Number(amount),
        date: new Date().toISOString()
      };

      // Purani transactions mein nayi add karein
      const updatedTransactions = [...(customer.transactions || []), newTransaction];

      const { error } = await supabase
        .from('customers')
        .update({ transactions: updatedTransactions })
        .eq('id', customer.id);

      if (error) throw error;

      toast.success("Hisaab save ho gaya!");
      setEntryOpen(false);
      
      // Screen refresh taake naya balance dikhe
      setTimeout(() => window.location.reload(), 500);
    } catch (error: any) {
      toast.error("Save nahi hua: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntry = async (txId: string) => {
    try {
      const updatedTransactions = customer.transactions.filter(t => t.id !== txId);

      const { error } = await supabase
        .from('customers')
        .update({ transactions: updatedTransactions })
        .eq('id', customer.id);

      if (error) throw error;

      toast.success("Entry delete ho gayi!");
      setTimeout(() => window.location.reload(), 500);
    } catch (error: any) {
      toast.error("Delete nahi ho saka");
    }
  };
  // --------------------------

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card shadow-sm border-b px-4 py-4 sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 rounded-lg hover:bg-secondary">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold">{customer.name}</h1>
            {customer.phone && <p className="text-sm text-muted-foreground">{customer.phone}</p>}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-4">
        {/* Total Card */}
        <div className={`rounded-xl p-5 shadow-sm border ${total > 0 ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}>
          <p className="text-sm font-medium text-gray-600">Total Udhar</p>
          <p className={`text-3xl font-bold mt-1 ${total > 0 ? "text-red-600" : "text-green-600"}`}>
            Rs {Math.abs(total).toLocaleString()}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => { setEntryType("udhar"); setEntryOpen(true); }}
            className="h-14 text-base font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Udhar Diya"}
          </Button>
          <Button
            onClick={() => { setEntryType("payment"); setEntryOpen(true); }}
            className="h-14 text-base font-bold bg-green-600 hover:bg-green-700 text-white rounded-xl"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Paisa Mila"}
          </Button>
        </div>

        {/* WhatsApp Reminder */}
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

        {/* Transactions List */}
        <div>
          <h2 className="text-xs font-bold text-gray-500 uppercase mb-3">Hisaab Kitab</h2>
          {customer.transactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Koi entry nahi hai</p>
          ) : (
            <div className="space-y-2">
              {[...customer.transactions].reverse().map(tx => (
                <div key={tx.id} className="bg-white rounded-xl p-4 shadow-sm border flex items-center justify-between">
                  <div>
                    <p className={`text-lg font-bold ${tx.type === "udhar" ? "text-red-600" : "text-green-600"}`}>
                      {tx.type === "udhar" ? "+" : "-"} Rs {tx.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {tx.type === "udhar" ? "Udhar Diya" : "Paisa Mila"} • {formatDate(tx.date)}
                    </p>
                  </div>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="p-2 text-gray-400 hover:text-red-600">
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
                        <AlertDialogAction onClick={() => handleDeleteEntry(tx.id)} className="bg-red-600">Haan, Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AddEntryDialog
        open={entryOpen}
        type={entryType}
        onClose={() => setEntryOpen(false)}
        onAdd={handleAddEntry} // Naya function yahan pass kiya
      />
    </div>
  );
}