import { useState, useRef, useEffect } from "react";
import { Star, X, Upload, AlertCircle, Loader } from "lucide-react";
import { reviewAPI } from "../../api/endpoints";
import Button from "../ui/Button";
// import Loader from "../ui/Loader";

const ReviewForm = ({
  productId,
  productName,
  onSuccess,
  onCancel,
  initialData = null,
  isEditMode = false,
  reviewId = null,
}) => {
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState(initialData?.title || "");
  const [comment, setComment] = useState(initialData?.comment || "");
  const [existingImages, setExistingImages] = useState(
    initialData?.images || []
  );
  const [newImages, setNewImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = existingImages.length + newImages.length + files.length;
    if (totalImages > 5) {
      setError("Maximum 5 images allowed");
      return;
    }
    setNewImages((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
    setError("");
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    URL.revokeObjectURL(previewUrls[index]);
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }
    if (!comment.trim()) {
      setError("Please write a review comment");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (isEditMode && reviewId) {
        // Edit mode: use multipart if new images, else JSON
        if (newImages.length > 0) {
          const formData = new FormData();
          formData.append("rating", rating);
          formData.append("title", title);
          formData.append("comment", comment);
          // Append remaining existing images (we want to keep them)
          existingImages.forEach((img) => {
            formData.append("existingImages", JSON.stringify(img));
          });
          newImages.forEach((img) => {
            formData.append("images", img);
          });
          await reviewAPI.update(reviewId, formData);
        } else {
          await reviewAPI.update(reviewId, {
            rating,
            title,
            comment,
            images: existingImages,
          });
        }
      } else {
        // Create mode
        const formData = new FormData();
        formData.append("product", productId);
        formData.append("rating", rating);
        formData.append("title", title);
        formData.append("comment", comment);
        newImages.forEach((img) => {
          formData.append("images", img);
        });
        await reviewAPI.create(formData);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {isEditMode ? "Edit Your Review" : "Write a Review"}
          {productName && " for " + productName}
        </h3>
        {onCancel && (
          <button
            onClick={onCancel}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            type="button"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Your Rating *
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none"
              >
                <Star
                  size={28}
                  className={
                    "transition-all " +
                    (star <= (hoverRating || rating)
                      ? "fill-yellow-400 text-yellow-400 scale-105"
                      : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700")
                  }
                />
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
          >
            Review Title (Optional)
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
            placeholder="Summarize your experience"
            maxLength="100"
          />
        </div>

        {/* Comment */}
        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
          >
            Your Review *
          </label>
          <textarea
            id="comment"
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all resize-y"
            placeholder="What did you like or dislike? Share your experience..."
            maxLength="1500"
            required
          />
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {comment.length}/1500
          </p>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Images (Max 5 total)
          </label>
          <div className="flex flex-wrap gap-3 items-center">
            {/* Existing images (edit mode) */}
            {existingImages.map((img, idx) => (
              <div
                key={"existing-" + idx}
                className="relative w-20 h-20 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden group"
              >
                <img
                  src={img.url}
                  alt="existing"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(idx)}
                  className="absolute top-1 right-1 bg-black/50 rounded-full p-0.5 text-white opacity-0 group-hover:opacity-100 transition"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            {/* New images preview */}
            {previewUrls.map((url, idx) => (
              <div
                key={"new-" + idx}
                className="relative w-20 h-20 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden group"
              >
                <img
                  src={url}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeNewImage(idx)}
                  className="absolute top-1 right-1 bg-black/50 rounded-full p-0.5 text-white opacity-0 group-hover:opacity-100 transition"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            {existingImages.length + newImages.length < 5 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-primary-400 hover:text-primary-500 transition"
              >
                <Upload size={20} />
                <span className="text-[10px]">Upload</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Upload up to 5 images (JPEG, PNG)
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <div className="flex gap-3 justify-end">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={loading} className="min-w-[100px]">
            {loading ? (
              <Loader size={18} className="animate-spin" />
            ) : isEditMode ? (
              "Update Review"
            ) : (
              "Submit Review"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
