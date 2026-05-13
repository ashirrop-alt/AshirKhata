import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Loader2, Store, Download, FileText, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function PublicCustomerView() {
  const { shareId } = useParams();
  const [customer, setCustomer] = useState<any>(null);
  const [shopName, setShopName] = useState("Fazal Baksh 2.0");
  const [loading, setLoading] = useState(true);
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchPublicData() {
      const { data } = await supabase.from('customers').select('*').eq('share_id', shareId).single();
      if (data) {
        setCustomer(data);
        const { data: profile } = await supabase.from('profiles').select('shop_name').eq('id', data.user_id).single();
        if (profile?.shop_name) setShopName(profile.shop_name);
      }
      setLoading(false);
    }
    if (shareId) fetchPublicData();
  }, [shareId]);

  const downloadPDF = async () => {
    const element = pdfRef.current;
    if (!element) return;
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${customer.name}_Statement.pdf`);
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617] text-indigo-600"><Loader2 className="animate-spin" /></div>;
  if (!customer) return <div className="h-screen flex items-center justify-center font-bold text-rose-500">Link Invalid</div>;

  const total = customer.transactions?.reduce((acc: number, tx: any) => 
    tx.type === "udhar" ? acc + tx.amount : acc - tx.amount, 0) || 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100">
      
      {/* NAVBAR - Standard & Locked */}
      <header className="h-16 md:h-[68px] border-b border-slate-200 dark:border-white/[0.05] bg-white dark:bg-[#0f172a] px-4 md:px-6 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-lg">
              <Store className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <h1 className="text-base md:text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase truncate max-w-[150px] md:max-w-none">
              {shopName}
            </h1>
          </div>
          <button 
            onClick={downloadPDF}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-[10px] md:text-xs font-black transition-all active:scale-95"
          >
            <Download size={14} />
            <span>PDF</span>
          </button>
        </div>
      </header>

      <main className="p-4 md:p-8" ref={pdfRef}>
        <div className="max-w-xl mx-auto space-y-5">
          
          {/* TOP BOX - Balanced Width & Height */}
          <Card className="p-6 md:p-8 bg-indigo-600 border-none shadow-xl rounded-[2rem] relative overflow-hidden text-white max-w-[500px] mx-auto">
            <div className="flex justify-between items-start relative z-10">
              <div className="space-y-1">
                <p className="text-indigo-100/70 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">Kul Baqaya Rakam</p>
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter">
                  <span className="text-lg mr-1 opacity-80">Rs</span>
                  {total.toLocaleString()}
                </h2>
                <div className="mt-4 pt-4 border-t border-white/10">
                   <p className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-indigo-100">Grahak: {customer.name}</p>
                </div>
              </div>
              <div className="opacity-15">
                <FileText className="w-12 h-12 md:w-16 md:h-16" />
              </div>
            </div>
          </Card>

          {/* Transactions List */}
          <div className="space-y-3">
            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 mb-1">Hisaab ki Tafseel</h3>
            
            {customer.transactions?.slice().reverse().map((tx: any) => (
              <div key={tx.id} className="bg-white dark:bg-white/[0.03] p-4 rounded-2xl border border-slate-200/50 dark:border-white/10 flex justify-between items-center shadow-sm gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`p-2 rounded-xl flex-none ${tx.type === 'udhar' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                    {tx.type === 'udhar' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                       <span className={`text-[7px] md:text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter ${tx.type === 'udhar' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                        {tx.type === 'udhar' ? 'Udhar Diya' : 'Paisa Mila'}
                      </span>
                      <p className="text-[8px] md:text-[9px] text-slate-400 font-bold">{new Date(tx.date).toLocaleDateString('en-GB')}</p>
                    </div>
                    {/* Fixed Remarks Alignment */}
                    <p className="font-black text-xs md:text-sm text-slate-800 dark:text-slate-100 leading-tight break-words">
                      {tx.remarks || "Bila Tafseel"}
                    </p>
                  </div>
                </div>
                {/* Fixed Amount Position */}
                <div className={`text-sm md:text-base font-black whitespace-nowrap flex-none ${tx.type === 'udhar' ? 'text-rose-600' : 'text-emerald-500'}`}>
                  {tx.type === 'udhar' ? '+' : '-'} {tx.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-10 opacity-30">
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em]">
                Verified by Khatify • ashir-khata.vercel.app
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}