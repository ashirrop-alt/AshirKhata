import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (name: string, phone: string) => void;
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Pehle login karein!");
        return;
      }

      // TABLE NAME CHECK: Aapke DB mein 'customer' hai ya 'customers'? 
      // Agar 'customers' se nahi ho raha toh 'customer' try karein.
      const { error } = await supabase
        .from('customers')
        .insert([
          {
            name: name.trim(),
            phone: phone.trim(),
            user_id: user.id
          }
        ]);

      if (error) {
        console.error("DB Error:", error);
        alert("Database Error: " + error.message);
        throw error;
      }

      toast.success("Customer save ho gaya!");
      onAdd(name.trim(), phone.trim());
      setName("");
      setPhone("");
      onClose();

      // Refresh taake data load ho jaye
      setTimeout(() => window.location.reload(), 500);

    } catch (error: any) {
      alert("System Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] sm:max-w-[425px] w-[90%] sm:w-full rounded-2xl p-6 bg-white outline-none z-[100]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center">Naya Customer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <Input
            placeholder="Naam likhein"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12"
            required
          />
          <Input
            placeholder="WhatsApp Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            className="h-12"
            required
          />
          <Button
            type="submit"
            className="w-full h-12 bg-indigo-600"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Karein"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}