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
        width: '794px', // Standard A4 Width
        minHeight: '100vh', 
        backgroundColor: 'white',  
        fontFamily: 'Arial, sans-serif',
        color: '#1e293b',
        margin: '0 auto',
        padding: '0',
        overflow: 'visible' 
      }}
    >
      {/* 1. TOP BAR - Changed to Relative/Flow for stability */}
      <div style={{ width: '100%', height: '8px', backgroundColor: '#059669' }}></div>

      <div style={{ padding: '40px 50px' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#059669', margin: 0 }}>{shopName}</h1>
            <p style={{ fontSize: '12px', color: '#64748b' }}>Digital Khata Report</p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '12px' }}>
            <strong>Date:</strong> {new Date().toLocaleDateString('en-GB')}
          </div>
        </div>

        {/* 2. CUSTOMER INFO */}
        <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #e2e8f0' }}>
          <p style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 5px 0' }}>Billed To:</p>
          <p style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>{customerName}</p>
          <p style={{ fontSize: '14px', color: '#475569', margin: 0 }}>{customerPhone}</p>
        </div>

        {/* 3. TRANSACTIONS TABLE */}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
              <th style={{ padding: '12px 8px', fontSize: '12px' }}>Date</th>
              <th style={{ padding: '12px 8px', fontSize: '12px' }}>Description</th>
              <th style={{ padding: '12px 8px', fontSize: '12px', textAlign: 'right' }}>Amount (Rs)</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 8px', fontSize: '12px' }}>{t.date}</td>
                <td style={{ padding: '12px 8px', fontSize: '13px' }}>
                  <span style={{ color: t.type === 'dr' ? '#ef4444' : '#10b981', fontWeight: 'bold', marginRight: '5px' }}>
                    {t.type === 'dr' ? '[DEBIT]' : '[CREDIT]'}
                  </span>
                  {t.type === 'dr' ? 'Udhar Diya' : 'Paisa Mila'}
                </td>
                <td style={{ padding: '12px 8px', fontSize: '14px', fontWeight: 'bold', textAlign: 'right', color: t.type === 'dr' ? '#ef4444' : '#10b981' }}>
                  {t.type === 'dr' ? `+ ${t.amount.toLocaleString()}` : `- ${t.amount.toLocaleString()}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 4. TOTAL BOX - Using Margin instead of Absolute Positioning */}
        {/* 4. TOTAL BOX - Simple & Clean */}
        <div style={{ 
          marginTop: '40px', 
          display: 'flex', 
          justifyContent: 'flex-end',
          pageBreakInside: 'avoid'
        }}>
          <div style={{ 
            borderTop: '2px solid #1e293b', 
            paddingTop: '15px', 
            width: '250px', 
            textAlign: 'right' 
          }}>
            <div style={{ 
              fontSize: '12px', 
              fontWeight: '800', 
              color: '#64748b', 
              textTransform: 'uppercase', 
              marginBottom: '5px' 
            }}>
              Net Balance
            </div>
            <div style={{ 
              fontSize: '28px', 
              fontWeight: '900', 
              color: '#1e293b' 
            }}>
              <span style={{ fontSize: '16px', marginRight: '5px' }}>Rs</span>
              {totalBalance.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '50px', textAlign: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
          <p style={{ fontSize: '10px', color: '#94a3b8' }}>
            Generated via {shopName} Digital Khata - 2026
          </p>
        </div>
      </div>
    </div>
  );
});

export default InvoiceTemplate;