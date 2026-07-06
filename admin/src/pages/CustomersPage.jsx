import { useState, useEffect, useMemo } from 'react'
import PageHead from '../components/common/PageHead.jsx'
import CustomerTable from '../components/customers/CustomerTable.jsx'
import CustomerDrawer from '../components/customers/CustomerDrawer.jsx'
import apiClient from '../utils/apiClient.js'
import { formatMoney } from '../utils/formatters.js'

// --- Summary stat card component ---
function StatCard({ icon, label, value, sub }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #ece7df',
      borderRadius: '12px',
      padding: '20px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      flex: '1 1 200px',
      minWidth: '160px',
    }}>
      <span style={{ fontSize: '22px' }}>{icon}</span>
      <span style={{ fontSize: '11px', color: '#b88a44', fontWeight: '700', letterSpacing: '1.2px', textTransform: 'uppercase' }}>{label}</span>
      <b style={{ fontSize: '24px', color: '#2e241c', fontWeight: '700', lineHeight: 1 }}>{value}</b>
      {sub && <small style={{ fontSize: '11px', color: '#8c8276' }}>{sub}</small>}
    </div>
  )
}

// --- Sort options ---
const SORT_OPTIONS = [
  { value: 'newest',    label: 'Newest First' },
  { value: 'oldest',   label: 'Oldest First' },
  { value: 'spent',    label: 'Highest Spend' },
  { value: 'orders',   label: 'Most Orders' },
  { value: 'alpha',    label: 'Alphabetical' },
]

function CustomersPage({ notify }) {
  const [customers, setCustomers] = useState([])
  const [summary, setSummary]     = useState({})
  const [loading, setLoading]     = useState(true)
  const [query, setQuery]         = useState('')
  const [sortBy, setSortBy]       = useState('newest')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selected, setSelected]   = useState(null)

  // Fetch from backend
  const fetchCustomers = async () => {
    try {
      const res  = await apiClient('/users')
      const data = await res.json()
      if (data.customers) {
        setCustomers(data.customers)
        setSummary(data.summary || {})
      }
    } catch (err) {
      console.error('Failed to fetch customers', err)
      notify && notify('Could not load customers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCustomers() }, [])

  // Filter + sort
  const list = useMemo(() => {
    let out = [...customers]

    // Search
    if (query.trim()) {
      const q = query.toLowerCase()
      out = out.filter(c =>
        c.name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        String(c._id).toLowerCase().includes(q)
      )
    }

    // Status filter
    if (statusFilter !== 'All') {
      out = out.filter(c => c.status === statusFilter)
    }

    // Sort
    switch (sortBy) {
      case 'oldest':  out.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); break
      case 'spent':   out.sort((a, b) => (b.spent || 0) - (a.spent || 0)); break
      case 'orders':  out.sort((a, b) => (b.orders || 0) - (a.orders || 0)); break
      case 'alpha':   out.sort((a, b) => (a.name || '').localeCompare(b.name || '')); break
      default:        out.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
    return out
  }, [customers, query, sortBy, statusFilter])

  // CSV Export
  const exportCSV = () => {
    const header = ['Name', 'Email', 'Orders', 'Total Spent', 'Avg Order', 'Last Order', 'Joined', 'Status']
    const rows = list.map(c => [
      c.name,
      c.email,
      c.orders,
      c.spent,
      c.avgOrder,
      c.lastOrder ? new Date(c.lastOrder).toLocaleDateString('en-IN') : '—',
      new Date(c.createdAt).toLocaleDateString('en-IN'),
      c.status,
    ])
    const csv = [header, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `ariya-customers-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
    notify && notify('Customer list exported as CSV')
  }

  return (
    <>
      <PageHead
        eyebrow="CRM"
        title="Customers"
        text="View, analyse and manage your customer base with real-time order intelligence."
      />

      {/* Summary Cards */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <StatCard  label="Total Customers"  value={summary.totalCustomers  ?? '—'} />
        <StatCard  label="Active Customers" value={summary.activeCustomers ?? '—'} sub="Placed ≥1 order" />
        <StatCard  label="New This Month"   value={summary.newThisMonth    ?? '—'} />
        <StatCard  label="Total Revenue"    value={summary.totalRevenue != null ? formatMoney(summary.totalRevenue) : '—'} sub="All customers" />
      </div>

      {/* Toolbar */}
      <div className="toolbar" style={{ marginBottom: '16px' }}>
        <label className="search">
          ⌕
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name, email or ID…"
          />
        </label>

        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Registered">Registered</option>
        </select>

        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        <button className="secondary" onClick={exportCSV}>⇩ Export CSV</button>
      </div>

      {/* Table card */}
      <div className="card table-card">
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#b88a44', fontSize: '14px' }}>
            Loading customers…
          </div>
        ) : list.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#8c8276', fontSize: '14px' }}>
            {query || statusFilter !== 'All' ? 'No customers match your search.' : 'No customers found.'}
          </div>
        ) : (
          <CustomerTable customers={list} onOpen={setSelected} />
        )}
      </div>

      {/* Drawer */}
      {selected && (
        <CustomerDrawer
          customer={customers.find(c => String(c._id) === String(selected._id)) || selected}
          close={() => setSelected(null)}
        />
      )}
    </>
  )
}

export default CustomersPage
