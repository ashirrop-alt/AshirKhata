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
    <div ref={ref} className="p-10 bg-white w-[794px] min-h-[1123px] text-slate-800 font-sans">
      {/* Header */}
      <div className="flex justify-between border-b-2 border-slate-200 pb-8">
        <div>
          <h1 className="text-4xl font-bold text-emerald-600 uppercase tracking-tighter">{shopName}</h1>
          <p className="text-slate-500 mt-1 italic">Digital Khata Report</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-lg">INVOICE</p>
          <p className="text-slate-500">Date: {new Date().toLocaleDateString('en-GB')}</p>
        </div>
      </div>

      {/* Customer Info */}
      <div className="my-10 grid grid-cols-2 gap-4">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Bill To:</p>
          <p className="text-xl font-bold">{customerName}</p>
          <p className="text-slate-600">{customerPhone}</p>
        </div>
      </div>

      {/* Table */}
      <table className="w-full mt-4 border-collapse">
        <thead>
          <tr className="bg-slate-800 text-white">
            <th className="py-3 px-4 text-left rounded-tl-lg">Date</th>
            <th className="py-3 px-4 text-left">Description</th>
            <th className="py-3 px-4 text-right rounded-tr-lg">Amount (Rs)</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t, index) => (
            <tr key={t.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
              <td className="py-4 px-4 border-b border-slate-100">{t.date}</td>
              <td className="py-4 px-4 border-b border-slate-100 font-medium">
                {t.type === 'dr' ? 'Udhar Diya' : 'Paisa Mila'}
              </td>
              <td className={`py-4 px-4 border-b border-slate-100 text-right font-bold ${t.type === 'dr' ? 'text-red-600' : 'text-emerald-600'}`}>
                {t.type === 'dr' ? `+ ${t.amount}` : `- ${t.amount}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary */}
      <div className="mt-10 flex justify-end">
        <div className="w-64 bg-slate-800 text-white p-6 rounded-2xl shadow-xl">
          <p className="text-xs opacity-70 uppercase tracking-widest mb-1">Total Net Balance</p>
          <p className="text-3xl font-black italic">Rs {totalBalance.toLocaleString()}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-20 pt-10 border-t border-dotted border-slate-300 text-center">
        <p className="text-slate-400 text-sm italic">Generated via {shopName} Digital Khata - 2026</p>
      </div>
    </div>
  );
});

export default InvoiceTemplate;