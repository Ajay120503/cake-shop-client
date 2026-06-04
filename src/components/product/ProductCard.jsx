import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Eye, Star } from "lucide-react";
import {
  formatPrice,
  getDiscountPercent,
  getPlaceholderImage,
} from "../../utils/helpers.js";
import Rating from "../ui/Rating.jsx";
import Badge from "../ui/Badge.jsx";
import { useCart } from "../../store/cartStore.js";
import { useWishlist } from "../../store/wishlistStore.js";
import { useAuth } from "../../store/authStore.js";
import toast from "react-hot-toast";

const ProductCard = ({ product, index = 0 }) => {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const finalPrice =
    product.discountPrice > 0 ? product.discountPrice : product.price;
  const discount = getDiscountPercent(product.price, product.discountPrice);
  const inWishlist = isInWishlist(product._id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Please login");
      return;
    }
    try {
      await addToCart(product._id, 1);
      toast.success("Added to cart!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add");
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Please login");
      return;
    }
    try {
      if (inWishlist) {
        await removeFromWishlist(product._id);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(product._id);
        toast.success("Added to wishlist");
      }
    } catch (err) {
      toast.error("Failed to update wishlist");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: (index % 4) * 0.08, type: "spring", stiffness: 200 }}
      whileHover={{ y: -8 }}
      className="card group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-soft hover:shadow-elegant transition-all duration-300 border border-gray-100 dark:border-gray-700"
    >
      <Link to={"/product/" + (product.slug || product._id)} className="block">
        <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-cream-100 to-primary-50 dark:from-gray-700 dark:to-gray-800">
          <img
            src={product.images?.[0]?.url || getPlaceholderImage(product.name)}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = getPlaceholderImage(product.name);
            }}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discount > 0 && (
              <Badge variant="danger" className="shadow-sm">
                -{discount}%
              </Badge>
            )}
            {product.isNewArrival && (
              <Badge variant="success" className="shadow-sm">
                New
              </Badge>
            )}
            {product.isBestSeller && (
              <Badge variant="warning" className="shadow-sm">
                Bestseller
              </Badge>
            )}
          </div>

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            className={
              "absolute top-3 right-3 z-10 p-2.5 rounded-xl shadow-md transition-all duration-200 " +
              (inWishlist
                ? "bg-gradient-to-r from-primary-600 to-pink-600 text-white scale-110"
                : "bg-white/90 text-gray-600 hover:bg-white hover:scale-110 backdrop-blur-sm")
            }
          >
            <Heart size={16} className={inWishlist ? "fill-current" : ""} />
          </button>

          {/* Hover overlay actions */}
          <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-gradient-to-t from-black/40 via-black/10 to-transparent">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className="p-3 bg-white rounded-xl shadow-lg hover:bg-gradient-to-r hover:from-primary-600 hover:to-pink-600 hover:text-white transition-all duration-200 text-gray-700"
              title="Add to Cart"
            >
              <ShoppingCart size={18} />
            </motion.button>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link
                to={"/product/" + (product.slug || product._id)}
                className="p-3 bg-white rounded-xl shadow-lg hover:bg-gradient-to-r hover:from-primary-600 hover:to-pink-600 hover:text-white transition-all duration-200 text-gray-700 inline-flex"
                title="View Details"
              >
                <Eye size={18} />
              </Link>
            </motion.div>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          {/* Category */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider">
              {product.category?.name || "Cake"}
            </span>
            {product.ratings?.average > 0 && (
              <span className="flex items-center gap-0.5 text-xs text-amber-500">
                <Star size={11} className="fill-amber-400" />
                {product.ratings.average.toFixed(1)}
              </span>
            )}
          </div>

          {/* Name */}
          <h3 className="font-display font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors text-base">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <Rating
              value={product.ratings?.average || 0}
              size={13}
              showValue={false}
            />
            <span className="text-xs text-gray-400">
              ({product.reviewsCount || 0})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
              {formatPrice(finalPrice)}
            </span>
            {product.discountPrice > 0 && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
