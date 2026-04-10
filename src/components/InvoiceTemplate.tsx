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
    <div ref={ref} className="p-12 bg-white w-[794px] min-h-[1123px] text-slate-800 font-sans relative">
      {/* Top Accent Bar */}
      <div className="absolute top-0 left-0 w-full h-2 bg-emerald-600"></div>

      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-slate-100 pb-8 mt-4">
        <div>
          <h1 className="text-4xl font-black text-emerald-600 uppercase tracking-tight">{shopName}</h1>
          <p className="text-slate-400 mt-1 font-medium tracking-wide">DIGITAL KHATA REPORT</p>
        </div>
        <div className="text-right">
          <div className="bg-slate-100 px-4 py-2 rounded-lg inline-block">
            <p className="font-bold text-slate-700 text-sm">INVOICE NO: #INV-{Math.floor(Math.random() * 10000)}</p>
          </div>
          <p className="text-slate-500 mt-2 text-sm">Date: {new Date().toLocaleDateString('en-GB')}</p>
        </div>
      </div>

      {/* Customer Info Section */}
      <div className="my-12">
        <div className="w-1/2 bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] text-emerald-600 uppercase font-black tracking-[0.2em] mb-2">BILLING TO</p>
          <p className="text-2xl font-bold text-slate-800">{customerName}</p>
          <div className="flex items-center mt-1 text-slate-500">
            <span className="text-sm font-medium">{customerPhone}</span>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="mt-8">
        <table className="w-full border-separate border-spacing-y-2">
          <thead>
            <tr className="text-slate-400 text-[11px] uppercase tracking-[0.15em]">
              <th className="py-3 px-6 text-left font-bold">Date</th>
              <th className="py-3 px-6 text-left font-bold">Transaction Detail</th>
              <th className="py-3 px-6 text-right font-bold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="group hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 bg-slate-50/50 rounded-l-xl border-y border-l border-slate-100 text-sm font-medium text-slate-600">
                  {t.date}
                </td>
                <td className="py-4 px-6 bg-slate-50/50 border-y border-slate-100">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    t.type === 'dr' 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {t.type === 'dr' ? '● Udhar Diya' : '● Paisa Mila'}
                  </span>
                </td>
                <td className={`py-4 px-6 bg-slate-50/50 rounded-r-xl border-y border-r border-slate-100 text-right font-black text-base ${
                  t.type === 'dr' ? 'text-red-600' : 'text-emerald-600'
                }`}>
                  {t.type === 'dr' ? `+ Rs ${t.amount.toLocaleString()}` : `- Rs ${t.amount.toLocaleString()}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Calculation Summary */}
      <div className="mt-12 flex justify-end">
        <div className="w-72 bg-slate-900 text-white p-8 rounded-3xl shadow-2xl transform hover:scale-105 transition-transform">
          <p className="text-[10px] opacity-60 uppercase font-bold tracking-[0.2em] mb-2">Current Net Balance</p>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-bold opacity-80 font-sans">Rs</span>
            <p className="text-4xl font-black tracking-tight tracking-tighter">
              {totalBalance.toLocaleString()}
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-[10px] italic opacity-50 text-right">Hisaab Barabar</p>
          </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="absolute bottom-12 left-12 right-12">
        <div className="border-t border-slate-100 pt-8 flex justify-between items-center">
          <div className="text-left">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Powered By</p>
            <p className="text-slate-600 text-xs font-black tracking-tight">{shopName} App 2026</p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-[10px] italic">This is a computer generated document.</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default InvoiceTemplate;