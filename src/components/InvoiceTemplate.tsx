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
  return (
    <>
      {/* 1. PRINT SPECIFIC CSS - Ye alignment ko fix karega */}
      <style>
        {`
          @media print {
            @page { margin: 10mm; size: auto; }
            body { margin: 0; }
            .print-container { width: 100% !important; margin: 0 !important; padding: 0 !important; }
            table { page-break-inside: auto; width: 100% !important; }
            tr { page-break-inside: avoid; page-break-after: auto; }
            thead { display: table-header-group; }
            tfoot { display: table-footer-group; }
          }
        `}
      </style>

      <div  
        ref={ref}  
        className="print-container"
        style={{  
          width: '794px', 
          backgroundColor: 'white',  
          fontFamily: 'Arial, sans-serif',
          color: '#1e293b',
          margin: '0 auto',
          padding: '0',
          display: 'block'
        }}
      >
        <div style={{ width: '100%', height: '8px', backgroundColor: '#059669' }}></div>

        <div style={{ padding: '40px 50px' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#059669', margin: 0 }}>{shopName}</h1>
              <p style={{ fontSize: '12px', color: '#64748b' }}>Digital Khata Report</p>
            </div>
            <div style={{ textAlign: 'right', fontSize: '12px' }}>
              <strong>Date:</strong> {new Date().toLocaleDateString('en-GB')}
            </div>
          </div>

          {/* Customer Info */}
          <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #e2e8f0' }}>
            <p style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 5px 0' }}>Billed To:</p>
            <p style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>{customerName}</p>
            <p style={{ fontSize: '14px', color: '#475569', margin: 0 }}>{customerPhone}</p>
          </div>

          {/* Table - Added fixed widths to columns */}
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                <th style={{ padding: '12px 8px', fontSize: '12px', width: '120px' }}>Date</th>
                <th style={{ padding: '12px 8px', fontSize: '12px' }}>Description</th>
                <th style={{ padding: '12px 8px', fontSize: '12px', textAlign: 'right', width: '140px' }}>Amount (Rs)</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 8px', fontSize: '12px' }}>{t.date}</td>
                  <td style={{ padding: '12px 8px', fontSize: '13px' }}>
                    <span style={{ color: t.type === 'dr' ? '#ef4444' : '#10b981', fontWeight: 'bold', marginRight: '5px' }}>
                      {t.type === 'dr' ? '[DEBIT]' : '[CREDIT]'}
                    </span>
                    {t.type === 'dr' ? 'Udhar Diya' : 'Paisa Mila'}
                  </td>
                  <td style={{ padding: '12px 8px', fontSize: '14px', fontWeight: 'bold', textAlign: 'right', color: t.type === 'dr' ? '#ef4444' : '#10b981' }}>
                    {t.type === 'dr' ? `+ ${t.amount.toLocaleString()}` : `- ${t.amount.toLocaleString()}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total Section - Using clear alignment */}
          <div style={{ marginTop: '30px', width: '100%', pageBreakInside: 'avoid' }}>
            <div style={{ borderTop: '2px solid #1e293b', paddingTop: '15px', width: '220px', marginLeft: 'auto', textAlign: 'right' }}>
              <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>
                Net Balance
              </div>
              <div style={{ fontSize: '26px', fontWeight: '900', color: '#1e293b', marginTop: '5px' }}>
                <span style={{ fontSize: '14px', marginRight: '4px' }}>Rs</span>
                {totalBalance.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ marginTop: '50px', textAlign: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '20px', pageBreakInside: 'avoid' }}>
            <p style={{ fontSize: '10px', color: '#94a3b8' }}>
              Generated via {shopName} Digital Khata - 2026
            </p>
          </div>
        </div>
      </div>
    </>
  );
});

export default InvoiceTemplate;