import { useState, useRef } from "react";
import { useKhata } from "@/hooks/useKhata";
import jsPDF from 'jspdf';
import InvoiceTemplate from './InvoiceTemplate';
import { Customer } from "@/lib/store";
import { AddEntryDialog } from "./AddEntryDialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, History, Phone, WalletCards, PhoneCall, Pencil, ArrowUpRight, ArrowDownLeft, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";
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
  const [entryType, setEntryType] = useState<"udhar" | "payment">("udhar");
  const [entryOpen, setEntryOpen] = useState(false);
  const [transactions, setTransactions] = useState(customer.transactions || []);
  const [editingEntry, setEditingEntry] = useState<any>(null);

  const { data } = useKhata();
  const displayShopName = data?.shopName || "Khatify User";

  const total = transactions.reduce((acc, tx) => {
    return tx.type === "udhar" ? acc + tx.amount : acc - tx.amount;
  }, 0);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getDate()} ${d.toLocaleString('en-GB', { month: 'short' })} ${d.getFullYear()}`;
  };

  const handleSaveEntry = async (type: "udhar" | "payment", amount: number, remarks: string) => {
    try {
      let updatedTransactions;
      if (editingEntry) {
        updatedTransactions = transactions.map(t =>
          t.id === editingEntry.id ? { ...t, type, amount: Number(amount), remarks: remarks } : t
        );
      } else {
        const newTransaction = {
          id: crypto.randomUUID(),
          type,
          amount: Number(amount),
          remarks,
          date: new Date().toISOString()
        };
        updatedTransactions = [...transactions, newTransaction];
      }

      const { error } = await supabase.from('customers').update({ transactions: updatedTransactions }).eq('id', customer.id);
      if (error) throw error;

      setTransactions(updatedTransactions);
      toast.success("Hisaab Updated!");
      setEntryOpen(false);
      setEditingEntry(null);
    } catch (error) {
      toast.error("Error saving data");
    }
  };

  const handleDeleteEntry = async (txId: string) => {
    const updatedTransactions = transactions.filter(t => t.id !== txId);
    const { error } = await supabase.from('customers').update({ transactions: updatedTransactions }).eq('id', customer.id);
    if (!error) {
      setTransactions(updatedTransactions);
      toast.success("Entry Deleted");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#f8fafc] dark:bg-[#020617] text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-500 font-sans">
      
      {/* --- NAVBAR SYNC WITH HOME --- */}
      <header className="flex-none bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/[0.05] px-4 py-2 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-12">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 active:scale-90 transition-all">
              <ArrowLeft className="w-5 h-5 text-slate-500" />
            </button>
            <div className="flex flex-col">
              <h1 className="text-base sm:text-lg font-black tracking-tight leading-tight">{customer.name}</h1>
              {customer.phone && <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">{customer.phone}</span>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {customer.phone && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 bg-slate-100 dark:bg-white/5 text-slate-500">
                    <PhoneCall className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 rounded-2xl p-2 shadow-2xl border-slate-200 dark:border-white/10 bg-white dark:bg-[#1e293b]">
                  <DropdownMenuItem onClick={() => window.open(`tel:${customer.phone}`, "_self")} className="rounded-xl py-3 font-bold gap-3"><Phone className="w-4 h-4 text-blue-500" /> Phone Call</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.location.href = `whatsapp://send?phone=92${customer.phone.replace(/^0/, "")}`} className="rounded-xl py-3 font-bold gap-3 text-emerald-600">WhatsApp</DropdownMenuItem>
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
        <div className="max-w-7xl mx-auto h-full flex flex-col md:flex-row gap-6 p-4 sm:p-6">
          
          {/* BALANCE PANEL */}
          <div className="w-full md:w-80 space-y-5">
            <div className="relative rounded-[2.5rem] p-8 shadow-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/[0.05] overflow-hidden group">
              {/* GLOWING LINE */}
              <div className={`absolute bottom-0 left-0 right-0 h-1.5 transition-all duration-700 animate-pulse ${total > 0 ? "bg-red-500 shadow-[0_-5px_20px_rgba(239,68,68,0.5)]" : "bg-emerald-500 shadow-[0_-5px_20px_rgba(16,185,129,0.5)]"}`} />
              
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                {total > 0 ? "Aap ne Lene Hain" : "Hisaab Barabar Hai"}
              </p>
              <div className={`flex items-baseline gap-1.5 ${total > 0 ? "text-red-500" : "text-emerald-600"}`}>
                <span className="text-xl font-bold">Rs</span>
                <h2 className="text-4xl sm:text-5xl font-black tracking-tighter leading-none">{Math.abs(total).toLocaleString()}</h2>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
              <Button onClick={() => { setEditingEntry(null); setEntryType("udhar"); setEntryOpen(true); }} className="h-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl shadow-xl shadow-red-500/10 font-black active:scale-95 transition-all">+ Udhar Diya</Button>
              <Button onClick={() => { setEditingEntry(null); setEntryType("payment"); setEntryOpen(true); }} className="h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-xl shadow-emerald-500/10 font-black active:scale-95 transition-all">- Paisa Mila</Button>
            </div>

            <div className="pt-2 space-y-2">
               <Button variant="outline" className="w-full py-4 text-[11px] font-black border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0f172a] rounded-2xl gap-2 hover:bg-blue-50 transition-all uppercase tracking-widest" onClick={() => toast.info("Coming Soon")}>
                <Send className="w-3.5 h-3.5" /> Send Reminder
              </Button>
              <Button variant="outline" className="w-full py-4 text-[11px] font-black border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0f172a] rounded-2xl gap-2 hover:bg-blue-50 transition-all uppercase tracking-widest" onClick={() => window.print()}>
                <History className="w-3.5 h-3.5" /> Full History Report
              </Button>
            </div>
          </div>

          {/* TRANSACTION LIST */}
          <div className="flex-1 bg-white dark:bg-[#0f172a] rounded-[2.5rem] border border-slate-200 dark:border-white/[0.05] shadow-sm flex flex-col overflow-hidden">
            <div className="px-7 py-5 border-b border-slate-100 dark:border-white/[0.05] flex items-center gap-2 bg-slate-50/50 dark:bg-white/[0.02]">
                <History className="w-4 h-4 text-blue-500" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Len Den Ka Record ({transactions.length})</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {[...transactions].reverse().map(tx => (
                <div key={tx.id} className="group bg-slate-50 dark:bg-white/[0.02] rounded-3xl p-5 border border-transparent hover:border-blue-500/10 hover:bg-white transition-all flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${tx.type === "udhar" ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-600"}`}>
                      {tx.type === "udhar" ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownLeft className="w-6 h-6" />}
                    </div>
                    <div>
                      <div className={`flex items-baseline gap-1 font-black ${tx.type === "udhar" ? "text-red-500" : "text-emerald-600"}`}>
                        <span className="text-[10px]">Rs</span>
                        <p className="text-xl">{tx.amount.toLocaleString()}</p>
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        {tx.type === "udhar" ? "Udhar Diya" : "Paisa Mila"} • {formatDate(tx.date)}
                      </p>
                      {tx.remarks && <p className="text-[11px] font-medium text-blue-500/70 mt-1 italic">"{tx.remarks}"</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => { setEditingEntry(tx); setEntryType(tx.type); setEntryOpen(true); }} className="p-2 text-slate-400 hover:text-blue-500 active:scale-90"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => { if(confirm("Hisaab delete kardein?")) handleDeleteEntry(tx.id) }} className="p-2 text-slate-400 hover:text-red-500 active:scale-90"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <AddEntryDialog open={entryOpen} onClose={() => { setEntryOpen(false); setEditingEntry(null); }} type={entryType} onAdd={handleSaveEntry} initialAmount={editingEntry?.amount} initialRemarks={editingEntry?.remarks} />
    </div>
  );
}