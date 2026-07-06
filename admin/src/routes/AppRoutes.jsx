import ComingSoonPage from "../pages/ComingSoonPage.jsx";
import CustomersPage from "../pages/CustomersPage.jsx";
import DashboardPage from "../pages/DashboardPage.jsx";
import OrdersPage from "../pages/OrdersPage.jsx";
import ProductsPage from "../pages/ProductsPage.jsx";
import SupportTickets from "../pages/SupportTickets.jsx";

function AppRoutes({
  page,
  products,
  orders,
  setPage,
  setProducts,
  saveProducts,
  saveOrders,
  notify,
}) {
  // Debug: Check which page is currently active
  console.log("Current page:", page);

  if (page === "Dashboard") {
    return (
      <DashboardPage
        products={products}
        orders={orders}
        setPage={setPage}
      />
    );
  }

  if (page === "Products") {
    return (
      <>
        <ProductsPage
          products={products}
          setProducts={setProducts}
          save={saveProducts}
          notify={notify}
        />
        <ComingSoonPage title={page} />
      </>
    );
  }

  if (page === "Orders") {
    return (
      <OrdersPage
        orders={orders}
        save={saveOrders}
        notify={notify}
      />
    );
  }

  if (page === "Customers") {
    return <CustomersPage notify={notify} />;
  }

  if (page === "Support Tickets") {
    return <SupportTickets />;
  }

  return <ComingSoonPage title={page} />;
}

export default AppRoutes;