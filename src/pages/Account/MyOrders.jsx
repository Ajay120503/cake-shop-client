import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Package, ChevronRight } from "lucide-react";
import { orderAPI } from "../../api/endpoints.js";
import { formatPrice, formatDate } from "../../utils/helpers.js";
import Loader from "../../components/ui/Loader.jsx";
import Badge from "../../components/ui/Badge.jsx";

const MyOrders = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: () => orderAPI.getMyOrders().then((r) => r.data),
  });
  const orders = data?.data || [];

  if (isLoading) return <Loader />;

  return (
    <div className="container-custom py-8">
      {/* Premium Header */}
      <div className="relative min-h-[18vh] flex items-center bg-gradient-to-br from-primary-50 via-cream-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-primary-900/20 rounded-3xl mb-8 overflow-hidden px-6 sm:px-8">
        <div className="absolute inset-0 overflow-hidden opacity-20 dark:opacity-5">
          <div className="absolute -top-10 left-1/4 w-60 h-60 rounded-full bg-primary-200 blur-3xl" />
          <div className="absolute bottom-0 right-10 w-40 h-40 rounded-full bg-pink-200 blur-3xl" />
        </div>
        <div className="relative z-10 py-8">
          <h1 className="text-3xl sm:text-4xl font-display font-bold gradient-text mb-2">
            My Orders
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Track and manage your orders
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-soft border border-gray-100 dark:border-gray-700">
          <Package
            size={48}
            className="mx-auto text-gray-300 dark:text-gray-600 mb-4"
          />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No orders yet
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Start shopping to see your orders here.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-pink-600 hover:from-primary-700 hover:to-pink-700 text-white rounded-full font-semibold shadow-elegant hover:shadow-glow transition-all duration-200"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order._id}
              to={"/account/orders/" + order._id}
              className="block bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 shadow-soft hover:shadow-elegant transition-all duration-200 border border-gray-100 dark:border-gray-700 group"
            >
              <div className="flex items-center gap-4 sm:gap-6">
                {/* Product thumbnails */}
                <div className="flex -space-x-2 shrink-0">
                  {order.items.slice(0, 3).map((item, i) => (
                    <div key={i} className="relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border-2 border-white dark:border-gray-800"
                      />
                      {order.orderStatus === "Delivered" && item.product && (
                        <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary-600 text-white rounded-full flex items-center justify-center shadow-sm">
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        </span>
                      )}
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gray-100 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-semibold text-gray-500 dark:text-gray-400">
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>

                {/* Order info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                    Order #{order.orderNumber}
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white truncate">
                    {order.items.length} item
                    {order.items.length !== 1 ? "s" : ""}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                {/* Status + Price */}
                <div className="text-right shrink-0">
                  <Badge
                    variant={
                      order.orderStatus === "Delivered"
                        ? "success"
                        : order.orderStatus === "Cancelled"
                        ? "danger"
                        : "warning"
                    }
                  >
                    {order.orderStatus.replace(/_/g, " ")}
                  </Badge>
                  <p className="text-lg font-bold text-primary-600 dark:text-primary-400 mt-1">
                    {formatPrice(order.totalPrice)}
                  </p>
                </div>

                <ChevronRight
                  size={20}
                  className="text-gray-300 dark:text-gray-600 group-hover:text-primary-500 group-hover:translate-x-1 transition-all shrink-0"
                />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
