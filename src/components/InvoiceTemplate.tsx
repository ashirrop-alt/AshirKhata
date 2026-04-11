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
        padding: '0'
        // REMOVED overflow: 'hidden' to allow page breaking
      }}
    >
      {/* 1. TOP GREEN BAR */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '8px', backgroundColor: '#059669', zIndex: 100 }}></div>

      <div style={{ padding: '60px 50px 40px 50px' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '34px', fontWeight: '900', color: '#059669', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {shopName}
            </h1>
            <p style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', margin: '2px 0 0 0', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Digital Khata Report
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '13px', color: '#1e293b', margin: 0, fontWeight: '800' }}>
              Date: <span style={{ fontWeight: '600' }}>{new Date().toLocaleDateString('en-GB')}</span>
            </p>
          </div>
        </div>

        {/* 2. BILL TO SECTION */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ backgroundColor: '#f8fafc', padding: '25px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
            <p style={{ fontSize: '11px', color: '#64748b', fontWeight: '900', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Bill To:</p>
            <p style={{ fontSize: '26px', fontWeight: '900', color: '#0f172a', margin: 0 }}>{customerName}</p>
            <p style={{ fontSize: '15px', color: '#475569', margin: '5px 0 0 0', fontWeight: '700' }}>{customerPhone}</p>
          </div>
        </div>

        {/* 3. TABLE - Alignment Preserved */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#1e293b' }}>
              <th style={{ color: 'white', padding: '14px 15px', textAlign: 'left', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', width: '22%' }}>Date</th>
              <th style={{ color: 'white', padding: '14px 15px', textAlign: 'left', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', width: '48%' }}>Description</th>
              <th style={{ color: 'white', padding: '14px 15px', textAlign: 'right', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', width: '30%' }}>Amount (Rs)</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, index) => (
              <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: index % 2 === 0 ? 'white' : '#fcfdfe' }}>
                <td style={{ padding: '16px 15px', fontSize: '12px', color: '#1e293b', fontWeight: '800' }}>{t.date}</td>
                <td style={{ padding: '16px 15px', fontSize: '14px', color: '#334155', fontWeight: '700' }}>
                  <span style={{ fontSize: '10px', fontWeight: '900', color: t.type === 'dr' ? '#ef4444' : '#10b981', marginRight: '10px', textTransform: 'uppercase' }}>
                    [{t.type === 'dr' ? 'Debit' : 'Credit'}]
                  </span>
                  {t.type === 'dr' ? 'Udhar Diya' : 'Paisa Mila'}
                </td>
                <td style={{ padding: '16px 15px', textAlign: 'right', fontSize: '15px', fontWeight: '900', color: t.type === 'dr' ? '#ef4444' : '#10b981', whiteSpace: 'nowrap' }}>
                  {t.type === 'dr' ? `+ ${t.amount.toLocaleString()}` : `- ${t.amount.toLocaleString()}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 4. SUMMARY BOX - Logic to prevent half-cut */}
        <div style={{ 
            marginTop: '50px', 
            width: '100%',
            display: 'block', 
            breakInside: 'avoid', 
            pageBreakInside: 'avoid' 
        }}>
          <div style={{ 
            backgroundColor: '#1e293b', 
            color: 'white', 
            padding: '25px', 
            borderRadius: '20px', 
            width: '280px', 
            textAlign: 'center',
            marginLeft: 'auto' // Pulls box to the right
          }}>
            <p style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '900', margin: '0 0 10px 0', letterSpacing: '1px' }}>Total Net Balance</p>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '15px', fontSize: '34px', fontWeight: '900' }}>
              Rs {totalBalance.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '70px', textAlign: 'center', borderTop: '1px dotted #cbd5e1', paddingTop: '20px' }}>
          <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px' }}>
            Generated via {shopName} Digital Khata - 2026
          </p>
        </div>
      </div>
    </div>
  );
});

export default InvoiceTemplate;