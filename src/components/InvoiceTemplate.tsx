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
        fontFamily: 'Arial, sans-serif',
        color: '#1e293b',
        margin: '0 auto',
        padding: '0',
        overflow: 'visible' 
      }}
    >
      {/* 1. TOP GREEN BAR */}
      <div style={{ width: '100%', height: '8px', backgroundColor: '#059669' }}></div>

      <div style={{ padding: '60px 50px' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#059669', margin: 0, textTransform: 'uppercase' }}>{shopName}</h1>
            <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', margin: '2px 0 0 0', textTransform: 'uppercase' }}>Digital Khata Report</p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '13px', fontWeight: 'bold' }}>
            Date: {new Date().toLocaleDateString('en-GB')}
          </div>
        </div>

        {/* 2. BILL TO SECTION */}
        <div style={{ marginBottom: '40px', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px' }}>
          <p style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 5px 0' }}>Bill To:</p>
          <p style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a', margin: 0 }}>{customerName}</p>
          <p style={{ fontSize: '14px', color: '#475569', margin: '2px 0 0 0' }}>{customerPhone}</p>
        </div>

        {/* 3. TABLE */}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #1e293b', textAlign: 'left' }}>
              <th style={{ padding: '12px 5px', fontSize: '12px', fontWeight: '800', width: '20%' }}>DATE</th>
              <th style={{ padding: '12px 5px', fontSize: '12px', fontWeight: '800', width: '55%' }}>DESCRIPTION</th>
              <th style={{ padding: '12px 5px', fontSize: '12px', fontWeight: '800', textAlign: 'right', width: '25%' }}>AMOUNT (RS)</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '14px 5px', fontSize: '12px', color: '#1e293b' }}>{t.date}</td>
                <td style={{ padding: '14px 5px', fontSize: '13px', fontWeight: '600' }}>
                  <span style={{ color: t.type === 'dr' ? '#ef4444' : '#10b981', marginRight: '8px' }}>
                    {t.type === 'dr' ? '[DR]' : '[CR]'}
                  </span>
                  {t.type === 'dr' ? 'Udhar Diya' : 'Paisa Mila'}
                </td>
                <td style={{ padding: '14px 5px', textAlign: 'right', fontSize: '14px', fontWeight: '700', color: t.type === 'dr' ? '#ef4444' : '#10b981' }}>
                  {t.type === 'dr' ? `+ ${t.amount.toLocaleString()}` : `- ${t.amount.toLocaleString()}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 4. TOTAL SECTION - Clean & Final */}
        <div style={{ 
          marginTop: '30px', 
          display: 'flex', 
          justifyContent: 'flex-end',
          pageBreakInside: 'avoid'
        }}>
          <div style={{ 
            borderTop: '2px solid #1e293b', 
            paddingTop: '15px', 
            width: '200px', 
            textAlign: 'right' 
          }}>
            <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>
              Net Balance
            </div>
            <div style={{ fontSize: '24px', fontWeight: '900', color: '#1e293b', marginTop: '5px' }}>
              <span style={{ fontSize: '14px', marginRight: '4px' }}>Rs</span>
              {totalBalance.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '60px', textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
          <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold' }}>
            GENERATED VIA {shopName.toUpperCase()} DIGITAL KHATA
          </p>
        </div>
      </div>
    </div>
  );
});

export default InvoiceTemplate;