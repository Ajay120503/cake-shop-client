import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { orderAPI } from "../../api/endpoints.js";
import { formatPrice, formatDate } from "../../utils/helpers.js";
import Loader from "../../components/ui/Loader.jsx";
import Modal from "../../components/ui/Modal.jsx";
import Badge from "../../components/ui/Badge.jsx";
import toast from "react-hot-toast";

const STATUSES = [
  "Processing",
  "Confirmed",
  "Preparing",
  "Shipped",
  "Out_for_Delivery",
  "Delivered",
  "Cancelled",
  "Refunded",
];

const AdminOrders = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [modalOrder, setModalOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [note, setNote] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-orders", page, filter],
    queryFn: () =>
      orderAPI.getAll({ page, status: filter, limit: 20 }).then((r) => r.data),
  });

  const handleStatus = async () => {
    if (!newStatus) return;
    try {
      await orderAPI.updateStatus(modalOrder._id, { status: newStatus, note });
      toast.success("Status updated");
      queryClient.invalidateQueries(["admin-orders"]);
      setModalOrder(null);
      setNewStatus("");
      setNote("");
    } catch (err) {
      toast.error("Failed");
    }
  };

  if (isLoading) return <Loader />;
  const orders = data?.data || [];
  const pagination = data?.pagination || {};

  const getStatusBadgeVariant = (status) => {
    if (status === "Delivered") return "success";
    if (status === "Cancelled" || status === "Refunded") return "danger";
    return "warning";
  };

  return (
    <div className="space-y-6">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Orders</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage customer orders
          </p>
        </div>
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
          className="admin-select"
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="admin-table-wrapper">
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td className="p-3">
                    <span className="font-mono text-xs font-bold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg">
                      #{o.orderNumber}
                    </span>
                  </td>
                  <td className="p-3 font-medium text-gray-900 dark:text-white">
                    {o.user?.name || o.shippingAddress?.fullName}
                  </td>
                  <td className="p-3 text-gray-600 dark:text-gray-400">
                    {o.items.length}
                  </td>
                  <td className="p-3 font-bold text-gray-900 dark:text-white">
                    {formatPrice(o.totalPrice)}
                  </td>
                  <td className="p-3">
                    <Badge variant={getStatusBadgeVariant(o.orderStatus)}>
                      {o.orderStatus.replace(/_/g, " ")}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Badge
                      variant={
                        o.paymentStatus === "Paid" ? "success" : "warning"
                      }
                    >
                      {o.paymentStatus}
                    </Badge>
                  </td>
                  <td className="p-3 text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(o.createdAt)}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => {
                        setModalOrder(o);
                        setNewStatus(o.orderStatus);
                      }}
                      className="px-3 py-1.5 text-xs font-semibold bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/50 rounded-lg transition-colors"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={8}>
                    <div className="admin-empty-state">
                      <p className="admin-empty-state-text">No orders found</p>
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

      {/* Modal */}
      <Modal
        isOpen={!!modalOrder}
        onClose={() => setModalOrder(null)}
        title={"Order #" + (modalOrder?.orderNumber || "")}
        size="lg"
      >
        {modalOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                  Customer
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {modalOrder.user?.name ||
                    modalOrder.shippingAddress?.fullName}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                  Total
                </p>
                <p className="text-sm font-bold text-primary-600 dark:text-primary-400">
                  {formatPrice(modalOrder.totalPrice)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                  Current Status
                </p>
                <Badge variant={getStatusBadgeVariant(modalOrder.orderStatus)}>
                  {modalOrder.orderStatus.replace(/_/g, " ")}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                  Payment
                </p>
                <Badge
                  variant={
                    modalOrder.paymentStatus === "Paid" ? "success" : "warning"
                  }
                >
                  {modalOrder.paymentStatus}
                </Badge>
              </div>
            </div>

            <div>
              <label className="label">New Status</label>
              <select
                className="input"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Note (Optional)</label>
              <textarea
                className="input"
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={handleStatus} className="admin-btn-primary">
                Update Status
              </button>
              <button
                onClick={() => setModalOrder(null)}
                className="admin-btn-outline"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminOrders;
