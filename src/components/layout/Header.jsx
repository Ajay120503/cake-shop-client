// Fixed Header.jsx
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  ShoppingCart,
  User,
  Heart,
  Search,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  Package,
  MapPin,
  Lock,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../store/authStore.js";
import { useCart } from "../../store/cartStore.js";
import { useWishlist } from "../../store/wishlistStore.js";
import { useTheme } from "../../context/ThemeContext.jsx";
import { useSettings } from "../../store/settingsStore.js";
import { couponAPI, productAPI } from "../../api/endpoints.js";
import { formatPrice, getPlaceholderImage } from "../../utils/helpers.js";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { getItemCount } = useCart();
  const { settings } = useSettings();
  const { wishlist } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const cartCount = getItemCount();
  const wishlistCount = wishlist?.products?.length || 0;
  const [activeCoupon, setActiveCoupon] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const searchTimeoutRef = useRef(null);

  // Fetch public coupons dynamically
  useEffect(() => {
    (async () => {
      try {
        const { data } = await couponAPI.getPublic();
        const coupons = data.data || [];
        if (coupons.length > 0) {
          setActiveCoupon(coupons[0]);
        }
      } catch {
        // ignore - fall back to no coupon
      }
    })();
  }, []);

  // Close search overlay on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && searchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [searchOpen]);

  const handleSearchNavigate = (query) => {
    if (query) {
      navigate(`/shop?search=${encodeURIComponent(query)}`);
      setSearchOpen(false);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    handleSearchNavigate(searchQuery.trim());
  };

  // Live search as user types
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const { data } = await productAPI.search(searchQuery.trim());
        setSearchResults(data.data || []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchQuery]);

  const handleLogout = async () => {
    await logout();
    setUserMenu(false);
    navigate("/");
  };

  const links = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Shop" },
    { to: "/shop?isNewArrival=true", label: "New Arrivals" },
    { to: "/shop?isBestSeller=true", label: "Best Sellers" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40">
        {/* Announcement Bar – unchanged */}
        <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-pink-600 text-white text-xs sm:text-sm py-2 text-center font-medium tracking-wide">
          <span>
            Free delivery on orders above ₹
            {settings?.freeShippingThreshold ?? 500}
            {activeCoupon && (
              <>
                &nbsp;·&nbsp; Use code{" "}
                <span className="bg-white/20 rounded px-1.5 py-0.5 font-bold tracking-widest text-xs">
                  {activeCoupon.code}
                </span>{" "}
                for{" "}
                {activeCoupon.discountType === "percentage"
                  ? `${activeCoupon.discountValue}% off`
                  : `₹${activeCoupon.discountValue} off`}
              </>
            )}
          </span>
        </div>

        {/* Main Nav – unchanged except for fixed search */}
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="container-custom">
            <div className="flex items-center justify-between h-16 sm:h-20">
              {/* Logo – unchanged */}
              <Link to="/" className="flex items-center gap-3 group">
                <div className="relative">
                  {/* Logo image – handles both object.url and direct string */}
                  {(() => {
                    const logoSrc =
                      settings?.logo?.url ||
                      (typeof settings?.logo === "string"
                        ? settings.logo
                        : null);
                    if (logoSrc) {
                      return (
                        <img
                          src={logoSrc}
                          alt={settings?.siteName || "Cake Shop"}
                          className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-110 duration-300"
                          onError={(e) => {
                            // If image fails to load, fallback to emoji
                            e.target.style.display = "none";
                            e.target.nextSibling?.classList?.remove("hidden");
                          }}
                        />
                      );
                    }
                    return (
                      <span className="text-3xl sm:text-4xl block transition-transform group-hover:scale-110 duration-300">
                        🎂
                      </span>
                    );
                  })()}
                  {/* Hidden fallback emoji in case img fails */}
                  <span className="hidden text-3xl sm:text-4xl">🎂</span>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl sm:text-2xl font-display font-bold gradient-text leading-tight">
                    {settings?.siteName || "Cake Shop"}
                  </h1>
                  <p className="text-[10px] text-gray-400 tracking-widest uppercase -mt-0.5">
                    {settings?.tagline || "Baked with love"}
                  </p>
                </div>
              </Link>

              {/* Desktop Nav – unchanged */}
              <nav className="hidden lg:flex items-center gap-0.5">
                {links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === "/"}
                    className={({ isActive }) =>
                      "relative px-3.5 py-2 rounded-lg text-sm font-medium transition-colors " +
                      (isActive
                        ? "text-primary-600 dark:text-primary-400"
                        : "text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400")
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {link.label}
                        {isActive && (
                          <motion.span
                            layoutId="nav-pill"
                            className="absolute inset-0 bg-primary-50 dark:bg-primary-900/30 rounded-lg -z-10"
                            transition={{ type: "spring", duration: 0.4 }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>

              {/* Right Actions – unchanged except for search overlay (fixed below) */}
              <div className="flex items-center gap-1">
                {/* Search button */}
                <button
                  onClick={() => {
                    setSearchOpen(true);
                    setSearchQuery("");
                  }}
                  className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-600 transition-colors"
                  aria-label="Search"
                >
                  <Search size={20} />
                </button>

                {/* Theme toggle – unchanged */}
                {/* <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-600 transition-colors hidden sm:flex"
                  aria-label="Toggle theme"
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={theme}
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {theme === "light" ? (
                        <Moon size={20} />
                      ) : (
                        <Sun size={20} />
                      )}
                    </motion.span>
                  </AnimatePresence>
                </button> */}

                {/* Wishlist – unchanged */}
                <Link
                  to="/account/wishlist"
                  className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-600 transition-colors relative hidden sm:flex"
                  aria-label="Wishlist"
                >
                  <Heart size={20} />
                  <AnimatePresence>
                    {wishlistCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 min-w-[18px] min-h-[18px] flex items-center justify-center leading-none px-0.5"
                      >
                        {wishlistCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>

                {/* Cart – unchanged */}
                <Link
                  to="/cart"
                  className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-600 transition-colors relative"
                  aria-label="Cart"
                >
                  <ShoppingCart size={20} />
                  <AnimatePresence>
                    {cartCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1 bg-primary-600 text-white text-[10px] font-bold rounded-full min-w-[18px] min-h-[18px] flex items-center justify-center leading-none px-0.5"
                      >
                        {cartCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>

                {/* User menu – unchanged */}
                {isAuthenticated ? (
                  <div className="relative ml-1">
                    <button
                      onClick={() => setUserMenu(!userMenu)}
                      className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-pink-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                        {user?.name?.[0]?.toUpperCase() || "U"}
                      </div>
                      <ChevronDown
                        size={14}
                        className={`text-gray-500 transition-transform duration-200 hidden sm:block ${
                          userMenu ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {userMenu && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setUserMenu(false)}
                          />
                          <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.96 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 mt-2 w-60 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50"
                          >
                            {/* User Info */}
                            <div className="px-4 py-3 bg-gradient-to-r from-primary-50 to-pink-50 dark:from-primary-900/30 dark:to-pink-900/20 border-b border-gray-100 dark:border-gray-700">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-pink-500 text-white flex items-center justify-center font-bold">
                                  {user?.name?.[0]?.toUpperCase() || "U"}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold truncate">
                                    {user?.name}
                                  </p>
                                  <p className="text-xs text-gray-500 truncate">
                                    {user?.email}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="py-1.5">
                              {isAdmin() && (
                                <Link
                                  to="/admin"
                                  onClick={() => setUserMenu(false)}
                                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary-700 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 font-medium transition-colors"
                                >
                                  <LayoutDashboard size={16} />
                                  Admin Panel
                                </Link>
                              )}
                              {[
                                {
                                  to: "/account",
                                  icon: User,
                                  label: "Profile",
                                },
                                {
                                  to: "/account/orders",
                                  icon: Package,
                                  label: "My Orders",
                                },
                                {
                                  to: "/account/addresses",
                                  icon: MapPin,
                                  label: "Addresses",
                                },
                                {
                                  to: "/account/change-password",
                                  icon: Lock,
                                  label: "Change Password",
                                },
                                {
                                  to: "/account/my-reviews",
                                  icon: Package,
                                  label: "My Reviews",
                                },
                              ].map(({ to, icon: Icon, label }) => (
                                <Link
                                  key={to}
                                  to={to}
                                  onClick={() => setUserMenu(false)}
                                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                >
                                  <Icon size={16} className="text-gray-400" />
                                  {label}
                                </Link>
                              ))}
                            </div>
                            <div className="border-t border-gray-100 dark:border-gray-700 py-1.5">
                              <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              >
                                <LogOut size={16} />
                                Logout
                              </button>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="hidden sm:flex items-center gap-2 ml-1">
                    <Link
                      to="/login"
                      className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="px-4 py-2 text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}

                {/* Hamburger – unchanged */}
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="lg:hidden p-2 ml-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Toggle menu"
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={mobileOpen ? "x" : "menu"}
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </motion.span>
                  </AnimatePresence>
                </button>
              </div>
            </div>

            {/* Mobile Nav – unchanged */}
            <AnimatePresence>
              {mobileOpen && (
                <motion.nav
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="lg:hidden border-t border-gray-100 dark:border-gray-800 overflow-hidden"
                >
                  <div className="flex flex-col py-3 gap-0.5">
                    {links.map((link, i) => (
                      <motion.div
                        key={link.to}
                        initial={{ x: -16, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <Link
                          to={link.to}
                          onClick={() => setMobileOpen(false)}
                          className="block px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 rounded-lg mx-2 transition-colors"
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    ))}
                    <div className="flex items-center gap-2 px-4 pt-2 pb-1 border-t border-gray-100 dark:border-gray-800 mt-2">
                      {/* <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
                      >
                        {theme === "light" ? (
                          <Moon size={18} />
                        ) : (
                          <Sun size={18} />
                        )}
                      </button> */}
                      <Link
                        to="/account/wishlist"
                        onClick={() => setMobileOpen(false)}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 relative"
                      >
                        <Heart size={18} />
                        {wishlistCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-bold rounded-full min-w-[16px] min-h-[16px] flex items-center justify-center px-0.5">
                            {wishlistCount}
                          </span>
                        )}
                      </Link>
                    </div>
                    {!isAuthenticated && (
                      <div className="px-4 pt-1 pb-3 flex gap-2">
                        <Link
                          to="/login"
                          onClick={() => setMobileOpen(false)}
                          className="flex-1 py-2 text-center text-sm font-medium border border-primary-600 text-primary-600 rounded-full hover:bg-primary-50 transition-colors"
                        >
                          Login
                        </Link>
                        <Link
                          to="/register"
                          onClick={() => setMobileOpen(false)}
                          className="flex-1 py-2 text-center text-sm font-medium bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
                        >
                          Sign Up
                        </Link>
                      </div>
                    )}
                  </div>
                </motion.nav>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 sm:pt-28 px-4"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -20, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <form
                onSubmit={handleSearch}
                className="bg-white dark:bg-gray-800 rounded-t-2xl shadow-2xl overflow-hidden"
              >
                <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                  <Search size={20} className="text-primary-500 shrink-0" />
                  <input
                    type="text"
                    name="search"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, category, keywords..."
                    className="flex-1 text-base outline-none bg-transparent text-gray-800 dark:text-gray-100 placeholder-gray-400"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setSearchResults([]);
                      }}
                      className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"
                    >
                      <X size={16} />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-2 sm:px-4 py-1 sm:py-2 bg-primary-600 text-white rounded-lg text-[11px] sm:text-sm font-medium hover:bg-primary-700 transition whitespace-nowrap shrink-0"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Live Search Results */}
              {searchQuery.trim() && (
                <div className="bg-white dark:bg-gray-800 rounded-b-2xl shadow-2xl max-h-96 overflow-y-auto -mt-2 pt-1">
                  {searching ? (
                    <div className="flex items-center gap-3 px-5 py-4 text-sm text-gray-500">
                      <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                      Searching...
                    </div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((p) => (
                      <Link
                        key={p._id}
                        to={"/product/" + (p.slug || p._id)}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery("");
                          setSearchResults([]);
                        }}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                      >
                        <img
                          src={
                            p.images?.[0]?.url || getPlaceholderImage(p.name)
                          }
                          alt={p.name}
                          className="w-12 h-12 rounded-lg object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {p.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {p.category?.name || "Cake"}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-semibold text-primary-600">
                            {formatPrice(
                              p.discountPrice > 0 ? p.discountPrice : p.price
                            )}
                          </p>
                          {p.discountPrice > 0 && (
                            <p className="text-xs text-gray-400 line-through">
                              {formatPrice(p.price)}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="px-5 py-4 text-sm text-gray-400 text-center">
                      No products found for "{searchQuery.trim()}"
                    </div>
                  )}
                </div>
              )}

              {/* Popular suggestions (shown when no query) */}
              {!searchQuery.trim() && (
                <div className="bg-white dark:bg-gray-800 rounded-b-2xl shadow-2xl px-5 py-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-gray-400 font-medium">
                      Popular:
                    </span>
                    {[
                      "Chocolate Cake",
                      "Birthday Cake",
                      "Cupcakes",
                      "Cheesecake",
                      "Pastries",
                    ].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          navigate(`/shop?search=${encodeURIComponent(s)}`);
                          setSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="text-xs px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-100 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <p className="text-center text-gray-400 text-xs mt-3">
                    Press{" "}
                    <kbd className="bg-gray-100 dark:bg-gray-700 rounded px-1.5 py-0.5 font-mono">
                      Esc
                    </kbd>{" "}
                    to close
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
