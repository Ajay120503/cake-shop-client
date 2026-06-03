import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { userAPI } from "../../api/endpoints.js";
import { formatDate } from "../../utils/helpers.js";
import Loader from "../../components/ui/Loader.jsx";
import toast from "react-hot-toast";

const AdminCustomers = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", page, search],
    queryFn: () =>
      userAPI.getAll({ page, search, limit: 20 }).then((r) => r.data),
  });
  const users = data?.data || [];
  const pagination = data?.pagination || {};

  const toggleBlock = async (id, isBlocked) => {
    try {
      isBlocked ? await userAPI.unblock(id) : await userAPI.block(id);
      toast.success(isBlocked ? "Unblocked" : "Blocked");
    } catch (_) {
      toast.error("Failed");
    }
  };
  const handleDelete = async (id) => {
    if (!confirm("Delete user?")) return;
    try {
      await userAPI.delete(id);
      toast.success("Deleted");
    } catch (_) {
      toast.error("Failed");
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-3xl font-display font-bold">Customers</h1>
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input sm:w-64"
        />
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Joined</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.phone || "-"}</td>
                  <td className="p-3 text-xs">{formatDate(u.createdAt)}</td>
                  <td className="p-3">
                    <span
                      className={
                        "badge " +
                        (u.isBlocked ? "badge-danger" : "badge-success")
                      }
                    >
                      {u.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="p-3 flex gap-1">
                    <button
                      onClick={() => toggleBlock(u._id, u.isBlocked)}
                      className="text-sm text-primary-600 hover:underline"
                    >
                      {u.isBlocked ? "Unblock" : "Block"}
                    </button>
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="text-sm text-red-600 hover:underline ml-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: pagination.pages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={
                "w-10 h-10 rounded-full " +
                (page === i + 1 ? "bg-primary-600 text-white" : "bg-gray-100")
              }
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
