import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Eye, Star } from "lucide-react";
import {
  formatPrice,
  getDiscountPercent,
  getPlaceholderImage,
} from "../../utils/helpers.js";
import Rating from "../ui/Rating.jsx";
import { useCart } from "../../store/cartStore.js";
import { useWishlist } from "../../store/wishlistStore.js";
import { useAuth } from "../../store/authStore.js";
import toast from "react-hot-toast";

const ProductCard = ({ product, index = 0 }) => {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const finalPrice =
    product.discountPrice > 0
      ? product.discountPrice
      : product.basePrice || product.price;
  const originalPrice = product.basePrice || product.price;
  const discount = getDiscountPercent(originalPrice, product.discountPrice);
  const inWishlist = isInWishlist(product._id);
  const images = product.images || [];

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
      className="group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 transition-all duration-500"
    >
      <Link to={"/product/" + (product.slug || product._id)} className="block">
        {/* ── Image container ── */}
        <div className="relative overflow-hidden aspect-[4/3] bg-gray-50 dark:bg-gray-800">
          {/* Primary image */}
          <img
            src={images[0]?.url || getPlaceholderImage(product.name)}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = getPlaceholderImage(product.name);
            }}
          />

          {/* Secondary image on hover */}
          {images[1] && (
            <img
              src={images[1].url}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              loading="lazy"
            />
          )}

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Badges — top-left stack */}
          <div className="absolute top-0 left-0 flex flex-col z-10">
            {discount > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-none bg-rose-500 text-white text-xs font-semibold whitespace-nowrap shadow-sm">
                -{discount}% OFF
              </span>
            )}

            {product.isNewArrival && (
              <span className="inline-flex items-center px-3 py-1 rounded-none bg-emerald-500 text-white text-xs font-semibold whitespace-nowrap shadow-sm">
                New
              </span>
            )}

            {product.isBestSeller && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none bg-amber-400 text-gray-900 text-xs font-semibold whitespace-nowrap shadow-sm">
                Bestseller
              </span>
            )}
          </div>

          {/* Wishlist button — top-right */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleWishlist}
            className={`absolute top-3 right-3 z-10 p-2.5 rounded-full transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center sm:min-h-0 sm:min-w-0 ${
              inWishlist
                ? "bg-primary-600 text-white scale-110"
                : "bg-white/90 dark:bg-gray-900/80 text-gray-500 hover:bg-white backdrop-blur-sm hover:text-rose-500"
            }`}
          >
            <Heart size={15} className={inWishlist ? "fill-current" : ""} />
          </motion.button>

          {/* Image pagination dots (if multiple images) */}
          {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {images.slice(0, 4).map((_, i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    i === 0
                      ? "bg-white w-3"
                      : "bg-white/50 group-hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Hover overlay — bottom action strip */}
          <div className="absolute inset-x-0 bottom-0 p-3 flex items-center gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 z-10">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-white px-4 py-3 text-[11px] font-bold text-gray-900 hover:bg-primary-600 hover:text-white transition-all duration-200 tracking-wide uppercase min-h-[44px] sm:min-h-0 sm:py-2.5"
            >
              <ShoppingCart size={13} /> Add to Cart
            </motion.button>
            <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }}>
              <Link
                to={"/product/" + (product.slug || product._id)}
                className="p-2.5 bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm rounded-full hover:bg-primary-600 hover:text-white transition-all duration-200 text-gray-700 inline-flex min-h-[44px] min-w-[44px] items-center justify-center sm:min-h-0 sm:min-w-0"
                title="View Details"
              >
                <Eye size={15} />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* ── Info panel ── */}
        <div className="p-4 pt-3.5">
          {/* Category pill + Rating */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-[0.12em]">
              {product.category?.name || "Cake"}
            </span>
            {product.ratings?.average > 0 && (
              <span className="flex items-center gap-0.5 text-[11px] text-amber-500 font-semibold">
                <Star size={10} className="fill-amber-400" />
                {product.ratings.average.toFixed(1)}
                <span className="text-gray-400 font-normal">
                  ({product.reviewsCount || 0})
                </span>
              </span>
            )}
          </div>

          {/* Product name */}
          <h3 className="font-display font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2.5 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors text-[15px] leading-snug tracking-tight">
            {product.name}
          </h3>

          {/* Divider */}
          <div className="divider mb-3" />

          {/* Price row */}
          <div className="flex items-end justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-gray-950 dark:text-white tracking-tight">
                {formatPrice(finalPrice)}
              </span>
              {product.discountPrice > 0 && (
                <span className="text-xs text-gray-400 line-through font-medium">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
