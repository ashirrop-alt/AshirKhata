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
    <div ref={ref} style={{ width: '794px', margin: '0 auto', backgroundColor: 'white' }}>
      <style>{`
        @media print {
          @page { margin: 0; size: A4; }
          .page-break {
            display: block;
            page-break-before: always;
            break-before: always;
          }
          body { 
            -webkit-print-color-adjust: exact; 
            margin: 0; 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          }
        }
      `}</style>

      {pages.map((pageEntries, pageIndex) => (
        <div
          key={pageIndex}
          className={pageIndex > 0 ? "page-break" : ""}
          style={{
            padding: '50px 60px',
            backgroundColor: 'white',
            minHeight: '1120px', 
            position: 'relative',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {pageIndex === 0 && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '35px' }}>
                <div>
                  <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', margin: 0, letterSpacing: '-1px' }}>{shopName}</h1>
                  <p style={{ fontSize: '13px', color: '#64748b', fontWeight: '700', margin: '4px 0 0 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Digital Khata Report</p>
                </div>
                <div style={{ textAlign: 'right', fontSize: '14px', color: '#475569' }}>
                  <strong style={{ color: '#0f172a', fontWeight: '800' }}>Date:</strong> {formattedDate}
                </div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '24px', borderRadius: '12px', marginBottom: '35px', border: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '10px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', margin: '0 0 6px 0', letterSpacing: '0.5px' }}>Billed To:</p>
                <p style={{ fontSize: '22px', fontWeight: '900', margin: 0, color: '#0f172a' }}>{customerName}</p>
                <p style={{ fontSize: '15px', color: '#475569', margin: '4px 0 0 0', fontWeight: '600' }}>{customerPhone}</p>
              </div>
            </>
          )}

          {pageIndex > 0 && <div style={{ height: '40px' }}></div>}

          <div style={{ flex: 1 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <thead>
                <tr style={{ backgroundColor: '#1e293b', textAlign: 'left' }}>
                  <th style={{ width: '120px', padding: '16px 25px', fontSize: '12px', color: 'white', fontWeight: '800', letterSpacing: '0.5px' }}>DATE</th>
                  <th style={{ width: '180px', padding: '16px 25px', fontSize: '12px', color: 'white', fontWeight: '800', letterSpacing: '0.5px' }}>TYPE</th>
                  <th style={{ padding: '16px 25px', fontSize: '12px', color: 'white', fontWeight: '800', letterSpacing: '0.5px' }}>REMARKS</th>
                  <th style={{ width: '140px', padding: '16px 25px', fontSize: '12px', color: 'white', textAlign: 'right', fontWeight: '800', letterSpacing: '0.5px' }}>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {pageEntries.map((t) => (
                  <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    {/* Fixed Date Spacing with 25px padding */}
                    <td style={{ padding: '18px 25px', fontSize: '12px', color: '#475569', fontWeight: '700' }}>{t.date}</td>
                    <td style={{ padding: '18px 25px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{
                          backgroundColor: t.type === 'dr' ? '#fef2f2' : '#ecfdf5',
                          color: t.type === 'dr' ? '#ef4444' : '#10b981',
                          border: `1px solid ${t.type === 'dr' ? '#fee2e2' : '#d1fae5'}`,
                          fontSize: '10px',
                          fontWeight: '900',
                          padding: '2px 8px',
                          borderRadius: '6px',
                        }}>
                          {t.type === 'dr' ? 'DEBIT' : 'CREDIT'}
                        </span>
                        <span style={{ color: '#0f172a', fontWeight: '800', fontSize: '13px' }}>
                          {t.type === 'dr' ? 'Udhar Diya' : 'Paisa Mila'}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '18px 25px', fontSize: '13px', color: '#64748b', wordWrap: 'break-word', fontWeight: '600' }}>
                      {t.remarks || '-'}
                    </td>
                    <td style={{ padding: '18px 25px', textAlign: 'right', fontSize: '15px', fontWeight: '900', color: t.type === 'dr' ? '#ef4444' : '#10b981' }}>
                      {t.type === 'dr' ? `+ ${t.amount.toLocaleString()}` : `- ${t.amount.toLocaleString()}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pageIndex === pages.length - 1 && (
            <div style={{ marginTop: 'auto', paddingBottom: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
                <div style={{
                  width: '230px',
                  backgroundColor: '#0f172a',
                  padding: '24px',
                  borderRadius: '16px',
                  textAlign: 'right',
                  color: 'white',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Net Balance</div>
                  <div style={{ fontSize: '28px', fontWeight: '900', marginTop: '8px' }}>
                    <span style={{ fontSize: '16px', marginRight: '6px', color: '#64748b', fontWeight: '600' }}>Rs</span>
                    {totalBalance.toLocaleString()}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'center', borderTop: '2px solid #f1f5f9', paddingTop: '25px' }}>
                <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '800', margin: 0, letterSpacing: '1.5px' }}>
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