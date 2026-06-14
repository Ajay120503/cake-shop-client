import { Link, useParams } from "react-router-dom";
import { CheckCircle, Package, ArrowRight } from "lucide-react";

const OrderSuccess = () => {
  const { id } = useParams();
  return (
    <div className="container-custom py-16">
      <div className="max-w-lg mx-auto text-center">
        {/* Success icon */}
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full flex items-center justify-center">
          <CheckCircle
            size={48}
            className="text-green-600 dark:text-green-400"
          />
        </div>

        <h1 className="text-3xl sm:text-4xl font-display font-bold gradient-text mb-3">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          Thank you for your order. We've received it and will start preparing
          it right away.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          Order ID:{" "}
          <span className="font-mono font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-2 py-0.5 rounded-lg">
            {id}
          </span>
        </p>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-gray-700 mb-6">
          <Package
            size={32}
            className="mx-auto mb-3 text-primary-600 dark:text-primary-400"
          />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Your order is being processed. You'll receive a confirmation email
            shortly. Track your order in the "My Orders" section.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to={"/account/orders/" + id}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-semibold shadow-md shadow-primary-500/20 hover:shadow-lg transition-all duration-200"
          >
            Track Order <ArrowRight size={16} />
          </Link>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white rounded-full font-semibold transition-all duration-200"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
