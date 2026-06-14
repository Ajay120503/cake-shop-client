import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle,
  CreditCard,
  Wallet,
  Smartphone,
  MapPin,
  ChevronRight,
  Tag,
} from "lucide-react";
import { useCart } from "../../store/cartStore.js";
import { useAuth } from "../../store/authStore.js";
import { useSettings } from "../../store/settingsStore.js";
import {
  orderAPI,
  addressAPI,
  paymentAPI,
  couponAPI,
} from "../../api/endpoints.js";
import { formatPrice } from "../../utils/helpers.js";
import toast from "react-hot-toast";

const Checkout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    cart,
    clearCart: clearCartStore,
    applyCoupon: applyCartCoupon,
    removeCoupon: removeCartCoupon,
  } = useCart();
  const { user } = useAuth();
  const { settings } = useSettings();
  const [step, setStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Razorpay");
  const [processing, setProcessing] = useState(false);

  const activePaymentMethods = (
    settings?.paymentMethods || [
      {
        key: "Razorpay",
        label: "Online Payment (Razorpay)",
        description: "Pay securely via UPI, cards, or netbanking",
      },
      {
        key: "COD",
        label: "Cash on Delivery",
        description: "Pay in cash when your order is delivered",
      },
    ]
  ).filter((m) => m.isActive);

  const iconForKey = (key) => {
    const k = (key || "").toLowerCase();
    if (k === "razorpay") return CreditCard;
    if (k === "cod") return Wallet;
    if (k === "upi") return Smartphone;
    return Wallet;
  };

  useEffect(() => {
    if (
      activePaymentMethods.length > 0 &&
      !activePaymentMethods.some((m) => m.key === paymentMethod)
    ) {
      setPaymentMethod(activePaymentMethods[0].key);
    }
    if (activePaymentMethods.length === 0) setPaymentMethod("");
  }, [activePaymentMethods]);

  const { data: addresses = [] } = useQuery({
    queryKey: ["addresses"],
    queryFn: () => addressAPI.getAll().then((r) => r.data.data || []),
  });

  const { data: availableCoupons = [] } = useQuery({
    queryKey: ["public-coupons"],
    queryFn: () => couponAPI.getPublic().then((r) => r.data.data || []),
  });
  const [applyingCoupon, setApplyingCoupon] = useState(null);

  const handleApplyCoupon = async (code) => {
    setApplyingCoupon(code);
    try {
      await applyCartCoupon(code);
      toast.success(`Coupon "${code}" applied!`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to apply coupon");
    } finally {
      setApplyingCoupon(null);
    }
  };

  const handleRemoveCoupon = async () => {
    setApplyingCoupon("__remove__");
    try {
      await removeCartCoupon();
      toast.success("Coupon removed");
    } catch (err) {
      toast.error("Failed to remove coupon");
    } finally {
      setApplyingCoupon(null);
    }
  };

  const [newAddress, setNewAddress] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    landmark: "",
  });

  const handleAddAddress = async () => {
    try {
      const { data } = await addressAPI.create(newAddress);
      setNewAddress({
        fullName: user?.name || "",
        phone: user?.phone || "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
        landmark: "",
      });
      queryClient.invalidateQueries(["addresses"]);
      setSelectedAddress(data.data._id);
      toast.success("Address added");
    } catch (err) {
      toast.error("Failed to add address");
    }
  };

  const placeOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select address");
      return;
    }
    setProcessing(true);
    const addr = addresses.find((a) => a._id === selectedAddress);
    try {
      const { data } = await orderAPI.create({
        items: cart.items.map((i) => ({
          product: i.product?._id || i.product,
          quantity: i.quantity,
        })),
        shippingAddress: {
          fullName: addr.fullName,
          phone: addr.phone,
          addressLine1: addr.addressLine1,
          addressLine2: addr.addressLine2,
          city: addr.city,
          state: addr.state,
          postalCode: addr.postalCode,
          country: addr.country,
          landmark: addr.landmark,
        },
        paymentMethod,
        couponCode: cart.coupon?.code,
      });
      const newOrder = data.data;
      if (paymentMethod === "Razorpay" || paymentMethod === "UPI") {
        const { data: orderData } = await paymentAPI.createOrder({
          amount: newOrder.totalPrice,
        });
        if (orderData.data.mock) {
          await paymentAPI.mockVerify(newOrder._id);
          clearCartStore();
          toast.success("Payment successful!");
          navigate("/order-success/" + newOrder._id);
        } else {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => {
            const options = {
              key: import.meta.env.VITE_RAZORPAY_KEY_ID,
              amount: orderData.data.amount,
              currency: orderData.data.currency,
              name: "Cake Shop",
              description: "Order Payment",
              order_id: orderData.data.id,
              handler: async (response) => {
                try {
                  await paymentAPI.verifyPayment({
                    ...response,
                    orderId: newOrder._id,
                  });
                  clearCartStore();
                  toast.success("Payment successful!");
                  navigate("/order-success/" + newOrder._id);
                } catch (e) {
                  toast.error("Verification failed");
                }
              },
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
          };
          document.body.appendChild(script);
        }
      } else {
        await paymentAPI.confirmCOD(newOrder._id);
        clearCartStore();
        toast.success("Order placed!");
        navigate("/order-success/" + newOrder._id);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Order failed");
    } finally {
      setProcessing(false);
    }
  };

  if (!cart || !cart.items?.length) {
    return (
      <div className="container-custom py-20 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-soft border border-gray-100 dark:border-gray-700 max-w-md mx-auto">
          <p className="text-gray-500 dark:text-gray-400">Your cart is empty</p>
        </div>
      </div>
    );
  }

  const steps = [
    { num: 1, title: "Address", icon: MapPin },
    { num: 2, title: "Payment", icon: CreditCard },
    { num: 3, title: "Review", icon: CheckCircle },
  ];

  return (
    <div className="container-custom py-8">
      {/* Premium Header */}
      <div className="relative min-h-[18vh] flex items-center bg-white dark:bg-gray-950 rounded-3xl mb-6 overflow-hidden px-6 sm:px-8">
        <div className="absolute inset-0 overflow-hidden opacity-20 dark:opacity-5">
          <div className="absolute -top-10 left-1/4 w-60 h-60 rounded-full bg-primary-200 blur-3xl" />
          <div className="absolute bottom-0 right-10 w-40 h-40 rounded-full bg-pink-200 blur-3xl" />
        </div>
        <div className="relative z-10 py-8">
          <h1 className="text-3xl sm:text-4xl font-display font-bold gradient-text mb-2">
            Checkout
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Complete your order
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="flex items-center justify-center mb-8">
        {steps.map((s, i) => (
          <div key={s.num} className="flex items-center">
            <div
              className={
                "flex items-center gap-2 " +
                (step >= s.num ? "text-primary-600" : "text-gray-400")
              }
            >
              <div
                className={
                  "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm " +
                  (step >= s.num
                    ? "bg-primary-600 text-white shadow-md shadow-primary-500/30"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400")
                }
              >
                {step > s.num ? <CheckCircle size={18} /> : s.num}
              </div>
              <span className="hidden sm:inline font-medium text-sm">
                {s.title}
              </span>
            </div>
            {i < steps.length - 1 && (
              <ChevronRight
                className="mx-2 sm:mx-4 text-gray-300 dark:text-gray-600"
                size={20}
              />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === 1 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-4">
                Delivery Address
              </h2>
              {addresses.length > 0 && (
                <div className="space-y-3 mb-6">
                  {addresses.map((addr) => (
                    <label
                      key={addr._id}
                      className={
                        "block p-4 border-2 rounded-xl cursor-pointer transition-all " +
                        (selectedAddress === addr._id
                          ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-600"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600")
                      }
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddress === addr._id}
                        onChange={() => setSelectedAddress(addr._id)}
                        className="mr-3 accent-primary-600"
                      />
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {addr.fullName},{" "}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        {addr.addressLine1}, {addr.city}, {addr.state} -{" "}
                        {addr.postalCode}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        📞 {addr.phone}
                      </span>
                    </label>
                  ))}
                </div>
              )}
              <h3 className="font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                Add New Address
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                  placeholder="Full Name"
                  value={newAddress.fullName}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, fullName: e.target.value })
                  }
                />
                <input
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                  placeholder="Phone"
                  value={newAddress.phone}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, phone: e.target.value })
                  }
                />
                <input
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all sm:col-span-2"
                  placeholder="Address Line 1"
                  value={newAddress.addressLine1}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      addressLine1: e.target.value,
                    })
                  }
                />
                <input
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, city: e.target.value })
                  }
                />
                <input
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                  placeholder="State"
                  value={newAddress.state}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, state: e.target.value })
                  }
                />
                <input
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                  placeholder="Postal Code"
                  value={newAddress.postalCode}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, postalCode: e.target.value })
                  }
                />
              </div>
              <button
                onClick={handleAddAddress}
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white rounded-xl text-sm font-semibold transition-all duration-200"
              >
                + Add Address
              </button>
              <button
                onClick={() => selectedAddress && setStep(2)}
                disabled={!selectedAddress}
                className="w-full mt-6 inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold shadow-md shadow-primary-500/20 hover:shadow-lg transition-all duration-200 disabled:opacity-50"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-4">
                Payment Method
              </h2>
              {activePaymentMethods.length === 0 ? (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 p-4 rounded-xl text-sm">
                  No payment methods are currently available. Please contact the
                  store.
                </div>
              ) : (
                <div className="space-y-3">
                  {activePaymentMethods.map((m) => {
                    const Icon = iconForKey(m.key);
                    return (
                      <label
                        key={m.key}
                        className={
                          "flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all " +
                          (paymentMethod === m.key
                            ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-600"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600")
                        }
                      >
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === m.key}
                          onChange={() => setPaymentMethod(m.key)}
                          className="accent-primary-600"
                        />
                        <Icon
                          size={20}
                          className="text-primary-600 dark:text-primary-400"
                        />
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {m.label}
                          </p>
                          {m.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {m.description}
                            </p>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white rounded-xl text-sm font-semibold transition-all duration-200"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold shadow-md shadow-primary-500/20 hover:shadow-lg transition-all duration-200"
                >
                  Review Order
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-4">
                Order Review
              </h2>
              <div className="space-y-3 mb-6">
                {cart.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between text-sm text-gray-700 dark:text-gray-300"
                  >
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-xl mb-4 text-sm border border-primary-100 dark:border-primary-800">
                <p className="text-gray-800 dark:text-gray-200">
                  <strong>Address:</strong>{" "}
                  {addresses.find((a) => a._id === selectedAddress)?.fullName},{" "}
                  {
                    addresses.find((a) => a._id === selectedAddress)
                      ?.addressLine1
                  }
                  , {addresses.find((a) => a._id === selectedAddress)?.city}
                </p>
                <p className="mt-1 text-gray-800 dark:text-gray-200">
                  <strong>Payment:</strong> {paymentMethod}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white rounded-xl text-sm font-semibold transition-all duration-200"
                >
                  Back
                </button>
                <button
                  onClick={placeOrder}
                  disabled={processing}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold shadow-md shadow-primary-500/20 hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                >
                  {processing ? "Processing..." : "Place Order"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-gray-700 h-fit sticky top-24">
          <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-4">
            Order Summary
          </h2>

          {cart.coupon ? (
            <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 p-3 rounded-xl mb-3 text-sm border border-green-100 dark:border-green-800">
              <span className="font-medium text-green-700 dark:text-green-300 flex items-center gap-1.5">
                <Tag size={14} /> {cart.coupon.code}
              </span>
              <button
                onClick={handleRemoveCoupon}
                disabled={applyingCoupon === "__remove__"}
                className="text-xs text-red-500 hover:underline font-medium"
              >
                {applyingCoupon === "__remove__" ? "..." : "Remove"}
              </button>
            </div>
          ) : availableCoupons.length > 0 ? (
            <div className="mb-3">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
                <Tag size={12} /> Available Coupons
              </p>
              <div className="space-y-2">
                {availableCoupons.slice(0, 3).map((c) => (
                  <div
                    key={c._id}
                    className="flex items-center justify-between border border-dashed border-primary-200 dark:border-primary-700 rounded-xl p-2.5 bg-primary-50/50 dark:bg-primary-900/10"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase">
                        {c.code}
                      </p>
                      {c.description && (
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                          {c.description}
                        </p>
                      )}
                      <p className="text-[10px] text-gray-400 dark:text-gray-500">
                        {c.discountType === "percentage"
                          ? `${c.discountValue}% off`
                          : `₹${c.discountValue} off`}
                        {c.minOrderValue > 0 && ` · Min: ₹${c.minOrderValue}`}
                      </p>
                    </div>
                    <button
                      onClick={() => handleApplyCoupon(c.code)}
                      disabled={applyingCoupon === c.code}
                      className="text-[10px] px-2.5 py-1 bg-primary-600 text-white rounded-full hover:from-primary-700 hover:to-pink-700 shrink-0 ml-2 transition-all font-semibold"
                    >
                      {applyingCoupon === c.code ? "..." : "Apply"}
                    </button>
                  </div>
                ))}
                {availableCoupons.length > 3 && (
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center">
                    +{availableCoupons.length - 3} more coupons
                  </p>
                )}
              </div>
            </div>
          ) : null}

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
          <div className="flex justify-between text-lg font-bold pt-2">
            <span className="text-gray-900 dark:text-white">Total</span>
            <span className="text-primary-600 dark:text-primary-400">
              {formatPrice(cart.totals?.totalPrice)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
