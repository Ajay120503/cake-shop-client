import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Eye } from "lucide-react";
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

const ProductCard = ({ product }) => {
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
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="card group"
    >
      <Link to={"/product/" + (product.slug || product._id)} className="block">
        <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-cream-100 to-primary-50">
          <img
            src={product.images?.[0]?.url || getPlaceholderImage(product.name)}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = getPlaceholderImage(product.name);
            }}
          />
          {discount > 0 && (
            <Badge variant="danger" className="absolute top-3 left-3">
              -{discount}%
            </Badge>
          )}
          {product.isNewArrival && (
            <Badge variant="success" className="absolute top-3 right-3">
              New
            </Badge>
          )}
          <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
            <button
              onClick={handleAddToCart}
              className="p-2.5 bg-white rounded-full shadow-lg hover:bg-primary-600 hover:text-white transition"
            >
              <ShoppingCart size={18} />
            </button>
            <Link
              to={"/product/" + (product.slug || product._id)}
              className="p-2.5 bg-white rounded-full shadow-lg hover:bg-primary-600 hover:text-white transition"
            >
              <Eye size={18} />
            </Link>
            <button
              onClick={handleWishlist}
              className={
                "p-2.5 bg-white rounded-full shadow-lg transition " +
                (inWishlist
                  ? "bg-primary-600 text-white"
                  : "hover:bg-primary-600 hover:text-white")
              }
            >
              <Heart size={18} className={inWishlist ? "fill-current" : ""} />
            </button>
          </div>
        </div>
        <div className="p-4">
          <p className="text-xs text-primary-600 font-medium mb-1">
            {product.category?.name || "Cake"}
          </p>
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-primary-600 transition">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <Rating
              value={product.ratings?.average || 0}
              size={14}
              showValue={false}
            />
            <span className="text-xs text-gray-500">
              ({product.reviewsCount || 0})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary-600">
              {formatPrice(finalPrice)}
            </span>
            {product.discountPrice > 0 && (
              <span className="text-sm text-gray-500 line-through">
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
