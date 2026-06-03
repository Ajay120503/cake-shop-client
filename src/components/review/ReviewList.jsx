import { useState } from "react";
import {
  Star,
  ThumbsUp,
  User,
  Calendar,
  Image as ImageIcon,
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { reviewAPI } from "../../api/endpoints";

const ReviewList = ({ reviews, productId, onHelpfulUpdate }) => {
  const [helpfulLoading, setHelpfulLoading] = useState(null);

  const handleHelpful = async (reviewId) => {
    setHelpfulLoading(reviewId);
    try {
      await reviewAPI.markHelpful(reviewId);
      onHelpfulUpdate?.(reviewId);
    } catch (error) {
      console.error("Failed to mark helpful:", error);
    } finally {
      setHelpfulLoading(null);
    }
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
        <p className="text-gray-500">
          No reviews yet. Be the first to review this product!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review, idx) => (
        <motion.div
          key={review._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="border-b border-gray-100 dark:border-gray-800 pb-6 last:border-0"
        >
          <div className="flex justify-between items-start flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-pink-500 text-white flex items-center justify-center font-bold text-sm">
                {review.user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-100">
                  {review.user?.name || "Anonymous"}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Calendar size={12} />
                  <span>
                    {format(new Date(review.createdAt), "dd MMM yyyy")}
                  </span>
                  {review.isVerifiedPurchase && (
                    <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full text-[10px] font-medium">
                      Verified Purchase
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={`${
                    i < review.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                  }`}
                />
              ))}
            </div>
          </div>

          {review.title && (
            <h4 className="mt-2 font-medium text-gray-800 dark:text-gray-200">
              {review.title}
            </h4>
          )}
          <p className="mt-1 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            {review.comment}
          </p>

          {/* Review Images */}
          {review.images?.length > 0 && (
            <div className="mt-3 flex gap-2 flex-wrap">
              {review.images.map((img, i) => (
                <a
                  key={i}
                  href={img.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform"
                >
                  <img
                    src={img.url}
                    alt="review"
                    className="w-full h-full object-cover"
                  />
                  <ImageIcon
                    size={12}
                    className="absolute bottom-1 right-1 text-white drop-shadow"
                  />
                </a>
              ))}
            </div>
          )}

          {/* Helpful button */}
          <button
            onClick={() => handleHelpful(review._id)}
            disabled={helpfulLoading === review._id}
            className="mt-3 flex items-center gap-1.5 text-xs text-gray-400 hover:text-primary-600 transition-colors"
          >
            <ThumbsUp size={14} />
            <span>Helpful ({review.helpfulCount || 0})</span>
          </button>
        </motion.div>
      ))}
    </div>
  );
};

export default ReviewList;
