import { useState, useEffect } from "react";
import { reviewAPI } from "../../api/endpoints";
import { Star, Edit2, Trash2, AlertCircle } from "lucide-react";
import Button from "../../components/ui/Button";
import ReviewForm from "../../components/review/ReviewForm"; // reuse same form for editing
import Modal from "../../components/ui/Modal";

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

  if (loading) return <div className="py-8 text-center">Loading...</div>;

  return (
    <div className="flex justify-center items-center flex-col">
      <h1 className="text-2xl font-bold mb-6">My Reviews</h1>
      {reviews.length === 0 ? (
        <p className="text-gray-500">You haven't written any reviews yet.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="border rounded-xl p-4 bg-white dark:bg-gray-800"
            >
              <div className="flex justify-between">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      Product: {review.product?.name}
                    </span>
                  </div>
                  {review.title && (
                    <p className="font-medium mt-1">{review.title}</p>
                  )}
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    {review.comment}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Status:{" "}
                    {review.isApproved ? "✅ Approved" : "⏳ Pending approval"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingReview(review);
                      setShowEditModal(true);
                    }}
                    className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(review._id)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Review"
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

      {/* Delete Confirmation */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Review"
      >
        <p>
          Are you sure you want to delete this review? This action cannot be
          undone.
        </p>
        <div className="flex justify-end gap-3 mt-4">
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
