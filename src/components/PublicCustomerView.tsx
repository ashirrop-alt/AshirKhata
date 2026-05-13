import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Loader2, Store, Wallet } from "lucide-react";

export default function PublicCustomerView() {
  const { shareId } = useParams();
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPublicData() {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('share_id', shareId)
        .single();

      if (data) setCustomer(data);
      setLoading(false);
    }
    if (shareId) fetchPublicData();
  }, [shareId]);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (!customer) return <div className="h-screen flex items-center justify-center font-bold text-rose-500">Link Galat Hai ya Purana Ho Chuka Hai</div>;

  const total = customer.transactions?.reduce((acc: number, tx: any) => 
    tx.type === "udhar" ? acc + tx.amount : acc - tx.amount, 0) || 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] p-4 md:p-8">
      <div className="max-w-md mx-auto space-y-6">
        
        {/* Shop Header */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Store className="w-6 h-6 text-indigo-600" />
          <h1 className="text-xl font-black tracking-tight">Khatify Live View</h1>
        </div>

        {/* Balance Card */}
        <Card className="p-6 bg-white dark:bg-slate-900 border-none shadow-xl rounded-3xl overflow-hidden relative">
            <div className="relative z-10">
                <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">Kul Baqaya Rakam</p>
                <h2 className={`text-4xl font-black ${total > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    Rs {total.toLocaleString()}
                </h2>
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Customer: {customer.name}</p>
                </div>
            </div>
        </Card>

        {/* Transaction History (Read Only) */}
        <div className="space-y-3">
          <h3 className="text-sm font-black text-slate-400 uppercase ml-2">Hisaab ki Tafseel</h3>
          {customer.transactions?.map((tx: any) => (
            <div key={tx.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl flex justify-between items-center shadow-sm">
              <div>
                <p className="text-xs text-slate-400 font-bold">{new Date(tx.date).toLocaleDateString()}</p>
                <p className="font-black text-slate-800 dark:text-slate-200">{tx.remarks || (tx.type === 'udhar' ? 'Udhar Liya' : 'Payment Di')}</p>
              </div>
              <div className={`font-black ${tx.type === 'udhar' ? 'text-rose-500' : 'text-emerald-500'}`}>
                {tx.type === 'udhar' ? '+' : '-'} {tx.amount.toLocaleString()}
              </div>
            </div>
          )).reverse()}
        </div>

        <p className="text-center text-[10px] text-slate-400 font-bold mt-10 uppercase tracking-widest">
            Powered by ashir-khata.vercel.app
        </p>
      </div>
    </div>
  );
}