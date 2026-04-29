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
      <DialogContent className="w-[88%] md:w-full max-w-[400px] bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/20 shadow-2xl rounded-[2rem] p-7 outline-none transition-all duration-300">
        <form onSubmit={handleSubmit} className="space-y-7">
          {/* --- Header --- */}
          <h2 className="text-xl font-black text-slate-900 dark:text-white text-center tracking-tight">
            Naya Customer
          </h2>

          <div className="space-y-5">
            {/* --- Customer Naam --- */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 ml-2 uppercase tracking-widest">
                Customer ka Naam
              </p>
              <Input
                placeholder="Naam likhien..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/[0.12] text-slate-900 dark:text-white rounded-xl focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-0 placeholder:text-slate-400/60 dark:placeholder:text-slate-500/60 transition-all text-sm"
                required
              />
            </div>

            {/* --- Phone Number --- */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 ml-2 uppercase tracking-widest">
                Phone Number
              </p>
              <Input
                placeholder="03xx-xxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                className="h-12 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/[0.12] text-slate-900 dark:text-white rounded-xl focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-0 placeholder:text-slate-400/60 dark:placeholder:text-slate-500/60 transition-all text-sm"
                required
              />
            </div>

            {/* --- Save Button --- */}
            <Button
              type="submit"
              className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 active:scale-[0.97] transition-all mt-2 text-base"
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