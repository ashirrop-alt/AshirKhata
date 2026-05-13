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
  const [shopName, setShopName] = useState("Khatify User");
  const [loading, setLoading] = useState(true);
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchPublicData() {
      const { data } = await supabase.from('customers').select('*').eq('share_id', shareId).single();
      if (data) {
        setCustomer(data);
        const { data: userData } = await supabase.from('profiles').select('shop_name').eq('id', data.user_id).single();
        if (userData?.shop_name) setShopName(userData.shop_name);
      }
      setLoading(false);
    }
    if (shareId) fetchPublicData();
  }, [shareId]);

  const downloadPDF = async () => {
    const element = pdfRef.current;
    if (!element) return;
    
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${customer.name}_Statement.pdf`);
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617] text-indigo-600"><Loader2 className="animate-spin" /></div>;
  if (!customer) return <div className="h-screen flex items-center justify-center font-bold text-rose-500">Link Invalid</div>;

  const total = customer.transactions?.reduce((acc: number, tx: any) => 
    tx.type === "udhar" ? acc + tx.amount : acc - tx.amount, 0) || 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-sans">
      
      {/* NAVBAR - Same Height as before */}
      <header className="h-16 md:h-[68px] border-b border-slate-200 dark:border-white/[0.05] bg-white dark:bg-[#0f172a] px-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-indigo-600" />
            <h1 className="text-sm font-black tracking-tighter uppercase">{shopName}</h1>
          </div>
          <button onClick={downloadPDF} className="p-2 bg-indigo-600 text-white rounded-full shadow-lg active:scale-90 transition-all">
            <Download size={18} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="p-4 md:p-6 pb-20">
        <div className="max-w-lg mx-auto space-y-6" ref={pdfRef}>
          
          {/* Compact Balance Card */}
          <Card className="p-6 bg-indigo-600 text-white border-none shadow-2xl rounded-[1.5rem] overflow-hidden relative">
            <div className="relative z-10">
              <p className="text-indigo-100 text-[10px] font-black uppercase tracking-widest opacity-80">Kul Baqaya</p>
              <h2 className="text-3xl font-black mt-1">Rs {total.toLocaleString()}</h2>
              <div className="mt-4 flex items-center gap-2 text-[11px] font-bold bg-white/10 w-fit px-3 py-1 rounded-full">
                <FileText size={12} /> {customer.name}
              </div>
            </div>
            {/* Design Circle */}
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          </Card>

          {/* History List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hisaab ki Tafseel</h3>
              <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-md">LIVE</span>
            </div>
            
            {customer.transactions?.slice().reverse().map((tx: any) => (
              <div key={tx.id} className="bg-white dark:bg-white/[0.02] p-4 rounded-xl border border-slate-100 dark:border-white/5 flex justify-between items-center transition-all shadow-sm">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${tx.type === 'udhar' ? 'bg-rose-50 dark:bg-rose-500/10' : 'bg-emerald-50 dark:bg-emerald-500/10'}`}>
                    {tx.type === 'udhar' ? <ArrowUpRight className="text-rose-600" size={16} /> : <ArrowDownLeft className="text-emerald-500" size={16} />}
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold">{new Date(tx.date).toLocaleDateString('en-GB')}</p>
                    <p className="font-black text-xs text-slate-700 dark:text-slate-200">{tx.remarks || "Bila Tafseel"}</p>
                    <span className={`text-[9px] font-black uppercase ${tx.type === 'udhar' ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {tx.type === 'udhar' ? 'Udhar Diya' : 'Paisa Mila'}
                    </span>
                  </div>
                </div>
                <div className={`font-black text-sm ${tx.type === 'udhar' ? 'text-rose-600' : 'text-emerald-500'}`}>
                  {tx.type === 'udhar' ? '+' : '-'} {tx.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-8 border-t border-slate-100 dark:border-white/5">
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
              Powered by Khatify.ashir • Verified Link
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}