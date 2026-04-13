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
          @page { size: A4; margin: 0; }
          body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; }
          .page-container { page-break-after: always !important; }
          .page-container:last-child { page-break-after: avoid !important; }
        }
      `}</style>

      {pages.map((pageEntries, pageIndex) => (
        <div 
          key={pageIndex} 
          className="page-container"
          style={{ 
            padding: '30px 45px 60px 45px', // Bottom padding added
            backgroundColor: 'white',
            width: '100%',
            minHeight: '1060px', // Slightly less than A4 to prevent ghost page
            boxSizing: 'border-box',
            position: 'relative',
          }}
        >
          {/* Header */}
          {pageIndex === 0 && (
            <>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#059669', position: 'absolute', top: 0, left: 0 }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', marginTop: '10px' }}>
                <div>
                  <h1 style={{ fontSize: '26px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>{shopName}</h1>
                  <p style={{ fontSize: '11px', color: '#059669', fontWeight: '900', margin: 0, letterSpacing: '1px' }}>DIGITAL KHATA REPORT</p>
                </div>
                <div style={{ textAlign: 'right', fontSize: '12px', color: '#64748b' }}>
                  <strong>Date:</strong> {new Date().toLocaleDateString('en-GB')}
                </div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '10px', marginBottom: '25px', border: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '9px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', margin: '0 0 4px 0' }}>Billed To:</p>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>{customerName}</p>
                <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>{customerPhone}</p>
              </div>
            </>
          )}

          {/* Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <thead>
              <tr style={{ backgroundColor: '#1e293b' }}>
                <th style={{ width: '100px', padding: '12px 10px', fontSize: '11px', color: 'white', textAlign: 'left' }}>DATE</th>
                <th style={{ padding: '12px 10px', fontSize: '11px', color: 'white', textAlign: 'left' }}>DESCRIPTION</th>
                <th style={{ width: '140px', padding: '12px 10px', fontSize: '11px', color: 'white', textAlign: 'right' }}>AMOUNT (RS)</th>
              </tr>
            </thead>
            <tbody>
              {pageEntries.map((t) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 10px', fontSize: '12px', color: '#64748b' }}>{t.date}</td>
                  <td style={{ padding: '14px 10px', fontSize: '13px', color: '#1e293b' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ 
                        display: 'table-cell', // Most stable for vertical centering
                        verticalAlign: 'middle',
                        backgroundColor: t.type === 'dr' ? '#fef2f2' : '#ecfdf5',
                        color: t.type === 'dr' ? '#ef4444' : '#10b981',
                        border: `1px solid ${t.type === 'dr' ? '#fee2e2' : '#d1fae5'}`,
                        fontSize: '9px', 
                        fontWeight: '900', 
                        padding: '3px 8px',
                        borderRadius: '4px',
                        marginRight: '10px',
                        lineHeight: '1.2'
                      }}>
                        {t.type === 'dr' ? 'DEBIT' : 'CREDIT'}
                      </span>
                      <span style={{ marginTop: '2px' }}>{t.type === 'dr' ? 'Udhar Diya' : 'Paisa Mila'}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 10px', textAlign: 'right', fontSize: '14px', fontWeight: '700', color: t.type === 'dr' ? '#ef4444' : '#10b981' }}>
                    {t.type === 'dr' ? `+ ${t.amount.toLocaleString()}` : `- ${t.amount.toLocaleString()}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Net Balance (Last Page) */}
          {pageIndex === pages.length - 1 && (
            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ 
                width: '260px', 
                backgroundColor: '#1e293b', 
                padding: '18px', 
                borderRadius: '12px', 
                textAlign: 'right',
                color: 'white'
              }}>
                <p style={{ fontSize: '10px', fontWeight: '600', color: '#94a3b8', margin: '0 0 5px 0', textTransform: 'uppercase' }}>Net Balance</p>
                <p style={{ fontSize: '26px', fontWeight: '800', margin: 0 }}>
                  <span style={{ fontSize: '14px', marginRight: '6px', color: '#94a3b8' }}>Rs.</span>
                  {totalBalance.toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {/* Footer (Absolute position for clean look) */}
          <div style={{ 
            position: 'absolute', 
            bottom: '20px', 
            left: '45px', 
            right: '45px', 
            borderTop: '1px solid #f1f5f9', 
            paddingTop: '10px', 
            display: 'flex', 
            justifyContent: 'space-between' 
          }}>
            <p style={{ fontSize: '9px', color: '#94a3b8', margin: 0 }}>Page {pageIndex + 1} of {pages.length}</p>
            <p style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 'bold', margin: 0 }}>{shopName.toUpperCase()} DIGITAL KHATA</p>
          </div>
        </div>
      ))}
    </div>
  );
});

export default InvoiceTemplate;