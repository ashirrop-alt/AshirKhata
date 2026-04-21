import { useState, useRef } from "react";
import { useKhata } from "@/hooks/useKhata";
import jsPDF from 'jspdf';
import InvoiceTemplate from './InvoiceTemplate';
import { Customer } from "@/lib/store";
import { AddEntryDialog } from "./AddEntryDialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, History, Phone, WalletCards, PhoneCall, Pencil, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { toast } from "sonner";
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
  const [entryType, setEntryType] = useState<"udhar" | "payment" >("udhar");
  const [entryOpen, setEntryOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState(customer.transactions || []);
  const [editingEntry, setEditingEntry] = useState<any>(null);

  const { data } = useKhata();
  const savedShopName = localStorage.getItem("my_shop_name");
  const displayShopName = data?.shopName || savedShopName || "Khatify User";

  const total = transactions.reduce((acc, tx) => {
    return tx.type === "udhar" ? acc + tx.amount : acc - tx.amount;
  }, 0);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getDate()}/${d.toLocaleString('en-GB', { month: 'short' })}/${d.getFullYear()}`;
  };

  const handleSaveEntry = async (type: "udhar" | "payment", amount: number, remarks: string) => {
    setLoading(true);
    try {
      let updatedTransactions;
      if (editingEntry) {
        updatedTransactions = transactions.map(t =>
          t.id === editingEntry.id ? { ...t, type, amount: Number(amount), remarks: remarks } : t
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
      toast.success(editingEntry ? "Update ho gaya!" : "Save ho gaya!");
      setEntryOpen(false);
      setEditingEntry(null);
    } catch (error: any) {
      toast.error("Masla aaya save karte waqt");
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
      toast.success("Delete ho gayi!");
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
      window.location.href = `whatsapp://send?phone=${cleanPhone}`;
    }
  };

  const shareFullHistory = () => {
    let message = `*${displayShopName} - Hisaab Report*\nCustomer: ${customer.name}\n--------------------------\n`;
    transactions.forEach((t) => {
      message += `${formatDate(t.date)}: Rs ${t.amount} ${t.type === 'udhar' ? 'Udhar' : 'Mila'}\n`;
    });
    message += `--------------------------\n*Total Balance: Rs ${total}*\n_Khatify App_`;
    const cleanPhone = customer.phone.replace(/^0/, "92");
    window.location.href = `whatsapp://send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
  };

  const downloadInvoice = async () => {
    const element = invoiceRef.current;
    if (!element) return;
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    await doc.html(element, {
      callback: (doc) => { doc.save(`${customer.name}_Bill.pdf`); toast.success("PDF Downloaded!"); },
      x: 0, y: 0, width: 210, windowWidth: 794
    });
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-300 font-sans">

      {/* --- NAVBAR (Pixel Sync with HomeScreen) --- */}
      <header className="flex-none bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-white/[0.08] px-4 py-2 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-12">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-all active:scale-90">
              <ArrowLeft className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            </button>
            <div className="flex flex-col">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-slate-100 leading-tight">{customer.name}</h1>
              {customer.phone && (
                <span className="text-[10px] font-bold text-slate-400 tracking-tight leading-none uppercase">{customer.phone}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {customer.phone && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-all">
                    <PhoneCall className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2 shadow-xl border-slate-200 dark:border-white/10 bg-white dark:bg-[#1e293b]">
                  <DropdownMenuItem onClick={() => makeCall('phone')} className="rounded-xl py-3 cursor-pointer gap-3 font-bold">
                    <Phone className="w-4 h-4 text-blue-500" /> Phone Call
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => makeCall('whatsapp')} className="rounded-xl py-3 cursor-pointer gap-3 font-bold">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.393 0 12.03c0 2.12.554 4.189 1.602 6.006L0 24l6.117-1.605a11.803 11.803 0 005.925 1.586h.005c6.635 0 12.032-5.396 12.035-12.032a11.762 11.762 0 00-3.441-8.518z" /></svg> WhatsApp
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <div className="bg-slate-100 dark:bg-white/5 p-2 rounded-full w-9 h-9 flex items-center justify-center text-slate-400">
              <WalletCards className="w-4 h-4" />
            </div>
          </div>
        </div>
      </header>

      {/* --- MAIN --- */}
      <main className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full flex flex-col md:flex-row gap-4 sm:gap-6 p-4 sm:p-5">

          {/* LEFT SIDE */}
          <div className="w-full md:w-80 space-y-4">
            <div className="relative rounded-[2rem] p-6 shadow-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/[0.08] overflow-hidden group">
              <div className={`absolute bottom-0 left-0 right-0 h-1.5 transition-all duration-500 ${total > 0 ? "bg-red-500 shadow-[0_-4px_15px_rgba(239,68,68,0.2)]" : "bg-emerald-500 shadow-[0_-4px_15px_rgba(16,185,129,0.2)]"}`} />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1.5">
                {total > 0 ? "Aap ne Lene Hain" : total < 0 ? "Aap ne Dene Hain" : "Hisaab Barabar"}
              </p>
              <div className={`flex items-baseline gap-1 ${total > 0 ? "text-red-500 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                <span className="text-base font-bold">Rs</span>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tighter leading-none">{Math.abs(total).toLocaleString()}</h2>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
              <Button onClick={() => { setEditingEntry(null); setEntryType("udhar"); setEntryOpen(true); }} className="h-12 sm:h-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl shadow-lg shadow-red-600/10 font-black text-xs sm:text-sm active:scale-95 transition-all">
                + Udhar Diya
              </Button>
              <Button onClick={() => { setEditingEntry(null); setEntryType("payment"); setEntryOpen(true); }} className="h-12 sm:h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-lg shadow-emerald-600/10 font-black text-xs sm:text-sm active:scale-95 transition-all">
                - Paisa Mila
              </Button>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Button variant="outline" className="w-full py-3.5 text-[11px] font-bold border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0f172a] rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 gap-2 transition-all" onClick={shareFullHistory}>
                 Share History Report
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={downloadInvoice} className="w-full py-3.5 text-[11px] font-bold border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0f172a] rounded-2xl gap-2 transition-all">
                  <History className="w-3.5 h-3.5 text-blue-500" /> PDF
                </Button>
                <Button variant="outline" onClick={() => window.open(`whatsapp://send?text=${encodeURIComponent(`Hi, your balance is Rs ${total.toLocaleString()}`)}`)} className="w-full py-3.5 text-[11px] font-bold border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0f172a] rounded-2xl gap-2 transition-all">
                   Reminder
                </Button>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE (Pixel Sync with HomeScreen List Header) */}
          <div className="flex-1 bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-white/[0.08] shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-white/[0.08] flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-slate-400" />
                <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Transactions ({transactions.length})</h2>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 custom-scrollbar">
              {[...transactions].reverse().map(tx => (
                <div key={tx.id} className="bg-slate-50 dark:bg-white/[0.03] rounded-2xl p-4 border border-transparent hover:border-slate-200 dark:hover:border-white/[0.1] transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-xl shadow-sm ${tx.type === "udhar" ? "bg-red-500/10 text-red-500 dark:text-red-400" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"}`}>
                      {tx.type === "udhar" ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className={`flex items-baseline gap-0.5 font-black ${tx.type === "udhar" ? "text-red-500 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                        <span className="text-[10px]">Rs</span>
                        <p className="text-lg">{tx.amount.toLocaleString()}</p>
                      </div>
                      <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight mt-1">
                        {tx.type === "udhar" ? "Udhar Diya" : "Paisa Mila"} • {formatDate(tx.date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button onClick={() => { setEditingEntry(tx); setEntryType(tx.type); setEntryOpen(true); }} className="p-2 text-slate-400 hover:text-indigo-500 transition-all active:scale-90"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => { if (confirm("Entry delete kardein?")) handleDeleteEntry(tx.id) }} className="p-2 text-slate-400 hover:text-red-500 transition-all active:scale-90">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <AddEntryDialog open={entryOpen} onClose={() => { setEntryOpen(false); setEditingEntry(null); }} type={entryType} onAdd={handleSaveEntry} initialAmount={editingEntry?.amount} initialRemarks={editingEntry?.remarks} />
      <div style={{ position: 'absolute', top: '-9999px' }}><div ref={invoiceRef}><InvoiceTemplate customerName={customer.name} customerPhone={customer.phone || ""} shopName={displayShopName} transactions={transactions.map((t: any) => ({ ...t, date: formatDate(t.date), type: t.type === 'udhar' ? 'dr' : 'cr' }))} totalBalance={total} /></div></div>
    </div>
  );
}