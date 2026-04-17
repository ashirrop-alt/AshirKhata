import { useState, useEffect, useRef } from "react";
import { useKhata } from "@/hooks/useKhata";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import InvoiceTemplate from './InvoiceTemplate';
import { Customer } from "@/lib/store";
import { AddEntryDialog } from "./AddEntryDialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, History, Phone, WalletCards, PhoneCall, Pencil } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  customer: Customer;
  onBack: () => void;
}

export function CustomerDetail({ customer, onBack }: Props) {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [entryType, setEntryType] = useState<"udhar" | "payment">("udhar");
  const [entryOpen, setEntryOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState(customer.transactions || []);

  const { data } = useKhata();
  const savedShopName = localStorage.getItem("my_shop_name"); // Underscore use karein
  const displayShopName = data?.shopName || savedShopName || "Khatify User";

  useEffect(() => {
    if (data?.shopName) {
      localStorage.setItem("my_shop_name", data.shopName); // Underscore use karein
    }
  }, [data]);

  const [editingEntry, setEditingEntry] = useState<any>(null);

  const total = transactions.reduce((acc, tx) => {
    return tx.type === "udhar" ? acc + tx.amount : acc - tx.amount;
  }, 0);

  const handleSaveEntry = async (type: "udhar" | "payment", amount: number, remarks: string) => {
    setLoading(true);
    try {
      let updatedTransactions;

      if (editingEntry) {
        updatedTransactions = transactions.map(t =>
          t.id === editingEntry.id
            ? { ...t, type, amount: Number(amount), remarks: remarks }
            : t
        );
      } else {
        const newTransaction = {
          id: crypto.randomUUID(),
          type: type,
          amount: Number(amount),
          remarks: remarks,
          date: new Date().toISOString()
        };
        updatedTransactions = [...transactions, newTransaction];
      }

      const { error } = await supabase.from('customers').update({ transactions: updatedTransactions }).eq('id', customer.id);
      if (error) throw error;

      setTransactions(updatedTransactions);
      toast.success(editingEntry ? "Hisaab update ho gaya!" : "Hisaab save ho gaya!");
      setEntryOpen(false);
      setEditingEntry(null);
    } catch (error: any) {
      toast.error("Save nahi hua");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntry = async (txId: string) => {
    try {
      const updatedTransactions = transactions.filter(t => t.id !== txId);
      const { error } = await supabase.from('customers').update({ transactions: updatedTransactions }).eq('id', customer.id);
      if (error) throw error;
      setTransactions(updatedTransactions);
      toast.success("Entry delete ho gayi!");
    } catch (error: any) {
      toast.error("Delete nahi ho saka");
    }
  };

  const makeCall = (type: 'phone' | 'whatsapp') => {
    if (!customer.phone) return;
    const cleanPhone = customer.phone.replace(/^0/, "92");

    if (type === 'phone') {
      window.open(`tel:${customer.phone}`, "_self");
    } else {
      const waLink = `whatsapp://send?phone=${cleanPhone}`;
      window.location.href = waLink;
    }
  };

  const shareFullHistory = () => {
    // Persistent Shop Name
    const savedShopName = localStorage.getItem("my_shop_name");
    const shopHeader = data?.shopName || savedShopName || "Khatify User";

    let message = `*${shopHeader} - Hisaab Report* 📜\n`;
    message += `Customer: ${customer.name}\n`;
    message += `--------------------------\n`;

    transactions.forEach((t) => {
      const note = t.remarks ? ` (${t.remarks})` : "";
      message += `${new Date(t.date).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '/')}: Rs ${t.amount} ${t.type === 'udhar' ? 'Udhar 🟥' : 'Mila 🟩'}${note}\n`;
    });

    message += `--------------------------\n`;
    message += `*Total Baqaya: Rs ${total}* 💰\n\n`;
    message += `_Powered by Khatify_`;

    const cleanPhone = customer.phone.replace(/^0/, "92");
    window.location.href = `whatsapp://send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
  };

  const sendReminder = async () => {
    if (!customer.phone) return;
    
    // Persistent Shop Name for Reminder
    const savedShopName = localStorage.getItem("my_shop_name");
    const currentShopName = data?.shopName || savedShopName || "Khatify User";
    
    const cleanPhone = customer.phone.replace(/^0/, "92");
    const message = `*Assalam o Alaikum!* ✨\n\nAapka udhar *Rs ${total.toLocaleString()}* baqi hai. Meharbani kar ke jald ada kar dein.\n\n*Shukriya,*\n*${currentShopName}*\n\n_Sent via Khatify_`;
    
    window.location.href = `whatsapp://send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
  };

  const downloadInvoice = async () => {
    const element = invoiceRef.current;
    if (!element) {
      toast.error("Template load nahi hua");
      return;
    }
    const toastId = toast.loading("PDF ban rahi hai...");
    try {
      const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      await doc.html(element, {
        callback: function (doc) {
          doc.save(`${customer.name}_Invoice.pdf`);
          toast.dismiss(toastId);
          toast.success("PDF Download ho gayi!");
        },
        x: 0, y: 0, width: 210, windowWidth: 794, autoPaging: 'text', margin: [10, 0, 10, 0]
      });
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("PDF banane mein masla aaya");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#f8fafc] overflow-hidden">
      <header className="flex-none bg-white border-b px-4 py-3 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-all active:scale-90">
              <ArrowLeft className="w-6 h-6 text-slate-600" />
            </button>
            <div className="flex flex-col">
              <h1 className="text-lg sm:text-xl font-black text-slate-800 leading-none mb-1">{customer.name}</h1>
              {customer.phone && (
                <span className="text-[11px] sm:text-xs font-bold text-slate-400 tracking-tight">{customer.phone}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {customer.phone && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors">
                    <PhoneCall className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2 shadow-xl border-slate-100">
                  <DropdownMenuItem onClick={() => makeCall('phone')} className="rounded-xl py-3 cursor-pointer gap-3 font-bold text-slate-700">
                    <Phone className="w-4 h-4 text-blue-500" /> Phone Call
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => makeCall('whatsapp')} className="rounded-xl py-3 cursor-pointer gap-3 font-bold text-slate-700">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="#25D366">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.393 0 12.03c0 2.12.554 4.189 1.602 6.006L0 24l6.117-1.605a11.803 11.803 0 005.925 1.586h.005c6.635 0 12.032-5.396 12.035-12.032a11.762 11.762 0 00-3.441-8.518z" />
                    </svg>
                    WhatsApp Call
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <div className="hidden sm:flex bg-slate-100 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-600 items-center gap-1">
              <WalletCards className="w-3.5 h-3.5" /> Profile
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto sm:overflow-hidden">
        <div className="max-w-7xl mx-auto h-full flex flex-col md:flex-row gap-4 sm:gap-6 p-4 sm:p-6">
          <div className="w-full md:w-80 space-y-4">
            <div className={`rounded-3xl p-6 sm:p-8 shadow-md border-b-8 transition-all duration-300 bg-white ${total > 0 ? "border-red-500" : "border-emerald-500"}`}>

              {/* Yahan humne text ko dynamic kar diya */}
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                {total > 0 ? "Aap ne Lene Hain" : total < 0 ? "Aap ne Dene Hain" : "Hisaab Barabar"}
              </p>

              <h2 className={`text-4xl sm:text-5xl font-black tracking-tighter ${total > 0 ? "text-red-600" : "text-emerald-600"}`}>
                {/* Agar total negative hai (dene hain), toh minus sign dikhayega, warna simple amount */}
                Rs {total < 0 ? `-${Math.abs(total).toLocaleString()}` : total.toLocaleString()}
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
              <Button
                onClick={() => { setEditingEntry(null); setEntryType("udhar"); setEntryOpen(true); }}
                className="h-14 sm:h-16 bg-red-600 hover:bg-red-700 text-white rounded-2xl shadow-sm font-black text-sm sm:text-lg"
              >
                + Udhar Diya
              </Button>
              <Button
                onClick={() => { setEditingEntry(null); setEntryType("payment"); setEntryOpen(true); }}
                className="h-14 sm:h-16 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-sm font-black text-sm sm:text-lg"
              >
                - Paisa Mila
              </Button>
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <Button
                variant="outline"
                className="w-full py-5 text-sm font-semibold border-green-200 hover:bg-green-50 text-slate-700 transition-all gap-2 rounded-2xl"
                onClick={sendReminder}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="#25D366">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.393 0 12.03c0 2.12.554 4.189 1.602 6.006L0 24l6.117-1.605a11.803 11.803 0 005.925 1.586h.005c6.635 0 12.032-5.396 12.035-12.032a11.762 11.762 0 00-3.441-8.518z" />
                </svg>
                WhatsApp Reminder
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={downloadInvoice} className="w-full py-5 text-[13px] font-semibold border-slate-200 hover:bg-slate-50 text-slate-700 transition-all gap-1.5 rounded-2xl">
                  <History className="w-4 h-4 text-blue-500" /> Invoice PDF
                </Button>
                <Button variant="outline" onClick={shareFullHistory} className="w-full py-5 text-[13px] font-semibold border-slate-200 hover:bg-slate-50 text-slate-700 transition-all gap-1.5 rounded-2xl">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.393 0 12.03c0 2.12.554 4.189 1.602 6.006L0 24l6.117-1.605a11.803 11.803 0 005.925 1.586h.005c6.635 0 12.032-5.396 12.035-12.032a11.762 11.762 0 00-3.441-8.518z" /></svg> History
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-white rounded-3xl border shadow-sm overflow-hidden flex flex-col min-h-[400px]">
            <div className="px-6 py-5 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-slate-400" />
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">Hisaab Kitab ({transactions.length})</h2>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
              {[...transactions].reverse().map(tx => (
                <div key={tx.id} className="bg-slate-50/50 rounded-2xl p-4 border border-transparent hover:border-slate-200 transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl shadow-inner ${tx.type === "udhar" ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-500"}`}>
                      {tx.type === "udhar" ? "+" : "-"}
                    </div>
                    <div>
                      <p className={`font-black text-xl ${tx.type === "udhar" ? "text-red-600" : "text-emerald-600"}`}>Rs {tx.amount.toLocaleString()}</p>

                      {/* --- YAHAN REMARKS WALA CODE ADDED HAI --- */}
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                        {tx.type === "udhar" ? "Udhar Diya" : "Paisa Mila"} • {new Date(tx.date).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '/')}
                      </p>
                      {tx.remarks && (
                        <p className="text-[11px] text-indigo-600 font-medium italic mt-1 bg-indigo-50/50 px-2 py-0.5 rounded-lg inline-block">
                          Note: {tx.remarks}
                        </p>
                      )}
                      {/* -------------------------------------- */}

                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingEntry(tx);
                        setEntryType(tx.type);
                        setEntryOpen(true);
                      }}
                      className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="w-[92%] max-w-[380px] rounded-[24px] p-5 sm:p-6 border-none shadow-2xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-lg font-bold text-slate-900">Delete Entry?</AlertDialogTitle>
                          <AlertDialogDescription className="text-slate-500 font-medium pt-1 text-sm">Ye wapas nahi ayega.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-5 flex flex-row gap-3">
                          <AlertDialogCancel className="flex-1 rounded-xl h-10 font-bold border-slate-100 text-slate-600 mt-0">Nahi</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteEntry(tx.id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl h-10 font-bold shadow-sm">Haan, Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <AddEntryDialog
        open={entryOpen}
        onClose={() => {
          setEntryOpen(false);
          setEditingEntry(null);
        }}
        type={entryType}
        onAdd={handleSaveEntry}
        initialAmount={editingEntry?.amount}
        initialRemarks={editingEntry?.remarks}
      />

      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', pointerEvents: 'none' }}>
        <div ref={invoiceRef}>
          <InvoiceTemplate
            customerName={customer.name}
            customerPhone={customer.phone || ""}
            shopName={displayShopName}
            transactions={transactions.map((t: any) => ({
              id: t.id,
              date: new Date(t.date).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '/'),
              amount: t.amount,
              type: t.type === 'udhar' ? 'dr' : 'cr',
              remarks: t.remarks
            }))}
            totalBalance={total}
          />
        </div>
      </div>
    </div>
  );
}