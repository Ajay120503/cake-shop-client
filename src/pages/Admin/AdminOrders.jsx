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

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-3xl font-display font-bold">Orders</h1>
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
          className="input py-2 w-auto"
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase">
              <tr>
                <th className="p-3">Order</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Items</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Date</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-mono text-xs">#{o.orderNumber}</td>
                  <td className="p-3">
                    {o.user?.name || o.shippingAddress?.fullName}
                  </td>
                  <td className="p-3">{o.items.length}</td>
                  <td className="p-3 font-bold">{formatPrice(o.totalPrice)}</td>
                  <td className="p-3">
                    <Badge
                      variant={
                        o.orderStatus === "Delivered"
                          ? "success"
                          : o.orderStatus === "Cancelled"
                          ? "danger"
                          : "warning"
                      }
                    >
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
                  <td className="p-3 text-xs">{formatDate(o.createdAt)}</td>
                  <td className="p-3">
                    <button
                      onClick={() => {
                        setModalOrder(o);
                        setNewStatus(o.orderStatus);
                      }}
                      className="text-primary-600 hover:underline"
                    >
                      Update
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
      <Modal
        isOpen={!!modalOrder}
        onClose={() => setModalOrder(null)}
        title={"Order #" + (modalOrder?.orderNumber || "")}
      >
        {modalOrder && (
          <div className="space-y-4">
            <div className="space-y-1 text-sm">
              <p>
                <strong>Customer:</strong>{" "}
                {modalOrder.user?.name || modalOrder.shippingAddress?.fullName}
              </p>
              <p>
                <strong>Total:</strong> {formatPrice(modalOrder.totalPrice)}
              </p>
              <p>
                <strong>Current Status:</strong> {modalOrder.orderStatus}
              </p>
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
                    {s}
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
              ></textarea>
            </div>
            <div className="flex gap-2">
              <button onClick={handleStatus} className="btn-primary text-sm">
                Update Status
              </button>
              <button
                onClick={() => setModalOrder(null)}
                className="btn-outline text-sm"
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
