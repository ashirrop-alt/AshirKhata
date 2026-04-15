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

  // LIMIT SET TO 10 (Footer safe rahega)
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
          body { -webkit-print-color-adjust: exact; margin: 0; font-family: sans-serif; }
        }
      `}</style>

      {pages.map((pageEntries, pageIndex) => (
        <div
          key={pageIndex}
          className={pageIndex > 0 ? "page-break" : ""}
          style={{
            padding: '45px 55px',
            backgroundColor: 'white',
            minHeight: '1050px', 
            position: 'relative',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {pageIndex === 0 && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                <div>
                  <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', margin: 0 }}>{shopName}</h1>
                  <p style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold', margin: '2px 0 0 0' }}>Digital Khata Report</p>
                </div>
                <div style={{ textAlign: 'right', fontSize: '13px', color: '#475569' }}>
                  <strong style={{ color: '#1e293b' }}>Date:</strong> {formattedDate}
                </div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '18px', borderRadius: '10px', marginBottom: '30px', border: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 5px 0' }}>Billed To:</p>
                <p style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: '#1e293b' }}>{customerName}</p>
                <p style={{ fontSize: '14px', color: '#475569', margin: '2px 0 0 0', fontWeight: '500' }}>{customerPhone}</p>
              </div>
            </>
          )}

          {pageIndex > 0 && <div style={{ height: '40px' }}></div>}

          <div style={{ flex: 1 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <thead>
                <tr style={{ backgroundColor: '#1e293b', textAlign: 'left' }}>
                  {/* Fixed widths to prevent date column from shrinking */}
                  <th style={{ width: '120px', padding: '14px 15px 14px 25px', fontSize: '12px', color: 'white', fontWeight: '700' }}>DATE</th>
                  <th style={{ width: '170px', padding: '14px 15px', fontSize: '12px', color: 'white', fontWeight: '700' }}>TYPE</th>
                  <th style={{ padding: '14px 15px', fontSize: '12px', color: 'white', fontWeight: '700' }}>REMARKS</th>
                  <th style={{ width: '130px', padding: '14px 25px 14px 15px', fontSize: '12px', color: 'white', textAlign: 'right', fontWeight: '700' }}>AMOUNT (Rs)</th>
                </tr>
              </thead>
              <tbody>
                {pageEntries.map((t) => (
                  <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px 15px 16px 25px', fontSize: '12px', color: '#475569', fontWeight: '600' }}>{t.date}</td>
                    <td style={{ padding: '16px 15px', fontSize: '13px' }}>
                      <span style={{
                        display: 'inline-block',
                        backgroundColor: t.type === 'dr' ? '#fef2f2' : '#ecfdf5',
                        color: t.type === 'dr' ? '#ef4444' : '#10b981',
                        border: `1px solid ${t.type === 'dr' ? '#fee2e2' : '#d1fae5'}`,
                        fontSize: '9px',
                        fontWeight: '900',
                        padding: '0 7px',
                        borderRadius: '4px',
                        marginRight: '8px',
                        height: '22px',
                        lineHeight: '22px',
                        textAlign: 'center'
                      }}>
                        {t.type === 'dr' ? 'DEBIT' : 'CREDIT'}
                      </span>
                      <span style={{ color: '#1e293b', fontWeight: '700', fontSize: '12px' }}>
                        {t.type === 'dr' ? 'Udhar Diya' : 'Paisa Mila'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 15px', fontSize: '12px', color: '#64748b', wordWrap: 'break-word', fontWeight: '500' }}>
                      {t.remarks || '-'}
                    </td>
                    <td style={{ padding: '16px 25px 16px 15px', textAlign: 'right', fontSize: '14px', fontWeight: '800', color: t.type === 'dr' ? '#ef4444' : '#10b981' }}>
                      {t.type === 'dr' ? `+ ${t.amount.toLocaleString()}` : `- ${t.amount.toLocaleString()}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pageIndex === pages.length - 1 && (
            <div style={{ marginTop: 'auto', paddingBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '25px' }}>
                <div style={{
                  width: '210px',
                  backgroundColor: '#1e293b',
                  padding: '20px',
                  borderRadius: '12px',
                  textAlign: 'right',
                  color: 'white'
                }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Net Balance</div>
                  <div style={{ fontSize: '26px', fontWeight: '900', marginTop: '5px' }}>
                    <span style={{ fontSize: '14px', marginRight: '5px', color: '#94a3b8' }}>Rs</span>
                    {totalBalance.toLocaleString()}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'center', borderTop: '2px solid #f8fafc', paddingTop: '20px' }}>
                <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '800', margin: 0, letterSpacing: '0.5px' }}>
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