import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { useState, useEffect, useRef } from "react";
import { useKhata } from "@/hooks/useKhata";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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
  const fromRef = useRef<HTMLInputElement>(null);
  const toRef = useRef<HTMLInputElement>(null);



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

  useEffect(() => {
    if (data?.shopName) {
      localStorage.setItem("my_shop_name", data.shopName);
    }
  }, [data]);

  // 5. FILTER LOGIC
  const filteredTransactions = transactions.filter(t => {
    // 1. Agar 'All' select hai tw sab dikhao
    if (filterType === 'all') return true;

    // 2. Transaction ki date ko format karna (Database date check)
    const txDate = new Date(t.date);
    txDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 3. Aaj ka Filter
    if (filterType === 'today') {
      return txDate.getTime() === today.getTime();
    }

    // 4. Is Mahine ka Filter
    if (filterType === 'thisMonth') {
      return txDate.getMonth() === today.getMonth() &&
        txDate.getFullYear() === today.getFullYear();
    }

    // 5. CUSTOM FILTER (Jo masla kar raha tha)
    if (filterType === 'custom') {
      // Agar dono dates poori nahi likhi (10 characters), tw filter apply mat karo
      if (startDate.length < 10 || endDate.length < 10) return true;

      try {
        // dd/mm/yyyy ko split karke Year, Month, Day nikalna
        const [sDay, sMonth, sYear] = startDate.split('/').map(Number);
        const [eDay, eMonth, eYear] = endDate.split('/').map(Number);

        // JavaScript months 0 se start hote hain isliye (sMonth - 1)
        const startLimit = new Date(sYear, sMonth - 1, sDay);
        const endLimit = new Date(eYear, eMonth - 1, eDay);

        startLimit.setHours(0, 0, 0, 0);
        endLimit.setHours(23, 59, 59, 999);

        return txDate >= startLimit && txDate <= endLimit;
      } catch (e) {
        console.error("Date filter error:", e);
        return true;
      }
    }

    return true;
  });

  // 6. CALCULATIONS & UTILS
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

  // 7. FUNCTIONS (Handlers)
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

  const askDeleteConfirmation = (txId: string) => {
    setIdToDelete(txId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteEntry = async () => {
    if (!idToDelete) return;
    try {
      const updatedTransactions = transactions.filter(t => t.id !== idToDelete);
      const { error } = await supabase.from('customers').update({ transactions: updatedTransactions }).eq('id', customer.id);
      if (error) throw error;
      setTransactions(updatedTransactions);
      toast.success("Entry delete ho gayi!");
    } catch (error: any) {
      toast.error("Delete nahi ho saka");
    } finally {
      setDeleteDialogOpen(false);
      setIdToDelete(null);
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
      <header className="flex-none h-16 md:h-[68px] border-b border-slate-200 dark:border-white/[0.05] bg-white dark:bg-[#0f172a] px-4 md:px-6 z-[100] shadow-sm transition-all">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          {/* Left Side: Back Button + Info */}
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all group active:scale-90"
            >
              <ArrowLeft className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
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
            <div className="relative rounded-3xl p-5 md:p-6 shadow-sm bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/20 overflow-hidden transition-all min-h-[129px] md:min-h-[145px] flex flex-col justify-center">
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
              <TooltipProvider delayDuration={100}>
                <div className="grid grid-cols-3 gap-3 mt-4">

                  {/* Reminder Button */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        className="group flex flex-col h-16 items-center justify-center text-[11px] font-semibold rounded-xl w-full transition-all duration-200 border border-slate-300/70 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-400 shadow-sm dark:border-white/15 dark:bg-[#0f172a] dark:text-slate-300 dark:hover:bg-white/5"
                        onClick={sendReminder}
                      >
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="#25D366" className="transition-transform duration-200 group-hover:scale-110 mb-0.5">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.393 0 12.03c0 2.12.554 4.189 1.602 6.006L0 24l6.117-1.605a11.803 11.803 0 005.925 1.586h.005c6.635 0 12.032-5.396 12.035-12.032a11.762 11.762 0 00-3.441-8.518z" />
                        </svg>
                        <span className="leading-none text-slate-600 dark:text-slate-300">Reminder</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-slate-800 text-white border-none font-bold text-[11px] px-3 py-1.5 shadow-xl">
                      <p>Payment Reminder</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Invoice Button */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={downloadInvoice}
                        className="group flex flex-col h-16 items-center justify-center text-[11px] font-semibold rounded-xl w-full transition-all duration-200 border border-slate-300/70 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-400 shadow-sm dark:border-white/15 dark:bg-[#0f172a] dark:text-slate-300 dark:hover:bg-white/5"
                      >
                        <FileText className="w-5 h-5 text-blue-500 mb-0.5 transition-transform duration-200 group-hover:scale-110" />
                        <span className="leading-none text-slate-600 dark:text-slate-300">Invoice</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-slate-800 text-white border-none font-bold text-[11px] px-3 py-1.5 shadow-xl">
                      <p>Download PDF Invoice</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* History Button */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={shareFullHistory}
                        className="group flex flex-col h-16 items-center justify-center text-[11px] font-semibold rounded-xl w-full transition-all duration-200 border border-slate-300/70 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-400 shadow-sm dark:border-white/15 dark:bg-[#0f172a] dark:text-slate-300 dark:hover:bg-white/5"
                      >
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="#25D366" className="transition-transform duration-200 group-hover:scale-110 mb-0.5">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.393 0 12.03c0 2.12.554 4.189 1.602 6.006L0 24l6.117-1.605a11.803 11.803 0 005.925 1.586h.005c6.635 0 12.032-5.396 12.035-12.032a11.762 11.762 0 00-3.441-8.518z" />
                        </svg>
                        <span className="leading-none text-slate-600 dark:text-slate-300">History</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-slate-800 text-white border-none font-bold text-[11px] px-3 py-1.5 shadow-xl">
                      <p>Full Report</p>
                    </TooltipContent>
                  </Tooltip>

                </div>
              </TooltipProvider>
            </div>

          </div>

          {/* RIGHT SIDE (Transaction List Container) */}
          <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-[#0f172a] rounded-3xl shadow-sm border border-slate-200 dark:border-white/[0.05] overflow-hidden transition-all">
            <div className="flex flex-col h-full">
              {/* Date Filter Header Section */}
              {/* Unified Header - Matches Home Page Look */}
              {/* Native & Premium Filter Header */}
              {/* Final Premium Filter Header */}
              {/* --- Header Section (Heading + Filter) --- */}
{/* --- Header Section (Heading + Filter) --- */}
<div className="px-3 pt-5 pb-2 md:px-6 md:py-2 border-b border-slate-100 dark:border-white/[0.05] bg-transparent">
  
  {/* 1. LAPTOP HEADER (Exact Accuracy from your provided old code & image_01f43b.png) */}
  <div className="hidden lg:flex items-center justify-between min-h-[48px]">
    <div className="flex items-center gap-2">
      <div className="w-1 h-4 bg-indigo-600 rounded-full" />
      <span className="text-[12px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Transactions ({filteredTransactions.length})
      </span>
    </div>

    <div className="flex items-center gap-3 relative" ref={dropdownRef}>
      {/* Desktop Date Inputs */}
      {filterType === 'custom' && (
        <motion.div 
          initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
          className="flex items-center bg-white dark:bg-[#161625] h-[44px] px-1 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm divide-x divide-slate-100 dark:divide-white/5"
        >
          <DatePickerInput label="FROM" value={startDate} onChange={setStartDate} inputRef={fromRef} nextRef={toRef} />
          <DatePickerInput label="TO" value={endDate} onChange={setEndDate} inputRef={toRef} />
          <button onClick={() => { setStartDate(''); setEndDate(''); setFilterType('all'); }} className="h-[44px] w-[44px] flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
            <RotateCcw size={16} />
          </button>
        </motion.div>
      )}

      {/* Desktop Dropdown - Exact 150px and 12px text */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-[150px] flex items-center justify-between gap-2 bg-white dark:bg-[#161625] text-slate-800 dark:text-slate-200 text-[12px] font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm hover:border-indigo-500/40"
        >
          <span className="truncate">{filterOptions.find(opt => opt.id === filterType)?.label}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 4 }} exit={{ opacity: 0, y: 8 }}
              className="absolute right-0 z-40 mt-1 w-[170px] bg-white dark:bg-[#11111d] border border-slate-200 dark:border-white/[0.15] rounded-xl shadow-xl p-1"
            >
              {filterOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => { setFilterType(option.id); setIsDropdownOpen(false); if (option.id !== 'custom') { setStartDate(''); setEndDate(''); } }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[12px] font-medium transition-all mb-0.5 last:mb-0 ${filterType === option.id ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-indigo-500/10'}`}
                >
                  {option.label}
                  {filterType === option.id && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  </div>

  {/* 2. MOBILE HEADER (Aapka "Perfect" layout - No changes here) */}
  <div className="lg:hidden">
    <div className="flex flex-row items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 bg-indigo-600 rounded-full" />
        <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
          HISAAB ({filteredTransactions.length})
        </span>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 bg-white dark:bg-[#1e1e2d] text-slate-800 dark:text-slate-200 text-[11px] font-bold px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm active:scale-95"
        >
          <span className="max-w-[90px] truncate">{filterOptions.find(opt => opt.id === filterType)?.label}</span>
          <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 4 }} exit={{ opacity: 0, y: 8 }}
              className="absolute right-0 z-40 mt-1 w-[150px] bg-white dark:bg-[#1a1a25] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl p-1"
            >
              {filterOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => { setFilterType(option.id); setIsDropdownOpen(false); if (option.id !== 'custom') { setStartDate(''); setEndDate(''); } }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[11px] font-bold mb-0.5 ${filterType === option.id ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  {option.label}
                  {filterType === option.id && <Check className="w-3 h-3" />}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>

    {/* Mobile Custom Date Transition */}
    {filterType === 'custom' && (
      <motion.div
        initial={{ height: 0, opacity: 0, marginTop: 0 }}
        animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
        className="flex items-center gap-2 overflow-hidden"
      >
        <div className="flex flex-1 items-center bg-white dark:bg-[#1e1e2d] h-[46px] px-1 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm divide-x divide-slate-100 dark:divide-white/5">
          <DatePickerInput label="FROM" value={startDate} onChange={setStartDate} inputRef={fromRef} nextRef={toRef} />
          <DatePickerInput label="TO" value={endDate} onChange={setEndDate} inputRef={toRef} />
        </div>
        <button
          onClick={() => { setStartDate(''); setEndDate(''); setFilterType('all'); }}
          className="h-[46px] w-[46px] flex items-center justify-center bg-white dark:bg-[#1e1e2d] text-slate-400 rounded-xl border border-slate-200 dark:border-white/10"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </motion.div>
    )}
  </div>
</div>

              {/* Transactions List Section */}
              <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-transparent">
                <div className="flex-1 overflow-y-auto custom-scrollbar pb-24 md:pb-4 p-4 space-y-3">
                  {[...filteredTransactions].reverse().map(tx => (
                    <div key={tx.id} className="w-full bg-slate-50 dark:bg-white/[0.03] rounded-2xl p-4 border border-slate-200 dark:border-white/10 hover:border-blue-300/60 dark:hover:border-blue-500/50 transition-all flex items-center justify-between shadow-sm">
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
                          {tx.remarks && (
                            <div className="mt-1.5 inline-block px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black italic">
                              {tx.remarks}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setEditingEntry(tx); setEntryType(tx.type); setEntryOpen(true); }} className="p-2 text-slate-400 hover:text-blue-500 transition-all"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => askDeleteConfirmation(tx.id)} className="p-2 text-slate-400 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- Delete Modal Code --- */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="w-[85%] max-w-[340px] bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/20 shadow-2xl rounded-[2rem] p-7 outline-none">
          <div className="space-y-6 text-center">
            {/* Danger Icon with Better Visibility */}
            <div className="mx-auto w-14 h-14 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center">
              <span className="text-red-600 dark:text-red-500 text-xl">⚠️</span>
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                Entry Delete Karein?
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Ye entry hamesha ke liye khatam ho jayegi.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={confirmDeleteEntry}
                className="w-full h-12 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-500/20 active:scale-95 transition-all border-none"
              >
                Haan
              </Button>
              <Button
                onClick={() => setDeleteDialogOpen(false)}
                variant="outline"
                className="w-full h-12 rounded-xl font-bold transition-all active:scale-95
               /* Light Mode Styles */
               border-slate-300 text-slate-700 hover:bg-slate-50
               /* Dark Mode Styles - Ab ye 'bin bulaya mehmaan' nahi lagega */
               dark:border-white/20 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
              >
                Nahi
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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

// FINAL FIXED DatePickerInput (Proper typing + cursor + correct format)

// FINAL POLISHED DatePickerInput (placeholder overlay + auto focus jump)

function DatePickerInput({ label, value, onChange, nextRef, inputRef }: any) {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const toISO = (val: string) => {
    if (!val || val.length !== 10) return '';
    const [d, m, y] = val.split('/');
    return `${y}-${m}-${d}`;
  };

  const fromISO = (val: string) => {
    if (!val) return '';
    const [y, m, d] = val.split('-');
    return `${d}/${m}/${y}`;
  };

  return (
    <div className="flex flex-col flex-1 px-2 py-1 min-w-0 gap-0.5">
      <span className="text-[8px] font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase leading-none shrink-0">
        {label}
      </span>

      <div className="relative w-full flex items-center">

        {/* Placeholder overlay */}
        {!value && (
          <span className="absolute left-0 text-[11px] font-medium text-slate-400 pointer-events-none">
            dd/mm/yyyy
          </span>
        )}

        {/* MAIN INPUT */}
        <input
          type="text"
          ref={inputRef}
          value={value}
          onChange={(e) => {
            let val = e.target.value;

            val = val.replace(/[^0-9]/g, '');

            if (val.length <= 2) {
              // dd
            } else if (val.length <= 4) {
              val = val.slice(0, 2) + '/' + val.slice(2);
            } else {
              val = val.slice(0, 2) + '/' + val.slice(2, 4) + '/' + val.slice(4, 8);
            }

            onChange(val);

            // Auto jump to next field when complete
            if (val.length === 10 && nextRef?.current) {
              nextRef.current.focus();
            }
          }}
          className="w-full bg-transparent text-[11px] font-bold outline-none border-none p-0 focus:ring-0 text-slate-700 dark:text-slate-200 caret-black dark:caret-white"
        />

        {/* Desktop calendar only on icon */}
        {!isMobile && (
          <input
            type="date"
            tabIndex={-1} // <-- Ye computer ko kahe ga ke is par Tab se mat ruko
            value={toISO(value)}
            onChange={(e) => onChange(fromISO(e.target.value))}
            className="absolute right-0 w-6 h-full opacity-0 cursor-pointer"
          />
        )}

        {isMobile && (
          <input
            type="date"
            tabIndex={-1} // <-- Mobile par bhi focus ki zaroorat nahi
            value={toISO(value)}
            onChange={(e) => onChange(fromISO(e.target.value))}
            className="absolute inset-0 opacity-0"
          />
        )}

        <Calendar className="w-3 h-3 text-slate-400 absolute right-0 pointer-events-none" />
      </div>
    </div>
  );
}

