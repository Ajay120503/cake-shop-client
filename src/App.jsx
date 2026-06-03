import React, { lazy, Suspense, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./store/authStore.js";
import { useSettings } from "./store/settingsStore.js";

// Layouts
import MainLayout from "./layouts/MainLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import Loader from "./components/ui/Loader.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

// Lazy loaded pages
const Home = lazy(() => import("./pages/Home/Home.jsx"));
const Shop = lazy(() => import("./pages/Shop/Shop.jsx"));
const ProductDetail = lazy(() => import("./pages/Product/ProductDetail.jsx"));
const Cart = lazy(() => import("./pages/Cart/Cart.jsx"));
const Checkout = lazy(() => import("./pages/Checkout/Checkout.jsx"));
const OrderSuccess = lazy(() => import("./pages/Checkout/OrderSuccess.jsx"));
const Login = lazy(() => import("./pages/Auth/Login.jsx"));
const Register = lazy(() => import("./pages/Auth/Register.jsx"));
const ForgotPassword = lazy(() => import("./pages/Auth/ForgotPassword.jsx"));
const ResetPassword = lazy(() => import("./pages/Auth/ResetPassword.jsx"));
const Profile = lazy(() => import("./pages/Account/Profile.jsx"));
const MyOrders = lazy(() => import("./pages/Account/MyOrders.jsx"));
const OrderDetail = lazy(() => import("./pages/Account/OrderDetail.jsx"));
const Wishlist = lazy(() => import("./pages/Account/Wishlist.jsx"));
const Addresses = lazy(() => import("./pages/Account/Addresses.jsx"));
const ChangePassword = lazy(() => import("./pages/Account/ChangePassword.jsx"));
const MyReviews = lazy(() => import("./pages/Account/MyReviews.jsx"));
const About = lazy(() => import("./pages/Static/About.jsx"));
const Contact = lazy(() => import("./pages/Static/Contact.jsx"));
const FAQ = lazy(() => import("./pages/Static/FAQ.jsx"));
const NotFound = lazy(() => import("./pages/Static/NotFound.jsx"));

// Admin pages
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard.jsx"));
const AdminProducts = lazy(() => import("./pages/Admin/AdminProducts.jsx"));
const AdminCategories = lazy(() => import("./pages/Admin/AdminCategories.jsx"));
const AdminOrders = lazy(() => import("./pages/Admin/AdminOrders.jsx"));
const AdminCustomers = lazy(() => import("./pages/Admin/AdminCustomers.jsx"));
const AdminCoupons = lazy(() => import("./pages/Admin/AdminCoupons.jsx"));
const AdminReviews = lazy(() => import("./pages/Admin/AdminReviews.jsx"));
const AdminSettings = lazy(() => import("./pages/Admin/AdminSettings.jsx"));

function App() {
  const { checkAuth } = useAuth();
  const { fetchSettings } = useSettings();

  // Check auth and fetch settings on mount
  useEffect(() => {
    checkAuth();
    fetchSettings();
  }, [checkAuth, fetchSettings]);

  return (
    <Suspense fallback={<Loader fullScreen />}>
      <Routes>
        {/* Public routes with main layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-success/:id"
            element={
              <ProtectedRoute>
                <OrderSuccess />
              </ProtectedRoute>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />

          {/* Account */}
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/orders"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/addresses"
            element={
              <ProtectedRoute>
                <Addresses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/my-reviews"
            element={
              <ProtectedRoute>
                <MyReviews />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Auth routes without main layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
