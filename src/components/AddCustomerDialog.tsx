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
      <DialogContent className="fixed bottom-0 left-0 right-0 top-auto sm:top-[50%] sm:bottom-auto sm:left-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%] sm:max-w-[425px] w-full rounded-t-[20px] sm:rounded-xl p-6 bg-white outline-none z-[100] mb-[env(keyboard-inset-height,0px)]">
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
