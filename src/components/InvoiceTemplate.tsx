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
    <div ref={ref} className="p-10 bg-white w-[794px] min-h-[1123px] text-slate-800 font-sans relative">
      {/* Top Green Bar - Retained from new version */}
      <div className="absolute top-0 left-0 w-full h-2 bg-emerald-600"></div>

      {/* Header - Back to Old Style */}
      <div className="flex justify-between border-b-2 border-slate-200 pb-8 mt-4">
        <div>
          <h1 className="text-4xl font-bold text-emerald-600 uppercase tracking-tighter">{shopName}</h1>
          {/* Digital Khata Report - Italics Removed */}
          <p className="text-slate-500 mt-1 font-medium">Digital Khata Report</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-lg uppercase tracking-wider">Invoice</p>
          <p className="text-slate-500">Date: {new Date().toLocaleDateString('en-GB')}</p>
        </div>
      </div>

      {/* Customer Info - Old Style */}
      <div className="my-10 grid grid-cols-2 gap-4">
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-2">Bill To:</p>
          <p className="text-xl font-bold">{customerName}</p>
          <p className="text-slate-600 font-medium">{customerPhone}</p>
        </div>
      </div>

      {/* Table - Old Style with cleaner badges */}
      <table className="w-full mt-4 border-collapse">
        <thead>
          <tr className="bg-slate-800 text-white">
            <th className="py-3 px-4 text-left rounded-tl-lg font-bold uppercase text-xs tracking-wider">Date</th>
            <th className="py-3 px-4 text-left font-bold uppercase text-xs tracking-wider">Description</th>
            <th className="py-3 px-4 text-right rounded-tr-lg font-bold uppercase text-xs tracking-wider">Amount (Rs)</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t, index) => (
            <tr key={t.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
              <td className="py-4 px-4 border-b border-slate-100 text-sm font-medium">{t.date}</td>
              <td className="py-4 px-4 border-b border-slate-100 font-semibold text-sm">
                {t.type === 'dr' ? 'Udhar Diya' : 'Paisa Mila'}
              </td>
              <td className={`py-4 px-4 border-b border-slate-100 text-right font-bold text-base ${t.type === 'dr' ? 'text-red-600' : 'text-emerald-600'}`}>
                {t.type === 'dr' ? `+ ${t.amount.toLocaleString()}` : `- ${t.amount.toLocaleString()}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary - Old Style but No Italics in Amount */}
      <div className="mt-10 flex justify-end">
        <div className="w-64 bg-slate-800 text-white p-6 rounded-2xl shadow-xl">
          <p className="text-[10px] opacity-70 uppercase tracking-[0.2em] mb-1 font-bold">Total Net Balance</p>
          {/* Amount - No Italics */}
          <p className="text-3xl font-black">Rs {totalBalance.toLocaleString()}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-20 pt-10 border-t border-dotted border-slate-300 text-center">
        <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">
          Generated via {shopName} Digital Khata - 2026
        </p>
      </div>
    </div>
  );
});

export default InvoiceTemplate;