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
      style={{ fontFamily: 'sans-serif', margin: 0, padding: 0 }} // RESET BODY MARGINS
    >
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; margin: 0 !important; }
          .invoice-page { page-break-after: always; }
          tr { page-break-inside: avoid; }
        }
        /* Safely break table content */
        table { page-break-inside: auto; }
        thead { display: table-header-group; }
        tfoot { display: table-footer-group; }
        tr { page-break-inside: avoid; page-break-after: auto; }
        * { font-style: normal !important; box-sizing: border-box; }
      `}</style>
      
      {/* Top Green Bar - Border se chipka hua */}
      <div className="absolute top-0 left-0 w-full h-[8px] bg-emerald-600 z-50"></div>

      {/* Main Content Wrapper - Content flexible hogaya */}
      <div className="px-12 py-12 flex flex-col flex-grow mt-4">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-100 pb-8 mt-2">
          <div>
            <h1 className="text-4xl font-black text-emerald-600 uppercase tracking-tighter">{shopName}</h1>
            <p className="text-slate-400 text-xs font-bold mt-1 tracking-widest">DIGITAL KHATA REPORT</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-slate-700 uppercase tracking-tight">Invoice</h2>
            <p className="text-slate-500 text-[11px] font-medium">Date: {new Date().toLocaleDateString('en-GB')}</p>
          </div>
        </div>

        {/* Customer Info (BILL TO Fixed) */}
        <div className="my-10">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 min-w-[300px] inline-block shadow-sm">
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1.5">BILL TO:</p>
            <p className="text-2xl font-bold text-slate-800">{customerName}</p>
            <p className="text-slate-600 font-medium text-sm mt-1">{customerPhone}</p>
          </div>
        </div>

        {/* Table - content lamba hone par break hoga */}
        <div className="flex-grow">
          <table className="w-full mt-2 border-collapse">
            <thead>
              <tr className="bg-slate-800">
                <th className="py-3 px-4 text-left text-[10px] font-bold text-white uppercase rounded-tl-lg tracking-wider">Date</th>
                <th className="py-3 px-4 text-left text-[10px] font-bold text-white uppercase tracking-wider">Description</th>
                <th className="py-3 px-4 text-right text-[10px] font-bold text-white uppercase rounded-tr-lg tracking-wider">Amount (Rs)</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-b border-slate-100/50 hover:bg-slate-50 transition-colors">
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

        {/* Summary Box - Content barhne par push hogaya */}
        <div className="mt-12 flex justify-end mb-4">
          <div className="bg-slate-900 text-white p-8 rounded-3xl w-72 shadow-2xl transform transition-transform hover:scale-105">
            <p className="text-[10px] text-slate-400 uppercase font-bold mb-2.5 text-center tracking-wider">Total Net Balance</p>
            <p className="text-3xl font-black text-center border-t border-white/10 pt-4 leading-tight">
              Rs {totalBalance.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 mb-2 text-center border-t border-dotted border-slate-200 pt-6">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
            Generated via {shopName} Digital Khata - 2026
          </p>
        </div>
      </div>
    </div>
  );
});