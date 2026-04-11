import React from 'react';

interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'dr' | 'cr';
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
    <div 
      ref={ref} 
      className="bg-white w-[794px] h-auto text-slate-800 relative flex flex-col"
      style={{ fontFamily: 'sans-serif' }}
    >
      {/* CSS Fixes for Blank Page and Italics */}
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; margin: 0 !important; }
          .invoice-container { page-break-inside: avoid !important; }
        }
        * { font-style: normal !important; box-sizing: border-box; }
        table { border-collapse: collapse; width: 100%; }
      `}</style>
      
      {/* 1. GREEN BAR: Absolute top 0 with NO padding on parent */}
      <div className="absolute top-0 left-0 w-full h-[8px] bg-emerald-600 z-50"></div>

      {/* 2. INNER CONTENT WRAPPER: Sab padding yahan se shuru hogi */}
      <div className="px-12 pt-12 pb-10 flex flex-col flex-grow">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-100 pb-8 mt-2">
          <div>
            <h1 className="text-4xl font-black text-emerald-600 uppercase tracking-tighter">{shopName}</h1>
            <p className="text-slate-400 text-[10px] font-bold mt-1 tracking-widest uppercase">Digital Khata Report</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-slate-700 uppercase tracking-tight">Invoice</h2>
            <p className="text-slate-500 text-[11px] font-medium uppercase">Date: {new Date().toLocaleDateString('en-GB')}</p>
          </div>
        </div>

        {/* 3. BILL TO: Wapis add kar diya hai exact styling ke sath */}
        <div className="my-10">
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 min-w-[280px] inline-block shadow-sm">
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">BILL TO:</p>
            <p className="text-xl font-bold text-slate-900 leading-tight">{customerName}</p>
            <p className="text-slate-600 font-medium text-sm mt-1">{customerPhone}</p>
          </div>
        </div>

        {/* Table Section */}
        <div className="flex-grow">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-800">
                <th className="py-3 px-4 text-left text-[10px] font-bold text-white uppercase rounded-tl-lg tracking-wider">Date</th>
                <th className="py-3 px-4 text-left text-[10px] font-bold text-white uppercase tracking-wider">Description</th>
                <th className="py-3 px-4 text-right text-[10px] font-bold text-white uppercase rounded-tr-lg tracking-wider">Amount (Rs)</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, index) => (
                <tr key={t.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'} border-b border-slate-100/50`}>
                  <td className="py-4 px-4 text-xs font-bold text-slate-500">{t.date}</td>
                  <td className="py-4 px-4 font-semibold text-sm text-slate-700">
                    {t.type === 'dr' ? 'Udhar Diya' : 'Paisa Mila'}
                  </td>
                  <td className={`py-4 px-4 text-right font-bold text-sm ${t.type === 'dr' ? 'text-red-600' : 'text-emerald-600'}`}>
                    {t.type === 'dr' ? `+ ${t.amount.toLocaleString()}` : `- ${t.amount.toLocaleString()}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Box */}
        <div className="mt-12 flex justify-end">
          <div className="bg-slate-900 text-white p-7 rounded-2xl w-64 shadow-xl">
            <p className="text-[10px] text-slate-400 uppercase font-bold mb-1.5 text-center tracking-wider text-white">Total Net Balance</p>
            <p className="text-2xl font-black text-center border-t border-white/10 pt-3 text-white">
              Rs {totalBalance.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center border-t border-dotted border-slate-200 pt-6">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
            Generated via {shopName} Digital Khata - 2026
          </p>
        </div>
      </div>
    </div>
  );
});

export default InvoiceTemplate;