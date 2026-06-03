import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "../components/layout/Header.jsx";
import Footer from "../components/layout/Footer.jsx";
import { useSettings } from "../store/settingsStore.js";
import { useCart } from "../store/cartStore.js";
import { useWishlist } from "../store/wishlistStore.js";
import { useAuth } from "../store/authStore.js";

const MainLayout = () => {
  const location = useLocation();
  const { fetchSettings } = useSettings();
  const { fetchCart } = useCart();
  const { fetchWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
      fetchWishlist();
    }
  }, [isAuthenticated, fetchCart, fetchWishlist]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
