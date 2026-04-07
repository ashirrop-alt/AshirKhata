import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase"; // <--- Yeh line add ki hai

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (name: string, phone: string) => void;
}

export function AddCustomerDialog({ open, onClose, onAdd }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false); // <--- Yeh state missing thi

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || loading) return;

    setLoading(true);
    try {
      // 1. Current user ki ID lein
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Pehle login karein!");
        return;
      }

      // 2. Database mein save karein
      const { error } = await supabase
        .from('customers')
        .insert([{ 
          name, 
          phone, 
          user_id: user.id 
        }]);

      if (error) throw error;

      toast.success("Customer save ho gaya!");
      
      // Parent component ko batana ke kaam ho gaya
      onAdd(name, phone); 
      
      // Form saaf karein aur band karein
      setName("");
      setPhone("");
      onClose();
      
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] sm:max-w-[425px] w-[90%] sm:w-full rounded-2xl p-6 bg-white outline-none z-[100]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Naya Customer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <Input
            placeholder="Customer ka naam"
            value={name}
            onChange={e => setName(e.target.value)}
            className="h-12 text-base"
            disabled={loading}
          />
          <Input
            placeholder="Phone number (923...)"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            type="tel"
            className="h-12 text-base"
            disabled={loading}
          />
          <Button 
            type="submit"
            className="w-full h-12 text-base font-semibold" 
            disabled={!name.trim() || loading}
          >
            {loading ? "Sabr karein..." : "Customer Add Karo"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}