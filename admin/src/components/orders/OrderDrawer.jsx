import { useState } from 'react'
import { formatMoney } from '../../utils/formatters.js'
import offerBrochure from '../../assets/offer.jpeg'

function OrderDrawer({ order, close, update }) {
  const [tracking, setTracking] = useState(order.tracking || '')
  const [isPaid, setIsPaid] = useState(
    order.isPaid === true || order.isPaid === 'Paid' || order.isPaid === 'paid' || order.payment === 'Paid'
  )
  const [selectedStatus, setSelectedStatus] = useState(order.status || 'Pending')
  const [showOffer, setShowOffer] = useState(false)

  const steps = ['Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered']
  const current = steps.indexOf(selectedStatus)
  const id = order._id || order.id

  const items = order.products || order.orderItems || []
  const shippingAddress = order.shippingAddress || {}

  // Safe subtotal fallback calculation
  const calculatedItemsPrice = items.reduce((acc, item) => {
    return acc + (item.price || 0) * (item.quantity || 1)
  }, 0)

  const itemsPrice = order.itemsPrice ?? calculatedItemsPrice
  const shippingPrice = order.shippingPrice ?? 99 // Fixed ₹99 shipping charge
  const taxPrice = order.taxPrice ?? 0
  const totalPrice = order.total ?? order.totalPrice ?? (itemsPrice + shippingPrice + taxPrice)

  const handleSave = () => {
    const finalStatus = selectedStatus === 'Confirmed' ? 'Processing' : selectedStatus
    update(id, { tracking, isPaid, status: finalStatus })
  }

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
            {(order.customer || (order.user && order.user.name) || 'G').split(' ').map(x => x[0]).join('').toUpperCase()}
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

        {/* Customer Note */}
        {order.note && (
          <div className="note-box" style={{ padding: '12px', backgroundColor: '#fff9e6', border: '1px solid #ffd880', borderRadius: '10px', marginBottom: '20px' }}>
            <span style={{ fontSize: '10px', color: '#b88a44', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>CUSTOMER NOTE / INSTRUCTIONS</span>
            <p style={{ margin: 0, fontSize: '13px', color: '#2e241c', fontStyle: 'italic', whiteSpace: 'pre-wrap' }}>
              "{order.note}"
            </p>
          </div>
        )}

        {/* Ordered Items List */}
        <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', letterSpacing: '1px', color: '#b88a44', fontWeight: 'bold' }}>ORDERED ITEMS</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #ece7df', paddingBottom: '16px' }}>
          {items.map((item, idx) => {
            const itemPrice = item.price || 0
            const itemQuantity = item.quantity || 1
            const subtotal = itemPrice * itemQuantity

            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <img 
                  src={item.image || 'https://via.placeholder.com/40?text=Product'} 
                  alt={item.name} 
                  style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #ece7df', backgroundColor: '#f9f6f0' }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/40?text=Product'
                  }}
                />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <b style={{ fontSize: '13px', color: '#2e241c' }}>{item.name}</b>
                  <span style={{ fontSize: '11px', color: '#8c8276' }}>
                    {itemQuantity} × {formatMoney(itemPrice)}
                    {item.selectedSize ? ` | Size: ${item.selectedSize}` : ''}
                  </span>
                </div>
                <b style={{ fontSize: '13px', color: '#2e241c' }}>{formatMoney(subtotal)}</b>
              </div>
            )
          })}
        </div>

        {/* Financial Summary */}
        <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', letterSpacing: '1px', color: '#b88a44', fontWeight: 'bold' }}>ORDER SUMMARY</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', backgroundColor: '#fdfdfc', border: '1px solid #ece7df', borderRadius: '8px', marginBottom: '20px', fontSize: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#8c8276' }}>Items Subtotal</span>
            <b>{formatMoney(itemsPrice)}</b>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#8c8276' }}>Shipping Charge</span>
            <span>{formatMoney(shippingPrice)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#8c8276' }}>Tax</span>
            <span>{formatMoney(taxPrice)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #ece7df', paddingTop: '8px', marginTop: '4px', fontSize: '14px' }}>
            <span style={{ fontWeight: 'bold', color: '#2e241c' }}>Total</span>
            <b style={{ color: '#b88a44' }}>{formatMoney(totalPrice)}</b>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #ece7df', paddingTop: '8px', marginTop: '4px', fontSize: '11px', color: '#8c8276' }}>
            <span>Payment Method: <b>{order.paymentMethod ? String(order.paymentMethod).toUpperCase() : 'RAZORPAY'}</b></span>
            <span>Status: <b style={{ color: isPaid ? '#2e7d32' : '#c62828' }}>{isPaid ? 'Paid' : 'Pending'}</b></span>
          </div>
        </div>

        {/* Offer Brochure Section */}
        <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', letterSpacing: '1px', color: '#b88a44', fontWeight: 'bold' }}>PROMOTIONAL OFFER</h4>
        <div style={{ marginBottom: '20px', padding: '12px', border: '1px solid #ece7df', borderRadius: '8px', backgroundColor: '#fcfbf9' }}>
          <button 
            type="button"
            onClick={() => setShowOffer(!showOffer)}
            style={{ width: '100%', padding: '8px', backgroundColor: '#b88a44', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
          >
            {showOffer ? 'Hide Offer Brochure' : 'View Included Offer Brochure'}
          </button>
          
          {showOffer && (
            <div style={{ marginTop: '12px', textAlign: 'center' }}>
              <img 
                src={offerBrochure} 
                alt="Special Offer Brochure" 
                style={{ width: '100%', borderRadius: '6px', border: '1px solid #ece7df', objectFit: 'contain' }}
              />
              <a 
                href={offerBrochure} 
                download="offer-brochure.jpeg"
                style={{ display: 'inline-block', marginTop: '8px', fontSize: '11px', color: '#b88a44', fontWeight: 'bold', textDecoration: 'underline' }}
              >
                Download Brochure
              </a>
            </div>
          )}
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
              value={selectedStatus} 
              onChange={e => setSelectedStatus(e.target.value)}
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
            onClick={handleSave}
            style={{ padding: '10px', backgroundColor: '#2e241c', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}
          >
            Save tracking update
          </button>
          
          {tracking && (
            <div className="tracking-box" style={{ padding: '12px', backgroundColor: '#fcfbf9', border: '1px solid #ece7df', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <small style={{ fontSize: '10px', color: '#b88a44', fontWeight: 'bold' }}>ACTIVE TRACKING NUMBER</small>
              <b style={{ fontSize: '13px', color: '#2e241c' }}>{tracking}</b>
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