import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onClose: () => void;
  type: "udhar" | "payment";
  onAdd: (type: "udhar" | "payment", amount: number) => void;
  initialAmount?: number; // Pre-fill ke liye naya prop
}

export function AddEntryDialog({ open, onClose, type, onAdd, initialAmount }: Props) {
  const [amount, setAmount] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Jab dialog khule, check karo ke edit ho raha hai ya add
  useEffect(() => {
    if (open) {
      // Agar initialAmount hai (Edit mode), toh usey set karo warna khali (Add mode)
      setAmount(initialAmount ? initialAmount.toString() : "");
      
      // Thora sa delay taake dialog poora load ho jaye phir auto-focus/select kare
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select(); // Poori amount ko select kar lega
        }
      }, 50);
    }
  }, [open, initialAmount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) return;
    
    onAdd(type, numAmount);
    setAmount("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[92%] max-w-[400px] rounded-[28px] p-6 border-none shadow-2xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className={`text-xl font-black ${type === "udhar" ? "text-red-600" : "text-emerald-600"}`}>
            {type === "udhar" ? "Udhar Diya" : "Paisa Mila"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="relative group">
            <Input
              ref={inputRef}
              type="number"
              placeholder="Amount (Rs)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-16 text-2xl font-black text-center rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-indigo-500 transition-all"
            />
          </div>
          
          <Button 
            type="submit"
            className={`w-full h-14 rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-transform ${
              type === "udhar" ? "bg-red-600 hover:bg-red-700" : "bg-emerald-500 hover:bg-emerald-600"
            }`}
          >
            {initialAmount ? "Update Karo" : "Save Karo"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}