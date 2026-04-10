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

// Is code ko replace karein
const InvoiceTemplate = React.forwardRef<HTMLDivElement, InvoiceProps>(({ 
  customerName, customerPhone, shopName, transactions, totalBalance 
}, ref) => {
  return (
    <div ref={ref} className="p-10 bg-white w-[794px] text-slate-800 font-sans relative">
      {/* CSS for Page Breaking */}
      <style>{`
        @media print {
          @page { size: A4; margin: 0; }
          body { -webkit-print-color-adjust: exact; }
          .page-break { page-break-after: always; }
        }
        tr { break-inside: avoid; }
      `}</style>

      {/* Top Green Bar */}
      <div className="absolute top-0 left-0 w-full h-2 bg-emerald-600"></div>

      {/* Header */}
      <div className="flex justify-between border-b-2 border-slate-200 pb-8 mt-4">
        <div>
          <h1 className="text-4xl font-bold text-emerald-600 uppercase tracking-tighter">{shopName}</h1>
          <p className="text-slate-500 mt-1 font-medium">Digital Khata Report</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-lg uppercase tracking-wider">Invoice</p>
          <p className="text-slate-500 text-sm">Date: {new Date().toLocaleDateString('en-GB')}</p>
        </div>
      </div>

      {/* Customer Info */}
      <div className="my-10">
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 w-1/2">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Bill To:</p>
          <p className="text-xl font-bold leading-tight">{customerName}</p>
          <p className="text-slate-600 font-medium text-sm">{customerPhone}</p>
        </div>
      </div>

      {/* Table */}
      <table className="w-full mt-4 border-collapse">
        <thead>
          <tr className="bg-slate-800 text-white">
            <th className="py-3 px-4 text-left rounded-tl-lg font-bold uppercase text-[10px] tracking-wider">Date</th>
            <th className="py-3 px-4 text-left font-bold uppercase text-[10px] tracking-wider">Description</th>
            <th className="py-3 px-4 text-right rounded-tr-lg font-bold uppercase text-[10px] tracking-wider">Amount (Rs)</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t, index) => (
            <tr key={t.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'} border-b border-slate-100`}>
              <td className="py-3 px-4 text-sm font-medium">{t.date}</td>
              <td className="py-3 px-4 font-semibold text-sm">
                {t.type === 'dr' ? 'Udhar Diya' : 'Paisa Mila'}
              </td>
              <td className={`py-3 px-4 text-right font-bold text-sm ${t.type === 'dr' ? 'text-red-600' : 'text-emerald-600'}`}>
                {t.type === 'dr' ? `+ ${t.amount.toLocaleString()}` : `- ${t.amount.toLocaleString()}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary - Ye hamesha table ke foran baad aaye ga */}
      <div className="mt-8 flex justify-end">
        <div className="w-64 bg-slate-800 text-white p-6 rounded-2xl shadow-xl">
          <p className="text-[10px] opacity-70 uppercase tracking-[0.2em] mb-1 font-bold text-center">Total Net Balance</p>
          <p className="text-2xl font-black text-center border-t border-white/20 pt-2">
            Rs {totalBalance.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Footer - Content lamba hone par ye bottom par auto-adjust hoga */}
      <div className="mt-12 mb-4 pt-6 border-t border-dotted border-slate-300 text-center">
        <p className="text-slate-400 text-[10px] font-medium uppercase tracking-widest">
          Generated via {shopName} Digital Khata - 2026
        </p>
      </div>
    </div>
  );
});