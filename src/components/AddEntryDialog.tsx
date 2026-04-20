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
  const [loading, setLoading] = useState(false);

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
      {/* 1. Mobile width fix aur professional dark mode background */}
      <DialogContent className="w-[82%] max-w-[400px] bg-white dark:bg-[#1e293b] border-none shadow-2xl rounded-[2rem] p-6 outline-none transition-all duration-300">
        <DialogHeader>
          <DialogTitle className={`text-xl font-black text-center ${type === "udhar" ? "text-red-600 dark:text-red-500" : "text-emerald-600 dark:text-emerald-500"}`}>
            {type === "udhar" ? "Udhar Diya" : "Paisa Mila"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            {/* --- Amount Input --- */}
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 ml-2 uppercase tracking-widest">
                Raqam (Amount)
              </p>
              <Input
                ref={inputRef}
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-16 text-3xl font-black text-center rounded-2xl bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-white/5 focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 dark:text-white"
              />
            </div>

            {/* --- Remarks Input --- */}
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 ml-2 uppercase tracking-widest">
                Tafseel (Remarks)
              </p>
              <Input
                placeholder={dynamicPlaceholder}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          {/* --- Submit Button --- */}
          <Button
            type="submit"
            className={`w-full h-14 rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-all ${
              type === "udhar" 
                ? "bg-red-600 hover:bg-red-700 shadow-red-500/20" 
                : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20"
            }`}
            disabled={loading}
          >
            {loading ? "Processing..." : (initialAmount ? "Update Karo" : "Save Karo")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}