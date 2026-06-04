import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Package,
  MapPin,
  CreditCard,
  ChevronLeft,
  Download,
  X,
  Star,
} from "lucide-react";
import { orderAPI } from "../../api/endpoints.js";
import {
  formatPrice,
  formatDate,
  getPlaceholderImage,
} from "../../utils/helpers.js";
import Loader from "../../components/ui/Loader.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import toast from "react-hot-toast";

const OrderDetail = () => {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => orderAPI.getById(id).then((r) => r.data.data),
  });

  if (isLoading) return <Loader />;
  if (!data)
    return (
      <div className="container-custom py-20 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-soft border border-gray-100 dark:border-gray-700 max-w-md mx-auto">
          <p className="text-gray-500 dark:text-gray-400">Order not found</p>
        </div>
      </div>
    );

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    try {
      await orderAPI.cancel(data._id, "Customer cancelled");
      toast.success("Order cancelled");
      window.location.reload();
    } catch (err) {
      toast.error("Failed to cancel");
    }
  };

  const handleInvoice = async () => {
    try {
      const res = await orderAPI.getInvoice(data._id);
      const blob = new Blob([res.data], { type: "text/html" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "invoice-" + data.orderNumber + ".html";
      a.click();
    } catch (err) {
      toast.error("Failed to download");
    }
  };

  const getBadgeVariant = (status) => {
    if (status === "Delivered") return "success";
    if (status === "Cancelled" || status === "Refunded") return "danger";
    return "warning";
  };

  return (
    <div className="container-custom py-8">
      {/* Back link */}
      <Link
        to="/account/orders"
        className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-4 transition-colors"
      >
        <ChevronLeft size={16} /> Back to orders
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
            Order #{data.orderNumber}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Placed on {formatDate(data.createdAt)}
          </p>
        </div>
        <Badge variant={getBadgeVariant(data.orderStatus)}>
          {data.orderStatus.replace(/_/g, " ")}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Items */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-gray-700">
            <h2 className="font-display font-semibold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Package size={18} className="text-primary-600" /> Items
            </h2>
            <div className="space-y-3">
              {data.items.map((item, i) => (
                <div
                  key={i}
                  className="flex gap-3 pb-3 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0"
                >
                  <img
                    src={item.image || getPlaceholderImage(item.name)}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Qty: {item.quantity} × {formatPrice(item.price)}
                    </p>
                    {data.orderStatus === "Delivered" && item.product && (
                      <Link
                        to={
                          "/product/" +
                          (typeof item.product === "object"
                            ? item.product.slug
                            : item.product)
                        }
                        className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 mt-1 transition-colors"
                      >
                        <Star size={12} /> Write a Review
                      </Link>
                    )}
                  </div>
                  <p className="font-bold text-primary-600 dark:text-primary-400 shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Status History */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-gray-700">
            <h2 className="font-display font-semibold text-lg text-gray-900 dark:text-white mb-4">
              Status History
            </h2>
            <div className="space-y-3">
              {data.statusHistory?.map((s, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary-500 to-pink-500 shadow-sm" />
                    {i < data.statusHistory.length - 1 && (
                      <div className="w-0.5 flex-1 bg-gradient-to-b from-primary-200 to-pink-100 dark:from-primary-700 dark:to-pink-900/30 mt-1" />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="font-medium text-sm text-gray-900 dark:text-white">
                      {s.status?.replace(/_/g, " ")}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(s.updatedAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Order Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-gray-700">
            <h2 className="font-display font-semibold text-lg text-gray-900 dark:text-white mb-4">
              Order Summary
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatPrice(data.itemsPrice)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Tax</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatPrice(data.taxPrice)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatPrice(data.shippingPrice)}
                </span>
              </div>
              {data.discountPrice > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount</span>
                  <span>-{formatPrice(data.discountPrice)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-100 dark:border-gray-700">
                <span className="text-gray-900 dark:text-white">Total</span>
                <span className="text-primary-600 dark:text-primary-400">
                  {formatPrice(data.totalPrice)}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-gray-700">
            <h2 className="font-display font-semibold text-lg text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <MapPin size={18} className="text-primary-600" /> Shipping Address
            </h2>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-0.5">
              <p className="font-medium text-gray-900 dark:text-white">
                {data.shippingAddress.fullName}
              </p>
              <p>{data.shippingAddress.addressLine1}</p>
              <p>
                {data.shippingAddress.city}, {data.shippingAddress.state}{" "}
                {data.shippingAddress.postalCode}
              </p>
              <p>📞 {data.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-gray-700">
            <h2 className="font-display font-semibold text-lg text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <CreditCard size={18} className="text-primary-600" /> Payment
            </h2>
            <div className="text-sm space-y-1.5">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Method</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {data.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400 items-center">
                <span>Status</span>
                <Badge
                  variant={
                    data.paymentStatus === "Paid" ? "success" : "warning"
                  }
                >
                  {data.paymentStatus}
                </Badge>
              </div>
            </div>
          </div>

          {/* Actions */}
          <button
            onClick={handleInvoice}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white rounded-xl text-sm font-semibold transition-all duration-200"
          >
            <Download size={16} /> Download Invoice
          </button>

          {!["Delivered", "Cancelled", "Refunded"].includes(
            data.orderStatus
          ) && (
            <button
              onClick={handleCancel}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 border-2 border-red-400 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-sm font-semibold transition-all duration-200"
            >
              <X size={16} /> Cancel Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
