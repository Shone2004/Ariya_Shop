import { useMemo, useState } from 'react'
import PageHead from '../components/common/PageHead.jsx'
import ProductModal from '../components/products/ProductModal.jsx'
import { formatMoney } from '../utils/formatters.js'

function ProductsPage({ products, save, notify, setProducts }) {
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All categories')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean))
    return ['All categories', ...Array.from(cats).sort()]
  }, [products])

  const list = useMemo(
    () => {
      const filtered = products.filter(p => {
        const matchesQuery = `${p.name} ${p.sku} ${p.category}`.toLowerCase().includes(query.toLowerCase())
        const matchesCategory = categoryFilter === 'All categories' || p.category === categoryFilter
        return matchesQuery && matchesCategory
      })

      return filtered.sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.createdAt || 0)
        const dateB = new Date(b.updatedAt || b.createdAt || 0)
        return dateB - dateA
      })
    },
    [products, query, categoryFilter],
  )

  const remove = async id => {
    if (confirm('Remove this product from the catalogue?')) {
      const targetProduct = products.find(p => p._id === id || p.id === id)
      await save(targetProduct, 'delete')
      setProducts(prev => prev.filter(p => p._id !== id && p.id !== id))
      notify('Product removed')
    }
  }

  const submit = async data => {
    const processedImages = (data.images || [])
      .map(img => typeof img === 'string' ? img : (img?.url || null))
      .filter(url => url !== null)

    const itemPayload = {
      ...data,
      price: Number(data.price),
      stock: Number(data.stock),
      images: processedImages,
    }

    const actionType = (editing && (editing._id || editing.id)) ? 'update' : 'create'
    const savedData = await save(itemPayload, actionType)

    if (savedData) {
      if (actionType === 'update') {
        setProducts(prev => prev.map(p => (p._id === savedData._id || p.id === savedData.id) ? savedData : p))
        notify('Product updated successfully!')
      } else {
        setProducts(prev => [savedData, ...prev])
        notify('Product added to database!')
      }
      setModal(false)
      setEditing(null)
    }
  }

  return (
    <>
      <PageHead eyebrow="CATALOGUE" title="Products" text="Create, edit, publish and manage your jewellery inventory.">
        <button className="primary" onClick={() => { setEditing(null); setModal(true); }}>＋ Add product</button>
      </PageHead>
      <div className="toolbar">
        <label className="search">⌕<input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products or SKU…" /></label>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="card table-card">
        <table>
          <thead>
            <tr>
              <th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map(p => (
              <tr key={p._id || p.id}>
                <td>
                  <div className="product-name">
                    {p.images?.[0] ? <img className="product-thumb" src={p.images[0]} alt="" /> : <div className="gem">◇</div>}
                    <span><b>{p.name}</b><small>{p.sku}</small></span>
                  </div>
                </td>
                <td>{p.category}</td>
                <td><b>{formatMoney(p.price)}</b></td>
                <td><span className={p.stock < 8 ? 'low' : ''}>{p.stock} units</span></td>
                <td>
                  <div className="actions">
                    <button onClick={() => { setEditing(p); setModal(true); }}>Edit</button>
                    <button className="remove" onClick={() => remove(p._id || p.id)}>Remove</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!list.length && <div className="empty">No products found.</div>}
      </div>
      {modal && <ProductModal product={editing} onClose={() => setModal(false)} onSubmit={submit} />}
    </>
  )
}

export default ProductsPage