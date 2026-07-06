import Status from '../common/Status.jsx'
import { formatMoney } from '../../utils/formatters.js'

function OrderTable({ orders, onOpen }) {
  console.log("OrderTable Debug Log:", orders);

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ textAlign: 'left' }}>Order</th>
          <th style={{ textAlign: 'left' }}>Customer</th>
          <th style={{ textAlign: 'left' }}>Items</th>
          <th style={{ textAlign: 'left' }}>Payment</th>
          <th style={{ textAlign: 'left' }}>Total</th>
          <th style={{ textAlign: 'left' }}>Fulfilment</th>
          {onOpen && <th style={{ textAlign: 'left' }}>Action</th>}
        </tr>
      </thead>
      <tbody>
        {orders.map(o => {
          const items = o.products || o.orderItems || [];
          const displayItems = items.slice(0, 2);
          const remainingCount = items.length - 2;

          return (
            <tr key={o._id || o.id} style={{ borderBottom: '1px solid #ece7df' }}>
              {/* Order ID & Date */}
              <td>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <b>#{o._id ? o._id.slice(-6).toUpperCase() : o.id}</b>
                  <span style={{ fontSize: '11px', color: '#8c8276' }}>
                    {o.date || (o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Pending')}
                  </span>
                </div>
              </td>

              {/* Customer Stack (Name & Email) */}
              <td>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <b style={{ color: '#2e241c' }}>{o.customer || (o.user && o.user.name) || 'Guest'}</b>
                  <span style={{ fontSize: '11px', color: '#8c8276' }}>
                    {o.customerEmail || (o.user && o.user.email) || ''}
                  </span>
                </div>
              </td>

              {/* Shopify-style Products list (thumbnail, name, quantity) */}
              <td>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '6px 0' }}>
                  {displayItems.map((p, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img 
                        src={p.image || 'https://via.placeholder.com/40?text=Product'} 
                        alt={p.name} 
                        style={{ 
                          width: '28px', 
                          height: '28px', 
                          objectFit: 'cover', 
                          borderRadius: '4px', 
                          border: '1px solid #ece7df',
                          backgroundColor: '#f9f6f0'
                        }} 
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/40?text=Product';
                        }}
                      />
                      <span style={{ fontSize: '12px', color: '#4a3e3d', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px' }}>
                        {p.name} <span style={{ color: '#8c8276', fontWeight: '500' }}>×{p.quantity}</span>
                      </span>
                    </div>
                  ))}
                  {remainingCount > 0 && (
                    <span style={{ fontSize: '11px', color: '#b88a44', fontWeight: 'bold', marginLeft: '36px' }}>
                      +{remainingCount} more
                    </span>
                  )}
                </div>
              </td>

              {/* Payment Method / Status */}
              <td>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Status value={o.payment} />
                  <span style={{ fontSize: '10px', color: '#8c8276', textTransform: 'uppercase', fontWeight: '500' }}>
                    {o.paymentMethod || 'Razorpay'}
                  </span>
                </div>
              </td>

              {/* Total Price */}
              <td>
                <b>{formatMoney(o.total || o.totalPrice)}</b>
              </td>

              {/* Fulfilment Status */}
              <td>
                <Status value={o.status} />
              </td>

              {/* Manage Action */}
              {onOpen && (
                <td>
                  <button className="text-btn" onClick={() => onOpen(o)} style={{ fontWeight: '500', color: '#b88a44', border: 'none', background: 'none', cursor: 'pointer' }}>
                    Track & manage →
                  </button>
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  )
}

export default OrderTable
