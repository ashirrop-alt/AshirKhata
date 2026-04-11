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
        minHeight: '1123px', // Standard A4 height
        backgroundColor: 'white', 
        position: 'relative', 
        fontFamily: "'Segoe UI', Arial, sans-serif",
        color: '#1e293b',
        margin: '0 auto',
        padding: '0',
        overflow: 'hidden'
      }}
    >
      {/* Top Green Accent Bar */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '6px', 
        backgroundColor: '#059669'
      }}></div>

      <div style={{ padding: '60px 50px' }}>
        
        {/* Header: Shop Name & Report Type */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '50px', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px' }}>
          <div>
            <h1 style={{ 
              fontSize: '34px', 
              fontWeight: '800', 
              color: '#059669', 
              margin: 0, 
              textTransform: 'uppercase', 
              letterSpacing: '1px' // Fixing "chipka hua" text
            }}>
              {shopName}
            </h1>
            <p style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', margin: '5px 0 0 0', letterSpacing: '2px', textTransform: 'uppercase' }}>
              Digital Khata Report
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', margin: 0, textTransform: 'uppercase' }}>Report Date</p>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: '2px 0 0 0' }}>{new Date().toLocaleDateString('en-GB')}</p>
          </div>
        </div>

        {/* Customer Details Section */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ 
            backgroundColor: '#f8fafc', 
            padding: '20px 25px', 
            borderRadius: '8px', 
            border: '1px solid #e2e8f0'
          }}>
            <p style={{ fontSize: '10px', color: '#64748b', fontWeight: '800', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Bill To:</p>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: 0 }}>{customerName}</h2>
            <p style={{ fontSize: '14px', color: '#475569', fontWeight: '500', marginTop: '4px' }}>Phone: {customerPhone}</p>
          </div>
        </div>

        {/* Table Section */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
          <thead>
            <tr style={{ backgroundColor: '#1e293b' }}>
              <th style={{ color: 'white', padding: '14px 15px', textAlign: 'left', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Date</th>
              <th style={{ color: 'white', padding: '14px 15px', textAlign: 'left', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Description</th>
              <th style={{ color: 'white', padding: '14px 15px', textAlign: 'right', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Amount (Rs)</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, index) => (
              <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: index % 2 === 0 ? 'white' : '#fcfdfe' }}>
                <td style={{ padding: '14px 15px', fontSize: '12px', color: '#64748b', fontWeight: '600' }}>{t.date}</td>
                <td style={{ padding: '14px 15px', fontSize: '13px', color: '#334155', fontWeight: '600' }}>
                   <span style={{ 
                     fontSize: '10px', 
                     padding: '2px 6px', 
                     borderRadius: '4px', 
                     marginRight: '8px',
                     backgroundColor: t.type === 'dr' ? '#fee2e2' : '#dcfce7',
                     color: t.type === 'dr' ? '#b91c1c' : '#15803d',
                     textTransform: 'uppercase'
                   }}>
                     {t.type === 'dr' ? 'Debit' : 'Credit'}
                   </span>
                   {t.type === 'dr' ? 'Udhar Diya' : 'Paisa Mila'}
                </td>
                <td style={{ 
                  padding: '14px 15px', 
                  textAlign: 'right', 
                  fontSize: '14px', 
                  fontWeight: '700', 
                  color: t.type === 'dr' ? '#ef4444' : '#10b981' 
                }}>
                  {t.type === 'dr' ? `+ ${t.amount.toLocaleString()}` : `- ${t.amount.toLocaleString()}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary Footer Box */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
          <div style={{ 
            backgroundColor: '#1e293b', 
            color: 'white', 
            padding: '20px 30px', 
            borderRadius: '12px', 
            textAlign: 'center',
            minWidth: '220px'
          }}>
            <p style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700', margin: '0 0 8px 0', letterSpacing: '1px' }}>Net Outstanding</p>
            <div style={{ fontSize: '28px', fontWeight: '800', borderTop: '1px solid #334155', paddingTop: '10px' }}>
              Rs {totalBalance.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Final Footer Line */}
        <div style={{ 
          position: 'absolute', 
          bottom: '50px', 
          left: '50px', 
          right: '50px', 
          textAlign: 'center', 
          borderTop: '1px solid #f1f5f9', 
          paddingTop: '20px' 
        }}>
          <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
            Generated via {shopName} App &bull; 2026
          </p>
        </div>
      </div>
    </div>
  );
});

export default InvoiceTemplate;