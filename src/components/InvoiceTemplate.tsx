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
        minHeight: '1120px', // Standard A4 Height
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
      {/* 1. GREEN BAR: Absolute Edge */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '8px', 
        backgroundColor: '#059669',
        zIndex: 100 
      }}></div>

      <div style={{ padding: '45px 50px 30px 50px', flex: 1 }}>
        
        {/* Header: Reduced bottom padding slightly */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #f1f5f9', paddingBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '34px', fontWeight: '900', color: '#059669', margin: 0, textTransform: 'uppercase' }}>
              {shopName}
            </h1>
            <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#94a3b8', margin: '3px 0 0 0', letterSpacing: '1px' }}>
              Digital Khata Report
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#334155', margin: 0 }}>INVOICE</h2>
            <p style={{ fontSize: '11px', color: '#64748b', margin: '3px 0 0 0' }}>Date: {new Date().toLocaleDateString('en-GB')}</p>
          </div>
        </div>

        {/* 2. BILL TO: Compact but stylish */}
        <div style={{ marginTop: '25px', marginBottom: '25px' }}>
          <div style={{ 
            backgroundColor: '#f8fafc', 
            padding: '18px 22px', 
            borderRadius: '14px', 
            border: '1px solid #f1f5f9', 
            display: 'inline-block',
            minWidth: '280px'
          }}>
            <p style={{ fontSize: '9px', color: '#94a3b8', fontWeight: '900', margin: '0 0 6px 0', textTransform: 'uppercase' }}>BILL TO:</p>
            <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>{customerName || 'Customer Name'}</p>
            <p style={{ fontSize: '13px', color: '#475569', margin: '2px 0 0 0', fontWeight: '500' }}>{customerPhone || 'Phone Number'}</p>
          </div>
        </div>

        {/* Table: Use break-inside to prevent weird cuts */}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#1e293b' }}>
              <th style={{ color: 'white', padding: '12px 15px', textAlign: 'left', fontSize: '10px', borderRadius: '6px 0 0 0' }}>DATE</th>
              <th style={{ color: 'white', padding: '12px 15px', textAlign: 'left', fontSize: '10px' }}>DESCRIPTION</th>
              <th style={{ color: 'white', padding: '12px 15px', textAlign: 'right', fontSize: '10px', borderRadius: '0 6px 0 0' }}>AMOUNT (RS)</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, index) => (
              <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: index % 2 === 0 ? 'white' : '#f8fafc' }}>
                <td style={{ padding: '8px 15px', fontSize: '12px', color: '#64748b' }}>{t.date}</td>
                <td style={{ padding: '8px 15px', fontSize: '13px', color: '#334155', fontWeight: '600' }}>
                  {t.type === 'dr' ? 'Udhar Diya' : 'Paisa Mila'}
                </td>
                <td style={{ 
                  padding: '8px 15px', 
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

        {/* Summary Box: Floating Dark Blue */}
        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ 
            backgroundColor: '#1e293b', 
            color: 'white', 
            padding: '20px 30px', 
            borderRadius: '16px', 
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold', margin: '0 0 6px 0' }}>Total Net Balance</p>
            <div style={{ fontSize: '24px', fontWeight: '900' }}>
              Rs {totalBalance.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Footer: Dotted Line */}
        <div style={{ marginTop: '40px', textAlign: 'center', borderTop: '1px dotted #cbd5e1', paddingTop: '15px' }}>
          <p style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase' }}>
            Generated via {shopName} Digital Khata - 2026
          </p>
        </div>
      </div>
    </div>
  );
});

export default InvoiceTemplate;