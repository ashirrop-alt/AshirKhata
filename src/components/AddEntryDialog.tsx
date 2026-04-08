import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Props {
  open: boolean;
  type: "udhar" | "payment";
  onClose: () => void;
  onAdd: (type: "udhar" | "payment", amount: number) => void;
}

export function AddEntryDialog({ open, type, onClose, onAdd }: Props) {
  const [amount, setAmount] = useState("");

  const handleSubmit = (e?: React.FormEvent) => {
    // Form submit hone par page refresh rokne ke liye
    if (e) e.preventDefault();
    
    const num = parseFloat(amount);
    if (!num || num <= 0) return;
    
    onAdd(type, num);
    toast.success("Entry save ho gayi!");
    setAmount("");
    onClose();
  };

  const isUdhar = type === "udhar";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] sm:max-w-[425px] w-[90%] sm:w-full rounded-2xl p-6 bg-white outline-none z-[100] transform transition-transform duration-300 ease-in-out sm:mb-0 mb-[10vh]">
        <DialogHeader>
          <DialogTitle className={`text-lg font-semibold ${isUdhar ? "text-destructive" : "text-success"}`}>
            {isUdhar ? "Udhar Diya" : "Paisa Mila"}
          </DialogTitle>
        </DialogHeader>

        {/* --- Form tag add kiya gaya hai taake Enter kaam kare --- */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <Input
            placeholder="Amount (Rs)"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            type="number"
            inputMode="numeric"
            className="h-14 text-xl font-semibold text-center"
            autoFocus
            required
          />
          <Button
            type="submit" // Type hamesha submit hona chahiye
            className={`w-full h-12 text-base font-semibold ${
              isUdhar
                ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                : "bg-success hover:bg-success/90 text-success-foreground"
            }`}
            disabled={!amount || parseFloat(amount) <= 0}
          >
            Save Karo
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}