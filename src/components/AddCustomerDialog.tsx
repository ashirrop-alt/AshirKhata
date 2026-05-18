import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NotebookTabs } from "lucide-react"; // Chota aur pyara icon
import { toast } from "sonner"; // Toast notification ke liye

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (name: string, phone: string) => Promise<void>;
}

export function AddCustomerDialog({ open, onClose, onAdd }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Check karne ke liye ke user ka browser contact picker support karta hai ya nahi
  const [isContactSupported, setIsContactSupported] = useState(false);

  useEffect(() => {
    if ("contacts" in navigator && "ContactsManager" in window) {
      setIsContactSupported(true);
    }
  }, []);

  const handlePickContact = async () => {
    try {
      const props = ["name", "tel"];
      const opts = { multiple: false }; // Ek waqt mein ek hi customer select hoga

      // Mobile ki asli contact list trigger hogi yahan
      const contacts = await (navigator as any).contacts.select(props, opts);

      if (contacts && contacts.length > 0) {
        const picked = contacts[0];

        // 1. Name autofill logic
        if (picked.name && picked.name.length > 0) {
          setName(picked.name[0]);
        }

        // 2. Phone number clean aur autofill logic
        if (picked.tel && picked.tel.length > 0) {
          let rawPhone = picked.tel[0];
          
          // Pakistani numbers ka clean-up setup (+92300... ya 0092300... ko clean karke standard 0300... banana)
          let cleanPhone = rawPhone.replace(/[^0-9+]/g, ""); // Sirf numbers aur '+' rakhein
          
          if (cleanPhone.startsWith("+92")) {
            cleanPhone = "0" + cleanPhone.slice(3);
          } else if (cleanPhone.startsWith("92")) {
            cleanPhone = "0" + cleanPhone.slice(2);
          } else if (cleanPhone.startsWith("0092")) {
            cleanPhone = "0" + cleanPhone.slice(4);
          }
          
          setPhone(cleanPhone);
          toast.success("Contact details auto-fill ho gayeen! 😊");
        }
      }
    } catch (error: any) {
      // Agar user back daba kar baghair select kiye band kar de toh error handle ho jaye
      console.log("Contact pick nahi kiya:", error.message);
    }
  };

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
      toast.error("Customer save karne mein masla aaya!");
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

            {/* --- Phone Number (With Contact Picker Trigger) --- */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-2">
                <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  Phone Number
                </p>
                
                {/* Agar mobile browser support karta hai tabhi yeh option chamkega */}
                {isContactSupported && (
                  <button
                    type="button"
                    onClick={handlePickContact}
                    className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline active:scale-95 transition-all"
                  >
                    <NotebookTabs size={13} />
                    Contacts se dhoondien
                  </button>
                )}
              </div>
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