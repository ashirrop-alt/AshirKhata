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
  
  const itemsPerPage = 11;
  const pages = [];
  for (let i = 0; i < transactions.length; i += itemsPerPage) {
    pages.push(transactions.slice(i, i + itemsPerPage));
  }

  return (
    <div ref={ref} style={{ width: '794px', margin: '0 auto', backgroundColor: 'white' }}>
      <style>{`
        @media print {
          .page-break { display: block; page-break-before: always; break-before: always; }
          body { -webkit-print-color-adjust: exact; margin: 0; padding: 0; }
          @page { margin: 0; size: auto; }
        }
      `}</style>

      {pages.map((pageEntries, pageIndex) => (
        <div 
          key={pageIndex} 
          className={pageIndex > 0 ? "page-break" : ""}
          style={{ 
            padding: '35px 45px', 
            backgroundColor: 'white',
            minHeight: '1050px', // Shorter height to prevent ghost 3rd page
            position: 'relative',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {pageIndex === 0 && (
            <>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#059669', position: 'absolute', top: 0, left: 0 }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', marginTop: '5px', alignItems: 'center' }}>
                <div>
                  <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>{shopName}</h1>
                  <p style={{ fontSize: '11px', color: '#059669', fontWeight: '800', margin: 0, letterSpacing: '1px' }}>DIGITAL KHATA REPORT</p>
                </div>
                <div style={{ textAlign: 'right', fontSize: '12px', color: '#64748b' }}>
                  <strong>Date:</strong> {new Date().toLocaleDateString('en-GB')}
                </div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '18px', borderRadius: '10px', marginBottom: '30px', border: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '9px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', margin: '0 0 4px 0' }}>Billed To:</p>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>{customerName}</p>
                <p style={{ fontSize: '14px', color: '#475569', margin: 0 }}>{customerPhone}</p>
              </div>
            </>
          )}

          {pageIndex > 0 && <div style={{ height: '30px' }}></div>}

          <div style={{ flex: 1 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <thead>
                <tr style={{ backgroundColor: '#1e293b' }}>
                  <th style={{ width: '110px', padding: '12px 10px', fontSize: '11px', color: 'white', textAlign: 'left', fontWeight: '600' }}>DATE</th>
                  <th style={{ padding: '12px 10px', fontSize: '11px', color: 'white', textAlign: 'left', fontWeight: '600' }}>DESCRIPTION</th>
                  <th style={{ width: '140px', padding: '12px 10px', fontSize: '11px', color: 'white', textAlign: 'right', fontWeight: '600' }}>AMOUNT (RS)</th>
                </tr>
              </thead>
              <tbody>
                {pageEntries.map((t) => (
                  <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 10px', fontSize: '12px', color: '#64748b' }}>{t.date}</td>
                    <td style={{ padding: '14px 10px', fontSize: '13px', color: '#1e293b', verticalAlign: 'middle' }}>
                      <span style={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 8px', 
                        height: '20px', // Fixed height for centering
                        borderRadius: '4px', 
                        fontSize: '9px', 
                        fontWeight: '900', 
                        marginRight: '10px',
                        backgroundColor: t.type === 'dr' ? '#fef2f2' : '#ecfdf5',
                        color: t.type === 'dr' ? '#ef4444' : '#10b981',
                        border: `1px solid ${t.type === 'dr' ? '#fee2e2' : '#d1fae5'}`,
                        lineHeight: 'normal' 
                      }}>
                        {t.type === 'dr' ? 'DEBIT' : 'CREDIT'}
                      </span>
                      {t.type === 'dr' ? 'Udhar Diya' : 'Paisa Mila'}
                    </td>
                    <td style={{ padding: '14px 10px', textAlign: 'right', fontSize: '14px', fontWeight: '700', color: t.type === 'dr' ? '#ef4444' : '#10b981' }}>
                      {t.type === 'dr' ? `+ ${t.amount.toLocaleString()}` : `- ${t.amount.toLocaleString()}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {pageIndex === pages.length - 1 && (
              <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ 
                  width: '280px', 
                  backgroundColor: '#1e293b', 
                  padding: '20px', 
                  borderRadius: '12px', 
                  textAlign: 'right',
                  color: 'white'
                }}>
                  <p style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', margin: '0 0 5px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Net Balance</p>
                  <p style={{ fontSize: '28px', fontWeight: '800', margin: 0 }}>
                    <span style={{ fontSize: '16px', marginRight: '6px', fontWeight: '400', color: '#94a3b8' }}>Rs.</span>
                    {totalBalance.toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div style={{ marginTop: '20px', borderTop: '1px solid #f1f5f9', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>Page {pageIndex + 1} of {pages.length}</p>
            <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold', margin: 0 }}>{shopName.toUpperCase()} DIGITAL KHATA</p>
          </div>
        </div>
      ))}
    </div>
  );
});

export default InvoiceTemplate;