import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
      <DialogContent className="w-[90%] max-w-[400px] bg-white dark:bg-[#0f172a] border-none shadow-2xl rounded-[2.5rem] p-8 outline-none">
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* --- Header --- */}
          <h2 className="text-2xl font-black text-slate-900 dark:text-white text-center tracking-tighter">
            Naya Customer
          </h2>

          <div className="space-y-6">
            {/* --- Customer Naam --- */}
            <div className="space-y-2.5">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 ml-2 uppercase tracking-[0.15em]">
                Customer ka Naam
              </p>
              <Input
                placeholder="Naam likhien..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-14 bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-white/5 text-slate-900 dark:text-white rounded-2xl focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-0 border-none placeholder:text-slate-400 transition-all"
                required
              />
            </div>

            {/* --- Phone Number --- */}
            <div className="space-y-2.5">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 ml-2 uppercase tracking-[0.15em]">
                Phone Number
              </p>
              <Input
                placeholder="03xx-xxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                className="h-14 bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-white/5 text-slate-900 dark:text-white rounded-2xl focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-0 border-none placeholder:text-slate-400 transition-all"
                required
              />
            </div>

            {/* --- Save Button --- */}
            <Button
              type="submit"
              className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-xl shadow-indigo-500/25 active:scale-95 transition-all mt-4 text-base"
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