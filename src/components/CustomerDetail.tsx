import { useState } from "react";
import { Customer, getCustomerTotal } from "@/lib/store";
import { AddEntryDialog } from "./AddEntryDialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle, Trash2 } from "lucide-react";
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
  onAddTransaction: (customerId: string, type: "udhar" | "payment", amount: number) => void;
  onDeleteTransaction: (customerId: string, txId: string) => void;
}

export function CustomerDetail({ customer, onBack, onAddTransaction, onDeleteTransaction }: Props) {
  const [entryType, setEntryType] = useState<"udhar" | "payment">("udhar");
  const [entryOpen, setEntryOpen] = useState(false);
  const total = getCustomerTotal(customer);

  const sendReminder = () => {
  if (!customer.phone) return;

  const phone = customer.phone.replace(/^0/, "92"); // auto fix number
  const message = `Assalam o Alaikum! Aapka udhar Rs ${total} baqi hai. Meharbani kar ke jaldi ada kar dein. Shukriya!`;

  const url = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`;

  window.location.href = url;
};

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card shadow-sm border-b px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 rounded-lg hover:bg-secondary transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">{customer.name}</h1>
            {customer.phone && <p className="text-sm text-muted-foreground">{customer.phone}</p>}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-4">
        {/* Total Card */}
        <div className={`rounded-xl p-5 shadow-sm ${total > 0 ? "bg-destructive/10 border border-destructive/20" : "bg-success/10 border border-success/20"}`}>
          <p className="text-sm font-medium text-muted-foreground">Total Udhar</p>
          <p className={`text-3xl font-bold mt-1 ${total > 0 ? "text-destructive" : "text-success"}`}>
            Rs {Math.abs(total).toLocaleString()}
          </p>
          {total <= 0 && <p className="text-sm text-success mt-1">Sab hisaab barabar hai! ✅</p>}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => { setEntryType("udhar"); setEntryOpen(true); }}
            className="h-14 text-base font-semibold bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl"
          >
            Udhar Diya
          </Button>
          <Button
            onClick={() => { setEntryType("payment"); setEntryOpen(true); }}
            className="h-14 text-base font-semibold bg-success hover:bg-success/90 text-success-foreground rounded-xl"
          >
            Paisa Mila
          </Button>
        </div>

        {/* WhatsApp Reminder */}
        {customer.phone && total > 0 && (
          <Button
            onClick={sendReminder}
            variant="outline"
            className="w-full h-12 text-base font-medium rounded-xl border-2 gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Reminder Bhejo
          </Button>
        )}

        {/* Transactions */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Transactions</h2>
          {customer.transactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Koi entry nahi hai abhi</p>
          ) : (
            <div className="space-y-2">
              {[...customer.transactions].reverse().map(tx => (
                <div key={tx.id} className="bg-card rounded-xl p-4 shadow-sm border flex items-center justify-between">
                  <div>
                    <p className={`text-lg font-bold ${tx.type === "udhar" ? "text-destructive" : "text-success"}`}>
                      {tx.type === "udhar" ? "+" : "-"} Rs {tx.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {tx.type === "udhar" ? "Udhar Diya" : "Paisa Mila"} • {formatDate(tx.date)}
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Entry</AlertDialogTitle>
                        <AlertDialogDescription>
                          Kya aap ye entry delete karna chahte hain?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Nahi</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDeleteTransaction(customer.id, tx.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Haan, Delete Karo
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

      <AddEntryDialog
        open={entryOpen}
        type={entryType}
        onClose={() => setEntryOpen(false)}
        onAdd={(type, amount) => onAddTransaction(customer.id, type, amount)}
      />
    </div>
  );
}
