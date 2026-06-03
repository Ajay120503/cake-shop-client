import { Link, useNavigate } from "react-router-dom";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Tag,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import { useCart } from "../../store/cartStore.js";
import { useAuth } from "../../store/authStore.js";
import { formatPrice, getPlaceholderImage } from "../../utils/helpers.js";
import toast from "react-hot-toast";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateItem, removeItem, applyCoupon, removeCoupon, clearCart } =
    useCart();
  const { isAuthenticated } = useAuth();
  const [coupon, setCoupon] = useState("");
  const [applying, setApplying] = useState(false);

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="container-custom py-20 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-display font-bold mb-3">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mb-6">
          Looks like you haven't added anything yet.
        </p>
        <Link to="/shop" className="btn-primary">
          Continue Shopping <ArrowRight size={16} className="ml-2" />
        </Link>
      </div>
    );
  }

  const handleApplyCoupon = async () => {
    if (!coupon) return;
    setApplying(true);
    try {
      await applyCoupon(coupon);
      toast.success("Coupon applied!");
      setCoupon("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid coupon");
    } finally {
      setApplying(false);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error("Please login");
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-display font-bold mb-6">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item._id}
              className="card flex flex-col sm:flex-row gap-4 p-4"
            >
              <Link
                to={"/product/" + (item.product?.slug || item.product?._id)}
                className="flex-shrink-0"
              >
                <img
                  src={item.image || getPlaceholderImage(item.name)}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = getPlaceholderImage(item.name);
                  }}
                />
              </Link>
              <div className="flex-1">
                <Link
                  to={"/product/" + (item.product?.slug || item.product?._id)}
                  className="font-semibold hover:text-primary-600"
                >
                  {item.name}
                </Link>
                <p className="text-sm text-gray-500">
                  {formatPrice(item.price)} each
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() =>
                      updateItem(item._id, Math.max(1, item.quantity - 1))
                    }
                    className="p-1 border rounded"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="px-2 font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateItem(item._id, item.quantity + 1)}
                    className="p-1 border rounded"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="font-bold text-lg text-primary-600">
                  {formatPrice(item.price * item.quantity)}
                </span>
                <button
                  onClick={() => removeItem(item._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={clearCart}
            className="text-sm text-red-500 hover:underline"
          >
            Clear Cart
          </button>
        </div>

        <div className="card p-6 h-fit sticky top-24">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm border-b pb-3 mb-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(cart.totals?.itemsPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>{formatPrice(cart.totals?.taxPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>
                {cart.totals?.shippingPrice === 0 ? (
                  <span className="text-green-600">FREE</span>
                ) : (
                  formatPrice(cart.totals?.shippingPrice)
                )}
              </span>
            </div>
            {cart.totals?.discountPrice > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-{formatPrice(cart.totals.discountPrice)}</span>
              </div>
            )}
          </div>

          {cart.coupon ? (
            <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg mb-3">
              <span className="text-sm flex items-center gap-2">
                <Tag size={14} /> {cart.coupon.code} applied
              </span>
              <button
                onClick={removeCoupon}
                className="text-xs text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Coupon code"
                className="input flex-1"
              />
              <button
                onClick={handleApplyCoupon}
                disabled={applying}
                className="btn-outline text-sm"
              >
                {applying ? "..." : "Apply"}
              </button>
            </div>
          )}

          <div className="flex justify-between text-lg font-bold mb-4">
            <span>Total</span>
            <span className="text-primary-600">
              {formatPrice(cart.totals?.totalPrice)}
            </span>
          </div>
          <button onClick={handleCheckout} className="btn-primary w-full">
            Proceed to Checkout <ArrowRight size={16} className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
