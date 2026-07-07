import { useEffect, useState } from 'react'
import './App.css'
import Toast from './components/common/Toast.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import AppRoutes from './routes/AppRoutes.jsx'
import apiClient from './utils/apiClient.js'

function App() {
  const [page, setPage] = useState('Dashboard')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [toast, setToast] = useState('')

  const notify = message => {
    setToast(message)
    setTimeout(() => setToast(''), 2600)
  }

  const fetchLiveInventory = async () => {
  try {
    const response = await apiClient("/products");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch products");
    }

    setProducts(data);
  } catch (error) {
    console.error("Failed to fetch live inventory:", error);
  }
};

const fetchLiveOrders = async () => {
  try {
    const response = await apiClient("/orders");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch orders");
    }

    setOrders(data);
  } catch (error) {
    console.error("Failed to fetch live orders:", error);
  }
};

useEffect(() => {
  const params = new URLSearchParams(window.location.search);

  const urlToken = params.get("token");
  const urlUser = params.get("user");

  if (urlToken) {
    localStorage.setItem("token", urlToken);

    if (urlUser) {
      localStorage.setItem("currentUser", decodeURIComponent(urlUser));
    }

    window.history.replaceState({}, "", "/");
  }

  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href =
      "https://www.ariyashop.in/login?redirect=admin";
    return;
  }

  fetchLiveInventory();
  fetchLiveOrders();

  const interval = setInterval(() => {
    fetchLiveInventory();
    fetchLiveOrders();
  }, 5000);

  return () => clearInterval(interval);

}, []);

  const saveProducts = async (productData, actionType = 'create') => {
    try {
      let endpoint = '/products'
      let method = 'POST'
      const id = productData._id || productData.id

      if (actionType === 'update' && id) {
        endpoint = `/products/${id}`
        method = 'PUT'
      } else if (actionType === 'delete' && id) {
        endpoint = `/products/${id}`
        method = 'DELETE'
      }

      const options = {
        method
      }

      if (method !== 'DELETE') {
        options.body = JSON.stringify(productData)
      }

      const response = await apiClient(endpoint, options)
      const data = await response.json().catch(() => null)

      if (!response.ok) {
        const errorMsg = data?.message || data?.errors?.[0] || data?.error || `Status ${response.status}`
        throw new Error(errorMsg)
      }

      notify(actionType === 'delete' ? 'Product removed from shop!' : 'Product synced to shop!')
      return data
    } catch (err) {
      console.error('Database sync failed:', err)
      notify(`Sync failed: ${err.message}`)
      return null
    }
  }

  const saveOrders = async updatedOrderListOrPayload => {
    setOrders(updatedOrderListOrPayload)

    const lastUpdatedOrder = updatedOrderListOrPayload.find((o, idx) => JSON.stringify(o) !== JSON.stringify(orders[idx]))
    if (lastUpdatedOrder) {
      try {
        const id = lastUpdatedOrder._id || lastUpdatedOrder.id
        await apiClient(`/orders/${id}`, {
          method: 'PUT',
          body: JSON.stringify(lastUpdatedOrder),
        })
        notify('Order status synchronized.')
      } catch (err) {
        console.error('Failed to sync order update to server', err)
      }
    }
  }

  return (
    <AdminLayout page={page} setPage={setPage} orders={orders} overlay={<Toast message={toast} />}>
      <AppRoutes
        page={page}
        products={products}
        orders={orders}
        setPage={setPage}
        setProducts={setProducts}
        saveProducts={saveProducts}
        saveOrders={saveOrders}
        notify={notify}
      />
    </AdminLayout>
  )
}

export default App;
