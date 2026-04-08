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
      <DialogContent className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] sm:max-w-[425px] w-[90%] sm:w-full rounded-2xl p-6 bg-white outline-none z-[100]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center text-gray-900">Naya Customer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-700">Customer ka Naam</p>
            <Input
              placeholder="Maslan: Ali Ahmed"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 text-base border-gray-300 focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-700">WhatsApp Number</p>
            <Input
              placeholder="03001234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              className="h-12 text-base border-gray-300 focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Karein"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}