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
      <div className="container-custom py-20 text-center">Order not found</div>
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

  return (
    <div className="container-custom py-8">
      <Link
        to="/account/orders"
        className="inline-flex items-center text-sm text-gray-500 hover:text-primary-600 mb-4"
      >
        <ChevronLeft size={16} /> Back to orders
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-3xl font-display font-bold">
          Order #{data.orderNumber}
        </h1>
        <Badge
          variant={
            data.orderStatus === "Delivered"
              ? "success"
              : data.orderStatus === "Cancelled"
              ? "danger"
              : "warning"
          }
        >
          {data.orderStatus.replace(/_/g, " ")}
        </Badge>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Package size={18} /> Items
            </h2>
            <div className="space-y-3">
              {data.items.map((item, i) => (
                <div key={i} className="flex gap-3 pb-3 border-b last:border-0">
                  <img
                    src={item.image || getPlaceholderImage(item.name)}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity} × {formatPrice(item.price)}
                    </p>
                    {/* Review button for delivered items */}
                    {data.orderStatus === "Delivered" && item.product && (
                      <Link
                        to={
                          "/product/" +
                          (typeof item.product === "object"
                            ? item.product.slug
                            : item.product)
                        }
                        className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 mt-1 font-medium"
                      >
                        <Star size={12} />
                        Write a Review
                      </Link>
                    )}
                  </div>
                  <p className="font-bold text-primary-600">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="card p-6">
            <h2 className="font-semibold mb-4">Status History</h2>
            <div className="space-y-2">
              {data.statusHistory?.map((s, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary-600 mt-2" />
                  <div>
                    <p className="font-medium">{s.status}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(s.updatedAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="card p-6">
            <h2 className="font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(data.itemsPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatPrice(data.taxPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{formatPrice(data.shippingPrice)}</span>
              </div>
              {data.discountPrice > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(data.discountPrice)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total</span>
                <span className="text-primary-600">
                  {formatPrice(data.totalPrice)}
                </span>
              </div>
            </div>
          </div>
          <div className="card p-6 text-sm">
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <MapPin size={18} /> Shipping Address
            </h2>
            <p>{data.shippingAddress.fullName}</p>
            <p className="text-gray-600">{data.shippingAddress.addressLine1}</p>
            <p className="text-gray-600">
              {data.shippingAddress.city}, {data.shippingAddress.state}{" "}
              {data.shippingAddress.postalCode}
            </p>
            <p className="text-gray-600">📞 {data.shippingAddress.phone}</p>
          </div>
          <div className="card p-6 text-sm">
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <CreditCard size={18} /> Payment
            </h2>
            <p>
              Method: <span className="font-medium">{data.paymentMethod}</span>
            </p>
            <p>
              Status:{" "}
              <Badge
                variant={data.paymentStatus === "Paid" ? "success" : "warning"}
              >
                {data.paymentStatus}
              </Badge>
            </p>
          </div>
          <button onClick={handleInvoice} className="btn-outline w-full">
            <Download size={16} className="mr-2" /> Download Invoice
          </button>
          {!["Delivered", "Cancelled", "Refunded"].includes(
            data.orderStatus
          ) && (
            <button
              onClick={handleCancel}
              className="btn-outline w-full text-red-600 border-red-200 hover:bg-red-50"
            >
              <X size={16} className="mr-2" /> Cancel Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
