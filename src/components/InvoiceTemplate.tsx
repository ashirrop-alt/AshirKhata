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

const InvoiceTemplate = React.forwardRef<HTMLDivElement, InvoiceProps>(
({ customerName, customerPhone, shopName, transactions, totalBalance }, ref) => {

  return (
    <div
      ref={ref}
      style={{
        width: '794px',
        minHeight: '1120px',
        backgroundColor: 'white',
        fontFamily: 'Arial, sans-serif',
        color: '#0f172a',
        margin: '0 auto',
        position: 'relative'
      }}
    >

      {/* Top Green Bar */}
      <div style={{
        height: '6px',
        width: '100%',
        backgroundColor: '#059669'
      }} />

      <div style={{ padding: '50px 55px 40px' }}>

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '35px'
        }}>
          <div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 800,
              color: '#059669',
              margin: 0,
              letterSpacing: '-0.5px'
            }}>
              {shopName}
            </h1>

            <p style={{
              fontSize: '10px',
              color: '#94a3b8',
              marginTop: '4px',
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }}>
              Digital Khata Report
            </p>
          </div>

          <p style={{
            fontSize: '11px',
            color: '#64748b',
            marginTop: '10px'
          }}>
            Date: {new Date().toLocaleDateString('en-GB')}
          </p>
        </div>

        {/* Bill To */}
        <div style={{
          backgroundColor: '#f8fafc',
          padding: '20px 25px',
          borderRadius: '10px',
          border: '1px solid #f1f5f9',
          marginBottom: '30px'
        }}>
          <p style={{
            fontSize: '10px',
            color: '#94a3b8',
            fontWeight: 600,
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Bill To:
          </p>

          <p style={{
            fontSize: '20px',
            fontWeight: 700,
            margin: 0
          }}>
            {customerName}
          </p>

          <p style={{
            fontSize: '13px',
            color: '#64748b',
            marginTop: '4px'
          }}>
            {customerPhone}
          </p>
        </div>

        {/* Table */}
        <table style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#1e293b' }}>
              <th style={thStyleLeft}>Date</th>
              <th style={thStyle}>Description</th>
              <th style={thStyleRight}>Amount (Rs)</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((t, i) => (
              <tr key={t.id} style={{
                borderBottom: '1px solid #f1f5f9',
                backgroundColor: i % 2 ? '#fafafa' : '#ffffff'
              }}>
                <td style={tdDate}>{t.date}</td>

                <td style={tdDesc}>
                  {t.type === 'dr' ? 'Udhar Diya' : 'Paisa Mila'}
                </td>

                <td style={{
                  ...tdAmount,
                  color: t.type === 'dr' ? '#ef4444' : '#10b981'
                }}>
                  {t.type === 'dr'
                    ? `+ ${t.amount.toLocaleString()}`
                    : `- ${t.amount.toLocaleString()}`
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Balance Box */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: '40px'
        }}>
          <div style={{
            backgroundColor: '#1e293b',
            borderRadius: '16px',
            padding: '18px 22px',
            width: '230px',
            textAlign: 'center'
          }}>
            <p style={{
              fontSize: '9px',
              color: '#94a3b8',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Total Net Balance
            </p>

            <div style={{
              borderTop: '1px solid rgba(255,255,255,0.15)',
              paddingTop: '10px',
              fontSize: '26px',
              fontWeight: 800,
              color: 'white'
            }}>
              Rs {totalBalance.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '50px',
          borderTop: '1px dashed #cbd5e1',
          paddingTop: '15px',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '9px',
            color: '#94a3b8',
            letterSpacing: '1.5px',
            textTransform: 'uppercase'
          }}>
            Generated via {shopName} Digital Khata - 2026
          </p>
        </div>

      </div>
    </div>
  );
});

// Styles
const thStyle = {
  padding: '10px',
  fontSize: '10px',
  color: 'white',
  textTransform: 'uppercase' as const
};

const thStyleLeft = {
  ...thStyle,
  textAlign: 'left' as const,
  borderTopLeftRadius: '6px'
};

const thStyleRight = {
  ...thStyle,
  textAlign: 'right' as const,
  borderTopRightRadius: '6px'
};

const tdDate = {
  padding: '12px',
  fontSize: '12px',
  color: '#64748b',
  fontWeight: 600
};

const tdDesc = {
  padding: '12px',
  fontSize: '13px',
  fontWeight: 600
};

const tdAmount = {
  padding: '12px',
  textAlign: 'right' as const,
  fontSize: '13px',
  fontWeight: 700
};

export default InvoiceTemplate;