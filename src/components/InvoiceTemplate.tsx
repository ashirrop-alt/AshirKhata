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

  // Items per page adjusted to ensure space for footer
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
    <div ref={ref} style={{ width: '794px', margin: '0 auto', backgroundColor: 'white' }}>
      <style>{`
        @media print {
          @page { margin: 0; size: A4; }
          body { margin: 0; -webkit-print-color-adjust: exact; }
          .page-break { display: block; page-break-before: always; }
        }
      `}</style>

      {pages.map((pageEntries, pageIndex) => (
        <div
          key={pageIndex}
          className={pageIndex > 0 ? "page-break" : ""}
          style={{
            padding: '40px 50px', 
            backgroundColor: 'white',
            width: '210mm',
            height: '297mm', // Exact A4 Height
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            overflow: 'hidden' // Force content to stay on one page
          }}
        >
          {/* Header Section */}
          {pageIndex === 0 && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                <div>
                  <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e293b', margin: 0, letterSpacing: '-0.5px' }}>{shopName}</h1>
                  <p style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', margin: '4px 0 0 0' }}>Digital Khata Report</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                   <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Date:</p>
                   <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}>{formattedDate}</p>
                </div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '10px', marginBottom: '30px', border: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 8px 0', letterSpacing: '0.5px' }}>Billed To:</p>
                <p style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: '#1e293b' }}>{customerName}</p>
                <p style={{ fontSize: '14px', color: '#475569', marginTop: '4px' }}>{customerPhone}</p>
              </div>
            </>
          )}

          {/* Table Section */}
          <div style={{ flex: 1 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#1e293b' }}>
                  <th style={{ width: '15%', padding: '12px 15px', fontSize: '11px', color: 'white', textAlign: 'left', borderRadius: '6px 0 0 0' }}>DATE</th>
                  <th style={{ width: '25%', padding: '12px 15px', fontSize: '11px', color: 'white', textAlign: 'left' }}>TYPE</th>
                  <th style={{ width: '40%', padding: '12px 15px', fontSize: '11px', color: 'white', textAlign: 'left' }}>REMARKS</th>
                  <th style={{ width: '20%', padding: '12px 15px', fontSize: '11px', color: 'white', textAlign: 'right', borderRadius: '0 6px 0 0' }}>AMOUNT (Rs)</th>
                </tr>
              </thead>
              <tbody>
                {pageEntries.map((t) => (
                  <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 15px', fontSize: '12px', color: '#475569' }}>{t.date}</td>
                    <td style={{ padding: '14px 15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          backgroundColor: t.type === 'dr' ? '#fef2f2' : '#ecfdf5',
                          color: t.type === 'dr' ? '#ef4444' : '#10b981',
                          fontSize: '9px',
                          fontWeight: 'bold',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          border: `1px solid ${t.type === 'dr' ? '#fee2e2' : '#d1fae5'}`
                        }}>
                          {t.type === 'dr' ? 'DEBIT' : 'CREDIT'}
                        </span>
                        <span style={{ fontSize: '12px', color: '#1e293b', fontWeight: '600' }}>
                          {t.type === 'dr' ? 'Udhar Diya' : 'Paisa Mila'}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 15px', fontSize: '12px', color: '#64748b' }}>
                      {t.remarks || '-'}
                    </td>
                    <td style={{ padding: '14px 15px', textAlign: 'right', fontSize: '13px', fontWeight: 'bold', color: t.type === 'dr' ? '#ef4444' : '#10b981' }}>
                      {t.type === 'dr' ? `+ ${t.amount.toLocaleString()}` : `- ${t.amount.toLocaleString()}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Section - Fixed at the bottom of the page */}
          {pageIndex === pages.length - 1 && (
            <div style={{ 
              position: 'absolute', 
              bottom: '40px', 
              left: '50px', 
              right: '50px' 
            }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '25px' }}>
                <div style={{
                  width: '200px',
                  backgroundColor: '#1e293b',
                  padding: '18px',
                  borderRadius: '12px',
                  textAlign: 'right',
                  color: 'white',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Net Balance</div>
                  <div style={{ fontSize: '24px', fontWeight: '900', marginTop: '4px' }}>
                    <span style={{ fontSize: '14px', marginRight: '4px', color: '#94a3b8' }}>Rs</span>
                    {totalBalance.toLocaleString()}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'center', borderTop: '2px solid #f1f5f9', paddingTop: '20px' }}>
                <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', margin: 0, letterSpacing: '1px' }}>
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