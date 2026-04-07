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
    if (!name.trim() || loading) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Pehle login karein!");
        return;
      }

      // 1. Database mein insert karein
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

      // 2. Success message
      toast.success("Customer save ho gaya!");
      
      // 3. Frontend list ko update karein
      onAdd(name.trim(), phone.trim());
      
      // 4. Form saaf karein aur band karein
      setName("");
      setPhone("");
      onClose();

      // 5. Page ko refresh karein taake data nazar aaye
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Naya Customer Add Karein</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Customer ka Naam</label>
            <Input
              placeholder="Maslan: Ali Ahmed"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Phone Number (Optional)</label>
            <Input
              placeholder="0300-1234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Save Customer"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}