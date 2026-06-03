import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingBag,
  Users,
  Ticket,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../store/authStore.js";
import { motion, AnimatePresence } from "framer-motion";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/admin/products", label: "Products", icon: Package },
    { to: "/admin/categories", label: "Categories", icon: Tag },
    { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { to: "/admin/customers", label: "Customers", icon: Users },
    { to: "/admin/coupons", label: "Coupons", icon: Ticket },
    { to: "/admin/reviews", label: "Reviews", icon: MessageSquare },
    { to: "/admin/settings", label: "Settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside
        className={
          "fixed lg:sticky top-0 left-0 h-screen w-64 bg-white dark:bg-gray-800 shadow-lg z-40 transform transition-transform lg:translate-x-0 " +
          (sidebarOpen ? "translate-x-0" : "-translate-x-full")
        }
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
            <h1 className="text-2xl font-display font-bold gradient-text">
              🎂 Admin
            </h1>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <X size={20} />
            </button>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg transition " +
                  (isActive
                    ? "bg-primary-600 text-white shadow-elegant"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700")
                }
              >
                <link.icon size={18} />
                <span className="font-medium">{link.label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="p-4 border-t dark:border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold">
                {user?.name?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-20">
          <div className="flex items-center justify-between px-6 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-lg font-semibold">Admin Panel</h2>
            <a href="/" className="text-sm text-primary-600 hover:underline">
              View Store
            </a>
          </div>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
