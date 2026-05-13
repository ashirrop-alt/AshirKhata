import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Loader2, Store, Download, FileText } from "lucide-react";
import jsPDF from 'jspdf';

export default function PublicCustomerView() {
  const { shareId } = useParams();
  const [customer, setCustomer] = useState<any>(null);
  const [shopName, setShopName] = useState("Khatify User");
  const [loading, setLoading] = useState(true);
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchPublicData() {
      // 1. Customer Data fetch karna
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('share_id', shareId)
        .single();

      if (data) {
        setCustomer(data);
        // 2. Us customer ke malik (User) ki shop ka naam nikalna
        const { data: userData } = await supabase
          .from('profiles') // Ya jo bhi aapka settings table hai
          .select('shop_name')
          .eq('id', data.user_id)
          .single();
        
        if (userData?.shop_name) setShopName(userData.shop_name);
      }
      setLoading(false);
    }
    if (shareId) fetchPublicData();
  }, [shareId]);

  const downloadStatement = async () => {
    const element = pdfRef.current;
    if (!element) return;
    const doc = new jsPDF('p', 'mm', 'a4');
    await doc.html(element, {
      callback: (doc) => doc.save(`${customer.name}_Statement.pdf`),
      x: 10, y: 10, width: 190, windowWidth: 800
    });
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617]"><Loader2 className="animate-spin text-indigo-600" /></div>;
  if (!customer) return <div className="h-screen flex items-center justify-center font-bold text-rose-500 bg-slate-50 dark:bg-[#020617]">Link Invalid</div>;

  const total = customer.transactions?.reduce((acc: number, tx: any) => 
    tx.type === "udhar" ? acc + tx.amount : acc - tx.amount, 0) || 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100">
      
      {/* STANDARD NAVBAR - Matching Dashboard Height */}
      <header className="h-16 md:h-[68px] border-b border-slate-200 dark:border-white/[0.05] bg-white dark:bg-[#0f172a] px-4 md:px-6 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Store className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-black tracking-tight uppercase">{shopName}</h1>
          </div>
          
          <button 
            onClick={downloadStatement}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-black transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
          >
            <Download size={14} />
            <span className="hidden sm:inline">PDF</span>
          </button>
        </div>
      </header>

      <main className="p-4 md:p-8" ref={pdfRef}>
        <div className="max-w-xl mx-auto space-y-6">
          
          {/* Main Balance Card */}
          <Card className="p-8 bg-white dark:bg-white/[0.03] border-slate-200 dark:border-white/10 shadow-xl rounded-[2rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
                <FileText size={80} />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Kul Baqaya Rakam</p>
            <h2 className={`text-5xl font-black tracking-tighter ${total > 0 ? 'text-rose-600' : 'text-emerald-500'}`}>
                <span className="text-2xl mr-1 font-bold">Rs</span>
                {total.toLocaleString()}
            </h2>
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-white/5">
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Grahak: <span className="text-slate-900 dark:text-white">{customer.name}</span></p>
            </div>
          </Card>

          {/* Transactions with Badges */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 mb-4">Hisaab ki Tafseel</h3>
            
            {customer.transactions?.slice().reverse().map((tx: any) => (
              <div key={tx.id} className="bg-white dark:bg-white/[0.03] p-4 rounded-2xl border border-slate-100 dark:border-white/5 flex justify-between items-center shadow-sm hover:border-indigo-500/30 transition-all group">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    {/* Status Badge */}
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter ${tx.type === 'udhar' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                        {tx.type === 'udhar' ? 'Udhar' : 'Mila'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">{new Date(tx.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <p className="font-black text-slate-700 dark:text-slate-200 text-sm">{tx.remarks || "No Details"}</p>
                </div>
                <div className={`text-base font-black ${tx.type === 'udhar' ? 'text-rose-600' : 'text-emerald-500'}`}>
                  {tx.type === 'udhar' ? '+' : '-'} {tx.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center py-10">
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em] opacity-50">
                Generated via Khatify • ashir-khata.vercel.app
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}