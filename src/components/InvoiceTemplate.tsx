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
        minHeight: '1123px', // Standard A4 Height
        backgroundColor: 'white', 
        position: 'relative', 
        fontFamily: 'Arial, sans-serif',
        color: '#1e293b',
        margin: '0 auto',
        padding: '0',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* 1. STICKY TOP GREEN BAR - No white space above */}
      <div style={{ 
        width: '100%', 
        height: '10px', 
        backgroundColor: '#059669',
        flexShrink: 0
      }}></div>

      {/* Main Content Area */}
      <div style={{ padding: '50px 50px 40px 50px', flexGrow: 1 }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '34px', fontWeight: '900', color: '#059669', margin: 0, textTransform: 'uppercase', letterSpacing: '-1px' }}>
              {shopName}
            </h1>
            <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#94a3b8', margin: '3px 0 0 0', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              Digital Khata Report
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b', margin: 0, textTransform: 'uppercase' }}>INVOICE</h2>
            <p style={{ fontSize: '11px', color: '#64748b', margin: '5px 0 0 0' }}>Date: {new Date().toLocaleDateString('en-GB')}</p>
          </div>
        </div>

        {/* Bill To Section */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ 
            backgroundColor: '#f8fafc', 
            padding: '25px', 
            borderRadius: '12px', 
            border: '1px solid #f1f5f9',
            minWidth: '280px',
            display: 'inline-block'
          }}>
            <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Bill To:</p>
            <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>{customerName}</p>
            <p style={{ fontSize: '14px', color: '#475569', margin: '4px 0 0 0' }}>{customerPhone}</p>
          </div>
        </div>

        {/* Transactions Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#1e293b' }}>
              <th style={{ color: 'white', padding: '12px 15px', textAlign: 'left', fontSize: '10px', textTransform: 'uppercase', borderRadius: '6px 0 0 0' }}>Date</th>
              <th style={{ color: 'white', padding: '12px 15px', textAlign: 'left', fontSize: '10px', textTransform: 'uppercase' }}>Description</th>
              <th style={{ color: 'white', padding: '12px 15px', textAlign: 'right', fontSize: '10px', textTransform: 'uppercase', borderRadius: '0 6px 0 0' }}>Amount (Rs)</th>
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

        {/* Balance Box */}
        <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ 
            backgroundColor: '#1e293b', 
            color: 'white', 
            padding: '25px', 
            borderRadius: '16px', 
            width: '260px', 
            textAlign: 'center' 
          }}>
            <p style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold', margin: '0 0 10px 0' }}>Total Net Balance</p>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px', fontSize: '28px', fontWeight: '900' }}>
              Rs {totalBalance.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 'auto', paddingTop: '60px', textAlign: 'center' }}>
          <div style={{ borderTop: '1px dotted #cbd5e1', paddingTop: '20px' }}>
            <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>
              Generated via {shopName} Digital Khata - 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default InvoiceTemplate;