import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2 } from "lucide-react";
import { categoryAPI } from "../../api/endpoints.js";
import Loader from "../../components/ui/Loader.jsx";
import Modal from "../../components/ui/Modal.jsx";
import { getPlaceholderImage } from "../../utils/helpers.js";
import toast from "react-hot-toast";

const AdminCategories = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    isActive: true,
    isFeatured: false,
    order: 0,
  });
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => categoryAPI.getAll().then((r) => r.data.data),
  });

  const openModal = (c) => {
    if (c) {
      setEditing(c);
      setForm({
        name: c.name,
        description: c.description || "",
        isActive: c.isActive,
        isFeatured: c.isFeatured,
        order: c.order || 0,
      });
    } else {
      setEditing(null);
      setForm({
        name: "",
        description: "",
        isActive: true,
        isFeatured: false,
        order: 0,
      });
    }
    setFile(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append("image", file);
      if (editing) await categoryAPI.update(editing._id, fd);
      else await categoryAPI.create(fd);
      toast.success(editing ? "Updated" : "Created");
      queryClient.invalidateQueries(["admin-categories"]);
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
      await categoryAPI.delete(id);
      queryClient.invalidateQueries(["admin-categories"]);
      toast.success("Deleted");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Cannot delete - products exist"
      );
    }
  };

  if (isLoading) return <Loader />;
  const categories = data || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-display font-bold">Categories</h1>
        <button
          onClick={() => openModal(null)}
          className="btn-primary text-sm py-2"
        >
          <Plus size={16} className="mr-1" /> Add Category
        </button>
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase">
              <tr>
                <th className="p-3">Image</th>
                <th className="p-3">Name</th>
                <th className="p-3">Slug</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <img
                      src={c.image?.url || getPlaceholderImage(c.name)}
                      alt=""
                      className="w-10 h-10 rounded object-cover"
                    />
                  </td>
                  <td className="p-3 font-medium">{c.name}</td>
                  <td className="p-3 text-gray-500">{c.slug}</td>
                  <td className="p-3">
                    <span
                      className={
                        "badge " +
                        (c.isActive ? "badge-success" : "badge-danger")
                      }
                    >
                      {c.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-3 flex gap-1">
                    <button
                      onClick={() => openModal(c)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Category" : "Add Category"}
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className="input"
            placeholder="Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <textarea
            className="input"
            rows={2}
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          ></textarea>
          <input
            className="input"
            type="number"
            placeholder="Display Order"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: e.target.value })}
          />
          <div className="flex gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm({ ...form, isActive: e.target.checked })
                }
              />{" "}
              Active
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) =>
                  setForm({ ...form, isFeatured: e.target.checked })
                }
              />{" "}
              Featured
            </label>
          </div>
          <div>
            <label className="label">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="input"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary text-sm"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="btn-outline text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCategories;
