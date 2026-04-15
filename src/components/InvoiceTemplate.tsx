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

  // Items per page 10 kar diye hain taake page par niche kafi saari "saans lene ki jagah" bache
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
          body { 
            margin: 0; 
            -webkit-print-color-adjust: exact; 
          }
          .page-container {
            page-break-after: always;
            page-break-inside: avoid;
            break-after: page;
          }
        }
      `}</style>

      {pages.map((pageEntries, pageIndex) => (
        <div
          key={pageIndex}
          className="page-container"
          style={{
            padding: '40px 50px',
            backgroundColor: 'white',
            width: '210mm',
            height: '290mm', // Isay 297 se kam rakha hai taake blank page ka sawal hi khatam ho jaye
            position: 'relative',
            boxSizing: 'border-box',
            overflow: 'hidden'
          }}
        >
          {/* 1. Header Section */}
          {pageIndex === 0 && (
            <div style={{ marginBottom: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>{shopName}</h1>
                  <p style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold', marginTop: '4px' }}>Digital Khata Report</p>
                </div>
                <div style={{ textAlign: 'right', fontSize: '13px', color: '#475569' }}>
                  <span style={{ fontWeight: 'bold' }}>Date:</span> {formattedDate}
                </div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '18px', borderRadius: '10px', marginTop: '25px', border: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 6px 0' }}>Billed To:</p>
                <p style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: '#1e293b' }}>{customerName}</p>
                <p style={{ fontSize: '14px', color: '#475569', margin: '4px 0 0 0' }}>{customerPhone}</p>
              </div>
            </div>
          )}

          {/* 2. Table Section */}
          <div style={{ marginTop: pageIndex > 0 ? '20px' : '0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <thead>
                <tr style={{ backgroundColor: '#1e293b' }}>
                  <th style={{ width: '100px', padding: '12px 10px', fontSize: '11px', color: 'white', textAlign: 'left' }}>DATE</th>
                  <th style={{ width: '150px', padding: '12px 10px', fontSize: '11px', color: 'white', textAlign: 'left' }}>TYPE</th>
                  <th style={{ padding: '12px 10px', fontSize: '11px', color: 'white', textAlign: 'left' }}>REMARKS</th>
                  <th style={{ width: '120px', padding: '12px 10px', fontSize: '11px', color: 'white', textAlign: 'right' }}>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {pageEntries.map((t) => (
                  <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 10px', fontSize: '12px', color: '#475569' }}>{t.date}</td>
                    <td style={{ padding: '14px 10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          backgroundColor: t.type === 'dr' ? '#fef2f2' : '#ecfdf5',
                          color: t.type === 'dr' ? '#ef4444' : '#10b981',
                          fontSize: '9px',
                          fontWeight: 'bold',
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }}>
                          {t.type === 'dr' ? 'DEBIT' : 'CREDIT'}
                        </span>
                        <span style={{ fontSize: '12px', color: '#1e293b', fontWeight: '600' }}>
                          {t.type === 'dr' ? 'Udhar' : 'Paisa'}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 10px', fontSize: '12px', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {t.remarks || '-'}
                    </td>
                    <td style={{ padding: '14px 10px', textAlign: 'right', fontSize: '13px', fontWeight: 'bold', color: t.type === 'dr' ? '#ef4444' : '#10b981' }}>
                      {t.type === 'dr' ? `+ ${t.amount.toLocaleString()}` : `- ${t.amount.toLocaleString()}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 3. Footer Section - Hard coded to bottom with enough margin */}
          {pageIndex === pages.length - 1 && (
            <div style={{ marginTop: 'auto', paddingBottom: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '30px' }}>
                <div style={{
                  width: '180px',
                  backgroundColor: '#1e293b',
                  padding: '16px',
                  borderRadius: '12px',
                  textAlign: 'right',
                  color: 'white'
                }}>
                  <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold' }}>NET BALANCE</div>
                  <div style={{ fontSize: '22px', fontWeight: '900', marginTop: '4px' }}>Rs {totalBalance.toLocaleString()}</div>
                </div>
              </div>

              <div style={{ textAlign: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
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