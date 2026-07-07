import { useMemo, useState, useEffect } from 'react'
import './Admin.css'
import { useNavigate } from "react-router-dom";
// import SupportTickets from "../../../admin/src/pages/SupportTickets";

const seedProducts = [
  { id: 1048, name: 'Celestial Diamond Ring', sku: 'AR-RNG-048', category: 'Rings', price: 249000, stock: 12, status: 'Published' },
  { id: 1047, name: 'Serpentine Gold Necklace', sku: 'AR-NCK-047', category: 'Necklaces', price: 185000, stock: 4, status: 'Low stock' },
  { id: 1046, name: 'Aurora Pearl Earrings', sku: 'AR-EAR-046', category: 'Earrings', price: 89000, stock: 18, status: 'Published' },
  { id: 1045, name: 'Eternity Tennis Bracelet', sku: 'AR-BRC-045', category: 'Bracelets', price: 320000, stock: 7, status: 'Draft' },
]

const seedOrders = [
  { id: 'AR-8429', customer: 'Maya Thompson', date: '30 Jun 2026', total: 249000, payment: 'Paid', status: 'Processing', tracking: '' },
  { id: 'AR-8428', customer: 'Olivia Chen', date: '30 Jun 2026', total: 89000, payment: 'Paid', status: 'Confirmed', tracking: '' },
  { id: 'AR-8427', customer: 'Sophia Williams', date: '29 Jun 2026', total: 405000, payment: 'Paid', status: 'Shipped', tracking: 'AWB29048162' },
  { id: 'AR-8426', customer: 'Isabella Moore', date: '29 Jun 2026', total: 185000, payment: 'Paid', status: 'Delivered', tracking: 'AWB29047011' },
]

const nav = [
  'Dashboard', 'Products', 'Orders', 'Customers',   "Support Tickets",
//  'Reviews', 'Banners', 'Analytics', 'Settings','Categories',
]
const symbols = {
   Dashboard:'⌂', Products:'◇', Orders:'▣', Customers:'♙',"Support Tickets":'%', 
    // Categories:'◫', Reviews:'☆', Banners:'▧', Analytics:'↗', Settings:'⚙',
     Logout: '↩' 
    }

const money = value => `₹${Number(value).toLocaleString('en-IN')}`
const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) || fallback } catch { return fallback } }

const Admin = () => {
  const [page, setPage] = useState('Dashboard')
  const [products, setProducts] = useState(() => read('ariya-products', seedProducts))
  const [orders, setOrders] = useState(() => read('ariya-orders', seedOrders))
  const [toast, setToast] = useState('')
  const notify = message => { setToast(message); setTimeout(() => setToast(''), 2600) }
  const saveProducts = next => { setProducts(next); localStorage.setItem('ariya-products', JSON.stringify(next)) }
  const saveOrders = next => { setOrders(next); localStorage.setItem('ariya-orders', JSON.stringify(next)) }
const navigate = useNavigate();

const handleLogout = () => {
  // Clear login data
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("isAdmin");

  // Redirect to Home page
  navigate("/");
};
return <div id="admin-root"><div className="app">
    <aside>
      <div className="brand"><span>A</span><div><b>ARIYA</b><small>FINE JEWELLERY</small></div></div>
      
      <nav>
        {/* Main navigation items */}
        {nav.map(item => (
          <button key={item} onClick={() => setPage(item)} className={page === item ? 'active' : ''}>
            <i>{symbols[item]}</i>{item}
            {item === 'Orders' && <em>{orders.filter(o => !['Delivered','Cancelled'].includes(o.status)).length}</em>}
          </button>
        ))}
        
        {/* Separator line for visual distinction */}
        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '12px 0' }} />
        
        {/* Logout Button */}
        <button 
          onClick={() => setPage('Logout')} 
          className={page === 'Logout' ? 'active' : ''}
          style={{ color: '#e05252', marginTop: 'auto' }}
        >
          <i>{symbols.Logout}</i>Logout
        </button>
      </nav>

      <div className="admin"><div>AK</div><span><b>Aisha Kapoor</b><small>Store owner</small></span></div>
    </aside>

    <main>
      {/* ... header and routing logic ... */}
      <section className="content">
  {page === "Dashboard" && (
    <Dashboard
      products={products}
      orders={orders}
      setPage={setPage}
    />
  )}

  {page === "Products" && (
    <Products
      products={products}
      save={saveProducts}
      notify={notify}
    />
  )}

  {page === "Orders" && (
    <Orders
      orders={orders}
      save={saveOrders}
      notify={notify}
    />
  )}

  {page === "Support Tickets" && <SupportTickets />}

  {page === "Logout" && (
    <Logout />
  )}

  {![
    "Dashboard",
    "Products",
    "Orders",
    "Support Tickets",
    "Logout",
  ].includes(page) && (
    <ComingSoon title={page} />
  )}
</section>
    </main>
  </div></div>
}

function Logout() {
  useEffect(() => {
    // Optional: Clear out any localStorage authentication markers here
    const timeout = setTimeout(() => {
      window.location.href = '/' // Direct route to home page
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="card empty large" style={{ textAlign: 'center', padding: '3rem' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔒</div>
      <h2>Logging out securely...</h2>
      <p style={{ color: '#666', marginTop: '0.5rem' }}>
        Clearing your session and returning you to Ariya Fine Jewellery.
      </p>
      <div style={{ marginTop: '1.5rem' }}>
        <a href="/" className="text-btn" style={{ textDecoration: 'underline' }}>
          Click here if you aren't redirected automatically
        </a>
      </div>
    </div>
  );
}

function Dashboard({products, orders, setPage}) {
  const revenue = orders.filter(o => o.payment === 'Paid').reduce((sum,o) => sum + o.total, 0)
  const active = orders.filter(o => !['Delivered','Cancelled'].includes(o.status)).length
  return <><div className="intro"><div><p>Tuesday, 30 June</p><h2>Good morning, Aisha.</h2><span>Here’s what’s happening with your store today.</span></div><button className="secondary">Last 30 days⌄</button></div>
    <div className="stats">
      <Stat label="Revenue" value={money(revenue)} trend="+12.8%" />
      <Stat label="Orders" value={orders.length} trend={`${active} active`} />
      <Stat label="Products" value={products.length} trend={`${products.filter(p=>p.stock<8).length} low stock`} />
      <Stat label="Customers" value="8,642" trend="+6.2%" />
    </div>
    <div className="dashboard-grid">
      <div className="card chart-card"><div className="card-head"><div><h3>Revenue overview</h3><p>Gross revenue across all channels</p></div><b>{money(revenue)}</b></div><div className="chart"><div style={{height:'34%'}}/><div style={{height:'49%'}}/><div style={{height:'43%'}}/><div style={{height:'67%'}}/><div style={{height:'76%'}}/><div style={{height:'92%'}}/></div><div className="months"><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span></div></div>
      <div className="card"><div className="card-head"><div><h3>Inventory attention</h3><p>Items needing a restock</p></div></div>{products.filter(p=>p.stock<10).map(p=><div className="stock-row" key={p.id}><div className="gem">◇</div><div><b>{p.name}</b><div className="meter"><span style={{width:`${Math.min(p.stock*10,100)}%`}}/></div></div><strong>{p.stock} left</strong></div>)}</div>
    </div>
    <div className="card table-card"><div className="card-head"><div><h3>Recent orders</h3><p>Track the latest customer purchases</p></div><button className="text-btn" onClick={()=>setPage('Orders')}>Manage orders →</button></div><OrderTable orders={orders.slice(0,4)} /></div>
  </>
}

function Stat({label,value,trend}) { return <div className="card stat"><div className="stat-icon">◇</div><span>{label}</span><h3>{value}</h3><small>↗ {trend}</small></div> }

function Products({products, save, notify}) {
  const [query,setQuery] = useState('')
  const [modal,setModal] = useState(false)
  const [editing,setEditing] = useState(null)
  const [selected,setSelected] = useState([])
  const list = useMemo(()=>products.filter(p=>`${p.name} ${p.sku} ${p.category}`.toLowerCase().includes(query.toLowerCase())),[products,query])
  const remove = id => { if(confirm('Remove this product from the catalogue?')) { save(products.filter(p=>p.id!==id)); notify('Product removed') } }
  const bulkRemove = () => { if(selected.length && confirm(`Remove ${selected.length} selected products?`)) { save(products.filter(p=>!selected.includes(p.id))); setSelected([]); notify('Selected products removed') } }
  const submit = data => {
    const item = {...data, price:Number(data.price), stock:Number(data.stock), id:editing?.id || Date.now()}
    save(editing ? products.map(p=>p.id===editing.id?item:p) : [item,...products])
    setModal(false); setEditing(null); notify(editing?'Product updated':'Product added')
  }
  return <><PageHead eyebrow="CATALOGUE" title="Products" text="Create, edit, publish and manage your jewellery inventory."><button className="primary" onClick={()=>{setEditing(null);setModal(true)}}>＋ Add product</button></PageHead>
    <div className="toolbar"><label className="search">⌕<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search products or SKU…" /></label><select><option>All categories</option><option>Rings</option><option>Necklaces</option></select>{selected.length>0&&<button className="danger" onClick={bulkRemove}>Remove selected ({selected.length})</button>}<button className="secondary" onClick={()=>notify('Catalogue exported')}>⇩ Export</button></div>
    <div className="card table-card"><table><thead><tr><th><input type="checkbox" checked={selected.length===products.length&&products.length>0} onChange={e=>setSelected(e.target.checked?products.map(p=>p.id):[])}/></th><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead><tbody>{list.map(p=><tr key={p.id}><td><input type="checkbox" checked={selected.includes(p.id)} onChange={e=>setSelected(e.target.checked?[...selected,p.id]:selected.filter(x=>x!==p.id))}/></td><td><div className="product-name">{p.images?.[0]?<img className="product-thumb" src={p.images[0].url} alt=""/>:<div className="gem">◇</div>}<span><b>{p.name}</b><small>{p.sku}</small></span></div></td><td>{p.category}</td><td><b>{money(p.price)}</b></td><td><span className={p.stock<8?'low':''}>{p.stock} units</span></td><td><Status value={p.status}/></td><td><div className="actions"><button onClick={()=>{setEditing(p);setModal(true)}}>Edit</button><button className="remove" onClick={()=>remove(p.id)}>Remove</button></div></td></tr>)}</tbody></table>{!list.length&&<div className="empty">No products found.</div>}</div>
    {modal&&<ProductModal product={editing} onClose={()=>setModal(false)} onSubmit={submit}/>}
  </>
}

function ProductModal({product,onClose,onSubmit}) {
  const [form,setForm]=useState(product||{name:'',sku:'',category:'Rings',price:'',stock:'',status:'Draft',images:[]})
  const [uploading,setUploading]=useState(false)
  const [uploadError,setUploadError]=useState('')
  const update=e=>setForm({...form,[e.target.name]:e.target.value})
  const uploadImages=async files=>{
    setUploadError('')
    const cloud=import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    const preset=import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    if(!cloud||!preset){setUploadError('Add your Cloudinary cloud name and unsigned upload preset to .env first.');return}
    const accepted=[...files].filter(file=>file.type.startsWith('image/')).slice(0,6-(form.images?.length||0))
    if(!accepted.length)return
    setUploading(true)
    try{
      const uploaded=await Promise.all(accepted.map(async file=>{
        const body=new FormData();body.append('file',file);body.append('upload_preset',preset);body.append('folder','ariya/products')
        const response=await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`,{method:'POST',body})
        if(!response.ok)throw new Error('Cloudinary rejected the upload. Check your preset settings.')
        const data=await response.json()
        return {url:data.secure_url,publicId:data.public_id,width:data.width,height:data.height}
      }))
      setForm(current=>({...current,images:[...(current.images||[]),...uploaded]}))
    }catch(error){setUploadError(error.message||'Image upload failed.')}
    finally{setUploading(false)}
  }
  const removeImage=index=>setForm({...form,images:(form.images||[]).filter((_,i)=>i!==index)})
  return <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><form className="modal product-modal" onSubmit={e=>{e.preventDefault();onSubmit(form)}}><div className="modal-head"><div><small>{product?'EDIT':'NEW'} PRODUCT</small><h2>{product?'Update product':'Add to catalogue'}</h2></div><button type="button" onClick={onClose}>×</button></div><div className="form-grid"><label className="wide">Product name<input required name="name" value={form.name} onChange={update} placeholder="e.g. Celestial Diamond Ring"/></label><label>SKU<input required name="sku" value={form.sku} onChange={update}/></label><label>Category<select name="category" value={form.category} onChange={update}><option>Rings</option><option>Necklaces</option><option>Earrings</option><option>Bracelets</option></select></label><label>Price (₹)<input required min="0" type="number" name="price" value={form.price} onChange={update}/></label><label>Stock quantity<input required min="0" type="number" name="stock" value={form.stock} onChange={update}/></label><label>Status<select name="status" value={form.status} onChange={update}><option>Draft</option><option>Published</option><option>Low stock</option></select></label><div className="wide image-section"><span>Product images <small>FIRST IMAGE IS THE THUMBNAIL · MAX 6</small></span><label className={`upload-zone ${uploading?'uploading':''}`} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();uploadImages(e.dataTransfer.files)}}><input type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple disabled={uploading} onChange={e=>uploadImages(e.target.files)}/><b>{uploading?'Uploading to Cloudinary…':'＋ Drop images here or browse'}</b><small>JPG, PNG, WebP or AVIF · up to 10 MB each</small></label>{uploadError&&<div className="upload-error">{uploadError}</div>}{form.images?.length>0&&<div className="image-grid">{form.images.map((image,index)=><div className="image-preview" key={image.publicId||image.url}><img src={image.url} alt="Product"/>{index===0&&<span>Thumbnail</span>}<button type="button" onClick={()=>removeImage(index)}>×</button></div>)}</div>}</div></div><div className="modal-actions"><button type="button" className="secondary" onClick={onClose}>Cancel</button><button disabled={uploading} className="primary">{product?'Save changes':'Add product'}</button></div></form></div>
}

function Orders({orders,save,notify}) {
  const [selected,setSelected]=useState(null)
  const [query,setQuery]=useState('')
  const list=orders.filter(o=>`${o.id} ${o.customer}`.toLowerCase().includes(query.toLowerCase()))
  const update=(id, patch)=>{save(orders.map(o=>o.id===id?{...o,...patch}:o));setSelected(s=>s?.id===id?{...s,...patch}:s);notify('Order tracking updated')}
  return <><PageHead eyebrow="FULFILMENT" title="Orders" text="Manage payment, fulfilment, tracking and delivery from one place."/>
    <div className="order-summary"><div><span>Needs action</span><b>{orders.filter(o=>o.status==='Processing').length}</b></div><div><span>Ready to ship</span><b>{orders.filter(o=>o.status==='Confirmed').length}</b></div><div><span>In transit</span><b>{orders.filter(o=>o.status==='Shipped').length}</b></div><div><span>Delivered</span><b>{orders.filter(o=>o.status==='Delivered').length}</b></div></div>
    <div className="toolbar"><label className="search">⌕<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search order or customer…" /></label><select><option>All order statuses</option><option>Processing</option><option>Shipped</option></select><button className="secondary" onClick={()=>notify('Orders exported')}>⇩ Export orders</button></div>
    <div className="card table-card"><OrderTable orders={list} onOpen={setSelected}/></div>
    {selected&&<OrderDrawer order={orders.find(o=>o.id===selected.id)||selected} close={()=>setSelected(null)} update={update}/>}
  </>
}

function OrderTable({orders,onOpen}) { return <table><thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Payment</th><th>Total</th><th>Fulfilment</th>{onOpen&&<th>Action</th>}</tr></thead><tbody>{orders.map(o=><tr key={o.id}><td><b>#{o.id}</b></td><td>{o.customer}</td><td>{o.date}</td><td><Status value={o.payment}/></td><td><b>{money(o.total)}</b></td><td><Status value={o.status}/></td>{onOpen&&<td><button className="text-btn" onClick={()=>onOpen(o)}>Track & manage →</button></td>}</tr>)}</tbody></table> }

function OrderDrawer({order,close,update}) {
  const [tracking,setTracking]=useState(order.tracking)
  const steps=['Processing','Confirmed','Shipped','Delivered']; const current=steps.indexOf(order.status)
  return <div className="overlay drawer-overlay" onMouseDown={e=>e.target===e.currentTarget&&close()}><aside className="drawer"><div className="modal-head"><div><small>ORDER MANAGEMENT</small><h2>#{order.id}</h2></div><button onClick={close}>×</button></div><div className="customer-box"><div className="avatar">{order.customer.split(' ').map(x=>x[0]).join('')}</div><div><b>{order.customer}</b><small>{order.date} · {money(order.total)}</small></div></div><h4>Fulfilment timeline</h4><div className="timeline">{steps.map((s,i)=><div className={i<=current?'done':''} key={s}><i>{i<current?'✓':i+1}</i><span><b>{s}</b><small>{i<=current?'Completed / active':'Waiting'}</small></span></div>)}</div><label>Order status<select value={order.status} onChange={e=>update(order.id,{status:e.target.value})}>{[...steps,'Cancelled'].map(s=><option key={s}>{s}</option>)}</select></label><label>Courier tracking / AWB<input value={tracking} onChange={e=>setTracking(e.target.value)} placeholder="Enter tracking number"/></label><button className="primary full" onClick={()=>update(order.id,{tracking,status:order.status==='Confirmed'?'Shipped':order.status})}>Save tracking update</button>{order.tracking&&<div className="tracking-box"><small>ACTIVE TRACKING NUMBER</small><b>{order.tracking}</b></div>}<button className="secondary full" onClick={()=>window.print()}>Print invoice</button></aside></div>
}

function Status({value}) { return <span className={`status ${String(value).toLowerCase().replace(' ','-')}`}>{value}</span> }
function PageHead({eyebrow,title,text,children}) { return <div className="page-head"><div><small>{eyebrow}</small><h2>{title}</h2><p>{text}</p></div>{children}</div> }
function ComingSoon({title}) { return <><PageHead eyebrow="ARIYA ADMIN" title={title} text={`Manage your ${title.toLowerCase()} with the same premium workflow.`}/><div className="card empty large">The {title} workspace is ready for backend integration.</div></> }

export default Admin