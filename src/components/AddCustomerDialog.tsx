import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog"; // DialogHeader/Title nikal diye kyunki hum custom h2 use kar rahe hain
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (name: string, phone: string) => Promise<void>;
}

export function AddCustomerDialog({ open, onClose, onAdd }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || loading) return;

    setLoading(true);
    try {
      await onAdd(name.trim(), phone.trim());
      setName("");
      setPhone("");
      onClose();
    } catch (error: any) {
      console.error("System Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      {/* 1. Mobile Width aur Dark Mode Background yahan fix kiya hai */}
      <DialogContent className="
  /* Mobile par niche se chipka hua (Bottom Sheet) */
  sm:max-w-[425px] w-full 
  fixed bottom-0 sm:bottom-[unset] sm:top-[50%] 
  translate-y-0 sm:-translate-y-[50%]
  rounded-t-[2.5rem] sm:rounded-[2.5rem] 
  bg-white dark:bg-[#0f172a] 
  p-8 pb-10 sm:pb-8
  border-none shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)]
  transition-transform duration-500 ease-out
">
        {/* Handlebar for Mobile (Standard UI) */}
        <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mb-6 sm:hidden" />

        <form onSubmit={handleSubmit} className="space-y-7">
          <div className="text-center">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Naya Customer
            </h2>
          </div>

          <div className="space-y-5">
            {/* Input Group */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-blue-600 dark:text-blue-400 ml-2 uppercase tracking-[0.2em]">
                Naam
              </label>
              <Input
                placeholder="Customer ka naam..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-15 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-2xl focus:ring-4 focus:ring-blue-500/10 transition-all text-base"
                required
              />
            </div>

            {/* Button - Floating & Premium */}
            <Button
              type="submit"
              className="w-full h-15 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/25 active:scale-[0.98] transition-all"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Karein"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}