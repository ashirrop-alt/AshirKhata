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
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif", // Professional Font Stack
        color: '#1e293b',
        margin: '0 auto',
        padding: '0',
        overflow: 'hidden'
      }}
    >
      {/* 1. TOP INDICATOR BAR */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '6px', 
        backgroundColor: '#059669',
        zIndex: 100 
      }}></div>

      <div style={{ padding: '60px 50px 40px 50px' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '50px' }}>
          <div>
            <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#059669', margin: 0, textTransform: 'uppercase', letterSpacing: '-1.5px', lineHeight: '1' }}>
              {shopName}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
              <span style={{ height: '1px', width: '20px', backgroundColor: '#cbd5e1', marginRight: '8px' }}></span>
              <p style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', margin: 0, letterSpacing: '2px', textTransform: 'uppercase' }}>
                Financial Report
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ backgroundColor: '#f1f5f9', padding: '8px 15px', borderRadius: '8px', display: 'inline-block' }}>
              <p style={{ fontSize: '11px', fontWeight: '700', color: '#475569', margin: 0, textTransform: 'uppercase' }}>Invoice Date</p>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: '2px 0 0 0' }}>{new Date().toLocaleDateString('en-GB')}</p>
            </div>
          </div>
        </div>

        {/* 2. CUSTOMER INFORMATION CARD */}
        <div style={{ marginBottom: '45px' }}>
          <div style={{ 
            backgroundColor: '#ffffff', 
            padding: '25px', 
            borderRadius: '12px', 
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)' // Subtle depth
          }}>
            <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '800', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Billed To</p>
            <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', margin: 0, lineHeight: '1.2' }}>{customerName}</h2>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '6px' }}>
               <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>Phone: {customerPhone}</span>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#1e293b' }}>
                <th style={{ color: 'white', padding: '16px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Date</th>
                <th style={{ color: 'white', padding: '16px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Description</th>
                <th style={{ color: 'white', padding: '16px 20px', textAlign: 'right', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Amount (Rs)</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, index) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                  <td style={{ padding: '16px 20px', fontSize: '13px', color: '#64748b', fontWeight: '600' }}>{t.date}</td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: '#334155', fontWeight: '600' }}>
                    <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: t.type === 'dr' ? '#fff1f2' : '#f0fdf4', color: t.type === 'dr' ? '#e11d48' : '#16a34a', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>
                      {t.type === 'dr' ? 'Debit' : 'Credit'}
                    </span>
                    <span style={{ marginLeft: '10px' }}>{t.type === 'dr' ? 'Udhar Diya' : 'Paisa Mila'}</span>
                  </td>
                  <td style={{ 
                    padding: '16px 20px', 
                    textAlign: 'right', 
                    fontSize: '15px', 
                    fontWeight: '700', 
                    color: t.type === 'dr' ? '#ef4444' : '#10b981' 
                  }}>
                    {t.type === 'dr' ? `+ ${t.amount.toLocaleString()}` : `- ${t.amount.toLocaleString()}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Section */}
        <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ 
            backgroundColor: '#1e293b', 
            color: 'white', 
            padding: '30px', 
            borderRadius: '16px', 
            width: '280px', 
            boxShadow: '0 10px 15px -3px rgba(30, 41, 59, 0.2)'
          }}>
            <p style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '800', margin: '0 0 12px 0', letterSpacing: '1px' }}>Net Outstanding</p>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px', fontSize: '34px', fontWeight: '800', display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
              <span style={{ fontSize: '16px', marginRight: '5px', color: '#94a3b8' }}>Rs</span>
              {totalBalance.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '80px', textAlign: 'center' }}>
          <div style={{ width: '100%', height: '1px', background: 'linear-gradient(to right, transparent, #e2e8f0, transparent)', marginBottom: '20px' }}></div>
          <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px' }}>
            Generated by {shopName} Digital Khata &bull; 2026
          </p>
        </div>
      </div>
    </div>
  );
});

export default InvoiceTemplate;