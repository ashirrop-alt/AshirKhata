import { useState, useEffect, useRef } from "react";
import { useKhata } from "@/hooks/useKhata";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import InvoiceTemplate from './InvoiceTemplate';
import { Customer } from "@/lib/store";
import { AddEntryDialog } from "./AddEntryDialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, History, Phone, WalletCards, PhoneCall, Pencil, ArrowUpRight, ArrowDownLeft, FileText, MessageCircle } from "lucide-react";
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
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState(customer.transactions || []);

  const { data } = useKhata();
  const savedShopName = localStorage.getItem("my_shop_name");
  const displayShopName = data?.shopName || savedShopName || "Khatify User";

  useEffect(() => {
    if (data?.shopName) {
      localStorage.setItem("my_shop_name", data.shopName);
    }
  }, [data]);

  const [editingEntry, setEditingEntry] = useState<any>(null);

  const total = transactions.reduce((acc, tx) => {
    return tx.type === "udhar" ? acc + tx.amount : acc - tx.amount;
  }, 0);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const day = d.getDate();
    const month = d.toLocaleString('en-GB', { month: 'short' });
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
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
    let message = `*${displayShopName} - Hisaab Report* 📜\nCustomer: ${customer.name}\n--------------------------\n`;
    transactions.forEach((t) => {
      const note = t.remarks ? ` (${t.remarks})` : "";
      message += `${formatDate(t.date)}: Rs ${t.amount} ${t.type === 'udhar' ? 'Udhar 🟥' : 'Mila 🟩'}${note}\n`;
    });
    message += `--------------------------\n*Total Baqaya: Rs ${total}* 💰\n\n_Powered by Khatify_`;
    const cleanPhone = customer.phone.replace(/^0/, "92");
    window.location.href = `whatsapp://send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
  };

  const sendReminder = async () => {
    if (!customer.phone) return;
    const cleanPhone = customer.phone.replace(/^0/, "92");
    const message = `*Assalam o Alaikum!* ✨\n\nAapka udhar *Rs ${total.toLocaleString()}* baqi hai. Meharbani kar ke jald ada kar dein.\n\n*Shukriya,*\n*${displayShopName}*\n\n_Sent via Khatify_`;
    window.location.href = `whatsapp://send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
  };

  const downloadInvoice = async () => {
    const element = invoiceRef.current;
    if (!element) { toast.error("Template load nahi hua"); return; }
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
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-[#020617] transition-colors duration-500 overflow-hidden">

      {/* --- HEADER --- */}
      <header className="flex-none bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-white/[0.05] px-4 md:px-6 py-3 md:py-4 z-40 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left Side: Back Button + Info */}
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={onBack}
              className="p-2 -ml-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all group active:scale-90"
            >
              <ArrowLeft className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-blue-500" />
            </button>
            <div className="flex flex-col text-left leading-none">
              <h1 className="text-[17px] md:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {customer.name}
              </h1>
              {customer.phone && (
                <span className="text-[10px] md:text-[11px] font-bold text-slate-400 dark:text-slate-500 mt-0.5 uppercase tracking-wider">
                  {customer.phone}
                </span>
              )}
            </div>
          </div>

          {/* Right Side: Enhanced Prominent Icon */}
          <div className="flex items-center">
            {customer.phone && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-transparent hover:bg-blue-50 dark:hover:bg-blue-500/10 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all active:scale-90 border-none outline-none focus-visible:ring-0"
                  >
                    <PhoneCall className="w-[22px] h-[22px] stroke-[2.2] drop-shadow-sm" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  sideOffset={10}
                  className="w-44 rounded-2xl p-1 shadow-2xl border-slate-200/60 dark:border-white/10 bg-white dark:bg-[#0f172a] overflow-hidden"
                >
                  <DropdownMenuItem
                    onClick={() => makeCall('phone')}
                    className="rounded-[10px] py-2.5 px-3 cursor-pointer flex items-center gap-2.5 font-bold text-[13px] text-slate-700 dark:text-slate-200 focus:bg-slate-50 dark:focus:bg-white/5 transition-colors group"
                  >
                    <Phone className="w-3.5 h-3.5 text-blue-500" />
                    Phone Call
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => makeCall('whatsapp')}
                    className="rounded-[10px] py-2.5 px-3 cursor-pointer flex items-center gap-2.5 font-bold text-[13px] text-slate-700 dark:text-slate-200 focus:bg-slate-50 dark:focus:bg-white/5 transition-colors group"
                  >
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" className="text-emerald-500">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.393 0 12.03c0 2.12.554 4.189 1.602 6.006L0 24l6.117-1.605a11.803 11.803 0 005.925 1.586h.005c6.635 0 12.032-5.396 12.035-12.032a11.762 11.762 0 00-3.441-8.518z" />
                    </svg>
                    WhatsApp Call
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>

      {/* --- MAIN --- */}
      <main className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full flex flex-col md:flex-row gap-4 md:gap-6 p-4 md:p-6">

          {/* LEFT SIDE */}
          <div className="flex-none w-full md:w-72 space-y-4">
            {/* EXACT height match with Home Screen to prevent list jumping */}
            <div className="relative rounded-3xl p-5 md:p-6 shadow-sm bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/[0.05] overflow-hidden transition-all min-h-[110px] md:min-h-[145px] flex flex-col justify-center">
              {/* Prominent Bottom Line for "Ubhaar" */}
              <div className={`absolute bottom-0 left-0 right-0 h-1.5 ${total > 0 ? "bg-red-500 shadow-[0_-4px_20px_rgba(239,68,68,0.6)]" : "bg-emerald-500 shadow-[0_-4px_20px_rgba(16,185,129,0.6)]"}`} />

              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 mb-1.5">
                {total > 0 ? "Aap ne Lene Hain" : total < 0 ? "Aap ne Dene Hain" : "Hisaab Barabar"}
              </p>

              <div className={`flex items-baseline gap-1.5 ${total > 0 ? "text-red-500 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                <span className="text-sm md:text-lg font-black opacity-80">Rs</span>
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-none">
                  {total < 0 ? Math.abs(total).toLocaleString() : total.toLocaleString()}
                </h2>
              </div>
            </div>

            {/* Buttons container with exact Home Screen spacing */}
            <div className="grid grid-cols-2 md:grid-cols-1 gap-3 mt-4">
              <Button onClick={() => { setEditingEntry(null); setEntryType("udhar"); setEntryOpen(true); }} className="h-12 md:h-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl shadow-lg font-bold text-sm active:scale-95 transition-all">
                + Udhar Diya
              </Button>
              <Button onClick={() => { setEditingEntry(null); setEntryType("payment"); setEntryOpen(true); }} className="h-12 md:h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-lg font-bold text-sm active:scale-95 transition-all">
                - Paisa Mila
              </Button>
            </div>

            {/* Rest of the action buttons */}
            {/* Container: Mobile par spacing khatam, Laptop par space-y-2 wapis */}
<div className="space-y-0">
  <div className="grid grid-cols-3 gap-3 mt-4">

    {/* Reminder Button */}
    <Button
      variant="outline"
      title="Send Payment Reminder"
      className="group flex flex-col h-16 items-center justify-center text-[11px] font-semibold rounded-xl w-full transition-all duration-200
      border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm
      dark:border-white/10 dark:bg-[#0f172a] dark:text-slate-300 dark:hover:bg-white/5 dark:hover:border-white/20"
      onClick={sendReminder}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="#25D366" className="transition-transform duration-200 group-hover:scale-110 mb-0.5">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.393 0 12.03c0 2.12.554 4.189 1.602 6.006L0 24l6.117-1.605a11.803 11.803 0 005.925 1.586h.005c6.635 0 12.032-5.396 12.035-12.032a11.762 11.762 0 00-3.441-8.518z"/>
      </svg>
      <span className="leading-none text-slate-600 dark:text-slate-300">Reminder</span>
    </Button>

    {/* Invoice Button */}
    <Button
      variant="outline"
      title="Download PDF Invoice"
      onClick={downloadInvoice}
      className="group flex flex-col h-16 items-center justify-center text-[11px] font-semibold rounded-xl w-full transition-all duration-200
      border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm
      dark:border-white/10 dark:bg-[#0f172a] dark:text-slate-300 dark:hover:bg-white/5 dark:hover:border-white/20"
    >
      <FileText className="w-5 h-5 text-blue-500 mb-0.5 transition-transform duration-200 group-hover:scale-110" />
      <span className="leading-none text-slate-600 dark:text-slate-300">Invoice</span>
    </Button>

    {/* History Button */}
    <Button
      variant="outline"
      title="Share Full Report"
      onClick={shareFullHistory}
      className="group flex flex-col h-16 items-center justify-center text-[11px] font-semibold rounded-xl w-full transition-all duration-200
      border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm
      dark:border-white/10 dark:bg-[#0f172a] dark:text-slate-300 dark:hover:bg-white/5 dark:hover:border-white/20"
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="#25D366" className="transition-transform duration-200 group-hover:scale-110 mb-0.5">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.393 0 12.03c0 2.12.554 4.189 1.602 6.006L0 24l6.117-1.605a11.803 11.803 0 005.925 1.586h.005c6.635 0 12.032-5.396 12.035-12.032a11.762 11.762 0 00-3.441-8.518z"/>
      </svg>
      <span className="leading-none text-slate-600 dark:text-slate-300">History</span>
    </Button>

  </div>
</div>
       
          </div>

          {/* RIGHT SIDE (Transaction List Container) */}
          <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-[#0f172a] rounded-3xl shadow-sm border border-slate-200 dark:border-white/[0.05] overflow-hidden transition-all">
            <div className="flex flex-col h-full">
              <div className="px-6 py-5 border-b border-slate-100 dark:border-white/[0.05] flex items-center gap-2 bg-slate-50/50 dark:bg-white/[0.02]">
                <History className="w-4 h-4 text-slate-400" />
                <span className="text-[10px] md:text-[10.5px] font-black uppercase tracking-widest text-slate-400">Transactions ({transactions.length})</span>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar pb-24 md:pb-4 p-4 space-y-3">
                {[...transactions].reverse().map(tx => (
                  <div key={tx.id} className="w-full bg-slate-50 dark:bg-white/[0.03] rounded-2xl p-4 border border-transparent hover:border-slate-200 dark:hover:border-white/[0.05] transition-all flex items-center justify-between">
                    <div className="flex items-center gap-3 md:gap-4 text-left">
                      <div className={`w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center border border-slate-100 dark:border-white/5 transition-all shadow-sm ${tx.type === "udhar" ? "bg-red-50 dark:bg-red-500/10" : "bg-emerald-50 dark:bg-emerald-500/10"}`}>
                        {tx.type === "udhar" ? <ArrowUpRight className="w-5 h-5 text-red-500" /> : <ArrowDownLeft className="w-5 h-5 text-emerald-600" />}
                      </div>
                      <div>
                        <div className={`flex items-baseline gap-0.5 font-extrabold leading-tight ${tx.type === "udhar" ? "text-red-500 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                          <span className="text-[10px] md:text-xs">Rs</span>
                          <p className="text-base md:text-lg">{tx.amount.toLocaleString()}</p>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-bold uppercase tracking-tight">
                          {tx.type === "udhar" ? "Udhar Diya" : "Paisa Mila"} • {formatDate(tx.date)}
                        </p>

                        {/* COMPACT NOTE SECTION - REDUCED PADDING & MARGIN */}
                        {tx.remarks && (
                          <div className="mt-1.5 inline-block px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black italic">
                            Note: {tx.remarks}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button onClick={() => { setEditingEntry(tx); setEntryType(tx.type); setEntryOpen(true); }} className="p-2 text-slate-400 hover:text-blue-500 transition-all active:scale-90"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => { if (confirm("Hisaab delete kardein?")) handleDeleteEntry(tx.id) }} className="p-2 text-slate-400 hover:text-red-500 transition-all active:scale-90">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <AddEntryDialog open={entryOpen} onClose={() => { setEntryOpen(false); setEditingEntry(null); }} type={entryType} onAdd={handleSaveEntry} initialAmount={editingEntry?.amount} initialRemarks={editingEntry?.remarks} />

      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', pointerEvents: 'none' }}>
        <div ref={invoiceRef}>
          <InvoiceTemplate
            customerName={customer.name}
            customerPhone={customer.phone || ""}
            shopName={displayShopName}
            transactions={transactions.map((t: any) => ({ id: t.id, date: formatDate(t.date), amount: t.amount, type: t.type === 'udhar' ? 'dr' : 'cr', remarks: t.remarks }))}
            totalBalance={total}
          />
        </div>
      </div>
    </div>
  );
}