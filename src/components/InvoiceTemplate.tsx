import React from 'react';

interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'dr' | 'cr';
  remarks?: string;
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

  // Items per page ko wapas thoda badhaya hai taake balance rahe
  const itemsPerPage = 12; 
  const pages = [];
  for (let i = 0; i < transactions.length; i += itemsPerPage) {
    pages.push(transactions.slice(i, i + itemsPerPage));
  }

  const formattedDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).replace(/ /g, '/');

  return (
    <div ref={ref} className="invoice-root" style={{ width: '210mm', margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <style>{`
        @media print {
          @page { 
            size: A4;
            margin: 0;
          }
          body { 
            margin: 0;
            -webkit-print-color-adjust: exact;
          }
          .page-break {
            display: block;
            page-break-after: always;
            break-after: page;
          }
          /* Last page fix */
          .page-break:last-child {
            page-break-after: auto;
            break-after: auto;
          }
        }
        .invoice-page {
          width: 210mm;
          min-height: 296mm; /* Full A4 height but not forced */
          padding: 50px 60px;
          box-sizing: border-box;
          background: white;
          display: flex;
          flex-direction: column;
          position: relative;
        }
      `}</style>

      {pages.map((pageEntries, pageIndex) => (
        <div key={pageIndex} className="invoice-page page-break">
          
          {/* Header Only on Page 1 */}
          {pageIndex === 0 && (
            <div style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-1px' }}>{shopName}</h1>
                  <p style={{ fontSize: '14px', color: '#64748b', fontWeight: '600', marginTop: '5px', textTransform: 'uppercase' }}>Digital Khata Report</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '14px', color: '#475569', margin: 0 }}>
                    <span style={{ fontWeight: '700' }}>Report Date:</span> {formattedDate}
                  </p>
                </div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '25px', borderRadius: '12px', marginTop: '30px', border: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '11px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', margin: '0 0 8px 0', letterSpacing: '1px' }}>Customer Details</p>
                <p style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: '#0f172a' }}>{customerName}</p>
                <p style={{ fontSize: '16px', color: '#475569', margin: '5px 0 0 0', fontWeight: '500' }}>{customerPhone}</p>
              </div>
            </div>
          )}

          {/* Table - Consistent Font Sizes */}
          <div style={{ flex: 1 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#1e293b' }}>
                  <th style={{ padding: '15px', fontSize: '12px', color: 'white', textAlign: 'left', borderRadius: '8px 0 0 8px' }}>DATE</th>
                  <th style={{ padding: '15px', fontSize: '12px', color: 'white', textAlign: 'left' }}>DESCRIPTION</th>
                  <th style={{ padding: '15px', fontSize: '12px', color: 'white', textAlign: 'right', borderRadius: '0 8px 8px 0' }}>AMOUNT (Rs)</th>
                </tr>
              </thead>
              <tbody>
                {pageEntries.map((t) => (
                  <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '18px 15px', fontSize: '13px', color: '#475569', fontWeight: '500' }}>{t.date}</td>
                    <td style={{ padding: '18px 15px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            backgroundColor: t.type === 'dr' ? '#fef2f2' : '#ecfdf5',
                            color: t.type === 'dr' ? '#ef4444' : '#10b981',
                            fontSize: '10px',
                            fontWeight: '800',
                            padding: '3px 8px',
                            borderRadius: '5px',
                            textTransform: 'uppercase'
                          }}>
                            {t.type === 'dr' ? 'Debit' : 'Credit'}
                          </span>
                          <span style={{ fontSize: '14px', color: '#1e293b', fontWeight: '700' }}>
                            {t.type === 'dr' ? 'Udhar Diya' : 'Paisa Mila'}
                          </span>
                        </div>
                        {t.remarks && <span style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>Note: {t.remarks}</span>}
                      </div>
                    </td>
                    <td style={{ padding: '18px 15px', textAlign: 'right', fontSize: '15px', fontWeight: '800', color: t.type === 'dr' ? '#ef4444' : '#10b981' }}>
                      {t.type === 'dr' ? `+ ${t.amount.toLocaleString()}` : `- ${t.amount.toLocaleString()}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer - Stays at bottom of last page */}
          {pageIndex === pages.length - 1 && (
            <div style={{ marginTop: '50px' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
                <div style={{
                  width: '220px',
                  backgroundColor: '#1e293b',
                  padding: '20px',
                  borderRadius: '16px',
                  textAlign: 'right',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '800', letterSpacing: '1px' }}>NET BALANCE</div>
                  <div style={{ fontSize: '26px', fontWeight: '900', color: 'white', marginTop: '5px' }}>
                    <span style={{ fontSize: '16px', fontWeight: '500', marginRight: '4px' }}>Rs</span>
                    {totalBalance.toLocaleString()}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'center', borderTop: '2px solid #f1f5f9', paddingTop: '30px' }}>
                <p style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: '700', margin: 0, letterSpacing: '2px', textTransform: 'uppercase' }}>
                  Generated via {shopName} Digital Khata
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