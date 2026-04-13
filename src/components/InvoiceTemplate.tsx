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
          .print-page { 
            page-break-after: always !important; 
            height: 296mm; /* Exact A4 Height */
            overflow: hidden;
          }
          .print-page:last-child { page-break-after: avoid !important; height: auto; min-height: 296mm; }
        }
      `}</style>

      {pages.map((pageEntries, pageIndex) => (
        <div 
          key={pageIndex} 
          className="print-page"
          style={{ 
            padding: '40px 50px', 
            backgroundColor: 'white',
            boxSizing: 'border-box',
            position: 'relative',
            display: 'block'
          }}
        >
          {pageIndex === 0 && (
            <>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#059669', position: 'absolute', top: 0, left: 0 }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', marginTop: '10px' }}>
                <div>
                  <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>{shopName}</h1>
                  <p style={{ fontSize: '12px', color: '#059669', fontWeight: '900', margin: 0, letterSpacing: '1px' }}>DIGITAL KHATA REPORT</p>
                </div>
                <div style={{ textAlign: 'right', fontSize: '13px', color: '#64748b' }}>
                  <strong>Date:</strong> {new Date().toLocaleDateString('en-GB')}
                </div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '10px', marginBottom: '30px', border: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '10px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', margin: '0 0 5px 0' }}>Billed To:</p>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>{customerName}</p>
                <p style={{ fontSize: '14px', color: '#475569', margin: 0 }}>{customerPhone}</p>
              </div>
            </>
          )}

          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <thead>
              <tr style={{ backgroundColor: '#1e293b' }}>
                <th style={{ width: '120px', padding: '12px', fontSize: '12px', color: 'white', textAlign: 'left' }}>DATE</th>
                <th style={{ padding: '12px', fontSize: '12px', color: 'white', textAlign: 'left' }}>DESCRIPTION</th>
                <th style={{ width: '150px', padding: '12px', fontSize: '12px', color: 'white', textAlign: 'right' }}>AMOUNT (RS)</th>
              </tr>
            </thead>
            <tbody>
              {pageEntries.map((t) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '15px 12px', fontSize: '13px', color: '#64748b' }}>{t.date}</td>
                  <td style={{ padding: '15px 12px', fontSize: '14px', color: '#1e293b' }}>
                    <span style={{ 
                      display: 'inline-block',
                      backgroundColor: t.type === 'dr' ? '#fef2f2' : '#ecfdf5',
                      color: t.type === 'dr' ? '#ef4444' : '#10b981',
                      border: `1px solid ${t.type === 'dr' ? '#fee2e2' : '#d1fae5'}`,
                      fontSize: '10px',
                      fontWeight: '900',
                      padding: '0 8px',
                      borderRadius: '4px',
                      marginRight: '12px',
                      height: '24px',
                      lineHeight: '24px', // Matches height exactly for perfect centering
                      verticalAlign: 'middle',
                      textAlign: 'center'
                    }}>
                      {t.type === 'dr' ? 'DEBIT' : 'CREDIT'}
                    </span>
                    <span style={{ verticalAlign: 'middle' }}>{t.type === 'dr' ? 'Udhar Diya' : 'Paisa Mila'}</span>
                  </td>
                  <td style={{ padding: '15px 12px', textAlign: 'right', fontSize: '15px', fontWeight: '700', color: t.type === 'dr' ? '#ef4444' : '#10b981' }}>
                    {t.type === 'dr' ? `+ ${t.amount.toLocaleString()}` : `- ${t.amount.toLocaleString()}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {pageIndex === pages.length - 1 && (
            <div style={{ marginTop: '50px', textAlign: 'right' }}>
              <div style={{ 
                display: 'inline-block',
                width: '300px', 
                backgroundColor: '#1e293b', 
                padding: '25px', 
                borderRadius: '15px', 
                color: 'white',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}>
                <p style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', margin: '0 0 8px 0', textTransform: 'uppercase' }}>Net Balance</p>
                <p style={{ fontSize: '32px', fontWeight: '800', margin: 0 }}>
                  <span style={{ fontSize: '18px', marginRight: '8px', color: '#94a3b8' }}>Rs.</span>
                  {totalBalance.toLocaleString()}
                </p>
              </div>
            </div>
          )}

          <div style={{ 
            position: 'absolute', 
            bottom: '40px', 
            left: '50px', 
            right: '50px', 
            borderTop: '1px solid #f1f5f9', 
            paddingTop: '20px', 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Page {pageIndex + 1} of {pages.length}</p>
            <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', margin: 0 }}>{shopName.toUpperCase()}</p>
          </div>
        </div>
      ))}
    </div>
  );
});

export default InvoiceTemplate;