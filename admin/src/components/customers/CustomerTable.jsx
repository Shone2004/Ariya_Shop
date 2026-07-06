import { formatMoney } from '../../utils/formatters.js'

// Avatar initials helper
const initials = (name = '') =>
  name.split(' ').slice(0, 2).map(w => w[0] || '').join('').toUpperCase() || '?'

// Status badge colours
const statusStyle = (s) => {
  if (s === 'Active')     return { background: '#e8f5e9', color: '#2e7d32', border: '1px solid #a5d6a7' }
  if (s === 'Registered') return { background: '#fff8e1', color: '#e65100', border: '1px solid #ffe082' }
  return                         { background: '#fce4ec', color: '#c62828', border: '1px solid #ef9a9a' }
}

function CustomerTable({ customers, onOpen }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ textAlign: 'left' }}>Customer</th>
          <th style={{ textAlign: 'left' }}>Email</th>
          <th style={{ textAlign: 'right' }}>Orders</th>
          <th style={{ textAlign: 'right' }}>Spent</th>
          <th style={{ textAlign: 'left' }}>Last Order</th>
          <th style={{ textAlign: 'left' }}>Joined</th>
          <th style={{ textAlign: 'left' }}>Status</th>
          <th style={{ textAlign: 'left' }}>Action</th>
        </tr>
      </thead>
      <tbody>
        {customers.map(c => (
          <tr key={String(c._id)} style={{ borderBottom: '1px solid #ece7df' }}>

            {/* Customer: Avatar + Name + Short ID */}
            <td>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'linear-gradient(135deg,#c9a54b,#b88a44)',
                  color: '#fff', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontWeight: '700', fontSize: '13px',
                  flexShrink: 0,
                }}>
                  {initials(c.name)}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                  <b style={{ color: '#2e241c', fontSize: '13px' }}>{c.name}</b>
                  <span style={{ fontSize: '10px', color: '#b88a44', fontFamily: 'monospace' }}>
                    #{String(c._id).slice(-8).toUpperCase()}
                  </span>
                </div>
              </div>
            </td>

            {/* Email */}
            <td>
              <span style={{ fontSize: '12px', color: '#4a3e3d' }}>{c.email}</span>
            </td>

            {/* Orders count */}
            <td style={{ textAlign: 'right' }}>
              <b style={{ fontSize: '13px', color: '#2e241c' }}>{c.orders}</b>
            </td>

            {/* Lifetime spend */}
            <td style={{ textAlign: 'right' }}>
              <b style={{ fontSize: '13px', color: c.spent > 0 ? '#b88a44' : '#8c8276' }}>
                {c.spent > 0 ? formatMoney(c.spent) : '—'}
              </b>
            </td>

            {/* Last order date */}
            <td>
              <span style={{ fontSize: '12px', color: '#4a3e3d' }}>
                {c.lastOrder
                  ? new Date(c.lastOrder).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                  : '—'}
              </span>
            </td>

            {/* Joined date */}
            <td>
              <span style={{ fontSize: '12px', color: '#8c8276' }}>
                {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </td>

            {/* Status badge */}
            <td>
              <span style={{
                fontSize: '11px', fontWeight: '700', padding: '3px 10px',
                borderRadius: '20px', letterSpacing: '0.5px',
                ...statusStyle(c.status)
              }}>
                {c.status}
              </span>
            </td>

            {/* Action */}
            <td>
              <button
                className="text-btn"
                onClick={() => onOpen(c)}
                style={{ fontWeight: '600', color: '#b88a44', border: 'none', background: 'none', cursor: 'pointer', fontSize: '12px' }}
              >
                View →
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default CustomerTable
