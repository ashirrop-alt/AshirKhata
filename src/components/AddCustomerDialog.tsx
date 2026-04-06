import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (name: string, phone: string) => void;
}

export function AddCustomerDialog({ open, onClose, onAdd }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) return;
    onAdd(name.trim(), phone.trim());
    toast.success("Customer add ho gaya!");
    setName("");
    setPhone("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] sm:max-w-[425px] w-[90%] sm:w-full rounded-2xl p-6 bg-white outline-none z-[100] transform transition-transform duration-300 ease-in-out sm:mb-0 mb-[10vh]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Naya Customer</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <Input
            placeholder="Customer ka naam"
            value={name}
            onChange={e => setName(e.target.value)}
            className="h-12 text-base"
          />
          <Input
            placeholder="Phone number (923...)"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            type="tel"
            inputMode="tel"
            className="h-12 text-base"
          />
          <Button onClick={handleSubmit} className="w-full h-12 text-base font-semibold" disabled={!name.trim()}>
            Customer Add Karo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
