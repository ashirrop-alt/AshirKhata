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
          body { -webkit-print-color-adjust: exact; margin: 0; }
        }
      `}</style>

      {pages.map((pageEntries, pageIndex) => (
        <div 
          key={pageIndex} 
          className={pageIndex > 0 ? "page-break" : ""}
          style={{ 
            padding: '30px 40px', 
            backgroundColor: 'white',
            minHeight: '1080px', // Adjusted for perfect A4 fit
            position: 'relative',
            boxSizing: 'border-box'
          }}
        >
          {/* Header (Only First Page) */}
          {pageIndex === 0 && (
            <>
              <div style={{ width: '100%', height: '6px', backgroundColor: '#059669', position: 'absolute', top: 0, left: 0 }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', marginTop: '10px', alignItems: 'center' }}>
                <div>
                  <h1 style={{ fontSize: '26px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>{shopName}</h1>
                  <p style={{ fontSize: '11px', color: '#059669', fontWeight: 'bold', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Digital Khata Report</p>
                </div>
                <div style={{ textAlign: 'right', fontSize: '12px', color: '#64748b' }}>
                  <strong>Date:</strong> {new Date().toLocaleDateString('en-GB')}
                </div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '25px', border: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '9px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', margin: '0 0 4px 0' }}>Billed To:</p>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>{customerName}</p>
                <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>{customerPhone}</p>
              </div>
            </>
          )}

          {/* Transactions Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <thead>
              <tr style={{ backgroundColor: '#1e293b' }}>
                <th style={{ width: '110px', padding: '10px', fontSize: '11px', color: 'white', textAlign: 'left', fontWeight: '600' }}>DATE</th>
                <th style={{ padding: '10px', fontSize: '11px', color: 'white', textAlign: 'left', fontWeight: '600' }}>DESCRIPTION</th>
                <th style={{ width: '130px', padding: '10px', fontSize: '11px', color: 'white', textAlign: 'right', fontWeight: '600' }}>AMOUNT (RS)</th>
              </tr>
            </thead>
            <tbody>
              {pageEntries.map((t) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 10px', fontSize: '12px', color: '#64748b' }}>{t.date}</td>
                  <td style={{ padding: '12px 10px', fontSize: '13px', color: '#1e293b', verticalAlign: 'middle' }}>
                    <span style={{ 
                      display: 'inline-flex', // Flex use kiya center ke liye
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '2px 6px', 
                      borderRadius: '4px', 
                      fontSize: '9px', 
                      fontWeight: '800', 
                      marginRight: '8px',
                      backgroundColor: t.type === 'dr' ? '#fef2f2' : '#ecfdf5',
                      color: t.type === 'dr' ? '#ef4444' : '#10b981',
                      border: `1px solid ${t.type === 'dr' ? '#fee2e2' : '#d1fae5'}`,
                      lineHeight: '1' // Text center fix
                    }}>
                      {t.type === 'dr' ? 'DEBIT' : 'CREDIT'}
                    </span>
                    {t.type === 'dr' ? 'Udhar Diya' : 'Paisa Mila'}
                  </td>
                  <td style={{ padding: '12px 10px', textAlign: 'right', fontSize: '14px', fontWeight: '700', color: t.type === 'dr' ? '#ef4444' : '#10b981' }}>
                    {t.type === 'dr' ? `+ ${t.amount.toLocaleString()}` : `- ${t.amount.toLocaleString()}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total Section (Only Last Page) */}
          {pageIndex === pages.length - 1 && (
            <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ 
                width: '240px', 
                border: '2px solid #1e293b', 
                padding: '15px', 
                borderRadius: '8px', 
                textAlign: 'right'
              }}>
                <p style={{ fontSize: '10px', fontWeight: '800', color: '#64748b', margin: '0 0 5px 0', textTransform: 'uppercase' }}>Net Balance</p>
                <p style={{ fontSize: '24px', fontWeight: '900', color: '#1e293b', margin: 0 }}>
                  <span style={{ fontSize: '14px', marginRight: '4px' }}>Rs.</span>
                  {totalBalance.toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {/* Minimal Footer */}
          <div style={{ position: 'absolute', bottom: '30px', left: '40px', right: '40px', borderTop: '1px solid #f1f5f9', paddingTop: '15px', display: 'flex', justifyContent: 'space-between' }}>
            <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>Page {pageIndex + 1} of {pages.length}</p>
            <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold', margin: 0 }}>{shopName.toUpperCase()}</p>
          </div>
        </div>
      ))}
    </div>
  );
});

export default InvoiceTemplate;