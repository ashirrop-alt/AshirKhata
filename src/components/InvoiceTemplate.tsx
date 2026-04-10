import React from 'react';

interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'dr' | 'cr'; // 'dr' for Udhar, 'cr' for Paisa Mila
}

interface InvoiceProps {
  customerName: string;
  customerPhone: string;
  shopName: string;
  transactions: Transaction[];
  totalBalance: number;
}

const InvoiceTemplate = React.forwardRef<HTMLDivElement, InvoiceProps>(({ 
  customerName, customerPhone, shopName, transactions, totalBalance 
}, ref) => {
  return (
    /* 1. MAIN CONTAINER: Padding 0 kardi taake bar top edge par rahe */
    <div 
      ref={ref} 
      className="bg-white w-[794px] h-auto text-slate-800 relative flex flex-col overflow-hidden"
      style={{ fontFamily: 'sans-serif' }}
    >
      <style>{`
        @media print {
          tr { page-break-inside: avoid !important; }
          .summary-container { page-break-inside: avoid !important; }
        }
        table { page-break-inside: auto; width: 100%; border-collapse: collapse; }
        tr { page-break-inside: avoid; page-break-after: auto; }
        * { font-style: normal !important; } 
      `}</style>
      
      {/* 2. GREEN BAR: Absolute top-0 taake bilkul edge par chipak jaye */}
      <div className="absolute top-0 left-0 w-full h-[8px] bg-emerald-600 z-50"></div>

      {/* 3. INNER CONTENT WRAPPER: Saari padding ab yahan handle hogi */}
      <div className="px-10 pb-10 pt-12 flex flex-col flex-grow">
        
        {/* Header */}
        <div className="flex justify-between border-b-2 border-slate-200 pb-8">
          <div>
            <h1 className="text-4xl font-bold text-emerald-600 uppercase tracking-tighter">
              {shopName}
            </h1>
            <p className="text-slate-500 mt-1 font-semibold text-sm">Digital Khata Report</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg uppercase tracking-wider text-slate-700">Invoice</p>
            <p className="text-slate-500 text-xs font-medium">Date: {new Date().toLocaleDateString('en-GB')}</p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="my-10">
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 w-1/2 shadow-sm">
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Bill To:</p>
            <p className="text-xl font-bold text-slate-800 leading-tight">{customerName}</p>
            <p className="text-slate-600 font-semibold text-sm mt-1">{customerPhone}</p>
          </div>
        </div>

        {/* Table Section */}
        <div className="flex-grow">
          <table className="w-full mt-2">
            <thead>
              <tr className="bg-slate-800">
                <th className="py-3 px-4 text-left rounded-tl-lg font-bold uppercase text-[10px] tracking-widest text-white">Date</th>
                <th className="py-3 px-4 text-left font-bold uppercase text-[10px] tracking-widest text-white">Description</th>
                <th className="py-3 px-4 text-right rounded-tr-lg font-bold uppercase text-[10px] tracking-widest text-white">Amount (Rs)</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, index) => (
                <tr key={t.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} border-b border-slate-100`}>
                  <td className="py-4 px-4 text-xs font-bold text-slate-500">{t.date}</td>
                  <td className="py-4 px-4 font-bold text-sm text-slate-700">
                    {t.type === 'dr' ? 'Udhar Diya' : 'Paisa Mila'}
                  </td>
                  <td className={`py-4 px-4 text-right font-black text-base ${t.type === 'dr' ? 'text-red-600' : 'text-emerald-600'}`}>
                    {t.type === 'dr' ? `+ ${t.amount.toLocaleString()}` : `- ${t.amount.toLocaleString()}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Box */}
        <div className="mt-12 flex justify-end summary-container">
          <div className="w-72 bg-slate-900 text-white p-8 rounded-3xl shadow-2xl">
            <p className="text-[10px] opacity-60 uppercase font-black tracking-[0.2em] mb-2 text-center text-white">Total Net Balance</p>
            <div className="border-t border-white/20 pt-4">
              <p className="text-3xl font-black text-center tracking-tight text-white">
                Rs {totalBalance.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 mb-4 pt-8 border-t border-dotted border-slate-300 text-center">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em]">
            Generated via {shopName} Digital Khata - 2026
          </p>
        </div>
      </div>
    </div>
  );
});

export default InvoiceTemplate;