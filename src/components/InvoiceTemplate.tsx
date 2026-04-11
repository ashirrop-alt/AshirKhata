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
        minHeight: '1120px', // Standard A4 height
        backgroundColor: 'white', 
        position: 'relative', 
        fontFamily: 'Arial, sans-serif',
        color: '#1e293b',
        margin: '0 auto',
        padding: '0',
        overflow: 'hidden'
      }}
    >
      {/* 1. GREEN BAR: Absolute Top Fix */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '10px', 
        backgroundColor: '#059669',
        zIndex: 100 
      }}></div>

      {/* Main Content Padding Adjusted */}
      <div style={{ padding: '50px 50px 30px 50px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#059669', margin: 0, textTransform: 'uppercase', letterSpacing: '-1px' }}>
              {shopName}
            </h1>
            <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#94a3b8', margin: '2px 0 0 0', letterSpacing: '2px', textTransform: 'uppercase' }}>
              Digital Khata Report
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#334155', margin: 0, textTransform: 'uppercase' }}>Invoice</h2>
            <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0 0' }}>Date: {new Date().toLocaleDateString('en-GB')}</p>
          </div>
        </div>

        {/* 2. BILL TO SECTION: Cleaned up as per Screenshot 1 */}
        <div style={{ marginTop: '30px', marginBottom: '30px' }}>
          <div style={{ 
            backgroundColor: '#f8fafc', 
            padding: '15px 20px', 
            borderRadius: '12px', 
            border: '1px solid #f1f5f9', 
            display: 'inline-block',
            minWidth: '250px'
          }}>
            <p style={{ fontSize: '9px', color: '#94a3b8', fontWeight: '900', margin: '0 0 5px 0', letterSpacing: '1px' }}>BILL TO:</p>
            <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>{customerName}</p>
            <p style={{ fontSize: '13px', color: '#475569', margin: '2px 0 0 0', fontWeight: '500' }}>{customerPhone}</p>
          </div>
        </div>

        {/* Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#1e293b' }}>
              <th style={{ color: 'white', padding: '10px 15px', textAlign: 'left', fontSize: '10px', textTransform: 'uppercase', borderRadius: '6px 0 0 0' }}>Date</th>
              <th style={{ color: 'white', padding: '10px 15px', textAlign: 'left', fontSize: '10px', textTransform: 'uppercase' }}>Description</th>
              <th style={{ color: 'white', padding: '10px 15px', textAlign: 'right', fontSize: '10px', textTransform: 'uppercase', borderRadius: '0 6px 0 0' }}>Amount (Rs)</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, index) => (
              <tr key={t.id} style={{ borderBottom: '1px solid #f8fafc', backgroundColor: index % 2 === 0 ? 'white' : '#fcfcfc' }}>
                <td style={{ padding: '12px 15px', fontSize: '12px', color: '#64748b' }}>{t.date}</td>
                <td style={{ padding: '12px 15px', fontSize: '13px', color: '#334155', fontWeight: '500' }}>
                  {t.type === 'dr' ? 'Udhar Diya' : 'Paisa Mila'}
                </td>
                <td style={{ 
                  padding: '12px 15px', 
                  textAlign: 'right', 
                  fontSize: '13px', 
                  fontWeight: 'bold', 
                  color: t.type === 'dr' ? '#dc2626' : '#059669' 
                }}>
                  {t.type === 'dr' ? `+ ${t.amount.toLocaleString()}` : `- ${t.amount.toLocaleString()}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary Box */}
        <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ 
            backgroundColor: '#1e293b', 
            color: 'white', 
            padding: '20px', 
            borderRadius: '15px', 
            width: '240px', 
            textAlign: 'center' 
          }}>
            <p style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold', margin: '0 0 8px 0' }}>Total Net Balance</p>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px', fontSize: '24px', fontWeight: '900' }}>
              Rs {totalBalance.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ position: 'absolute', bottom: '40px', left: '50px', right: '50px', textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '15px' }}>
          <p style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
            GENERATED VIA {shopName} DIGITAL KHATA - 2026
          </p>
        </div>
      </div>
    </div>
  );
});

export default InvoiceTemplate;