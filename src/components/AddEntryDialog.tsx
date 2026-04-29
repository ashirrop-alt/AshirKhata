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
  onAdd: (type: "udhar" | "payment", amount: number, remarks: string) => void;
  initialAmount?: number;
  initialRemarks?: string;
}

export function AddEntryDialog({ open, onClose, type, onAdd, initialAmount, initialRemarks }: Props) {
  const [amount, setAmount] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setAmount(initialAmount ? initialAmount.toString() : "");
      setRemarks(initialRemarks || "");

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

    onAdd(type, numAmount, remarks);
    setAmount("");
    setRemarks("");
  };

  const dynamicPlaceholder = type === "udhar"
    ? "Detail (e.g. 1 KG Cheeni)"
    : "Detail (e.g. Cheeni ke paise)";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[88%] md:w-full max-w-[400px] bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/20 shadow-2xl rounded-[2rem] p-7 outline-none transition-all duration-300">
        <DialogHeader>
          <DialogTitle className={`text-xl font-black text-center tracking-tight ${type === "udhar" ? "text-red-600 dark:text-red-500" : "text-emerald-600 dark:text-emerald-500"}`}>
            {type === "udhar" ? "Udhar Diya" : "Paisa Mila"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          <div className="space-y-5">
            {/* --- Amount Input --- */}
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 ml-2 uppercase tracking-widest text-center">
                Raqam (Amount)
              </p>
              <Input
                ref={inputRef}
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-20 text-4xl font-black text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/[0.12] focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-0 text-slate-900 dark:text-white transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700"
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
                className="h-12 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/[0.12] text-slate-900 dark:text-white rounded-xl focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-0 placeholder:text-slate-400/60 dark:placeholder:text-slate-500/60 transition-all text-sm"
              />
            </div>
          </div>

          {/* --- Submit Button --- */}
          <Button
            type="submit"
            className={`w-full h-14 rounded-xl font-bold text-base shadow-lg active:scale-95 transition-all ${
              type === "udhar" 
                ? "bg-red-600 hover:bg-red-700 shadow-red-500/25" 
                : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25"
            }`}
            disabled={loading}
          >
            {loading ? "Processing..." : (initialAmount ? "Update Karein" : "Save Karein")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}