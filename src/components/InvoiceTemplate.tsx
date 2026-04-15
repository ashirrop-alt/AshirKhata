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

  // Items per page 12 rakha hai taake niche kafi jagah bache footer ke liye
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
    <div ref={ref} style={{ width: '210mm', margin: '0 auto', backgroundColor: 'white' }}>
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
            padding: '30px 40px', // Proper padding so text is not "chipka"
            backgroundColor: 'white',
            width: '210mm',
            height: '296mm', // Slightly less than 297 to prevent extra blank page
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
          }}
        >
          {/* Header */}
          {pageIndex === 0 && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>{shopName}</h1>
                  <p style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', margin: 0 }}>Digital Khata Report</p>
                </div>
                <div style={{ textAlign: 'right', fontSize: '12px', color: '#475569' }}>
                  <strong>Date:</strong> {formattedDate}
                </div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '9px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 4px 0' }}>Billed To:</p>
                <p style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#1e293b' }}>{customerName}</p>
                <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>{customerPhone}</p>
              </div>
            </>
          )}

          {/* Table */}
          <div style={{ flex: 1 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <thead>
                <tr style={{ backgroundColor: '#1e293b' }}>
                  <th style={{ width: '90px', padding: '10px', fontSize: '11px', color: 'white', textAlign: 'left' }}>DATE</th>
                  <th style={{ width: '140px', padding: '10px', fontSize: '11px', color: 'white', textAlign: 'left' }}>TYPE</th>
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
                          padding: '2px 4px',
                          borderRadius: '3px',
                          border: `1px solid ${t.type === 'dr' ? '#fee2e2' : '#d1fae5'}`
                        }}>
                          {t.type === 'dr' ? 'DEBIT' : 'CREDIT'}
                        </span>
                        <span style={{ fontSize: '11px', color: '#1e293b', fontWeight: '500' }}>
                          {t.type === 'dr' ? 'Udhar Diya' : 'Paisa Mila'}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 10px', fontSize: '11px', color: '#64748b', wordWrap: 'break-word' }}>
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

          {/* Footer - Fixed at bottom */}
          {pageIndex === pages.length - 1 && (
            <div style={{ paddingBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
                <div style={{
                  width: '160px',
                  backgroundColor: '#1e293b',
                  padding: '12px',
                  borderRadius: '8px',
                  textAlign: 'right',
                  color: 'white'
                }}>
                  <div style={{ fontSize: '9px', color: '#94a3b8' }}>NET BALANCE</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>Rs {totalBalance.toLocaleString()}</div>
                </div>
              </div>

              <div style={{ textAlign: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
                <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>
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