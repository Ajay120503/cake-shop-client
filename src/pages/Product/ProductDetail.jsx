import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Heart,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  Award,
  Minus,
  Plus,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Package,
} from "lucide-react";
import { productAPI, reviewAPI } from "../../api/endpoints.js";
import SEO from "../../components/common/SEO.jsx";
import Loader from "../../components/ui/Loader.jsx";
import Button from "../../components/ui/Button.jsx";
import Rating from "../../components/ui/Rating.jsx";
import ProductCard from "../../components/product/ProductCard.jsx";
import ReviewForm from "../../components/review/ReviewForm.jsx";
import ReviewList from "../../components/review/ReviewList.jsx";
import { useCart } from "../../store/cartStore.js";
import { useWishlist } from "../../store/wishlistStore.js";
import { useAuth } from "../../store/authStore.js";
import {
  formatPrice,
  getDiscountPercent,
  getPlaceholderImage,
} from "../../utils/helpers.js";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const TABS = ["description", "details", "reviews"];

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [activeImage, setActiveImage] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => productAPI.getById(slug).then((r) => r.data.data),
  });

  const { data: relatedData } = useQuery({
    queryKey: ["related", data?._id],
    queryFn: () => productAPI.getRelated(data._id).then((r) => r.data.data),
    enabled: !!data?._id,
  });

  const { data: reviewsData, refetch: refetchReviews } = useQuery({
    queryKey: ["reviews", data?._id],
    queryFn: () => reviewAPI.getProductReviews(data._id).then((r) => r.data),
    enabled: !!data?._id,
  });

  if (isLoading) return <Loader fullScreen />;
  if (!data)
    return (
      <div className="container-custom py-20 text-center text-gray-500">
        Product not found.
      </div>
    );

  const finalPrice = data.discountPrice > 0 ? data.discountPrice : data.price;
  const discount = getDiscountPercent(data.price, data.discountPrice);
  const inWishlist = isInWishlist(data._id);
  const reviews = reviewsData?.data || [];
  const reviewCount = data.reviewsCount || 0;

  // Calculate effective stock: from top-level stock field or total from sizes array
  const effectiveStock =
    data.stock > 0
      ? data.stock
      : (data.sizes || []).reduce((acc, s) => {
          const qty = typeof s.stock === "number" ? s.stock : 0;
          return acc + qty;
        }, 0);
  const isInStock = effectiveStock > 0;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please login");
      navigate("/login");
      return;
    }
    try {
      await addToCart(data._id, quantity);
      toast.success("Added to cart!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.error("Please login");
      navigate("/login");
      return;
    }
    try {
      await addToCart(data._id, quantity);
      navigate("/checkout");
    } catch (_) {
      toast.error("Failed");
    }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error("Please login");
      return;
    }
    try {
      if (inWishlist) {
        await removeFromWishlist(data._id);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(data._id);
        toast.success("Added to wishlist");
      }
    } catch (_) {}
  };

  const handleReviewSuccess = () => {
    setShowReviewForm(false);
    toast.success("Review submitted! Visible after admin approval.");
    refetchReviews();
  };

  return (
    <div className="pb-20">
      <SEO
        title={data.name}
        description={
          data.shortDescription || data.description?.slice(0, 200) || ""
        }
        image={data.images?.[0]?.url || ""}
      />

      {/* ── Breadcrumb ── */}
      <div className="border-b border-gray-100 dark:border-gray-800">
        <div className="container-custom py-3">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 flex-wrap">
            <Link to="/" className="hover:text-primary-600 transition-colors">
              Home
            </Link>
            <ChevronRight size={12} />
            <Link
              to="/shop"
              className="hover:text-primary-600 transition-colors"
            >
              Shop
            </Link>
            <ChevronRight size={12} />
            {data.category && (
              <>
                <Link
                  to={"/shop?category=" + data.category._id}
                  className="hover:text-primary-600 transition-colors"
                >
                  {data.category.name}
                </Link>
                <ChevronRight size={12} />
              </>
            )}
            <span className="text-gray-700 dark:text-gray-300 truncate font-medium">
              {data.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-10">
        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 mb-16">
          {/* Left — Image gallery */}
          <div className="space-y-3">
            <motion.div
              key={activeImage}
              initial={{ opacity: 0.7, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-800"
            >
              <img
                src={
                  data.images?.[activeImage]?.url ||
                  getPlaceholderImage(data.name)
                }
                alt={data.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = getPlaceholderImage(data.name);
                }}
              />

              {/* Floating badges */}
              <div className="absolute top-0 left-0 flex flex-col">
                {discount > 0 && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-none bg-rose-500 text-white text-[11px] font-bold tracking-wider">
                    -{discount}% OFF
                  </span>
                )}
                {data.isNewArrival && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-none bg-emerald-500 text-white text-[11px] font-bold tracking-wider">
                    New Arrival
                  </span>
                )}
                {data.isBestSeller && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-none bg-amber-400 text-gray-900 text-[11px] font-bold tracking-wider">
                    Bestseller
                  </span>
                )}
              </div>

              {/* Wishlist */}
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={handleWishlist}
                className={
                  "absolute top-4 right-4 p-3 rounded-full transition-all duration-200 " +
                  (inWishlist
                    ? "bg-primary-600 text-white"
                    : "bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm text-gray-500 hover:text-rose-500")
                }
              >
                <Heart size={18} className={inWishlist ? "fill-current" : ""} />
              </motion.button>
            </motion.div>

            {/* Thumbnail strip */}
            {data.images && data.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {data.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={
                      "w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200 " +
                      (i === activeImage
                        ? "border-primary-600"
                        : "border-transparent opacity-60 hover:opacity-100")
                    }
                  >
                    <img
                      src={img.url}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = getPlaceholderImage(data.name);
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right — Product info */}
          <div className="flex flex-col">
            {/* Category */}
            <p className="text-[11px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-[0.15em] mb-2 flex items-center gap-1.5">
              {data.category?.name || "Cake"}
            </p>

            <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-950 dark:text-white leading-tight mb-3">
              {data.name}
            </h1>

            {/* Rating row */}
            <div className="flex items-center gap-3 mb-5">
              <Rating value={data.ratings?.average || 0} size={15} />
              <span className="text-sm text-gray-500">
                {data.ratings?.average?.toFixed(1)} · {reviewCount} review
                {reviewCount !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Price block */}
            <div className="flex items-baseline gap-3 mb-5 flex-wrap">
              <span className="text-4xl font-black text-gray-950 dark:text-white tracking-tight">
                {formatPrice(finalPrice)}
              </span>
              {data.discountPrice > 0 && (
                <>
                  <span className="text-xl text-gray-400 line-through font-medium">
                    {formatPrice(data.price)}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                    Save {formatPrice(data.price - finalPrice)}
                  </span>
                </>
              )}
            </div>

            {data.shortDescription && (
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed text-sm">
                {data.shortDescription}
              </p>
            )}

            {/* Divider */}
            <div className="h-px bg-gray-100 dark:bg-gray-800 mb-6" />

            {/* Quantity + stock */}
            <div className="flex items-center gap-5 mb-6">
              <div className="flex items-center rounded-full border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
                >
                  <Minus size={15} />
                </button>
                <span className="px-5 py-2.5 font-bold text-gray-900 dark:text-white text-sm border-x border-gray-200 dark:border-gray-700 min-w-[48px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
                >
                  <Plus size={15} />
                </button>
              </div>
              {isInStock ? (
                <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 size={15} /> In Stock ({effectiveStock} left)
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-sm font-medium text-rose-500">
                  <Package size={15} /> Out of Stock
                </span>
              )}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <Button
                variant="outline-dark"
                size="lg"
                className="flex-1 min-w-[150px]"
                onClick={handleAddToCart}
                disabled={!isInStock}
              >
                <ShoppingCart size={16} /> Add to Cart
              </Button>
              <Button
                variant="primary"
                size="lg"
                className="flex-1 min-w-[150px]"
                onClick={handleBuyNow}
                disabled={!isInStock}
              >
                Buy Now <ArrowRight size={15} />
              </Button>
            </div>

            {/* Trust signals */}
            <div className="rounded-2xl p-4 grid grid-cols-2 gap-3">
              {[
                { icon: Truck, label: data.deliveryTime || "Fast Delivery" },
                { icon: Shield, label: "100% Secure" },
                { icon: RotateCcw, label: "Easy Returns" },
                { icon: Award, label: "Premium Quality" },
              ].map(({ icon: Icon, label }, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                    <Icon
                      size={13}
                      className="text-primary-600 dark:text-primary-400"
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Review CTA banner ── */}
        {isAuthenticated && !showReviewForm && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 p-5 rounded-2xl border border-primary-100 dark:border-primary-900/40 bg-primary-50/60 dark:bg-primary-900/10"
          >
            <div>
              <p className="font-semibold text-gray-900 dark:text-white mb-0.5">
                Enjoyed this product?
              </p>
              <p className="text-sm text-gray-500">
                Share your experience with others!
              </p>
            </div>
            <button
              onClick={() => {
                setActiveTab("reviews");
                setShowReviewForm(true);
                setTimeout(
                  () =>
                    document
                      .getElementById("reviews-section")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" }),
                  100
                );
              }}
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-all"
            >
              Write a Review
            </button>
          </motion.div>
        )}

        {/* ── Tabs ── */}
        <div
          className="border-b border-gray-100 dark:border-gray-800 mb-8"
          id="reviews-section"
        >
          <div className="flex gap-0 overflow-x-auto">
            {TABS.map((tab) => {
              const label =
                tab === "reviews"
                  ? `Reviews (${reviewCount})`
                  : tab.charAt(0).toUpperCase() + tab.slice(1);
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={
                    "relative py-3.5 px-5 text-sm font-semibold capitalize whitespace-nowrap transition-colors " +
                    (isActive
                      ? "text-primary-600 dark:text-primary-400"
                      : "text-gray-400 hover:text-gray-700 dark:hover:text-gray-300")
                  }
                >
                  {label}
                  {isActive && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400 rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mb-16 min-h-[200px]"
          >
            {activeTab === "description" && (
              <div className="prose prose-gray dark:prose-invert max-w-none text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {data.description}
              </div>
            )}

            {activeTab === "details" && (
              <div className="grid sm:grid-cols-2 gap-8">
                {data.ingredients && data.ingredients.length > 0 && (
                  <div>
                    <h3 className="font-display font-semibold text-gray-900 dark:text-white mb-3 text-base">
                      Ingredients
                    </h3>
                    <ul className="space-y-1.5">
                      {data.ingredients.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {data.allergens && data.allergens.length > 0 && (
                  <div>
                    <h3 className="font-display font-semibold text-gray-900 dark:text-white mb-3 text-base">
                      Allergens
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {data.allergens.map((a, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs font-semibold border border-amber-200 dark:border-amber-800"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {data.weight && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Weight:{" "}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {data.weight.value}
                      {data.weight.unit}
                    </span>
                  </p>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                {!isAuthenticated && (
                  <p className="text-sm text-gray-500 text-center py-6 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                    <Link
                      to="/login"
                      className="text-primary-600 hover:underline font-semibold"
                    >
                      Log in
                    </Link>{" "}
                    to write a review.
                  </p>
                )}
                {showReviewForm && (
                  <ReviewForm
                    productId={data._id}
                    productName={data.name}
                    onSuccess={handleReviewSuccess}
                    onCancel={() => setShowReviewForm(false)}
                  />
                )}
                <ReviewList
                  reviews={reviews}
                  productId={data._id}
                  onHelpfulUpdate={refetchReviews}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── Related Products ── */}
        {relatedData && relatedData.length > 0 && (
          <section className="border-t border-gray-100 dark:border-gray-800 pt-12">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-[11px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-[0.15em] mb-2 flex items-center gap-1.5">
                  You May Also Like
                </p>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-gray-950 dark:text-white">
                  Similar Styles
                </h2>
              </div>
              <Link
                to={"/shop?category=" + data.category?._id}
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 group"
              >
                View All{" "}
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedData.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
