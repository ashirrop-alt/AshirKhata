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
  
  // Logic: 11 entries per page
  const itemsPerPage = 11;
  const pages = [];
  for (let i = 0; i < transactions.length; i += itemsPerPage) {
    pages.push(transactions.slice(i, i + itemsPerPage));
  }

  return (
    <div ref={ref} style={{ width: '794px', margin: '0 auto' }}>
      {/* CSS for forcing clean breaks in PDF/Print */}
      <style>{`
        @media print {
          .page-break {
            display: block;
            page-break-before: always;
            break-before: always;
          }
          body { -webkit-print-color-adjust: exact; }
        }
      `}</style>

      {pages.map((pageEntries, pageIndex) => (
        <div 
          key={pageIndex} 
          className={pageIndex > 0 ? "page-break" : ""}
          style={{ 
            padding: '40px 50px', 
            backgroundColor: 'white',
            minHeight: '1000px', // Page ko poora fill karne ke liye
            position: 'relative'
          }}
        >
          
          {/* Header & Green Border (Sirf Pehle Page Par) */}
          {pageIndex === 0 && (
            <>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#059669', position: 'absolute', top: 0, left: 0 }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', marginTop: '10px' }}>
                <div>
                  <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#059669', margin: 0 }}>{shopName}</h1>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>Digital Khata Report</p>
                </div>
                <div style={{ textAlign: 'right', fontSize: '12px' }}>
                  <strong>Date:</strong> {new Date().toLocaleDateString('en-GB')}
                </div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 5px 0' }}>Billed To:</p>
                <p style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>{customerName}</p>
                <p style={{ fontSize: '14px', color: '#475569', margin: 0 }}>{customerPhone}</p>
              </div>
            </>
          )}

          {/* Space maintainer for 2nd page onwards */}
          {pageIndex > 0 && <div style={{ height: '40px' }}></div>}

          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                <th style={{ width: '120px', padding: '12px 8px', fontSize: '12px' }}>DATE</th>
                <th style={{ padding: '12px 8px', fontSize: '12px' }}>DESCRIPTION</th>
                <th style={{ width: '140px', padding: '12px 8px', fontSize: '12px', textAlign: 'right' }}>AMOUNT (Rs)</th>
              </tr>
            </thead>
            <tbody>
              {pageEntries.map((t) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 8px', fontSize: '13px', color: '#64748b' }}>{t.date}</td>
                  <td style={{ padding: '14px 8px', fontSize: '13px' }}>
                    <b style={{ color: t.type === 'dr' ? '#ef4444' : '#10b981', marginRight: '8px' }}>
                      {t.type === 'dr' ? '[DEBIT]' : '[CREDIT]'}
                    </b>
                    {t.type === 'dr' ? 'Udhar Diya' : 'Paisa Mila'}
                  </td>
                  <td style={{ padding: '14px 8px', textAlign: 'right', fontSize: '14px', fontWeight: 'bold', color: t.type === 'dr' ? '#ef4444' : '#10b981' }}>
                    {t.type === 'dr' ? `+ ${t.amount.toLocaleString()}` : `- ${t.amount.toLocaleString()}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total & Footer (Sirf Aakhri Page Par) */}
          {pageIndex === pages.length - 1 && (
            <div style={{ marginTop: '30px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '60%' }}></td>
                    <td style={{ width: '40%', borderTop: '2px solid #1e293b', paddingTop: '15px', textAlign: 'right' }}>
                      <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Net Balance</div>
                      <div style={{ fontSize: '28px', fontWeight: '900', color: '#1e293b', marginTop: '5px' }}>
                        <span style={{ fontSize: '16px', marginRight: '5px' }}>Rs</span>
                        {totalBalance.toLocaleString()}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div style={{ marginTop: '80px', textAlign: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold' }}>
                  GENERATED VIA {shopName.toUpperCase()} DIGITAL KHATA
                </p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
});

export default InvoiceTemplate;