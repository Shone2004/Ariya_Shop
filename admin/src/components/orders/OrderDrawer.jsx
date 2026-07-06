import { useState } from 'react'
import { formatMoney } from '../../utils/formatters.js'

function OrderDrawer({ order, close, update }) {
  const [tracking, setTracking] = useState(order.tracking || '')
  const [isPaid, setIsPaid] = useState(order.isPaid === true || order.isPaid === 'Paid' || order.isPaid === 'paid')
  
  // Dynamic steps as requested: Pending -> Confirmed -> Processing -> Packed -> Shipped -> Delivered
  const steps = ['Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered']
  const current = steps.indexOf(order.status)
  const id = order._id || order.id

  const items = order.products || order.orderItems || [];
  const shippingAddress = order.shippingAddress || {};

  return (
    <div className="overlay drawer-overlay" onMouseDown={e => e.target === e.currentTarget && close()}>
      <aside className="drawer" style={{ overflowY: 'auto', maxHeight: '100vh', paddingBottom: '30px' }}>
        {/* Header */}
        <div className="modal-head">
          <div>
            <small>ORDER FULFILMENT</small>
            <h2>#{order._id ? order._id.slice(-6).toUpperCase() : order.id}</h2>
          </div>
          <button onClick={close}>×</button>
        </div>

        {/* Customer Profile Box */}
        <div className="customer-box" style={{ display: 'flex', gap: '12px', padding: '16px', backgroundColor: '#fcfbf9', border: '1px solid #ece7df', borderRadius: '10px', marginBottom: '20px' }}>
          <div className="avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#b88a44', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' }}>
            {(order.customer || 'G').split(' ').map(x => x[0]).join('').toUpperCase()}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <b style={{ color: '#2e241c', fontSize: '14px' }}>{order.customer || (order.user && order.user.name) || 'Guest'}</b>
            <span style={{ fontSize: '11px', color: '#8c8276' }}>Email: {order.customerEmail || (order.user && order.user.email) || 'N/A'}</span>
            <span style={{ fontSize: '11px', color: '#8c8276' }}>Phone: {shippingAddress.phone || 'N/A'}</span>
            <span style={{ fontSize: '11px', color: '#8c8276', lineHeight: '1.4' }}>
              Address: {shippingAddress.address || ''}, {shippingAddress.city || ''}, {shippingAddress.postalCode || ''}, {shippingAddress.country || 'India'}
            </span>
          </div>
        </div>

        {/* Ordered Items List */}
        <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', letterSpacing: '1px', color: '#b88a44', fontWeight: 'bold' }}>ORDERED ITEMS</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #ece7df', paddingBottom: '16px' }}>
          {items.map((item, idx) => {
            const itemPrice = item.price || 0;
            const itemQuantity = item.quantity || 1;
            const subtotal = itemPrice * itemQuantity;

            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', gap: '12px' }}>
                <img 
                  src={item.image || 'https://via.placeholder.com/40?text=Product'} 
                  alt={item.name} 
                  style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #ece7df', backgroundColor: '#f9f6f0' }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/40?text=Product';
                  }}
                />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <b style={{ fontSize: '13px', color: '#2e241c' }}>{item.name}</b>
                  <span style={{ fontSize: '11px', color: '#8c8276' }}>
                    {itemQuantity} × {formatMoney(itemPrice)}
                  </span>
                </div>
                <b style={{ fontSize: '13px', color: '#2e241c' }}>{formatMoney(subtotal)}</b>
              </div>
            );
          })}
        </div>

        {/* Financial Summary */}
        <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', letterSpacing: '1px', color: '#b88a44', fontWeight: 'bold' }}>ORDER SUMMARY</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', backgroundColor: '#fdfdfc', border: '1px solid #ece7df', borderRadius: '8px', marginBottom: '20px', fontSize: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#8c8276' }}>Items Subtotal</span>
            <b>{formatMoney(order.itemsPrice || order.total - (order.shippingPrice || 0))}</b>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#8c8276' }}>Shipping</span>
            <span>{order.shippingPrice ? formatMoney(order.shippingPrice) : 'Free'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#8c8276' }}>Tax</span>
            <span>{order.taxPrice ? formatMoney(order.taxPrice) : '₹0.00'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #ece7df', paddingTop: '8px', marginTop: '4px', fontSize: '14px' }}>
            <span style={{ fontWeight: 'bold', color: '#2e241c' }}>Total</span>
            <b style={{ color: '#b88a44' }}>{formatMoney(order.total || order.totalPrice)}</b>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #ece7df', paddingTop: '8px', marginTop: '4px', fontSize: '11px', color: '#8c8276' }}>
            <span>Payment Method: <b>{order.paymentMethod ? String(order.paymentMethod).toUpperCase() : 'RAZORPAY'}</b></span>
            <span>Status: <b style={{ color: order.payment === 'Paid' ? '#2e7d32' : '#c62828' }}>{order.payment || 'Pending'}</b></span>
          </div>
        </div>

        {/* Timeline */}
        <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', letterSpacing: '1px', color: '#b88a44', fontWeight: 'bold' }}>FULFILMENT TIMELINE</h4>
        <div className="timeline" style={{ marginBottom: '20px' }}>
          {steps.map((s, i) => (
            <div className={i <= current ? 'done' : ''} key={s} style={{ display: 'flex', gap: '12px', marginBottom: '12px', position: 'relative' }}>
              <i style={{ 
                width: '20px', 
                height: '20px', 
                borderRadius: '50%', 
                backgroundColor: i <= current ? '#b88a44' : '#ece7df', 
                color: '#fff', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '10px',
                fontStyle: 'normal',
                fontWeight: 'bold',
                zIndex: 2
              }}>
                {i < current ? '✓' : i + 1}
              </i>
              <span style={{ display: 'flex', flexDirection: 'column' }}>
                <b style={{ fontSize: '12px', color: i <= current ? '#2e241c' : '#8c8276' }}>{s}</b>
                <small style={{ fontSize: '10px', color: '#8c8276' }}>{i <= current ? 'Completed / active' : 'Waiting'}</small>
              </span>
            </div>
          ))}
        </div>

        {/* Actions Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid #ece7df', paddingTop: '16px' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', fontWeight: 'bold', color: '#b88a44' }}>
            ORDER STATUS
            <select 
              value={order.status} 
              onChange={e => update(id, { status: e.target.value })}
              style={{ padding: '8px 12px', border: '1px solid #d1c7bd', borderRadius: '6px', font: 'inherit', width: '100%', backgroundColor: '#fff' }}
            >
              {[...steps, 'Cancelled'].map(s => <option key={s}>{s}</option>)}
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', fontWeight: 'bold', color: '#b88a44' }}>
            PAYMENT STATUS
            <select 
              value={isPaid ? "Paid" : "Pending"} 
              onChange={e => setIsPaid(e.target.value === "Paid")}
              style={{ padding: '8px 12px', border: '1px solid #d1c7bd', borderRadius: '6px', font: 'inherit', width: '100%', backgroundColor: '#fff' }}
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', fontWeight: 'bold', color: '#b88a44' }}>
            COURIER TRACKING / AWB
            <input 
              value={tracking} 
              onChange={e => setTracking(e.target.value)} 
              placeholder="Enter tracking number" 
              style={{ padding: '8px 12px', border: '1px solid #d1c7bd', borderRadius: '6px', font: 'inherit', width: '100%' }}
            />
          </label>

          <button 
            className="primary full" 
            onClick={() => update(id, { tracking, isPaid, status: order.status === 'Confirmed' ? 'Processing' : order.status })}
            style={{ padding: '10px', backgroundColor: '#2e241c', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}
          >
            Save tracking update
          </button>
          
          {order.tracking && (
            <div className="tracking-box" style={{ padding: '12px', backgroundColor: '#fcfbf9', border: '1px solid #ece7df', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <small style={{ fontSize: '10px', color: '#b88a44', fontWeight: 'bold' }}>ACTIVE TRACKING NUMBER</small>
              <b style={{ fontSize: '13px', color: '#2e241c' }}>{order.tracking}</b>
            </div>
          )}
          
          <button 
            className="secondary full" 
            onClick={() => window.print()}
            style={{ padding: '10px', backgroundColor: '#fff', color: '#2e241c', border: '1px solid #2e241c', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}
          >
            Print invoice
          </button>
        </div>
      </aside>
    </div>
  )
}

export default OrderDrawer
