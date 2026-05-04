import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { useState, useEffect, useRef } from "react";
import { useKhata } from "@/hooks/useKhata";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import InvoiceTemplate from './InvoiceTemplate';
import { Customer } from "@/lib/store";
import { AddEntryDialog } from "./AddEntryDialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, History, Phone, WalletCards, PhoneCall, Pencil, ArrowUpRight, ArrowDownLeft, FileText, MessageCircle, RotateCcw, ChevronDown, Check, Calendar, } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu, 
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface Props {
  customer: Customer;
  onBack: () => void;
}

export function CustomerDetail({ customer, onBack }: Props) {
  // 1. STATES
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [entryType, setEntryType] = useState<"udhar" | "payment">("udhar");
  const [entryOpen, setEntryOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState(customer.transactions || []);
  const [filterType, setFilterType] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [editingEntry, setEditingEntry] = useState<any>(null);

  // 2. REFS
  const invoiceRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 3. HOOKS & DATA
  const { data } = useKhata();
  const savedShopName = localStorage.getItem("my_shop_name");
  const displayShopName = data?.shopName || savedShopName || "Khatify User";

  const filterOptions = [
    { id: 'all', label: 'Sub Dekhein' },
    { id: 'today', label: 'Aaj Ka' },
    { id: 'thisMonth', label: 'Is Mahine' },
    { id: 'custom', label: 'Tarikh Chunien' },
  ];

  // 4. EFFECTS
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 5. FILTER LOGIC
  const filteredTransactions = transactions.filter(tx => {
    const txDate = new Date(tx.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    txDate.setHours(0, 0, 0, 0);

    if (filterType === "today") return txDate.getTime() === today.getTime();
    if (filterType === "thisMonth") return txDate.getMonth() === today.getMonth() && txDate.getFullYear() === today.getFullYear();
    if (filterType === "custom") {
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (txDate < start) return false;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (txDate > end) return false;
      }
    }
    return true;
  });

  // 6. CALCULATIONS
  const total = transactions.reduce((acc, tx) => tx.type === "udhar" ? acc + tx.amount : acc - tx.amount, 0);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getDate()}/${d.toLocaleString('en-GB', { month: 'short' })}/${d.getFullYear()}`;
  };

  // 7. HANDLERS
  const handleSaveEntry = async (type: "udhar" | "payment", amount: number, remarks: string) => {
    setLoading(true);
    try {
      let updatedTransactions;
      if (editingEntry) {
        updatedTransactions = transactions.map(t =>
          t.id === editingEntry.id ? { ...t, type, amount: Number(amount), remarks: remarks } : t
        );
      } else {
        updatedTransactions = [...transactions, { id: crypto.randomUUID(), type, amount: Number(amount), remarks, date: new Date().toISOString() }];
      }
      const { error } = await supabase.from('customers').update({ transactions: updatedTransactions }).eq('id', customer.id);
      if (error) throw error;
      setTransactions(updatedTransactions);
      toast.success("Hisaab update ho gaya!");
      setEntryOpen(false);
      setEditingEntry(null);
    } catch (e) { toast.error("Masla aaya"); } finally { setLoading(false); }
  };

  const confirmDeleteEntry = async () => {
    if (!idToDelete) return;
    const updatedTransactions = transactions.filter(t => t.id !== idToDelete);
    await supabase.from('customers').update({ transactions: updatedTransactions }).eq('id', customer.id);
    setTransactions(updatedTransactions);
    setDeleteDialogOpen(false);
    toast.success("Delete ho gayi!");
  };

  const makeCall = (type: 'phone' | 'whatsapp') => {
    if (!customer.phone) return;
    const cleanPhone = customer.phone.replace(/^0/, "92");
    if (type === 'phone') window.open(`tel:${customer.phone}`, "_self");
    else window.location.href = `whatsapp://send?phone=${cleanPhone}`;
  };

  const shareFullHistory = () => {
    let message = `*${displayShopName} - Hisaab* 📜\nCustomer: ${customer.name}\n---\n`;
    transactions.forEach(t => message += `${formatDate(t.date)}: Rs ${t.amount} ${t.type === 'udhar' ? 'Udhar' : 'Mila'}\n`);
    message += `---\n*Total: Rs ${total}*`;
    window.location.href = `whatsapp://send?phone=${customer.phone.replace(/^0/,"92")}&text=${encodeURIComponent(message)}`;
  };

  const sendReminder = () => {
    const msg = `*Assalam o Alaikum!* ✨\n\nAapka udhar *Rs ${total.toLocaleString()}* baqi hai. Meharbani kar ke ada kar dein.\n\n*Shukriya, ${displayShopName}*`;
    window.location.href = `whatsapp://send?phone=${customer.phone.replace(/^0/,"92")}&text=${encodeURIComponent(msg)}`;
  };

  const downloadInvoice = async () => {
    const element = invoiceRef.current;
    if (!element) return;
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    await doc.html(element, { callback: (doc) => doc.save(`${customer.name}.pdf`), x: 0, y: 0, width: 210, windowWidth: 794 });
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-[#020617] overflow-hidden">
      
      {/* HEADER */}
      <header className="flex-none h-16 border-b border-slate-200 dark:border-white/[0.05] bg-white dark:bg-[#0f172a] px-4 z-30">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all"><ArrowLeft className="w-5 h-5 text-slate-500" /></button>
            <div className="text-left">
              <h1 className="text-lg font-black text-slate-900 dark:text-white leading-none">{customer.name}</h1>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{customer.phone}</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full text-blue-600"><PhoneCall className="w-5 h-5" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl p-1 bg-white dark:bg-[#1e1e2d] border-slate-200 dark:border-white/10">
              <DropdownMenuItem onClick={() => makeCall('phone')} className="rounded-xl font-bold gap-2"><Phone className="w-4 h-4 text-blue-500" /> Phone Call</DropdownMenuItem>
              <DropdownMenuItem onClick={() => makeCall('whatsapp')} className="rounded-xl font-bold gap-2 text-emerald-600">WhatsApp Call</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full flex flex-col md:flex-row gap-6 p-4 md:p-6">
          
          {/* LEFT SIDE: BALANCE & BUTTONS */}
          <div className="flex-none w-full md:w-72 space-y-4">
            <div className="relative rounded-3xl p-6 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/20 overflow-hidden min-h-[140px] flex flex-col justify-center shadow-sm">
              <div className={`absolute bottom-0 left-0 right-0 h-1.5 ${total > 0 ? "bg-red-500" : "bg-emerald-500"}`} />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{total > 0 ? "Aap ne Lene Hain" : "Aap ne Dene Hain"}</p>
              <div className={`flex items-baseline gap-1 ${total > 0 ? "text-red-500" : "text-emerald-500"}`}>
                <span className="text-sm font-black">Rs</span>
                <h2 className="text-4xl font-black tracking-tighter">{Math.abs(total).toLocaleString()}</h2>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
              <Button onClick={() => { setEntryType("udhar"); setEntryOpen(true); }} className="h-12 bg-red-600 hover:bg-red-700 rounded-2xl font-bold text-sm">+ Udhar Diya</Button>
              <Button onClick={() => { setEntryType("payment"); setEntryOpen(true); }} className="h-12 bg-emerald-600 hover:bg-emerald-700 rounded-2xl font-bold text-sm">- Paisa Mila</Button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" onClick={sendReminder} className="flex-col h-16 rounded-2xl text-[10px] font-bold gap-1 dark:bg-[#0f172a] dark:border-white/10"><MessageCircle className="w-5 h-5 text-emerald-500" /> Reminder</Button>
              <Button variant="outline" onClick={downloadInvoice} className="flex-col h-16 rounded-2xl text-[10px] font-bold gap-1 dark:bg-[#0f172a] dark:border-white/10"><FileText className="w-5 h-5 text-blue-500" /> Invoice</Button>
              <Button variant="outline" onClick={shareFullHistory} className="flex-col h-16 rounded-2xl text-[10px] font-bold gap-1 dark:bg-[#0f172a] dark:border-white/10"><History className="w-5 h-5 text-indigo-500" /> History</Button>
            </div>
          </div>

          {/* RIGHT SIDE: TRANSACTION LIST & FILTERS */}
          <div className="flex-1 flex flex-col bg-white dark:bg-[#0f172a] rounded-[2rem] shadow-sm border border-slate-200 dark:border-white/[0.05] overflow-hidden">
            
            {/* NEW PREMIUM FILTER HEADER */}
            <div className="p-4 md:p-5 border-b border-slate-100 dark:border-white/[0.05] bg-slate-50/50 dark:bg-transparent">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-indigo-600 rounded-full" />
                  <span className="text-[11px] font-black uppercase text-slate-500">Transactions ({filteredTransactions.length})</span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch gap-2" ref={dropdownRef}>
                  {/* Dropdown Selector */}
                  <div className="relative">
                    <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-full sm:w-40 flex items-center justify-between bg-white dark:bg-[#1e1e2d] text-[12px] font-bold px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
                      {filterOptions.find(opt => opt.id === filterType)?.label}
                      <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 2 }} exit={{ opacity: 0, y: 5 }} className="absolute left-0 right-0 z-[50] mt-1 bg-white dark:bg-[#1a1a25] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl p-1">
                          {filterOptions.map(opt => (
                            <button key={opt.id} onClick={() => { setFilterType(opt.id); setIsDropdownOpen(false); if(opt.id!=='custom'){setStartDate(''); setEndDate('');} }} className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[12px] font-bold ${filterType === opt.id ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-500/10 text-slate-600'}`}>
                              {opt.label} {filterType === opt.id && <Check className="w-3 h-3" />}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Custom Date Inputs */}
                  {filterType === 'custom' && (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
                      <div className="flex flex-1 items-center bg-white dark:bg-[#1e1e2d] h-[42px] px-2 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm gap-4">
                        <DatePickerItem label="FROM" value={startDate} onChange={setStartDate} />
                        <div className="w-px h-6 bg-slate-200 dark:bg-white/10" />
                        <DatePickerItem label="TO" value={endDate} onChange={setEndDate} />
                      </div>
                      <button onClick={() => { setFilterType('all'); setStartDate(''); setEndDate(''); }} className="h-[42px] w-[42px] flex items-center justify-center bg-red-50 dark:bg-red-500/10 text-red-600 rounded-xl transition-all border border-red-100 dark:border-transparent"><RotateCcw className="w-4 h-4" /></button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* TRANSACTIONS LIST */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {[...filteredTransactions].reverse().map(tx => (
                <div key={tx.id} className="bg-slate-50 dark:bg-white/[0.02] rounded-2xl p-4 border border-slate-200 dark:border-white/5 flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${tx.type === "udhar" ? "bg-red-50 border-red-100 dark:bg-red-500/10 dark:border-transparent text-red-500" : "bg-emerald-50 border-emerald-100 dark:bg-emerald-500/10 dark:border-transparent text-emerald-600"}`}>
                      {tx.type === "udhar" ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className={`flex items-baseline gap-0.5 font-black ${tx.type === "udhar" ? "text-red-500" : "text-emerald-600"}`}>
                        <span className="text-[10px]">Rs</span>
                        <p className="text-lg">{tx.amount.toLocaleString()}</p>
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{formatDate(tx.date)} • {tx.remarks || (tx.type === 'udhar' ? 'Udhar' : 'Paisa Mila')}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingEntry(tx); setEntryType(tx.type); setEntryOpen(true); }} className="p-2 text-slate-400 hover:text-blue-500"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => { setIdToDelete(tx.id); setDeleteDialogOpen(true); }} className="p-2 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* DELETE DIALOG */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="w-[90%] max-w-[320px] rounded-[2rem] p-6 bg-white dark:bg-[#0f172a] border-slate-200 dark:border-white/10">
          <div className="text-center space-y-4">
            <div className="w-14 h-14 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto text-2xl">⚠️</div>
            <h2 className="text-lg font-black dark:text-white">Entry Delete Karein?</h2>
            <div className="flex flex-col gap-2">
              <Button onClick={confirmDeleteEntry} className="bg-red-600 hover:bg-red-700 rounded-xl h-12 font-bold">Haan, Delete Karein</Button>
              <Button onClick={() => setDeleteDialogOpen(false)} variant="ghost" className="rounded-xl h-12 font-bold text-slate-500">Nahi</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ADD ENTRY DIALOG */}
      <AddEntryDialog open={entryOpen} onClose={() => {setEntryOpen(false); setEditingEntry(null);}} type={entryType} onAdd={handleSaveEntry} initialAmount={editingEntry?.amount} initialRemarks={editingEntry?.remarks} />

      {/* INVOICE TEMPLATE (HIDDEN) */}
      <div style={{ position: 'absolute', top: '-9999px' }}>
        <div ref={invoiceRef}>
          <InvoiceTemplate customerName={customer.name} customerPhone={customer.phone || ""} shopName={displayShopName} transactions={transactions.map((t:any) => ({ id: t.id, date: formatDate(t.date), amount: t.amount, type: t.type === 'udhar' ? 'dr' : 'cr', remarks: t.remarks }))} totalBalance={total} />
        </div>
      </div>
    </div>
  );
}

// HELPER COMPONENT: CLEAN DATE ITEM
function DatePickerItem({ label, value, onChange }: any) {
  return (
    <div className="flex flex-col min-w-0 flex-1">
      <span className="text-[7px] font-black text-indigo-600 dark:text-indigo-400 tracking-widest leading-none mb-0.5">{label}</span>
      <div className="relative flex items-center">
        <input 
          type="date" 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent text-[11px] font-bold text-slate-700 dark:text-slate-200 outline-none w-full cursor-pointer uppercase appearance-none"
        />
        {/* Native date picker icon overrides standard input if styled correctly */}
      </div>
    </div>
  );
}