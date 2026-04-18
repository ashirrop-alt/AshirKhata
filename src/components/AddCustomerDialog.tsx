import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (name: string, phone: string) => Promise<void>; // useKhata ka function async hai
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
      // Saara insertion ka kaam onAdd (useKhata) handle karega
      await onAdd(name.trim(), phone.trim());

      // Form reset aur dialog close
      setName("");
      setPhone("");
      onClose();

      // window.location.reload() nikal diya hai taake refresh aur double record na ho
    } catch (error: any) {
      console.error("System Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl rounded-[2rem] transition-all duration-500">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center text-gray-900">Naya Customer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* --- Customer ka Naam Input --- */}

          <div className="space-y-6 py-2">
            {/* --- Modal Header --- */}
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 text-center tracking-tight">
              Naya Customer
            </h2>

            {/* --- Customer Naam Input --- */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 ml-2 uppercase tracking-[0.15em]">
                Customer ka Naam
              </p>
              <Input
                placeholder="Naam likhien..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-14 text-base bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 focus-visible:ring-2 focus-visible:ring-primary/30 dark:text-slate-200 rounded-2xl transition-all shadow-inner placeholder:text-slate-400 dark:placeholder:text-slate-600"
                required
              />
            </div>

            {/* --- Phone Number Input --- */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 ml-2 uppercase tracking-[0.15em]">
                Phone Number
              </p>
              <Input
                placeholder="03xx-xxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                className="h-14 text-base bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 focus-visible:ring-2 focus-visible:ring-primary/30 dark:text-slate-200 rounded-2xl transition-all shadow-inner placeholder:text-slate-400 dark:placeholder:text-slate-600"
                required
              />
            </div>

            {/* --- Save Button --- */}
            <Button
              type="submit"
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold shadow-lg shadow-primary/20 active:scale-[0.98] transition-all duration-300 mt-2"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Karein"}
            </Button>
          </div>


          <Button
            type="submit"
            className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold shadow-lg shadow-primary/20 active:scale-[0.98] transition-all duration-300 mt-2 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                {/* Emoji ke bajaye agar aapka Loader icon hai toh wo behtar hai, warna ye text clean hai */}
                <span className="animate-pulse">Saving...</span>
              </div>
            ) : (
              "Save Karein"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}