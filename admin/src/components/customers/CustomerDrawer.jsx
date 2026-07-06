import { formatMoney } from '../../utils/formatters.js'

// Avatar initials
const initials = (name = '') =>
  name.split(' ').slice(0, 2).map(w => w[0] || '').join('').toUpperCase() || '?'

// Status badge styles
const statusStyle = (s) => {
  if (s === 'Active')     return { background: '#e8f5e9', color: '#2e7d32' }
  if (s === 'Registered') return { background: '#fff8e1', color: '#e65100' }
  return                         { background: '#fce4ec', color: '#c62828' }
}

// Mini order status badge
const orderStatusStyle = (s) => {
  if (s === 'Delivered') return { background: '#e8f5e9', color: '#2e7d32' }
  if (s === 'Shipped')   return { background: '#e3f2fd', color: '#1565c0' }
  if (s === 'Cancelled') return { background: '#fce4ec', color: '#c62828' }
  return                        { background: '#fff8e1', color: '#e65100' }
}

// Section title
const SectionTitle = ({ children }) => (
  <h4 style={{ margin: '0 0 10px', fontSize: '11px', letterSpacing: '1.2px', color: '#b88a44', fontWeight: '700', textTransform: 'uppercase' }}>
    {children}
  </h4>
)

// Stat mini card
const MiniStat = ({ label, value, highlight }) => (
  <div style={{
    flex: '1 1 100px',
    background: '#fcfbf9',
    border: '1px solid #ece7df',
    borderRadius: '8px',
    padding: '12px 14px',
  }}>
    <div style={{ fontSize: '10px', color: '#8c8276', marginBottom: '4px', letterSpacing: '0.8px', textTransform: 'uppercase' }}>{label}</div>
    <div style={{ fontSize: '15px', fontWeight: '700', color: highlight ? '#b88a44' : '#2e241c' }}>{value}</div>
  </div>
)

function CustomerDrawer({ customer, close }) {
  const c = customer
  const addr = c.lastShippingAddress || {}

  const avgOrder = c.avgOrder > 0
    ? formatMoney(c.avgOrder)
    : c.orders > 0 && c.spent > 0
      ? formatMoney(Math.round(c.spent / c.orders))
      : '—'

  return (
    <div className="overlay drawer-overlay" onMouseDown={e => e.target === e.currentTarget && close()}>
      <aside className="drawer" style={{ overflowY: 'auto', maxHeight: '100vh', paddingBottom: '30px' }}>

        {/* Header */}
        <div className="modal-head">
          <div>
            <small>CUSTOMER PROFILE</small>
            <h2>#{String(c._id).slice(-8).toUpperCase()}</h2>
          </div>
          <button onClick={close}>×</button>
        </div>

        {/* Avatar + Identity */}
        <div style={{
          display: 'flex', gap: '16px', padding: '16px',
          background: 'linear-gradient(135deg, #2e241c, #4a3728)',
          borderRadius: '10px', marginBottom: '20px',
        }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg,#c9a54b,#b88a44)',
            color: '#fff', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontWeight: '700', fontSize: '18px',
            border: '2px solid rgba(201,165,75,0.6)',
          }}>
            {initials(c.name)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <b style={{ color: '#fff', fontSize: '15px' }}>{c.name}</b>
            <span style={{ fontSize: '12px', color: '#c9a54b' }}>{c.email}</span>
            <span style={{ fontSize: '10px', color: '#d4b896' }}>
              Joined {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
          <span style={{
            marginLeft: 'auto', alignSelf: 'flex-start', fontSize: '11px', fontWeight: '700',
            padding: '3px 10px', borderRadius: '20px',
            ...statusStyle(c.status),
          }}>
            {c.status}
          </span>
        </div>

        {/* Stats Row */}
        <SectionTitle>Overview</SectionTitle>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <MiniStat label="Lifetime Spend" value={c.spent > 0 ? formatMoney(c.spent) : '₹0'} highlight />
          <MiniStat label="Orders"         value={c.orders || 0} />
          <MiniStat label="Avg Order"      value={avgOrder} highlight />
          <MiniStat label="Last Purchase"  value={c.lastOrder
            ? new Date(c.lastOrder).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
            : '—'
          } />
        </div>

        {/* Preferred Payment */}
        {c.lastPaymentMethod && (
          <div style={{ marginBottom: '20px' }}>
            <SectionTitle>Preferred Payment</SectionTitle>
            <div style={{
              padding: '10px 14px', background: '#fcfbf9',
              border: '1px solid #ece7df', borderRadius: '8px',
              fontSize: '13px', color: '#2e241c', fontWeight: '600',
            }}>
              💳 {String(c.lastPaymentMethod).toUpperCase()}
            </div>
          </div>
        )}

        {/* Shipping Address */}
        {(addr.address || addr.city) && (
          <div style={{ marginBottom: '20px' }}>
            <SectionTitle>Latest Shipping Address</SectionTitle>
            <div style={{
              padding: '12px 14px', background: '#fcfbf9',
              border: '1px solid #ece7df', borderRadius: '8px',
              display: 'flex', flexDirection: 'column', gap: '2px',
            }}>
              {[
                addr.fullName,
                addr.address,
                [addr.city, addr.postalCode].filter(Boolean).join(', '),
                addr.country,
                addr.phone ? `📞 ${addr.phone}` : null,
              ].filter(Boolean).map((line, i) => (
                <span key={i} style={{ fontSize: '12px', color: '#2e241c', lineHeight: '1.5' }}>{line}</span>
              ))}
            </div>
          </div>
        )}

        {/* Recent Orders */}
        {c.recentOrders && c.recentOrders.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <SectionTitle>Recent Orders</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {c.recentOrders.map((o, idx) => {
                const firstItem = (o.orderItems || [])[0]
                const moreCount = (o.orderItems || []).length - 1
                return (
                  <div key={idx} style={{
                    padding: '12px', background: '#fcfbf9',
                    border: '1px solid #ece7df', borderRadius: '8px',
                  }}>
                    {/* Order header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <b style={{ fontSize: '12px', color: '#2e241c' }}>
                        #{String(o._id).slice(-6).toUpperCase()}
                      </b>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span style={{
                          fontSize: '10px', fontWeight: '700', padding: '2px 8px',
                          borderRadius: '20px', ...orderStatusStyle(o.status),
                        }}>{o.status}</span>
                        <b style={{ fontSize: '12px', color: '#b88a44' }}>{formatMoney(o.totalPrice)}</b>
                      </div>
                    </div>

                    {/* First item preview */}
                    {firstItem && (
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <img
                          src={firstItem.image || 'https://placehold.co/36x36/f5f1ec/c9a54b?text=?'}
                          alt={firstItem.name}
                          style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #ece7df' }}
                          onError={e => { e.target.src = 'https://placehold.co/36x36/f5f1ec/c9a54b?text=?' }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                          <span style={{ fontSize: '12px', color: '#2e241c', fontWeight: '500' }}>{firstItem.name}</span>
                          <span style={{ fontSize: '10px', color: '#8c8276' }}>
                            ×{firstItem.quantity} · {formatMoney(firstItem.price)}
                            {moreCount > 0 && <span style={{ color: '#b88a44', marginLeft: '4px' }}>+{moreCount} more</span>}
                          </span>
                        </div>
                        <span style={{ marginLeft: 'auto', fontSize: '10px', color: '#8c8276' }}>
                          {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    )}

                    {/* Payment status */}
                    <div style={{ marginTop: '8px', fontSize: '10px', color: '#8c8276', display: 'flex', gap: '12px' }}>
                      <span>💳 {String(o.paymentMethod || '').toUpperCase()}</span>
                      <span style={{ color: o.isPaid ? '#2e7d32' : '#c62828', fontWeight: '600' }}>
                        {o.isPaid ? '✓ Paid' : '⏳ Pending'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Empty orders state */}
        {(!c.recentOrders || c.recentOrders.length === 0) && (
          <div style={{ padding: '20px', textAlign: 'center', color: '#8c8276', fontSize: '13px', border: '1px dashed #ece7df', borderRadius: '8px' }}>
            No orders placed yet.
          </div>
        )}

      </aside>
    </div>
  )
}

export default CustomerDrawer
