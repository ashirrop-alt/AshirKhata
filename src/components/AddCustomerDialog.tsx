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
    
    // Validation: Dono cheezein zaroori hain
    if (!name.trim() || !phone.trim() || loading) {
      toast.error("Naam aur Phone Number dono likhna zaroori hain!");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Pehle login karein!");
        return;
      }

      // 1. Database mein insert
      const { error } = await supabase
        .from('customers')
        .insert([
          { 
            name: name.trim(), 
            phone: phone.trim(), 
            user_id: user.id,
            transactions: [] 
          }
        ]);

      if (error) throw error;

      toast.success("Customer save ho gaya!");
      
      // 2. UI update karein
      onAdd(name.trim(), phone.trim());
      
      // 3. Clear and Close
      setName("");
      setPhone("");
      onClose();

      // 4. Force refresh taake naya banda foran list mein nazar aaye
      window.location.reload();

    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "Customer save nahi ho saka");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] sm:max-w-[425px] w-[90%] sm:w-full rounded-2xl p-6 bg-white outline-none z-[100]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center">Naya Customer Add Karo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <Input
            placeholder="Customer ka naam"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 text-base"
            required
          />
          <Input
            placeholder="Phone number (WhatsApp ke liye)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            className="h-12 text-base"
            required
          />
          <Button 
            type="submit" 
            className="w-full h-12 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 text-white" 
            disabled={loading}
          >
            {loading ? "Sabr karein..." : "Customer Add Karo"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}