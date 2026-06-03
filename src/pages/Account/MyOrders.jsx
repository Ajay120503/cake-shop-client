import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Package, ChevronRight, Star } from "lucide-react";
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
      <h1 className="text-3xl font-display font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <div className="card p-12 text-center">
          <Package size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
          <Link to="/shop" className="btn-primary inline-flex mt-4">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order._id}
              to={"/account/orders/" + order._id}
              className="card p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center hover:shadow-elegant transition"
            >
              <div className="flex gap-2 flex-1 relative">
                {order.items.slice(0, 3).map((item, i) => (
                  <div key={i} className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    {/* Review link for delivered items */}
                    {order.orderStatus === "Delivered" && item.product && (
                      <Link
                        to={
                          "/product/" +
                          (typeof item.product === "object"
                            ? item.product.slug
                            : item.product)
                        }
                        className="absolute -bottom-1 -right-1 bg-primary-600 text-white rounded-full p-0.5 shadow-md hover:bg-primary-700 transition"
                        title="Write a Review"
                      >
                        <Star size={10} />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-500">
                  Order #{order.orderNumber}
                </p>
                <p className="font-medium truncate">
                  {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="text-right">
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
                <p className="text-lg font-bold text-primary-600 mt-1">
                  {formatPrice(order.totalPrice)}
                </p>
              </div>
              <ChevronRight className="text-gray-400" size={20} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
