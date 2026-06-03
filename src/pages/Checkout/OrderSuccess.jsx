import { Link, useParams } from "react-router-dom";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const OrderSuccess = () => {
  const { id } = useParams();
  return (
    <div className="container-custom py-20 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center"
      >
        <CheckCircle size={64} className="text-green-600" />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl sm:text-4xl font-display font-bold mb-3"
      >
        Order Placed Successfully!
      </motion.h1>
      <p className="text-gray-600 mb-2">Thank you for your order.</p>
      <p className="text-sm text-gray-500 mb-8">
        Order ID: <span className="font-mono font-medium">{id}</span>
      </p>
      <div className="bg-white card p-6 max-w-md mx-auto mb-6">
        <Package size={32} className="mx-auto mb-3 text-primary-600" />
        <p className="text-sm text-gray-600">
          Your order is being processed. You'll receive a confirmation email
          shortly. Track your order in the "My Orders" section.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to={"/account/orders/" + id} className="btn-primary">
          Track Order <ArrowRight size={16} className="ml-2" />
        </Link>
        <Link to="/shop" className="btn-outline">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
