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
  
  // Logic: 11 entries per page (DO NOT CHANGE)
  const itemsPerPage = 11;
  const pages = [];
  for (let i = 0; i < transactions.length; i += itemsPerPage) {
    pages.push(transactions.slice(i, i + itemsPerPage));
  }

  return (
    <div ref={ref} style={{ width: '794px', margin: '0 auto', backgroundColor: '#f8fafc' }}>
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
            padding: '0', 
            backgroundColor: 'white',
            minHeight: '1123px', // A4 Height
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Top Branding Strip */}
          <div style={{ width: '100%', height: '10px', backgroundColor: '#059669' }}></div>

          <div style={{ padding: '40px 50px', flex: 1 }}>
            
            {/* Header (Only on First Page) */}
            {pageIndex === 0 && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                  <div>
                    <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#1e293b', margin: 0, letterSpacing: '-1px' }}>{shopName}</h1>
                    <div style={{ display: 'inline-block', backgroundColor: '#ecfdf5', color: '#059669', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', marginTop: '5px' }}>
                      DIGITAL KHATA REPORT
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Report Date</p>
                    <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
                    <div style={{ flex: 1, backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <p style={{ fontSize: '10px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', margin: '0 0 8px 0', letterSpacing: '0.5px' }}>Customer Details</p>
                        <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>{customerName}</p>
                        <p style={{ fontSize: '14px', color: '#475569', marginTop: '4px' }}>{customerPhone}</p>
                    </div>
                </div>
              </>
            )}

            {/* Space maintainer for 2nd page onwards */}
            {pageIndex > 0 && <div style={{ height: '50px' }}></div>}

            {/* Transactions Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', borderRadius: '8px', overflow: 'hidden' }}>
              <thead>
                <tr style={{ backgroundColor: '#1e293b', color: 'white' }}>
                  <th style={{ width: '120px', padding: '15px 12px', fontSize: '12px', fontWeight: '600', textAlign: 'left', borderTopLeftRadius: '8px' }}>DATE</th>
                  <th style={{ padding: '15px 12px', fontSize: '12px', fontWeight: '600', textAlign: 'left' }}>DESCRIPTION</th>
                  <th style={{ width: '150px', padding: '15px 12px', fontSize: '12px', fontWeight: '600', textAlign: 'right', borderTopRightRadius: '8px' }}>AMOUNT (RS)</th>
                </tr>
              </thead>
              <tbody>
                {pageEntries.map((t) => (
                  <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px 12px', fontSize: '13px', color: '#64748b', fontWeight: '500' }}>{t.date}</td>
                    <td style={{ padding: '16px 12px', fontSize: '14px', color: '#1e293b' }}>
                      <span style={{ 
                        display: 'inline-block', 
                        padding: '2px 8px', 
                        borderRadius: '4px', 
                        fontSize: '10px', 
                        fontWeight: '800', 
                        marginRight: '10px',
                        backgroundColor: t.type === 'dr' ? '#fef2f2' : '#ecfdf5',
                        color: t.type === 'dr' ? '#ef4444' : '#10b981',
                        border: `1px solid ${t.type === 'dr' ? '#fee2e2' : '#d1fae5'}`
                      }}>
                        {t.type === 'dr' ? 'DEBIT' : 'CREDIT'}
                      </span>
                      {t.type === 'dr' ? 'Udhar Diya' : 'Paisa Mila'}
                    </td>
                    <td style={{ 
                      padding: '16px 12px', 
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

            {/* Net Balance (Only on Last Page) */}
            {pageIndex === pages.length - 1 && (
              <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ 
                  width: '300px', 
                  backgroundColor: '#1e293b', 
                  padding: '25px', 
                  borderRadius: '16px', 
                  color: 'white',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                    Current Net Balance
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: '800', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span style={{ fontSize: '16px', color: '#94a3b8', fontWeight: '400' }}>Rs.</span>
                    {totalBalance.toLocaleString()}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Professional Footer */}
          <div style={{ padding: '30px 50px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold', margin: 0, letterSpacing: '1px' }}>
              PAGE {pageIndex + 1} OF {pages.length}
            </p>
            <p style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', margin: 0 }}>
              Generated via {shopName}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
});

export default InvoiceTemplate;