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

        // Loading state ya alert dikha sakte hain kyunke isme thora waqt lagta hai
        const canvas = await html2canvas(element, {
            scale: 1.5, // 2 se kam karke 1.5 kiya taake size chota ho
            useCORS: true,
            logging: false,
            backgroundColor: "#ffffff" // PDF ka background saaf rakhega
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.7); // PNG ki bajaye JPEG aur 70% quality (size drastically kam hoga)
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4',
            compress: true // PDF compression on
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
        pdf.save(`${customer.name}_Khatify.pdf`);
    };

    if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617] text-indigo-600"><Loader2 className="animate-spin" /></div>;
    if (!customer) return <div className="h-screen flex items-center justify-center font-bold text-rose-500">Link Invalid</div>;

    const total = customer.transactions?.reduce((acc: number, tx: any) =>
        tx.type === "udhar" ? acc + tx.amount : acc - tx.amount, 0) || 0;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100">

            {/* NAVBAR */}
            <header className="h-16 md:h-[68px] border-b border-slate-200 dark:border-white/[0.05] bg-white dark:bg-[#0f172a] px-4 md:px-6 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto h-full flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/30">
                            <Store className="w-4 h-4 md:w-5 md:h-5 text-white" />
                        </div>
                        <h1 className="text-lg md:text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
                            {shopName}
                        </h1>
                    </div>
                    <a
                        href={`${window.location.origin}/signup`}
                        target="_blank"
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-[10px] font-black transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
                    >
                        <Store size={14} className="opacity-90" />
                        <span className="tracking-wider">FREE KHATA KHOLIYE</span>
                    </a>
                </div>
            </header>

            <main className="p-4 md:p-8" ref={pdfRef}>
                <div className="max-w-xl mx-auto space-y-6">

                    {/* TOP BOX - Balanced Size */}
                    <Card className="p-6 md:p-8 bg-indigo-600 dark:bg-indigo-600 border-none shadow-xl rounded-[2rem] relative overflow-hidden text-white">
                        <div className="flex justify-between items-start relative z-10">
                            <div>
                                <p className="text-indigo-100/70 text-[10px] font-black uppercase tracking-[0.2em] mb-1.5">Kul Baqaya Rakam</p>
                                <h2 className="text-4xl md:text-5xl font-black tracking-tighter">
                                    <span className="text-xl md:text-2xl mr-1.5 opacity-80 font-bold">Rs</span>
                                    {total.toLocaleString()}
                                </h2>
                                <div className="mt-5 pt-5 border-t border-white/10">
                                    <p className="text-[11px] md:text-sm font-black uppercase tracking-[0.1em] text-indigo-100">Grahak: {customer.name}</p>
                                </div>
                            </div>
                            <div className="opacity-20 hidden sm:block">
                                <FileText size={80} />
                            </div>
                        </div>
                    </Card>

                    {/* Transactions List */}
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Hisaab ki Tafseel</h3>

                        {customer.transactions?.slice(-50).reverse().map((tx: any) => (
                            <div key={tx.id} className="bg-white dark:bg-white/[0.03] p-5 rounded-2xl border border-slate-200/50 dark:border-white/10 flex justify-between items-center shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2.5 rounded-xl ${tx.type === 'udhar' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                        {tx.type === 'udhar' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter shadow-sm ${tx.type === 'udhar' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                                                {tx.type === 'udhar' ? 'Udhar Diya' : 'Paisa Mila'}
                                            </span>
                                            <p className="text-[9px] text-slate-400 font-bold">{new Date(tx.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                        </div>
                                        <p className="font-black text-sm md:text-base text-slate-900 dark:text-slate-100 leading-tight">{tx.remarks || "Bila Tafseel"}</p>
                                    </div>
                                </div>
                                <div className={`text-base md:text-lg font-black ${tx.type === 'udhar' ? 'text-rose-600' : 'text-emerald-500'}`}>
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