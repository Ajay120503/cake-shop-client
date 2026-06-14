import { useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Tag, Wand2 } from "lucide-react";
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
  const [filePreview, setFilePreview] = useState(null);
  const [removingBg, setRemovingBg] = useState(false);
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
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFilePreview(null);
    setRemovingBg(false);
    setModalOpen(true);
  };

  const handleFileSelect = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFilePreview(URL.createObjectURL(f));
  };

  const handleRemoveBackground = useCallback(async () => {
    if (!file) {
      toast.error("Please select an image first");
      return;
    }
    setRemovingBg(true);
    try {
      const { removeBackground } = await import("@imgly/background-removal");
      const imageBlob = await removeBackground(file);
      const processedFile = new File(
        [imageBlob],
        file.name.replace(/\.[^.]+$/, ".png"),
        { type: "image/png" }
      );
      setFile(processedFile);
      if (filePreview) URL.revokeObjectURL(filePreview);
      setFilePreview(URL.createObjectURL(processedFile));
      toast.success("Background removed!");
    } catch (err) {
      toast.error("Failed to remove background. Try a different image.");
    } finally {
      setRemovingBg(false);
    }
  }, [file, filePreview]);

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
    <div className="space-y-6">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Categories</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Organize your products by categories
          </p>
        </div>
        <button onClick={() => openModal(null)} className="admin-btn-primary">
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="admin-table-wrapper">
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c._id}>
                  <td>
                    <img
                      src={c.image?.url || getPlaceholderImage(c.name)}
                      alt=""
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-gray-200 dark:ring-gray-700"
                    />
                  </td>
                  <td className="font-semibold text-gray-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      {c.name}
                      {c.isFeatured && (
                        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-1.5 py-0.5 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="text-gray-500 dark:text-gray-400 text-xs font-mono">
                    {c.slug}
                  </td>
                  <td>
                    <span
                      className={
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium " +
                        (c.isActive
                          ? "admin-badge-success"
                          : "admin-badge-danger")
                      }
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          c.isActive ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      {c.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
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
              {categories.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    <div className="admin-empty-state">
                      <div className="admin-empty-state-icon">
                        <Tag size={28} className="text-gray-400" />
                      </div>
                      <p className="admin-empty-state-text">
                        No categories found
                      </p>
                    </div>
                  </td>
                </tr>
              )}
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
          />
          <input
            className="input"
            type="number"
            placeholder="Display Order"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: e.target.value })}
          />
          <div className="flex gap-3">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm({ ...form, isActive: e.target.checked })
                }
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />{" "}
              Active
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) =>
                  setForm({ ...form, isFeatured: e.target.checked })
                }
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />{" "}
              Featured
            </label>
          </div>
          <div>
            <label className="label">Image</label>
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex-1 cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-3 text-center hover:border-primary-400">
                  <span className="text-xs text-gray-500">
                    {file ? file.name : "Click to upload image"}
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </label>
              {filePreview && (
                <div className="flex items-center gap-2">
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded-xl border border-gray-200 dark:border-gray-700"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveBackground}
                    disabled={removingBg}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg text-xs font-medium transition-all"
                  >
                    {removingBg ? (
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Wand2 size={14} />
                    )}
                    {removingBg ? "Processing..." : "Remove BG"}
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white rounded-xl text-sm font-semibold"
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
