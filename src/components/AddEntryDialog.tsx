import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; // Agar Textarea component hai toh

interface Props {
  open: boolean;
  onClose: () => void;
  type: "udhar" | "payment";
  onAdd: (type: "udhar" | "payment", amount: number, remarks: string) => void; // Remarks add kiya
  initialAmount?: number;
  initialRemarks?: string; // Edit ke liye remarks
}

export function AddEntryDialog({ open, onClose, type, onAdd, initialAmount, initialRemarks }: Props) {
  const [amount, setAmount] = useState<string>("");
  const [remarks, setRemarks] = useState<string>(""); // New State
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setAmount(initialAmount ? initialAmount.toString() : "");
      setRemarks(initialRemarks || ""); // Remarks load karein

      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 50);
    }
  }, [open, initialAmount, initialRemarks]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) return;

    onAdd(type, numAmount, remarks); // Remarks pass karein
    setAmount("");
    setRemarks("");
  };

  const dynamicPlaceholder = type === "udhar"
    ? "Detail (e.g. 1 KG Cheeni)"
    : "Detail (e.g. Cheeni ke paise)";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-card border-none dark:border dark:border-white/10 shadow-2xl rounded-3xl transition-all duration-500">
        <DialogHeader>
          <DialogTitle className={`text-xl font-black ${type === "udhar" ? "text-red-600" : "text-emerald-600"}`}>
            {type === "udhar" ? "Udhar Diya" : "Paisa Mila"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-3">
            <Input
              ref={inputRef}
              type="number"
              placeholder="Amount (Rs)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-16 text-2xl font-black text-center rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-indigo-500 transition-all"
            />

            {/* Remarks Input Field */}
            <Input
              placeholder={dynamicPlaceholder} // <--- Ab ye type ke hisaab se badlega
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="..."
            />
          </div>

          <Button
            type="submit"
            className={`w-full h-14 rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-transform ${type === "udhar" ? "bg-red-600 hover:bg-red-700" : "bg-emerald-500 hover:bg-emerald-600"
              }`}
          >
            {initialAmount ? "Update Karo" : "Save Karo"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}