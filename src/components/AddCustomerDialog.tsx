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
      <DialogContent className="w-[92%] max-w-[400px] bg-white dark:bg-[#1e293b] border-none shadow-2xl rounded-[2rem] p-6 outline-none transition-all duration-300">
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* --- Modal Header --- */}
          <h2 className="text-xl font-black text-slate-900 dark:text-white text-center tracking-tight">
            Naya Customer
          </h2>

          {/* --- Customer Naam Input --- */}
          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 ml-2 uppercase tracking-widest">
              Customer ka Naam
            </p>
            <Input
              placeholder="Naam likhien..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              // 2. Input ka look professional aur dark mode friendly kiya hai
              className="h-14 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-2xl focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
              required
            />
          </div>

          {/* --- Phone Number Input --- */}
          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 ml-2 uppercase tracking-widest">
              Phone Number
            </p>
            <Input
              placeholder="03xx-xxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              className="h-14 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-2xl focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
              required
            />
          </div>

          {/* --- Save Button --- */}
          <Button
            type="submit"
            className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Karein"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}