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
      id="invoice-root"
      className="bg-white w-[794px] h-auto text-slate-800 relative flex flex-col"
      style={{ fontFamily: 'sans-serif', fontStyle: 'normal', margin: '0', padding: '0' }}
    >
      <style>{`
        * { font-style: normal !important; box-sizing: border-box; -webkit-print-color-adjust: exact; }
        @media print {
          body { margin: 0 !important; }
          #invoice-root { height: auto !important; }
        }
      `}</style>
      
      {/* 1. GREEN BAR: Forced to Absolute Zero Edge */}
      <div className="absolute top-0 left-0 w-full h-[8px] bg-emerald-600" style={{ zIndex: 9999 }}></div>

      {/* 2. INNER WRAPPER: Handles all spacing internally */}
      <div className="w-full px-12 pt-14 pb-10">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-100 pb-8">
          <div>
            <h1 className="text-4xl font-black text-emerald-600 uppercase tracking-tighter" style={{ margin: 0 }}>
              {shopName}
            </h1>
            <p className="text-slate-400 text-[10px] font-bold mt-1 tracking-widest uppercase">Digital Khata Report</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-slate-700 uppercase tracking-tight" style={{ margin: 0 }}>Invoice</h2>
            <p className="text-slate-500 text-[11px] font-medium uppercase">Date: {new Date().toLocaleDateString('en-GB')}</p>
          </div>
        </div>

        {/* 3. BILL TO: Locked in a container to prevent disappearing */}
        <div className="mt-10 mb-10 block">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 min-w-[280px] inline-block shadow-sm">
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1.5">BILL TO:</p>
            <p className="text-2xl font-bold text-slate-900 leading-none" style={{ margin: 0 }}>{customerName}</p>
            <p className="text-slate-600 font-medium text-sm mt-2">{customerPhone}</p>
          </div>
        </div>

        {/* 4. TABLE: Height is now auto to prevent 2nd blank page */}
        <div className="w-full h-auto overflow-visible">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-800">
                <th className="py-3 px-4 text-left text-[10px] font-bold text-white uppercase rounded-tl-lg">Date</th>
                <th className="py-3 px-4 text-left text-[10px] font-bold text-white uppercase">Description</th>
                <th className="py-3 px-4 text-right text-[10px] font-bold text-white uppercase rounded-tr-lg">Amount (Rs)</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, index) => (
                <tr key={t.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'} border-b border-slate-100`}>
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

        {/* 5. SUMMARY BOX */}
        <div className="mt-12 flex justify-end">
          <div className="bg-slate-900 text-white p-8 rounded-3xl w-72 shadow-xl">
            <p className="text-[10px] text-slate-400 uppercase font-bold mb-2 text-center tracking-wider">Total Net Balance</p>
            <p className="text-3xl font-black text-center border-t border-white/10 pt-4 leading-tight">
              Rs {totalBalance.toLocaleString()}
            </p>
          </div>
        </div>

        {/* 6. FOOTER */}
        <div className="mt-16 text-center border-t border-dotted border-slate-200 pt-6">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
            Generated via {shopName} Digital Khata - 2026
          </p>
        </div>
      </div>
    </div>
  );
});

export default InvoiceTemplate;