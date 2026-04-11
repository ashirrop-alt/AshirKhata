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
      className="bg-white w-[794px] min-h-[1120px] text-slate-800 relative flex flex-col overflow-hidden"
      style={{ fontFamily: 'sans-serif' }}
    >
      <style>{`
        @media print {
          body { margin: 0; }
          .invoice-page { page-break-after: avoid; page-break-inside: avoid; }
        }
        * { font-style: normal !important; box-sizing: border-box; }
      `}</style>
      
      {/* Top Green Bar - Border se chipka hua */}
      <div className="absolute top-0 left-0 w-full h-[8px] bg-emerald-600 z-50"></div>

      {/* Main Content Wrapper */}
      <div className="px-12 py-12 flex flex-col h-full flex-grow">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-100 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-emerald-600 uppercase tracking-tight">{shopName}</h1>
            <p className="text-slate-400 text-xs font-bold mt-1 tracking-widest uppercase">Digital Khata Report</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-black text-slate-700 uppercase tracking-tighter">Invoice</h2>
            <p className="text-slate-400 text-[10px] font-bold">DATE: {new Date().toLocaleDateString('en-GB')}</p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="mt-8 mb-8">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 inline-block min-w-[250px]">
            <p className="text-[9px] text-slate-400 uppercase font-black mb-1">Billing To:</p>
            <p className="text-lg font-bold text-slate-800">{customerName}</p>
            <p className="text-slate-500 font-medium text-xs">{customerPhone}</p>
          </div>
        </div>

        {/* Table */}
        <div className="flex-grow">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-800">
                <th className="py-2 px-4 text-left text-[10px] font-bold text-white uppercase rounded-tl-lg">Date</th>
                <th className="py-2 px-4 text-left text-[10px] font-bold text-white uppercase">Description</th>
                <th className="py-2 px-4 text-right text-[10px] font-bold text-white uppercase rounded-tr-lg">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, index) => (
                <tr key={t.id} className="border-b border-slate-50">
                  <td className="py-3 px-4 text-xs font-bold text-slate-400">{t.date}</td>
                  <td className="py-3 px-4 text-sm font-bold text-slate-700">{t.type === 'dr' ? 'Udhar Diya' : 'Paisa Mila'}</td>
                  <td className={`py-3 px-4 text-right font-bold ${t.type === 'dr' ? 'text-red-500' : 'text-emerald-500'}`}>
                    {t.type === 'dr' ? `+${t.amount}` : `-${t.amount}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary and Footer - Inhe bottom par lock karne ke liye wrapper */}
        <div className="mt-auto pt-10">
          <div className="flex justify-end">
            <div className="bg-slate-900 text-white p-6 rounded-2xl w-64 shadow-xl">
              <p className="text-[9px] text-slate-400 uppercase font-bold mb-2 text-center">Current Net Balance</p>
              <p className="text-2xl font-black text-center border-t border-slate-700 pt-3">
                Rs {totalBalance.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mt-12 text-center border-t border-dotted border-slate-200 pt-6">
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">
              Generated via {shopName} App 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default InvoiceTemplate;