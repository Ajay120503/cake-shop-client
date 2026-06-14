import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2 } from "lucide-react";
import { couponAPI } from "../../api/endpoints.js";
import { formatDate } from "../../utils/helpers.js";
import Loader from "../../components/ui/Loader.jsx";
import Modal from "../../components/ui/Modal.jsx";
import toast from "react-hot-toast";

const AdminCoupons = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    code: "",
    name: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: 0,
    maxDiscountAmount: "",
    usageLimit: "",
    usagePerUser: 1,
    validUntil: "",
  });
  const [saving, setSaving] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-coupons"],
    queryFn: () => couponAPI.getAll().then((r) => r.data.data),
  });

  const openModal = (c) => {
    if (c) {
      setEditing(c);
      setForm({
        code: c.code,
        name: c.name,
        description: c.description || "",
        discountType: c.discountType,
        discountValue: c.discountValue,
        minOrderAmount: c.minOrderAmount,
        maxDiscountAmount: c.maxDiscountAmount || "",
        usageLimit: c.usageLimit || "",
        usagePerUser: c.usagePerUser,
        validUntil: c.validUntil ? c.validUntil.substring(0, 10) : "",
      });
    } else {
      setEditing(null);
      setForm({
        code: "",
        name: "",
        description: "",
        discountType: "percentage",
        discountValue: "",
        minOrderAmount: 0,
        maxDiscountAmount: "",
        usageLimit: "",
        usagePerUser: 1,
        validUntil: "",
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        discountValue: Number(form.discountValue),
        minOrderAmount: Number(form.minOrderAmount),
        maxDiscountAmount: form.maxDiscountAmount
          ? Number(form.maxDiscountAmount)
          : undefined,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
        usagePerUser: Number(form.usagePerUser),
        validUntil: new Date(form.validUntil).toISOString(),
      };
      if (editing) await couponAPI.update(editing._id, payload);
      else await couponAPI.create(payload);
      toast.success(editing ? "Updated" : "Created");
      queryClient.invalidateQueries(["admin-coupons"]);
      setModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete?")) return;
    try {
      await couponAPI.delete(id);
      queryClient.invalidateQueries(["admin-coupons"]);
      toast.success("Deleted");
    } catch (_) {
      toast.error("Failed");
    }
  };

  if (isLoading) return <Loader />;
  const coupons = data || [];

  return (
    <div className="space-y-6">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Coupons</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage discount coupons
          </p>
        </div>
        <button onClick={() => openModal(null)} className="admin-btn-primary">
          <Plus size={16} /> Add Coupon
        </button>
      </div>

      {/* Table */}
      <div className="admin-table-wrapper">
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Discount</th>
                <th>Min Order</th>
                <th>Used/Limit</th>
                <th>Valid Until</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c._id}>
                  <td className="p-3 font-mono font-bold text-primary-600 dark:text-primary-400">
                    {c.code}
                  </td>
                  <td className="p-3 font-medium text-gray-900 dark:text-white">
                    {c.name}
                  </td>
                  <td className="p-3 text-gray-900 dark:text-white">
                    {c.discountType === "percentage"
                      ? c.discountValue + "%"
                      : "₹" + c.discountValue}
                  </td>
                  <td className="p-3 text-gray-600 dark:text-gray-400">
                    ₹{c.minOrderAmount}
                  </td>
                  <td className="p-3 text-gray-600 dark:text-gray-400">
                    {c.usedCount}/{c.usageLimit || "∞"}
                  </td>
                  <td className="p-3 text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(c.validUntil)}
                  </td>
                  <td className="p-3">
                    <span
                      className={
                        c.isActive
                          ? "admin-badge-success"
                          : "admin-badge-danger"
                      }
                    >
                      {c.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => openModal(c)}
                        className="admin-action-edit"
                      >
                        <Edit size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="admin-action-delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan={8}>
                    <div className="admin-empty-state">
                      <p className="admin-empty-state-text">No coupons found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Coupon" : "Add Coupon"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <input
              className="input"
              placeholder="Code"
              required
              value={form.code}
              onChange={(e) =>
                setForm({ ...form, code: e.target.value.toUpperCase() })
              }
            />
            <input
              className="input"
              placeholder="Name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <textarea
            className="input"
            rows={2}
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="grid grid-cols-3 gap-2">
            <select
              className="input"
              value={form.discountType}
              onChange={(e) =>
                setForm({ ...form, discountType: e.target.value })
              }
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed</option>
            </select>
            <input
              className="input"
              type="number"
              placeholder="Discount Value"
              required
              value={form.discountValue}
              onChange={(e) =>
                setForm({ ...form, discountValue: e.target.value })
              }
            />
            <input
              className="input"
              type="number"
              placeholder="Max Discount"
              value={form.maxDiscountAmount}
              onChange={(e) =>
                setForm({ ...form, maxDiscountAmount: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <input
              className="input"
              type="number"
              placeholder="Min Order"
              value={form.minOrderAmount}
              onChange={(e) =>
                setForm({ ...form, minOrderAmount: e.target.value })
              }
            />
            <input
              className="input"
              type="number"
              placeholder="Usage Limit"
              value={form.usageLimit}
              onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
            />
            <input
              className="input"
              type="number"
              placeholder="Per User"
              value={form.usagePerUser}
              onChange={(e) =>
                setForm({ ...form, usagePerUser: e.target.value })
              }
            />
          </div>
          <input
            className="input"
            type="date"
            placeholder="Valid Until"
            required
            value={form.validUntil}
            onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
          />
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="admin-btn-primary"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="admin-btn-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCoupons;
