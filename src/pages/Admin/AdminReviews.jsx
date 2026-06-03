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
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-3xl font-display font-bold">Reviews</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input py-2 w-auto"
        >
          <option value="">All</option>
          <option value="false">Pending</option>
          <option value="true">Approved</option>
        </select>
      </div>
      <div className="space-y-3">
        {reviews.length === 0 ? (
          <div className="card p-12 text-center text-gray-500">No reviews</div>
        ) : (
          reviews.map((r) => (
            <div
              key={r._id}
              className="card p-4 flex flex-col sm:flex-row gap-4"
            >
              <img
                src={r.product?.images?.[0]?.url || "https://placehold.co/80"}
                alt=""
                className="w-20 h-20 rounded object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{r.user?.name}</span>
                  <Rating value={r.rating} size={12} showValue={false} />
                  <span className="text-xs text-gray-500">
                    {formatDate(r.createdAt)}
                  </span>
                  <span
                    className={
                      "badge " +
                      (r.isApproved ? "badge-success" : "badge-warning")
                    }
                  >
                    {r.isApproved ? "Approved" : "Pending"}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  on <strong>{r.product?.name}</strong>
                </p>
                {r.title && <p className="font-medium mt-1">{r.title}</p>}
                <p className="text-sm text-gray-700 mt-1">{r.comment}</p>
              </div>
              <div className="flex sm:flex-col gap-2">
                {!r.isApproved && (
                  <button
                    onClick={() => handleApprove(r._id)}
                    className="btn-outline text-sm py-1.5 text-green-600"
                  >
                    <CheckCircle size={14} className="mr-1" /> Approve
                  </button>
                )}
                <button
                  onClick={() => handleDelete(r._id)}
                  className="btn-outline text-sm py-1.5 text-red-600"
                >
                  <Trash2 size={14} className="mr-1" /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminReviews;
