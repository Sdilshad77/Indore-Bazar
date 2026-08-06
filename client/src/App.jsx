import { Routes, Route } from "react-router-dom";
import { ChatWidget } from "./components/ChatWidget.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import ShopPage from "./pages/ShopPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import OrderDetail from "./pages/OrderDetail.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import ShopDashboard from "./pages/shop/ShopDashboard.jsx";
import ShopProducts from "./pages/shop/ShopProducts.jsx";
import ShopOrders from "./pages/shop/ShopOrders.jsx";
import ShopCoupons from "./pages/shop/ShopCoupons.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";
import AdminShops from "./pages/admin/AdminShops.jsx";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Header />
      <main className="flex-1 pb-24 lg:pb-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:pid" element={<ProductDetail />} />
          <Route path="/shops/:sid" element={<ShopPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/chat" element={<ChatPage />} />

          <Route element={<PrivateRoute />}>
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success/:oid" element={<OrderSuccess />} />
            <Route path="/orders" element={<MyOrders />} />
            <Route path="/orders/:oid" element={<OrderDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/seller/dashboard" element={<ShopDashboard />} />
            <Route path="/seller/products" element={<ShopProducts />} />
            <Route path="/seller/orders" element={<ShopOrders />} />
            <Route path="/seller/coupons" element={<ShopCoupons />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/shops" element={<AdminShops />} />
          </Route>
        </Routes>
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}