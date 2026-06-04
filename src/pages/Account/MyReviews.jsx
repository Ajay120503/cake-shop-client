import { useState, useEffect } from "react";
import { reviewAPI } from "../../api/endpoints";
import { Star, Edit2, Trash2 } from "lucide-react";
import Button from "../../components/ui/Button";
import ReviewForm from "../../components/review/ReviewForm";
import Modal from "../../components/ui/Modal";
import Badge from "../../components/ui/Badge";
import Loader from "../../components/ui/Loader";

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchUserReviews();
  }, []);

  const fetchUserReviews = async () => {
    try {
      const res = await reviewAPI.getUserReviews();
      setReviews(res.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await reviewAPI.delete(id);
      fetchUserReviews();
    } catch (error) {
      alert("Failed to delete review");
    }
    setDeleteConfirm(null);
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    setEditingReview(null);
    fetchUserReviews();
  };

  if (loading) return <Loader />;

  return (
    <div className="container-custom py-8">
      {/* Premium Header */}
      <div className="relative min-h-[20vh] flex items-center bg-gradient-to-br from-primary-50 via-cream-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-primary-900/20 rounded-3xl mb-8 overflow-hidden px-6 sm:px-8">
        <div className="absolute inset-0 overflow-hidden opacity-20 dark:opacity-5">
          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-primary-200 blur-3xl" />
          <div className="absolute bottom-0 right-10 w-40 h-40 rounded-full bg-pink-200 blur-3xl" />
        </div>
        <div className="relative z-10 py-10">
          <h1 className="text-3xl sm:text-4xl font-display font-bold gradient-text mb-2">
            My Reviews
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Manage your product reviews and feedback
          </p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-soft border border-gray-100 dark:border-gray-700">
          <Star
            size={48}
            className="mx-auto text-gray-300 dark:text-gray-600 mb-4"
          />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No reviews yet
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            You haven't written any reviews yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-soft hover:shadow-elegant transition-all duration-200 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={15}
                          className={
                            i < review.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-300 dark:text-gray-600"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {review.product?.name}
                    </span>
                    <Badge variant={review.isApproved ? "success" : "warning"}>
                      {review.isApproved ? "Approved" : "Pending"}
                    </Badge>
                  </div>
                  {review.title && (
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {review.title}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      setEditingReview(review);
                      setShowEditModal(true);
                    }}
                    className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(review._id)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showEditModal}
        // onClose={() => setShowEditModal(false)}
        title=""
      >
        {editingReview && (
          <ReviewForm
            productId={editingReview.product._id}
            productName={editingReview.product.name}
            initialData={{
              rating: editingReview.rating,
              title: editingReview.title,
              comment: editingReview.comment,
            }}
            isEditMode
            reviewId={editingReview._id}
            onSuccess={handleEditSuccess}
            onCancel={() => setShowEditModal(false)}
          />
        )}
      </Modal>

      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Review"
      >
        <p className="text-gray-600 dark:text-gray-400">
          Are you sure you want to delete this review? This action cannot be
          undone.
        </p>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => handleDelete(deleteConfirm)}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default MyReviews;
