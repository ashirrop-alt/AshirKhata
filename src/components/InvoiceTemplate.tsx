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
            padding: '35px 45px', // Slightly reduced to keep footer on page
            backgroundColor: 'white',
            width: '100%',
            minHeight: '290mm', // Safe height to avoid blank 2nd page
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
          }}
        >
          {pageIndex === 0 && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
                <div>
                  <h1 style={{ fontSize: '26px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>{shopName}</h1>
                  <p style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', margin: 0 }}>Digital Khata Report</p>
                </div>
                <div style={{ textAlign: 'right', fontSize: '12px', color: '#475569' }}>
                  <strong style={{ color: '#1e293b' }}>Date:</strong> {formattedDate}
                </div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '25px', border: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '9px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 5px 0' }}>Billed To:</p>
                <p style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#1e293b' }}>{customerName}</p>
                <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>{customerPhone}</p>
              </div>
            </>
          )}

          {pageIndex > 0 && <div style={{ height: '20px' }}></div>}

          <div style={{ flex: 1 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <thead>
                <tr style={{ backgroundColor: '#1e293b' }}>
                  <th style={{ width: '100px', padding: '10px', fontSize: '11px', color: 'white', textAlign: 'left' }}>DATE</th>
                  <th style={{ width: '140px', padding: '10px', fontSize: '11px', color: 'white', textAlign: 'left' }}>TYPE</th>
                  <th style={{ padding: '10px', fontSize: '11px', color: 'white', textAlign: 'left' }}>REMARKS</th>
                  <th style={{ width: '120px', padding: '10px', fontSize: '11px', color: 'white', textAlign: 'right' }}>AMOUNT (Rs)</th>
                </tr>
              </thead>
              <tbody>
                {pageEntries.map((t) => (
                  <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px', fontSize: '11px', color: '#475569' }}>{t.date}</td>
                    <td style={{ padding: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          backgroundColor: t.type === 'dr' ? '#fef2f2' : '#ecfdf5',
                          color: t.type === 'dr' ? '#ef4444' : '#10b981',
                          fontSize: '8px',
                          fontWeight: '900',
                          padding: '2px 6px',
                          borderRadius: '4px',
                        }}>
                          {t.type === 'dr' ? 'DEBIT' : 'CREDIT'}
                        </span>
                        <span style={{ fontSize: '11px', color: '#1e293b', fontWeight: '600', whiteSpace: 'nowrap' }}>
                          {t.type === 'dr' ? 'Udhar Diya' : 'Paisa Mila'}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '10px', fontSize: '11px', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.remarks || '-'}
                    </td>
                    <td style={{ padding: '10px', textAlign: 'right', fontSize: '12px', fontWeight: 'bold', color: t.type === 'dr' ? '#ef4444' : '#10b981' }}>
                      {t.type === 'dr' ? `+ ${t.amount.toLocaleString()}` : `- ${t.amount.toLocaleString()}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pageIndex === pages.length - 1 && (
            <div style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <div style={{
                  width: '180px',
                  backgroundColor: '#1e293b',
                  padding: '15px',
                  borderRadius: '10px',
                  textAlign: 'right',
                  color: 'white'
                }}>
                  <div style={{ fontSize: '9px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>Net Balance</div>
                  <div style={{ fontSize: '22px', fontWeight: '900', marginTop: '2px' }}>
                    <span style={{ fontSize: '12px', marginRight: '5px', color: '#94a3b8' }}>Rs</span>
                    {totalBalance.toLocaleString()}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '15px' }}>
                <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold', margin: 0 }}>
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