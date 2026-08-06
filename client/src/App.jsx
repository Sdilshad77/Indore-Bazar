import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { ChatWidget } from "./components/ChatWidget.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import Spinner from "./components/Spinner.jsx";

const Home = lazy(() => import("./pages/Home.jsx"));
const Products = lazy(() => import("./pages/Products.jsx"));
const ProductDetail = lazy(() => import("./pages/ProductDetail.jsx"));
const ShopPage = lazy(() => import("./pages/ShopPage.jsx"));
const CartPage = lazy(() => import("./pages/CartPage.jsx"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage.jsx"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess.jsx"));
const MyOrders = lazy(() => import("./pages/MyOrders.jsx"));
const OrderDetail = lazy(() => import("./pages/OrderDetail.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const ChatPage = lazy(() => import("./pages/ChatPage.jsx"));
const ShopDashboard = lazy(() => import("./pages/shop/ShopDashboard.jsx"));
const ShopProducts = lazy(() => import("./pages/shop/ShopProducts.jsx"));
const ShopOrders = lazy(() => import("./pages/shop/ShopOrders.jsx"));
const ShopCoupons = lazy(() => import("./pages/shop/ShopCoupons.jsx"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.jsx"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers.jsx"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders.jsx"));
const AdminShops = lazy(() => import("./pages/admin/AdminShops.jsx"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Spinner />
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Header />
      <main className="flex-1 pb-24 lg:pb-8">
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
