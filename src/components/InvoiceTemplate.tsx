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
    <div ref={ref} style={{ width: '794px', backgroundColor: 'white', fontFamily: 'Arial, sans-serif', color: '#1e293b', margin: '0 auto' }}>
      <div style={{ width: '100%', height: '8px', backgroundColor: '#059669' }}></div>

      <div style={{ padding: '40px 50px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#059669', margin: 0 }}>{shopName}</h1>
            <p style={{ fontSize: '12px', color: '#64748b' }}>Digital Khata Report</p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '12px' }}>
            <strong>Date:</strong> {new Date().toLocaleDateString('en-GB')}
          </div>
        </div>

        {/* Info Card */}
        <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #e2e8f0' }}>
          <p style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 5px 0' }}>Billed To:</p>
          <p style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>{customerName}</p>
          <p style={{ fontSize: '14px', color: '#475569', margin: 0 }}>{customerPhone}</p>
        </div>

        {/* --- MAIN TABLE (ALIGMENT LOCK) --- */}
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
              <th style={{ width: '120px', padding: '12px 8px', fontSize: '12px' }}>DATE</th>
              <th style={{ padding: '12px 8px', fontSize: '12px' }}>DESCRIPTION</th>
              <th style={{ width: '140px', padding: '12px 8px', fontSize: '12px', textAlign: 'right' }}>AMOUNT (Rs)</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9', pageBreakInside: 'avoid' }}>
                <td style={{ padding: '14px 8px', fontSize: '13px', color: '#64748b' }}>{t.date}</td>
                <td style={{ padding: '14px 8px', fontSize: '13px' }}>
                  <b style={{ color: t.type === 'dr' ? '#ef4444' : '#10b981', marginRight: '8px' }}>
                    {t.type === 'dr' ? '[DEBIT]' : '[CREDIT]'}
                  </b>
                  {t.type === 'dr' ? 'Udhar Diya' : 'Paisa Mila'}
                </td>
                <td style={{ padding: '14px 8px', textAlign: 'right', fontSize: '14px', fontWeight: 'bold', color: t.type === 'dr' ? '#ef4444' : '#10b981' }}>
                  {t.type === 'dr' ? `+ ${t.amount.toLocaleString()}` : `- ${t.amount.toLocaleString()}`}
                </td>
              </tr>
            ))}
            
            {/* INVISIBLE ROWS FOR TOTAL BOX (This is the fix) */}
            <tr style={{ pageBreakInside: 'avoid' }}>
              <td colSpan={2} style={{ paddingTop: '30px' }}></td>
              <td style={{ paddingTop: '30px', borderTop: '2px solid #1e293b', textAlign: 'right' }}>
                <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Net Balance</div>
                <div style={{ fontSize: '28px', fontWeight: '900', color: '#1e293b', marginTop: '5px' }}>
                  <span style={{ fontSize: '16px', marginRight: '5px' }}>Rs</span>
                  {totalBalance.toLocaleString()}
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Footer */}
        <div style={{ marginTop: '60px', textAlign: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '20px', pageBreakInside: 'avoid' }}>
          <p style={{ fontSize: '10px', color: '#94a3b8' }}>
            Generated via {shopName} Digital Khata - 2026
          </p>
        </div>
      </div>
    </div>
  );
});

export default InvoiceTemplate;