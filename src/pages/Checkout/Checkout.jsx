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
} from "lucide-react";
import { useCart } from "../../store/cartStore.js";
import { useAuth } from "../../store/authStore.js";
import { useSettings } from "../../store/settingsStore.js";
import { orderAPI, addressAPI, paymentAPI } from "../../api/endpoints.js";
import { formatPrice } from "../../utils/helpers.js";
import toast from "react-hot-toast";

console.log("RAZORPAY KEY:", import.meta.env.VITE_RAZORPAY_KEY_ID);

const Checkout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { cart, clearCart: clearCartStore } = useCart();
  const { user } = useAuth();
  const { settings } = useSettings();
  const [step, setStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Razorpay");
  const [processing, setProcessing] = useState(false);

  // Build list of active payment methods from settings, falling back to defaults
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

  // Map icons to known payment methods (case-insensitive)
  const iconForKey = (key) => {
    const k = (key || "").toLowerCase();
    if (k === "razorpay") return CreditCard;
    if (k === "cod") return Wallet;
    if (k === "upi") return Smartphone;
    return Wallet;
  };

  // Sync paymentMethod state with first active method
  useEffect(() => {
    if (
      activePaymentMethods.length > 0 &&
      !activePaymentMethods.some((m) => m.key === paymentMethod)
    ) {
      setPaymentMethod(activePaymentMethods[0].key);
    }
    if (activePaymentMethods.length === 0) {
      setPaymentMethod("");
    }
  }, [activePaymentMethods]);

  const { data: addresses = [] } = useQuery({
    queryKey: ["addresses"],
    queryFn: () => addressAPI.getAll().then((r) => r.data.data || []),
  });

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
              // key: orderData.data.key,
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
        Your cart is empty
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
      <h1 className="text-3xl font-display font-bold mb-6">Checkout</h1>
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
                  "w-10 h-10 rounded-full flex items-center justify-center font-semibold " +
                  (step >= s.num ? "bg-primary-600 text-white" : "bg-gray-200")
                }
              >
                {step > s.num ? <CheckCircle size={20} /> : s.num}
              </div>
              <span className="hidden sm:inline font-medium">{s.title}</span>
            </div>
            {i < steps.length - 1 && (
              <ChevronRight className="mx-2 sm:mx-4 text-gray-300" size={20} />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === 1 && (
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
              {addresses.length > 0 && (
                <div className="space-y-3 mb-6">
                  {addresses.map((addr) => (
                    <label
                      key={addr._id}
                      className={
                        "block p-4 border-2 rounded-lg cursor-pointer transition " +
                        (selectedAddress === addr._id
                          ? "border-primary-600 bg-primary-50"
                          : "border-gray-200")
                      }
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddress === addr._id}
                        onChange={() => setSelectedAddress(addr._id)}
                        className="mr-3"
                      />
                      <span className="font-medium">{addr.fullName}, </span>
                      <span>
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
              <h3 className="font-semibold mt-6 mb-3">Add New Address</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  className="input"
                  placeholder="Full Name"
                  value={newAddress.fullName}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, fullName: e.target.value })
                  }
                />
                <input
                  className="input"
                  placeholder="Phone"
                  value={newAddress.phone}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, phone: e.target.value })
                  }
                />
                <input
                  className="input sm:col-span-2"
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
                  className="input"
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, city: e.target.value })
                  }
                />
                <input
                  className="input"
                  placeholder="State"
                  value={newAddress.state}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, state: e.target.value })
                  }
                />
                <input
                  className="input"
                  placeholder="Postal Code"
                  value={newAddress.postalCode}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, postalCode: e.target.value })
                  }
                />
              </div>
              <button
                onClick={handleAddAddress}
                className="btn-outline mt-3 text-sm"
              >
                + Add Address
              </button>
              <button
                onClick={() => selectedAddress && setStep(2)}
                disabled={!selectedAddress}
                className="btn-primary w-full mt-6"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              {activePaymentMethods.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg text-sm">
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
                          "flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer " +
                          (paymentMethod === m.key
                            ? "border-primary-600 bg-primary-50"
                            : "border-gray-200")
                        }
                      >
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === m.key}
                          onChange={() => setPaymentMethod(m.key)}
                        />
                        <Icon size={20} className="text-primary-600" />
                        <div>
                          <p className="font-medium">{m.label}</p>
                          {m.description && (
                            <p className="text-sm text-gray-500">
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
                  className="btn-outline flex-1"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="btn-primary flex-1"
                >
                  Review Order
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Order Review</h2>
              <div className="space-y-3 mb-6">
                {cart.items.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="bg-cream-50 p-4 rounded-lg mb-4 text-sm">
                <p>
                  <strong>Address:</strong>{" "}
                  {addresses.find((a) => a._id === selectedAddress)?.fullName},{" "}
                  {
                    addresses.find((a) => a._id === selectedAddress)
                      ?.addressLine1
                  }
                  , {addresses.find((a) => a._id === selectedAddress)?.city}
                </p>
                <p className="mt-1">
                  <strong>Payment:</strong> {paymentMethod}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="btn-outline flex-1"
                >
                  Back
                </button>
                <button
                  onClick={placeOrder}
                  disabled={processing}
                  className="btn-primary flex-1"
                >
                  {processing ? "Processing..." : "Place Order"}
                </button>
              </div>
            </div>
          )}
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
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-primary-600">
              {formatPrice(cart.totals?.totalPrice)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
