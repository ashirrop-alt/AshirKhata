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

  const itemsPerPage = 10; 
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
    <div ref={ref} style={{ width: '210mm', margin: '0 auto', backgroundColor: 'white' }}>
      <style>{`
        @media print {
          @page { 
            margin: 0; 
            size: A4;
          }
          html, body {
            height: 100%;
            margin: 0 !important; 
            padding: 0 !important;
            overflow: hidden;
          }
          .page-container {
            page-break-after: always;
            page-break-inside: avoid;
            break-after: page;
          }
          /* Last page should not have a break after it */
          .page-container:last-child {
            page-break-after: auto;
            break-after: auto;
          }
        }
      `}</style>

      {pages.map((pageEntries, pageIndex) => (
        <div
          key={pageIndex}
          className="page-container"
          style={{
            padding: '30px 45px', // Balanced padding
            backgroundColor: 'white',
            width: '210mm',
            height: '287mm', // Reduced height to strictly avoid blank page
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
          }}
        >
          {/* Header */}
          {pageIndex === 0 && (
            <div style={{ marginBottom: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1 style={{ fontSize: '26px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>{shopName}</h1>
                  <p style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', margin: '2px 0 0 0' }}>Digital Khata Report</p>
                </div>
                <div style={{ textAlign: 'right', fontSize: '12px', color: '#475569' }}>
                  <span style={{ fontWeight: 'bold' }}>Date:</span> {formattedDate}
                </div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', marginTop: '20px', border: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '9px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 4px 0' }}>Billed To:</p>
                <p style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: '#1e293b' }}>{customerName}</p>
                <p style={{ fontSize: '13px', color: '#475569', margin: '2px 0 0 0' }}>{customerPhone}</p>
              </div>
            </div>
          )}

          {/* Table */}
          <div style={{ flex: 1 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <thead>
                <tr style={{ backgroundColor: '#1e293b' }}>
                  <th style={{ width: '90px', padding: '10px', fontSize: '11px', color: 'white', textAlign: 'left' }}>DATE</th>
                  <th style={{ width: '130px', padding: '10px', fontSize: '11px', color: 'white', textAlign: 'left' }}>TYPE</th>
                  <th style={{ padding: '10px', fontSize: '11px', color: 'white', textAlign: 'left' }}>REMARKS</th>
                  <th style={{ width: '110px', padding: '10px', fontSize: '11px', color: 'white', textAlign: 'right' }}>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {pageEntries.map((t) => (
                  <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 10px', fontSize: '11px', color: '#475569' }}>{t.date}</td>
                    <td style={{ padding: '12px 10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{
                          backgroundColor: t.type === 'dr' ? '#fef2f2' : '#ecfdf5',
                          color: t.type === 'dr' ? '#ef4444' : '#10b981',
                          fontSize: '8px',
                          fontWeight: 'bold',
                          padding: '2px 5px',
                          borderRadius: '4px'
                        }}>
                          {t.type === 'dr' ? 'DEBIT' : 'CREDIT'}
                        </span>
                        <span style={{ fontSize: '11px', color: '#1e293b', fontWeight: '600' }}>
                          {t.type === 'dr' ? 'Udhar' : 'Paisa'}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 10px', fontSize: '11px', color: '#64748b', wordBreak: 'break-word' }}>
                      {t.remarks || '-'}
                    </td>
                    <td style={{ padding: '12px 10px', textAlign: 'right', fontSize: '12px', fontWeight: 'bold', color: t.type === 'dr' ? '#ef4444' : '#10b981' }}>
                      {t.type === 'dr' ? `+ ${t.amount.toLocaleString()}` : `- ${t.amount.toLocaleString()}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {pageIndex === pages.length - 1 && (
            <div style={{ marginTop: 'auto', paddingBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <div style={{
                  width: '180px',
                  backgroundColor: '#1e293b',
                  padding: '14px',
                  borderRadius: '10px',
                  textAlign: 'right',
                  color: 'white'
                }}>
                  <div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 'bold' }}>NET BALANCE</div>
                  <div style={{ fontSize: '20px', fontWeight: '900', marginTop: '2px' }}>Rs {totalBalance.toLocaleString()}</div>
                </div>
              </div>

              <div style={{ textAlign: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>
                <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold', margin: 0, letterSpacing: '0.5px' }}>
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