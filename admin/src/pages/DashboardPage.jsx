import OrderTable from '../components/orders/OrderTable.jsx'
import { formatMoney } from '../utils/formatters.js'

function DashboardPage({ products, orders, setPage }) {
  const revenue = orders.filter(o => o.payment === 'Paid' || o.payment === 'paid').reduce((sum, o) => sum + o.total, 0)
  const active = orders.filter(o => !['Delivered', 'Cancelled'].includes(o.status)).length

  return (
    <>
      <div className="intro">
        <div>
          <p>Wednesday, 1 July</p>
          <h2>Good morning, Aisha.</h2>
          <span>Here’s what’s happening with your store today.</span>
        </div>
        <button className="secondary">Last 30 days⌄</button>
      </div>
      <div className="stats">
        <Stat label="Revenue" value={formatMoney(revenue)} trend="+12.8%" />
        <Stat label="Orders" value={orders.length} trend={`${active} active`} />
        <Stat label="Products" value={products.length} trend={`${products.filter(p => p.stock < 8).length} low stock`} />
        <Stat label="Customers" value="8,642" trend="+6.2%" />
      </div>
      <div className="dashboard-grid">
        <div className="card chart-card">
          <div className="card-head"><div><h3>Revenue overview</h3><p>Gross revenue across all channels</p></div><b>{formatMoney(revenue)}</b></div>
          <div className="chart">
            <div style={{ height: '34%' }} />
            <div style={{ height: '49%' }} />
            <div style={{ height: '43%' }} />
            <div style={{ height: '67%' }} />
            <div style={{ height: '76%' }} />
            <div style={{ height: '92%' }} />
          </div>
          <div className="months"><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span></div>
        </div>
        <div className="card">
          <div className="card-head"><div><h3>Inventory attention</h3><p>Items needing a restock</p></div></div>
          {products.filter(p => p.stock < 10).map(p => (
            <div className="stock-row" key={p._id || p.id}>
              <div className="gem">◇</div>
              <div><b>{p.name}</b><div className="meter"><span style={{ width: `${Math.min(p.stock * 10, 100)}%` }} /></div></div>
              <strong>{p.stock} left</strong>
            </div>
          ))}
        </div>
      </div>
      <div className="card table-card">
        <div className="card-head">
          <div><h3>Recent orders</h3><p>Track the latest customer purchases</p></div>
          <button className="text-btn" onClick={() => setPage('Orders')}>Manage orders →</button>
        </div>
        <OrderTable orders={orders.slice(0, 4)} />
      </div>
    </>
  )
}

function Stat({ label, value, trend }) {
  return <div className="card stat"><div className="stat-icon">◇</div><span>{label}</span><h3>{value}</h3><small>↗ {trend}</small></div>
}

export default DashboardPage
