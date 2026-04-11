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
      {/* 1. GREEN BAR: Absolute Top */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '8px', 
        backgroundColor: '#059669',
        zIndex: 100 
      }}></div>

      <div style={{ padding: '50px 50px 30px 50px', flex: 1 }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #f1f5f9', paddingBottom: '25px' }}>
          <div>
            <h1 style={{ fontSize: '34px', fontWeight: '900', color: '#059669', margin: 0, textTransform: 'uppercase' }}>
              {shopName}
            </h1>
            <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#94a3b8', margin: '4px 0 0 0', letterSpacing: '2px' }}>
              Digital Khata Report
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#334155', margin: 0 }}>INVOICE</h2>
            <p style={{ fontSize: '11px', color: '#64748b', margin: '4px 0 0 0' }}>Date: {new Date().toLocaleDateString('en-GB')}</p>
          </div>
        </div>

        {/* 2. BILL TO: Restored Shadow & Padding */}
        <div style={{ marginTop: '30px', marginBottom: '30px' }}>
          <div style={{ 
            backgroundColor: '#f8fafc', 
            padding: '20px 25px', 
            borderRadius: '16px', 
            border: '1px solid #f1f5f9', 
            display: 'inline-block',
            minWidth: '280px'
          }}>
            <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '900', margin: '0 0 8px 0', textTransform: 'uppercase' }}>BILL TO:</p>
            <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>{customerName}</p>
            <p style={{ fontSize: '14px', color: '#475569', margin: '4px 0 0 0', fontWeight: '500' }}>{customerPhone}</p>
          </div>
        </div>

        {/* Table: Compact spacing to save page space */}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#1e293b' }}>
              <th style={{ color: 'white', padding: '12px 15px', textAlign: 'left', fontSize: '10px', borderRadius: '8px 0 0 0' }}>DATE</th>
              <th style={{ color: 'white', padding: '12px 15px', textAlign: 'left', fontSize: '10px' }}>DESCRIPTION</th>
              <th style={{ color: 'white', padding: '12px 15px', textAlign: 'right', fontSize: '10px', borderRadius: '0 8px 0 0' }}>AMOUNT (RS)</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, index) => (
              <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: index % 2 === 0 ? 'white' : '#f8fafc' }}>
                <td style={{ padding: '10px 15px', fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>{t.date}</td>
                <td style={{ padding: '10px 15px', fontSize: '13px', color: '#334155', fontWeight: '600' }}>
                  {t.type === 'dr' ? 'Udhar Diya' : 'Paisa Mila'}
                </td>
                <td style={{ 
                  padding: '10px 15px', 
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
        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ 
            backgroundColor: '#1e293b', 
            color: 'white', 
            padding: '20px 30px', 
            borderRadius: '18px', 
            textAlign: 'center',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <p style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold', margin: '0 0 8px 0' }}>Total Net Balance</p>
            <div style={{ fontSize: '26px', fontWeight: '900' }}>
              Rs {totalBalance.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Footer: Moved up slightly */}
        <div style={{ marginTop: '40px', textAlign: 'center', borderTop: '1px dotted #cbd5e1', paddingTop: '15px' }}>
          <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase' }}>
            Generated via {shopName} Digital Khata - 2026
          </p>
        </div>
      </div>
    </div>
  );
});

export default InvoiceTemplate;