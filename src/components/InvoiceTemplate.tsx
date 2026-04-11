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
      style={{ 
        width: '794px', 
        minHeight: '1000px', 
        backgroundColor: 'white', 
        position: 'relative', 
        fontFamily: 'Arial, sans-serif',
        color: '#1e293b',
        margin: '0 auto',
        padding: '0',
        overflow: 'hidden'
      }}
    >
      {/* 1. TOP GREEN BAR */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '8px', 
        backgroundColor: '#059669',
        zIndex: 100 
      }}></div>

      <div style={{ padding: '60px 50px 40px 50px' }}>
        
        {/* Header - Spacing Improved */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
          <div>
            <h1 style={{ 
              fontSize: '32px', 
              fontWeight: '900', 
              color: '#059669', 
              margin: 0, 
              textTransform: 'uppercase', 
              letterSpacing: '1px' // Fixing "chipka hua" text
            }}>
              {shopName}
            </h1>
            <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#94a3b8', margin: '3px 0 0 0', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Digital Khata Report
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '10px 0 0 0', fontWeight: 'bold' }}>
              Date: {new Date().toLocaleDateString('en-GB')}
            </p>
          </div>
        </div>

        {/* 2. BILL TO SECTION */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ 
            backgroundColor: '#f8fafc', 
            padding: '25px', 
            borderRadius: '12px', 
            border: '1px solid #f1f5f9'
          }}>
            <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Bill To:</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>{customerName}</p>
            <p style={{ fontSize: '14px', color: '#475569', margin: '5px 0 0 0' }}>{customerPhone}</p>
          </div>
        </div>

        {/* Table - Optimized for PDF Performance */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#1e293b' }}>
              <th style={{ color: 'white', padding: '12px 15px', textAlign: 'left', fontSize: '10px', textTransform: 'uppercase', borderRadius: '8px 0 0 0' }}>Date</th>
              <th style={{ color: 'white', padding: '12px 15px', textAlign: 'left', fontSize: '10px', textTransform: 'uppercase' }}>Description</th>
              <th style={{ color: 'white', padding: '12px 15px', textAlign: 'right', fontSize: '10px', textTransform: 'uppercase', borderRadius: '0 8px 0 0' }}>Amount (Rs)</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, index) => (
              <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: index % 2 === 0 ? 'white' : '#fcfdfe' }}>
                <td style={{ padding: '15px', fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>{t.date}</td>
                <td style={{ padding: '15px', fontSize: '14px', color: '#334155', fontWeight: '600' }}>
                  {t.type === 'dr' ? 'Udhar Diya' : 'Paisa Mila'}
                </td>
                <td style={{ 
                  padding: '15px', 
                  textAlign: 'right', 
                  fontSize: '14px', 
                  fontWeight: 'bold', 
                  color: t.type === 'dr' ? '#ef4444' : '#10b981' 
                }}>
                  {t.type === 'dr' ? `+ ${t.amount.toLocaleString()}` : `- ${t.amount.toLocaleString()}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary Box */}
        <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ 
            backgroundColor: '#1e293b', 
            color: 'white', 
            padding: '25px', 
            borderRadius: '20px', 
            width: '260px', 
            textAlign: 'center' 
          }}>
            <p style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold', margin: '0 0 10px 0' }}>Total Net Balance</p>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px', fontSize: '32px', fontWeight: '900' }}>
              Rs {totalBalance.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '60px', textAlign: 'center', borderTop: '1px dotted #cbd5e1', paddingTop: '20px' }}>
          <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>
            Generated via {shopName} Digital Khata - 2026
          </p>
        </div>
      </div>
    </div>
  );
});

export default InvoiceTemplate;