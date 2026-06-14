import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Trash2 } from "lucide-react";
import { reviewAPI } from "../../api/endpoints.js";
import { formatDate } from "../../utils/helpers.js";
import Loader from "../../components/ui/Loader.jsx";
import Rating from "../../components/ui/Rating.jsx";
import toast from "react-hot-toast";

const AdminReviews = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["admin-reviews", filter],
    queryFn: () =>
      reviewAPI.getAll({ isApproved: filter, limit: 50 }).then((r) => r.data),
  });

  const handleApprove = async (id) => {
    try {
      await reviewAPI.approve(id);
      queryClient.invalidateQueries(["admin-reviews"]);
      toast.success("Approved");
    } catch (_) {
      toast.error("Failed");
    }
  };
  const handleDelete = async (id) => {
    if (!confirm("Delete?")) return;
    try {
      await reviewAPI.delete(id);
      queryClient.invalidateQueries(["admin-reviews"]);
      toast.success("Deleted");
    } catch (_) {
      toast.error("Failed");
    }
  };

  if (isLoading) return <Loader />;
  const reviews = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Reviews</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Moderate customer reviews
          </p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="admin-select"
        >
          <option value="">All</option>
          <option value="false">Pending</option>
          <option value="true">Approved</option>
        </select>
      </div>

      <div className="space-y-3">
        {reviews.length === 0 ? (
          <div className="admin-card p-12 text-center">
            <div className="admin-empty-state">
              <p className="admin-empty-state-text">No reviews found</p>
            </div>
          </div>
        ) : (
          reviews.map((r) => (
            <div key={r._id} className="admin-card p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row gap-4">
                <img
                  src={r.product?.images?.[0]?.url || "https://placehold.co/80"}
                  alt=""
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {r.user?.name}
                    </span>
                    <Rating value={r.rating} size={12} showValue={false} />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(r.createdAt)}
                    </span>
                    <span
                      className={
                        r.isApproved
                          ? "admin-badge-success"
                          : "admin-badge-warning"
                      }
                    >
                      {r.isApproved ? "Approved" : "Pending"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    on{" "}
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {r.product?.name}
                    </span>
                  </p>
                  {r.title && (
                    <p className="font-medium text-gray-800 dark:text-gray-200 mt-1">
                      {r.title}
                    </p>
                  )}
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 leading-relaxed">
                    {r.comment}
                  </p>
                </div>
                <div className="flex sm:flex-col gap-2 shrink-0">
                  {!r.isApproved && (
                    <button
                      onClick={() => handleApprove(r._id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white rounded-xl text-xs font-semibold transition-all duration-200"
                    >
                      <CheckCircle size={14} /> Approve
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="admin-action-delete"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminReviews;
