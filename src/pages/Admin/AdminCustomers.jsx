import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { userAPI } from "../../api/endpoints.js";
import { formatDate } from "../../utils/helpers.js";
import Loader from "../../components/ui/Loader.jsx";
import toast from "react-hot-toast";

const AdminCustomers = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchTimerRef = useRef(null);

  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, [search]);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", page, debouncedSearch],
    queryFn: () =>
      userAPI
        .getAll({ page, search: debouncedSearch, limit: 20 })
        .then((r) => r.data),
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
    <div className="space-y-6">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Customers</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your customers
          </p>
        </div>
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-select"
          style={{ minWidth: "220px" }}
        />
      </div>

      {/* Table */}
      <div className="admin-table-wrapper">
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td className="p-3 font-semibold text-gray-900 dark:text-white">
                    {u.name}
                  </td>
                  <td className="p-3 text-gray-600 dark:text-gray-400">
                    {u.email}
                  </td>
                  <td className="p-3 text-gray-600 dark:text-gray-400">
                    {u.phone || "-"}
                  </td>
                  <td className="p-3 text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(u.createdAt)}
                  </td>
                  <td className="p-3">
                    <span
                      className={
                        u.isBlocked
                          ? "admin-badge-danger"
                          : "admin-badge-success"
                      }
                    >
                      {u.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => toggleBlock(u._id, u.isBlocked)}
                        className={
                          u.isBlocked
                            ? "admin-action-edit"
                            : "p-2 rounded-lg text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-900/20 transition-colors"
                        }
                      >
                        {u.isBlocked ? "Unblock" : "Block"}
                      </button>
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="admin-action-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="admin-empty-state">
                      <p className="admin-empty-state-text">
                        No customers found
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="admin-pagination">
          {Array.from({ length: pagination.pages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={
                page === i + 1
                  ? "admin-pagination-active"
                  : "admin-pagination-btn"
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
