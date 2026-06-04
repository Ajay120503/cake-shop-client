import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Trash2 } from "lucide-react";
import { reviewAPI } from "../../api/endpoints.js";
import { formatDate } from "../../utils/helpers.js";
import Loader from "../../components/ui/Loader.jsx";
import Rating from "../../components/ui/Rating.jsx";
import Badge from "../../components/ui/Badge.jsx";
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
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
          Reviews
        </h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full sm:w-auto px-4 py-2.5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
        >
          <option value="">All</option>
          <option value="false">Pending</option>
          <option value="true">Approved</option>
        </select>
      </div>

      <div className="space-y-3">
        {reviews.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center text-gray-500 dark:text-gray-400 shadow-soft border border-gray-100 dark:border-gray-700">
            No reviews yet
          </div>
        ) : (
          reviews.map((r) => (
            <div
              key={r._id}
              className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 shadow-soft border border-gray-100 dark:border-gray-700 hover:shadow-elegant transition-all duration-200"
            >
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
                    <Badge variant={r.isApproved ? "success" : "warning"}>
                      {r.isApproved ? "Approved" : "Pending"}
                    </Badge>
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
                    className="inline-flex items-center gap-1.5 px-4 py-2 border-2 border-red-400 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-xs font-semibold transition-all duration-200"
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
