import { useQuery } from "@tanstack/react-query";
import {
  ShoppingBag,
  Users,
  Package,
  IndianRupee,
  AlertCircle,
  TrendingUp,
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
      color: "from-green-500 to-green-600",
      trend: "+12.5%",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders || 0,
      icon: ShoppingBag,
      color: "from-primary-500 to-primary-600",
      trend: "+8.2%",
    },
    {
      label: "Total Customers",
      value: stats.totalCustomers || 0,
      icon: Users,
      color: "from-secondary-500 to-secondary-600",
      trend: "+15.3%",
    },
    {
      label: "Total Products",
      value: stats.totalProducts || 0,
      icon: Package,
      color: "from-blue-500 to-blue-600",
      trend: "+5.1%",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-display font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((c, i) => (
          <div key={i} className="card p-6">
            <div className="flex items-start justify-between mb-3">
              <div
                className={
                  "w-12 h-12 rounded-xl bg-gradient-to-br " +
                  c.color +
                  " text-white flex items-center justify-center"
                }
              >
                <c.icon size={22} />
              </div>
              <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                <TrendingUp size={12} /> {c.trend}
              </span>
            </div>
            <p className="text-2xl font-bold">{c.value}</p>
            <p className="text-sm text-gray-500">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 lg:col-span-2">
          <h2 className="font-semibold mb-4">Recent Stats</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3 bg-cream-50 rounded-lg">
              <p className="text-xs text-gray-500">Today Orders</p>
              <p className="text-xl font-bold">{stats.todayOrders || 0}</p>
            </div>
            <div className="p-3 bg-cream-50 rounded-lg">
              <p className="text-xs text-gray-500">Month Orders</p>
              <p className="text-xl font-bold">{stats.monthOrders || 0}</p>
            </div>
            <div className="p-3 bg-cream-50 rounded-lg">
              <p className="text-xs text-gray-500">Month Revenue</p>
              <p className="text-xl font-bold">
                {formatPrice(stats.monthRevenue)}
              </p>
            </div>
            <div className="p-3 bg-cream-50 rounded-lg">
              <p className="text-xs text-gray-500">Pending</p>
              <p className="text-xl font-bold">{stats.pendingOrders || 0}</p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <AlertCircle size={18} className="text-yellow-600" /> Low Stock
          </h2>
          {stats.lowStock && stats.lowStock.length > 0 ? (
            <div className="space-y-2">
              {stats.lowStock.map((p) => (
                <div key={p._id} className="flex justify-between text-sm">
                  <span className="truncate">{p.name}</span>
                  <span className="text-red-600 font-medium">{p.stock}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">All products well-stocked</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Link
          to="/admin/orders"
          className="card p-6 hover:shadow-elegant transition"
        >
          <h2 className="font-semibold mb-2">Manage Orders</h2>
          <p className="text-sm text-gray-500">
            View, update, and track orders
          </p>
        </Link>
        <Link
          to="/admin/products"
          className="card p-6 hover:shadow-elegant transition"
        >
          <h2 className="font-semibold mb-2">Manage Products</h2>
          <p className="text-sm text-gray-500">
            Add, edit, and organize products
          </p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
