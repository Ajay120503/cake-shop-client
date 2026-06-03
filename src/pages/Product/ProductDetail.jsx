import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  CheckCircle2,
} from "lucide-react";
import { productAPI, reviewAPI } from "../../api/endpoints.js";
import SEO from "../../components/common/SEO.jsx";
import Loader from "../../components/ui/Loader.jsx";
import Rating from "../../components/ui/Rating.jsx";
import Badge from "../../components/ui/Badge.jsx";
import ProductCard from "../../components/product/ProductCard.jsx";
import Button from "../../components/ui/Button.jsx";
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
import toast from "react-hot-toast";

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [activeImage, setActiveImage] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { isAuthenticated, user } = useAuth();

  // Fetch product data
  const { data, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => productAPI.getById(slug).then((r) => r.data.data),
  });

  // Fetch related products
  const { data: relatedData } = useQuery({
    queryKey: ["related", data?._id],
    queryFn: () => productAPI.getRelated(data._id).then((r) => r.data.data),
    enabled: !!data?._id,
  });

  // Fetch reviews (approved only)
  const { data: reviewsData, refetch: refetchReviews } = useQuery({
    queryKey: ["reviews", data?._id],
    queryFn: () => reviewAPI.getProductReviews(data._id).then((r) => r.data),
    enabled: !!data?._id,
  });

  if (isLoading) return <Loader fullScreen />;
  if (!data)
    return (
      <div className="container-custom py-20 text-center">
        Product not found
      </div>
    );

  const finalPrice = data.discountPrice > 0 ? data.discountPrice : data.price;
  const discount = getDiscountPercent(data.price, data.discountPrice);
  const inWishlist = isInWishlist(data._id);
  const reviews = reviewsData?.data || [];

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
        toast.success("Removed");
      } else {
        await addToWishlist(data._id);
        toast.success("Added");
      }
    } catch (_) {}
  };

  const handleReviewSuccess = () => {
    setShowReviewForm(false);
    toast.success("Review submitted! It will be visible after admin approval.");
    refetchReviews();
  };

  const handleHelpfulUpdate = () => {
    refetchReviews();
  };

  return (
    <div className="container-custom py-8">
      <SEO
        title={data.name}
        description={
          data.shortDescription || data.description?.slice(0, 200) || ""
        }
        image={data.images?.[0]?.url || ""}
      />
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
        <Link to="/" className="hover:text-primary-600">
          Home
        </Link>
        <ChevronRight size={14} />
        <Link to="/shop" className="hover:text-primary-600">
          Shop
        </Link>
        <ChevronRight size={14} />
        {data.category && (
          <>
            <Link
              to={"/shop?category=" + data.category._id}
              className="hover:text-primary-600"
            >
              {data.category.name}
            </Link>
            <ChevronRight size={14} />
          </>
        )}
        <span className="text-gray-700 truncate">{data.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Images */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-cream-100 to-primary-50 mb-4">
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
          </div>
          {data.images && data.images.length > 1 && (
            <div className="flex gap-2">
              {data.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={
                    "w-20 h-20 rounded-lg overflow-hidden border-2 " +
                    (i === activeImage
                      ? "border-primary-600"
                      : "border-transparent")
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

        {/* Product details */}
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {data.isNewArrival && <Badge variant="success">New</Badge>}
            {discount > 0 && <Badge variant="danger">-{discount}% OFF</Badge>}
            {data.isEggless && <Badge variant="info">Eggless</Badge>}
            {data.isBestSeller && <Badge variant="warning">Bestseller</Badge>}
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold mb-3">
            {data.name}
          </h1>
          <p className="text-sm text-primary-600 mb-3">{data.category?.name}</p>
          <div className="flex items-center gap-3 mb-4">
            <Rating value={data.ratings?.average || 0} />
            <span className="text-sm text-gray-500">
              ({data.reviewsCount || 0} reviews)
            </span>
          </div>
          <div className="flex items-baseline gap-3 mb-6 flex-wrap">
            <span className="text-4xl font-bold text-primary-600">
              {formatPrice(finalPrice)}
            </span>
            {data.discountPrice > 0 && (
              <span className="text-xl text-gray-500 line-through">
                {formatPrice(data.price)}
              </span>
            )}
            {discount > 0 && (
              <Badge variant="success">
                Save {formatPrice(data.price - finalPrice)}
              </Badge>
            )}
          </div>
          {data.shortDescription && (
            <p className="text-gray-600 mb-6">{data.shortDescription}</p>
          )}

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-gray-300 rounded-full">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2"
              >
                <Minus size={16} />
              </button>
              <span className="px-4 font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="text-sm">
              {data.stock > 0 ? (
                <span className="text-green-600">In Stock ({data.stock})</span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={data.stock === 0}
              className="btn-outline flex-1 min-w-[150px]"
            >
              <ShoppingCart size={16} /> Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={data.stock === 0}
              className="btn-primary flex-1 min-w-[150px]"
            >
              Buy Now
            </button>
            <button
              onClick={handleWishlist}
              className={
                "btn-outline px-4 " +
                (inWishlist ? "bg-primary-50 text-primary-600" : "")
              }
            >
              <Heart size={16} className={inWishlist ? "fill-current" : ""} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm border-t pt-6">
            <div className="flex items-center gap-2">
              <Truck size={16} className="text-primary-600" />
              {data.deliveryTime}
            </div>
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-primary-600" /> 100% Secure
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw size={16} className="text-primary-600" /> Easy Returns
            </div>
            <div className="flex items-center gap-2">
              <Award size={16} className="text-primary-600" /> Premium Quality
            </div>
          </div>
        </div>
      </div>

      {/* Review CTA - always visible above tabs for authenticated users */}
      {isAuthenticated && !showReviewForm && (
        <div className="flex justify-between items-center mb-6 p-4 bg-gradient-to-r from-primary-50 to-cream-100 rounded-xl">
          <div>
            <p className="font-semibold">Enjoyed this product?</p>
            <p className="text-sm text-gray-600">
              Share your experience with others!
            </p>
          </div>
          <Button
            onClick={() => {
              setActiveTab("reviews (" + (data.reviewsCount || 0) + ")");
              setShowReviewForm(true);
              setTimeout(() => {
                document
                  .getElementById("reviews-section")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }, 100);
            }}
            className="shrink-0"
          >
            Write a Review
          </Button>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b mb-6" id="reviews-section">
        <div className="flex gap-6 overflow-x-auto">
          {[
            "description",
            "ingredients",
            "reviews (" + (data.reviewsCount || 0) + ")",
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={
                "py-3 capitalize font-medium border-b-2 whitespace-nowrap " +
                (activeTab === tab
                  ? "border-primary-600 text-primary-600"
                  : "border-transparent text-gray-500")
              }
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="mb-12 min-h-[200px]">
        {activeTab === "description" && (
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {data.description}
          </p>
        )}
        {activeTab === "ingredients" && (
          <div className="grid sm:grid-cols-2 gap-6">
            {data.ingredients && data.ingredients.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Ingredients</h3>
                <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                  {data.ingredients.map((i, idx) => (
                    <li key={idx}>{i}</li>
                  ))}
                </ul>
              </div>
            )}
            {data.allergens && data.allergens.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Allergens</h3>
                <div className="flex flex-wrap gap-2">
                  {data.allergens.map((a, idx) => (
                    <Badge key={idx} variant="warning">
                      {a}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {data.weight && (
              <p className="text-sm">
                Weight: {data.weight.value}
                {data.weight.unit}
              </p>
            )}
          </div>
        )}
        {activeTab.startsWith("reviews") && (
          <div className="space-y-6">
            {/* Auth prompt for non-logged-in users */}
            {!isAuthenticated && (
              <p className="text-sm text-gray-500 text-center py-4">
                <Link
                  to="/login"
                  className="text-primary-600 hover:underline font-medium"
                >
                  Log in
                </Link>{" "}
                to write a review.
              </p>
            )}

            {/* Review Form */}
            {showReviewForm && (
              <ReviewForm
                productId={data._id}
                productName={data.name}
                onSuccess={handleReviewSuccess}
                onCancel={() => setShowReviewForm(false)}
              />
            )}

            {/* Reviews List */}
            <ReviewList
              reviews={reviews}
              productId={data._id}
              onHelpfulUpdate={handleHelpfulUpdate}
            />
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedData && relatedData.length > 0 && (
        <section className="py-8 border-t">
          <h2 className="text-2xl font-display font-bold mb-6">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedData.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
