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
        minHeight: '1123px', // A4 Height
        backgroundColor: 'white', 
        position: 'relative', 
        fontFamily: "'Inter', sans-serif, Arial",
        color: '#1e293b',
        margin: '0 auto',
        padding: '0'
      }}
    >
      {/* Top Green Bar */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '10px', 
        backgroundColor: '#059669',
        zIndex: 100 
      }}></div>

      <div style={{ padding: '80px 60px 40px 60px' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '50px' }}>
          <div>
            <h1 style={{ fontSize: '38px', fontWeight: '900', color: '#059669', margin: 0, textTransform: 'uppercase', letterSpacing: '-1.5px' }}>
              {shopName}
            </h1>
            <p style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', margin: '5px 0 0 0', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Digital Khata Report
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>INVOICE</h2>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '5px 0 0 0', fontWeight: '500' }}>Date: {new Date().toLocaleDateString('en-GB')}</p>
          </div>
        </div>

        {/* Bill To Section - Fixed Width & Background */}
        <div style={{ 
          backgroundColor: '#f8fafc', 
          padding: '30px', 
          borderRadius: '16px', 
          marginBottom: '40px',
          border: '1px solid #f1f5f9'
        }}>
          <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '800', margin: '0 0 10px 0', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Bill To:</p>
          <p style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: 0 }}>{customerName}</p>
          <p style={{ fontSize: '15px', color: '#64748b', margin: '6px 0 0 0', fontWeight: '600' }}>{customerPhone}</p>
        </div>

        {/* Transactions Table */}
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0', marginTop: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#1e293b' }}>
              <th style={{ color: 'white', padding: '16px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', borderRadius: '8px 0 0 8px', letterSpacing: '0.5px' }}>Date</th>
              <th style={{ color: 'white', padding: '16px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Description</th>
              <th style={{ color: 'white', padding: '16px 20px', textAlign: 'right', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', borderRadius: '0 8px 8px 0', letterSpacing: '0.5px' }}>Amount (Rs)</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, index) => (
              <tr key={t.id} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#fcfdfe' }}>
                <td style={{ padding: '20px', fontSize: '13px', color: '#64748b', fontWeight: '600', borderBottom: '1px solid #f1f5f9' }}>{t.date}</td>
                <td style={{ padding: '20px', fontSize: '14px', color: '#334155', fontWeight: '700', borderBottom: '1px solid #f1f5f9' }}>
                  {t.type === 'dr' ? 'Udhar Diya' : 'Paisa Mila'}
                </td>
                <td style={{ 
                  padding: '20px', 
                  textAlign: 'right', 
                  fontSize: '15px', 
                  fontWeight: '800', 
                  borderBottom: '1px solid #f1f5f9',
                  color: t.type === 'dr' ? '#ef4444' : '#10b981' 
                }}>
                  {t.type === 'dr' ? `+ ${t.amount.toLocaleString()}` : `- ${t.amount.toLocaleString()}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total Balance Box */}
        <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ 
            backgroundColor: '#1e293b', 
            color: 'white', 
            padding: '24px 40px', 
            borderRadius: '16px', 
            minWidth: '240px',
            textAlign: 'center',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
          }}>
            <p style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '1px' }}>Total Net Balance</p>
            <div style={{ fontSize: '32px', fontWeight: '900', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px' }}>
              Rs {totalBalance.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ position: 'absolute', bottom: '50px', left: 0, width: '100%', textAlign: 'center' }}>
          <div style={{ margin: '0 60px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
            <p style={{ fontSize: '10px', color: '#cbd5e1', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px' }}>
              Generated via {shopName} Digital Khata • 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default InvoiceTemplate;