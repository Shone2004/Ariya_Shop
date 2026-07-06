import { useState } from 'react'
import PageHead from '../components/common/PageHead.jsx'
import OrderDrawer from '../components/orders/OrderDrawer.jsx'
import OrderTable from '../components/orders/OrderTable.jsx'

function OrdersPage({ orders, save, notify }) {
  const [selected, setSelected] = useState(null)
  const [query, setQuery] = useState('')
  const list = orders.filter(o => {
    const orderId = `${o._id || o.id || ''}`.toLowerCase();
    const customerName = `${o.customer || (o.user && o.user.name) || ''}`.toLowerCase();
    const customerEmail = `${o.customerEmail || (o.user && o.user.email) || ''}`.toLowerCase();
    const items = o.products || o.orderItems || [];
    const productNames = items.map(p => `${p.name || ''}`.toLowerCase()).join(' ');
    
    const searchStr = `${orderId} ${customerName} ${customerEmail} ${productNames}`;
    return searchStr.includes(query.toLowerCase());
  });

  const update = (id, patch) => {
    save(orders.map(o => (o._id === id || o.id === id) ? { ...o, ...patch } : o))
    setSelected(s => (s?._id === id || s?.id === id) ? { ...s, ...patch } : s)
    notify('Order tracking updated')
  }

  return (
    <>
      <PageHead eyebrow="FULFILMENT" title="Orders" text="Manage payment, fulfilment, tracking and delivery from one place." />
      <div className="order-summary">
        <div><span>Needs action</span><b>{orders.filter(o => o.status === 'Processing').length}</b></div>
        <div><span>Ready to ship</span><b>{orders.filter(o => o.status === 'Confirmed').length}</b></div>
        <div><span>In transit</span><b>{orders.filter(o => o.status === 'Shipped').length}</b></div>
        <div><span>Delivered</span><b>{orders.filter(o => o.status === 'Delivered').length}</b></div>
      </div>
      <div className="toolbar">
        <label className="search">⌕<input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search order or customer…" /></label>
        <select><option>All order statuses</option><option>Processing</option><option>Shipped</option></select>
        <button className="secondary" onClick={() => notify('Orders exported')}>⇩ Export orders</button>
      </div>
      <div className="card table-card"><OrderTable orders={list} onOpen={setSelected} /></div>
      {selected && <OrderDrawer order={orders.find(o => (o._id === selected._id || o.id === selected.id)) || selected} close={() => setSelected(null)} update={update} />}
    </>
  )
}

export default OrdersPage
