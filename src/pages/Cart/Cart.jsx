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
        <div className="rounded-3xl p-12 max-w-md mx-auto shadow-soft border border-gray-100 dark:border-gray-700">
          <ShoppingBag
            size={64}
            className="mx-auto text-gray-300 dark:text-gray-600 mb-4"
          />
          <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-3">
            Your cart is empty
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Looks like you haven't added anything yet.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-semibold shadow-md shadow-primary-500/20 hover:shadow-lg transition-all duration-200"
          >
            Continue Shopping <ArrowRight size={16} />
          </Link>
        </div>
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
      {/* Premium Header */}
      <div className="relative min-h-[18vh] flex items-center rounded-3xl mb-8 overflow-hidden px-6 sm:px-8">
        {/* <div className="absolute inset-0 overflow-hidden opacity-20 dark:opacity-5">
          <div className="absolute -top-10 left-1/3 w-60 h-60 rounded-full bg-primary-200 blur-3xl" />
          <div className="absolute bottom-0 right-10 w-40 h-40 rounded-full bg-pink-200 blur-3xl" />
        </div> */}
        <div className="relative z-10 py-8">
          <h1 className="text-3xl sm:text-4xl font-display font-bold gradient-text mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {cart.items.length} item{cart.items.length !== 1 ? "s" : ""} in your
            cart
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item._id}
              className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 shadow-soft hover:shadow-elegant transition-all duration-200 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to={"/product/" + (item.product?.slug || item.product?._id)}
                  className="shrink-0"
                >
                  <img
                    src={item.image || getPlaceholderImage(item.name)}
                    alt={item.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl"
                    onError={(e) => {
                      e.currentTarget.src = getPlaceholderImage(item.name);
                    }}
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    to={"/product/" + (item.product?.slug || item.product?._id)}
                    className="font-display font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    {formatPrice(item.price)} each
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() =>
                        updateItem(item._id, Math.max(1, item.quantity - 1))
                      }
                      className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-primary-50 dark:hover:bg-gray-700 hover:border-primary-300 transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-8 text-center font-semibold text-gray-900 dark:text-white text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateItem(item._id, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-primary-50 dark:hover:bg-gray-700 hover:border-primary-300 transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 sm:gap-2">
                  <span className="font-bold text-lg text-primary-600 dark:text-primary-400">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Remove"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={clearCart}
            className="text-sm font-medium text-red-500 hover:text-red-600 hover:underline transition-colors"
          >
            Clear Cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-gray-700 h-fit sticky top-24">
          <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-4">
            Order Summary
          </h2>

          <div className="space-y-2 text-sm border-b border-gray-100 dark:border-gray-700 pb-3 mb-3">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatPrice(cart.totals?.itemsPrice)}
              </span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Tax</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatPrice(cart.totals?.taxPrice)}
              </span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Shipping</span>
              <span className="font-medium">
                {cart.totals?.shippingPrice === 0 ? (
                  <span className="text-green-600 font-semibold">FREE</span>
                ) : (
                  formatPrice(cart.totals?.shippingPrice)
                )}
              </span>
            </div>
            {cart.totals?.discountPrice > 0 && (
              <div className="flex justify-between text-green-600 font-medium">
                <span>Discount</span>
                <span>-{formatPrice(cart.totals.discountPrice)}</span>
              </div>
            )}
          </div>

          {/* Coupon */}
          {cart.coupon ? (
            <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 p-3 rounded-xl mb-3 border border-green-100 dark:border-green-800">
              <span className="text-sm font-medium text-green-700 dark:text-green-300 flex items-center gap-1.5">
                <Tag size={14} /> {cart.coupon.code}
              </span>
              <button
                onClick={removeCoupon}
                className="text-xs text-red-500 hover:underline font-medium"
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
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
              />
              <button
                onClick={handleApplyCoupon}
                disabled={applying}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-primary-500/20 hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-200 disabled:opacity-50"
              >
                {applying ? "..." : "Apply"}
              </button>
            </div>
          )}

          {/* Total */}
          <div className="flex justify-between text-lg font-bold pt-2 mb-4">
            <span className="text-gray-900 dark:text-white">Total</span>
            <span className="text-primary-600 dark:text-primary-400">
              {formatPrice(cart.totals?.totalPrice)}
            </span>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-semibold shadow-md shadow-primary-500/20 hover:shadow-lg transition-all duration-200"
          >
            Proceed to Checkout <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
