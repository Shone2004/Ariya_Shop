import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Blog from "./pages/Blog";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import { ShopProvider } from "./context/ShopContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import CartDrawer from "./components/CartDrawer";
import LoginModal from "./components/LoginModal";
import Admin from "./pages/Admin";
import AdminRoute from "./components/AdminRoute";

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />
      {!isAdmin && <Navbar />}
      {!isAdmin && <CartDrawer />}
      {!isAdmin && <LoginModal />}

      <main className={isAdmin ? "" : "min-h-screen"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/wishlist" element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          } />
          <Route path="/cart" element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/admin/*" element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          } />
        </Routes>
      </main>

      {!isAdmin && <Footer />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <ShopProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AppContent />
        </BrowserRouter>
      </ShopProvider>
    </AuthProvider>
  );
}


export default App;