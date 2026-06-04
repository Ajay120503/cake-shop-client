import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { useWishlist } from "../../store/wishlistStore.js";
import ProductGrid from "../../components/product/ProductGrid.jsx";

const Wishlist = () => {
  const { wishlist } = useWishlist();
  const products =
    wishlist?.products?.map((p) => p.product).filter(Boolean) || [];

  return (
    <div className="container-custom py-8">
      {/* Premium Header */}
      <div className="relative min-h-[18vh] flex items-center bg-gradient-to-br from-primary-50 via-cream-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-primary-900/20 rounded-3xl mb-8 overflow-hidden px-6 sm:px-8">
        <div className="absolute inset-0 overflow-hidden opacity-20 dark:opacity-5">
          <div className="absolute -top-10 left-1/4 w-40 h-40 rounded-full bg-primary-200 blur-3xl" />
          <div className="absolute bottom-0 right-10 w-40 h-40 rounded-full bg-pink-200 blur-3xl" />
        </div>
        <div className="relative z-10 py-8">
          <h1 className="text-3xl sm:text-4xl font-display font-bold gradient-text mb-2">
            My Wishlist
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Products you've saved for later
          </p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-soft border border-gray-100 dark:border-gray-700">
          <Heart
            size={48}
            className="mx-auto text-gray-300 dark:text-gray-600 mb-4"
          />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Your wishlist is empty
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Save your favorite products to revisit later.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-pink-600 hover:from-primary-700 hover:to-pink-700 text-white rounded-full font-semibold shadow-elegant hover:shadow-glow transition-all duration-200"
          >
            <ShoppingBag size={16} /> Browse Products
          </Link>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
};

export default Wishlist;
