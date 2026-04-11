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
        minHeight: '1050px', 
        backgroundColor: 'white', 
        position: 'relative', 
        fontFamily: 'Arial, sans-serif',
        color: '#1e293b',
        margin: '0 auto',
        padding: '0'
      }}
    >
      {/* 1. GREEN BAR: Exact Edge Fix */}
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
        
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #f1f5f9', paddingBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#059669', margin: 0, textTransform: 'uppercase', letterSpacing: '-1px' }}>
              {shopName}
            </h1>
            <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#94a3b8', margin: '5px 0 0 0', letterSpacing: '2px', textTransform: 'uppercase' }}>
              Digital Khata Report
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#334155', margin: 0, textTransform: 'uppercase' }}>Invoice</h2>
            <p style={{ fontSize: '11px', color: '#64748b', margin: '5px 0 0 0' }}>Date: {new Date().toLocaleDateString('en-GB')}</p>
          </div>
        </div>

        {/* 2. BILL TO: The Rounded Light Box */}
        <div style={{ marginTop: '40px', marginBottom: '40px' }}>
          <div style={{ 
            backgroundColor: '#f8fafc', 
            padding: '25px', 
            borderRadius: '16px', 
            border: '1px solid #f1f5f9', 
            display: 'inline-block',
            minWidth: '320px'
          }}>
            <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '900', margin: '0 0 10px 0', letterSpacing: '1px' }}>BILL TO:</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>{customerName}</p>
            <p style={{ fontSize: '14px', color: '#475569', margin: '4px 0 0 0', fontWeight: '500' }}>{customerPhone}</p>
          </div>
        </div>

        {/* Table Section */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#1e293b' }}>
              <th style={{ color: 'white', padding: '15px', textAlign: 'left', fontSize: '10px', textTransform: 'uppercase', borderRadius: '4px 0 0 0' }}>Date</th>
              <th style={{ color: 'white', padding: '15px', textAlign: 'left', fontSize: '10px', textTransform: 'uppercase' }}>Description</th>
              <th style={{ color: 'white', padding: '15px', textAlign: 'right', fontSize: '10px', textTransform: 'uppercase', borderRadius: '0 4px 0 0' }}>Amount (Rs)</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, index) => (
              <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: index % 2 === 0 ? 'white' : '#f8fafc' }}>
                <td style={{ padding: '15px', fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>{t.date}</td>
                <td style={{ padding: '15px', fontSize: '14px', color: '#334155', fontWeight: '600' }}>
                  {t.type === 'dr' ? 'Udhar Diya' : 'Paisa Mila'}
                </td>
                <td style={{ 
                  padding: '15px', 
                  textAlign: 'right', 
                  fontSize: '14px', 
                  fontWeight: 'bold', 
                  color: t.type === 'dr' ? '#dc2626' : '#059669' 
                }}>
                  {t.type === 'dr' ? `+ ${t.amount.toLocaleString()}` : `- ${t.amount.toLocaleString()}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 3. TOTAL BALANCE: Dark Blue Floating Box */}
        <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ 
            backgroundColor: '#1e293b', 
            color: 'white', 
            padding: '25px 35px', 
            borderRadius: '20px', 
            textAlign: 'center',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
          }}>
            <p style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold', margin: '0 0 10px 0' }}>Total Net Balance</p>
            <div style={{ fontSize: '32px', fontWeight: '900' }}>
              Rs {totalBalance.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Footer: Position Relative for no extra page */}
        <div style={{ marginTop: '80px', textAlign: 'center', borderTop: '1px dotted #cbd5e1', paddingTop: '20px' }}>
          <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>
            Generated via {shopName} Digital Khata - 2026
          </p>
        </div>
      </div>
    </div>
  );
});

export default InvoiceTemplate;