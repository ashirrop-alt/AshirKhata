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
        fontFamily: 'Arial, sans-serif',
        color: '#1e293b',
        margin: '0 auto',
        padding: '0',
        display: 'block'
      }}
    >
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

        {/* Customer Info Card */}
        <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #e2e8f0' }}>
          <p style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 5px 0' }}>Billed To:</p>
          <p style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>{customerName}</p>
          <p style={{ fontSize: '14px', color: '#475569', margin: 0 }}>{customerPhone}</p>
        </div>

        {/* TRANSACTIONS SECTION */}
        <div style={{ width: '100%' }}>
          <div style={{ 
            display: 'flex', 
            borderBottom: '2px solid #e2e8f0', 
            padding: '12px 8px',
            fontWeight: 'bold',
            fontSize: '12px'
          }}>
            <div style={{ width: '120px' }}>DATE</div>
            <div style={{ flex: 1 }}>DESCRIPTION</div>
            <div style={{ width: '140px', textAlign: 'right' }}>AMOUNT (Rs)</div>
          </div>

          {transactions.map((t) => (
            <div key={t.id} style={{ 
              display: 'flex', 
              borderBottom: '1px solid #f1f5f9', 
              padding: '14px 8px',
              fontSize: '13px',
              pageBreakInside: 'avoid',
              breakInside: 'avoid' // Modern browsers ke liye
            }}>
              <div style={{ width: '120px', color: '#64748b' }}>{t.date}</div>
              <div style={{ flex: 1 }}>
                <span style={{ color: t.type === 'dr' ? '#ef4444' : '#10b981', fontWeight: 'bold', marginRight: '8px' }}>
                  {t.type === 'dr' ? '[DEBIT]' : '[CREDIT]'}
                </span>
                {t.type === 'dr' ? 'Udhar Diya' : 'Paisa Mila'}
              </div>
              <div style={{ 
                width: '140px', 
                textAlign: 'right', 
                fontWeight: 'bold', 
                color: t.type === 'dr' ? '#ef4444' : '#10b981' 
              }}>
                {t.type === 'dr' ? `+ ${t.amount.toLocaleString()}` : `- ${t.amount.toLocaleString()}`}
              </div>
            </div>
          ))}
        </div>

        {/* FIXED TOTAL BOX: Bina style cheere alignment fix */}
        <div style={{ 
          marginTop: '30px', 
          width: '100%',
          display: 'block',
          // Ye properties alignment out hone se bachaengi:
          pageBreakInside: 'avoid', 
          breakInside: 'avoid'
        }}>
          <div style={{ 
            borderTop: '2px solid #1e293b', 
            paddingTop: '15px', 
            width: '250px', 
            marginLeft: 'auto', 
            textAlign: 'right' 
          }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>
              Net Balance
            </div>
            <div style={{ fontSize: '28px', fontWeight: '900', color: '#1e293b', marginTop: '5px' }}>
              <span style={{ fontSize: '16px', marginRight: '5px' }}>Rs</span>
              {totalBalance.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ 
          marginTop: '60px', 
          textAlign: 'center', 
          borderTop: '1px solid #e2e8f0', 
          paddingTop: '20px',
          pageBreakInside: 'avoid',
          breakInside: 'avoid'
        }}>
          <p style={{ fontSize: '10px', color: '#94a3b8' }}>
            Generated via {shopName} Digital Khata - 2026
          </p>
        </div>
      </div>
    </div>
  );
});

export default InvoiceTemplate;