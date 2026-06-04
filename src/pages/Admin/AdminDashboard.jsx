import { useQuery } from "@tanstack/react-query";
import {
  ShoppingBag,
  Users,
  Package,
  IndianRupee,
  AlertCircle,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { analyticsAPI } from "../../api/endpoints.js";
import { formatPrice } from "../../utils/helpers.js";
import Loader from "../../components/ui/Loader.jsx";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => analyticsAPI.getDashboard().then((r) => r.data.data),
  });
  if (isLoading) return <Loader />;
  const stats = data || {};

  const cards = [
    {
      label: "Total Revenue",
      value: formatPrice(stats.totalRevenue),
      icon: IndianRupee,
      color: "from-green-500 to-emerald-500",
      trend: "+12.5%",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders || 0,
      icon: ShoppingBag,
      color: "from-primary-500 to-pink-500",
      trend: "+8.2%",
    },
    {
      label: "Total Customers",
      value: stats.totalCustomers || 0,
      icon: Users,
      color: "from-secondary-500 to-orange-500",
      trend: "+15.3%",
    },
    {
      label: "Total Products",
      value: stats.totalProducts || 0,
      icon: Package,
      color: "from-blue-500 to-indigo-500",
      trend: "+5.1%",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-display font-bold mb-6 text-gray-900 dark:text-white">
        Dashboard
      </h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {cards.map((c, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-soft hover:shadow-elegant transition-all duration-200 border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={
                  "w-12 h-12 rounded-xl bg-gradient-to-br " +
                  c.color +
                  " text-white flex items-center justify-center shadow-sm"
                }
              >
                <c.icon size={22} />
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full">
                <TrendingUp size={11} /> {c.trend}
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {c.value}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {c.label}
            </p>
          </div>
        ))}
      </div>

      {/* Stats Grid + Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-gray-700 lg:col-span-2">
          <h2 className="font-display font-semibold text-lg mb-4 text-gray-900 dark:text-white">
            Overview
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Today Orders", value: stats.todayOrders || 0 },
              { label: "Month Orders", value: stats.monthOrders || 0 },
              {
                label: "Month Revenue",
                value: formatPrice(stats.monthRevenue),
              },
              { label: "Pending", value: stats.pendingOrders || 0 },
            ].map((item, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-gradient-to-br from-primary-50 to-pink-50 dark:from-primary-900/20 dark:to-pink-900/20 border border-primary-100 dark:border-primary-800"
              >
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {item.label}
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-gray-700">
          <h2 className="font-display font-semibold text-lg mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            <AlertCircle size={18} className="text-amber-500" />
            Low Stock
          </h2>
          {stats.lowStock && stats.lowStock.length > 0 ? (
            <div className="space-y-2.5">
              {stats.lowStock.slice(0, 5).map((p) => (
                <div
                  key={p._id}
                  className="flex justify-between items-center px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20"
                >
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate mr-2">
                    {p.name}
                  </span>
                  <span className="text-sm font-bold text-red-600 dark:text-red-400 shrink-0">
                    {p.stock}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 py-4 text-center">
              All products well-stocked ✓
            </p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Link
          to="/admin/orders"
          className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft hover:shadow-elegant border border-gray-100 dark:border-gray-700 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-100 to-pink-100 dark:from-primary-900/30 dark:to-pink-900/30 flex items-center justify-center mb-3">
                <ShoppingBag
                  size={20}
                  className="text-primary-600 dark:text-primary-400"
                />
              </div>
              <h3 className="font-display font-semibold text-gray-900 dark:text-white">
                Manage Orders
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                View, update, and track orders
              </p>
            </div>
            <ArrowRight
              size={18}
              className="text-gray-300 dark:text-gray-600 group-hover:text-primary-500 group-hover:translate-x-1 transition-all"
            />
          </div>
        </Link>

        <Link
          to="/admin/products"
          className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft hover:shadow-elegant border border-gray-100 dark:border-gray-700 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-100 to-pink-100 dark:from-primary-900/30 dark:to-pink-900/30 flex items-center justify-center mb-3">
                <Package
                  size={20}
                  className="text-primary-600 dark:text-primary-400"
                />
              </div>
              <h3 className="font-display font-semibold text-gray-900 dark:text-white">
                Manage Products
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Add, edit, and organize products
              </p>
            </div>
            <ArrowRight
              size={18}
              className="text-gray-300 dark:text-gray-600 group-hover:text-primary-500 group-hover:translate-x-1 transition-all"
            />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
