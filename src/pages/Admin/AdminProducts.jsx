import { useState, useRef, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { productAPI, categoryAPI } from "../../api/endpoints.js";
import { formatPrice, getPlaceholderImage } from "../../utils/helpers.js";
import Loader from "../../components/ui/Loader.jsx";
import Modal from "../../components/ui/Modal.jsx";
import toast from "react-hot-toast";

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchTimerRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    shortDescription: "",
    price: "",
    discountPrice: "",
    stock: "",
    category: "",
    tags: "",
    ingredients: "",
    allergens: "",
    deliveryTime: "",
    weight: "",
    weightUnit: "g",
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    isEggless: false,
    isTrending: false,
  });
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, [search]);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-products", debouncedSearch],
    queryFn: () =>
      productAPI
        .getAll({ search: debouncedSearch, limit: 100 })
        .then((r) => r.data),
  });
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryAPI.getAll().then((r) => r.data.data),
  });

  const openModal = (p) => {
    if (p) {
      setEditing(p);
      setForm({
        name: p.name,
        description: p.description,
        shortDescription: p.shortDescription || "",
        price: p.price,
        discountPrice: p.discountPrice || "",
        stock: p.stock,
        category: p.category?._id || "",
        tags: (p.tags || []).join(","),
        ingredients: (p.ingredients || []).join(", "),
        allergens: (p.allergens || []).join(", "),
        deliveryTime: p.deliveryTime || "",
        weight: p.weight?.value || "",
        weightUnit: p.weight?.unit || "g",
        isFeatured: p.isFeatured,
        isBestSeller: p.isBestSeller,
        isNewArrival: p.isNewArrival || false,
        isEggless: p.isEggless || false,
        isTrending: p.isTrending || false,
      });
    } else {
      setEditing(null);
      setForm({
        name: "",
        description: "",
        shortDescription: "",
        price: "",
        discountPrice: "",
        stock: "",
        category: "",
        tags: "",
        ingredients: "",
        allergens: "",
        deliveryTime: "",
        weight: "",
        weightUnit: "g",
        isFeatured: false,
        isBestSeller: false,
        isNewArrival: true,
        isEggless: false,
        isTrending: false,
      });
    }
    setFiles([]);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      files.forEach((f) => fd.append("images", f));
      if (editing) await productAPI.update(editing._id, fd);
      else await productAPI.create(fd);
      toast.success(editing ? "Product updated" : "Product created");
      queryClient.invalidateQueries(["admin-products"]);
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
      await productAPI.delete(id);
      queryClient.invalidateQueries(["admin-products"]);
      toast.success("Deleted");
    } catch (_) {
      toast.error("Failed");
    }
  };

  if (isLoading) return <Loader />;
  const products = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Products</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your product catalog
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="admin-select pl-9"
              style={{ minWidth: "200px" }}
            />
          </div>
          <button onClick={() => openModal(null)} className="admin-btn-primary">
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-wrapper">
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images?.[0]?.url || getPlaceholderImage(p.name)}
                        alt=""
                        className="w-10 h-10 rounded-xl object-cover shrink-0"
                      />
                      <span className="font-semibold text-gray-900 dark:text-white truncate max-w-[200px]">
                        {p.name}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-gray-600 dark:text-gray-400">
                    {p.category?.name || "-"}
                  </td>
                  <td className="p-3 font-semibold text-gray-900 dark:text-white">
                    {formatPrice(p.discountPrice || p.price)}
                  </td>
                  <td className="p-3">
                    <span
                      className={
                        p.stock < 5
                          ? "admin-badge-danger"
                          : p.stock < 20
                          ? "admin-badge-warning"
                          : "admin-badge-success"
                      }
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={
                        p.isAvailable
                          ? "admin-badge-success"
                          : "admin-badge-danger"
                      }
                    >
                      {p.isAvailable ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => openModal(p)}
                        className="admin-action-edit"
                        title="Edit"
                      >
                        <Edit size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="admin-action-delete"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="admin-empty-state">
                      <p className="admin-empty-state-text">
                        No products found
                      </p>
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
        title={editing ? "Edit Product" : "Add Product"}
        size="xl"
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-3 max-h-[70vh] overflow-y-auto px-1 py-1"
        >
          <input
            className="input"
            placeholder="Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <textarea
            className="input"
            rows={3}
            placeholder="Description"
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              className="input"
              type="number"
              placeholder="Price"
              required
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <input
              className="input"
              type="number"
              placeholder="Discount Price"
              value={form.discountPrice}
              onChange={(e) =>
                setForm({ ...form, discountPrice: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              className="input"
              type="number"
              placeholder="Stock"
              required
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
            <select
              className="input"
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="">Select category</option>
              {(categoriesData || []).map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <input
            className="input"
            placeholder="Short Description"
            value={form.shortDescription}
            onChange={(e) =>
              setForm({ ...form, shortDescription: e.target.value })
            }
          />
          <input
            className="input"
            placeholder="Tags (comma separated)"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              className="input"
              placeholder="Ingredients (comma separated)"
              value={form.ingredients}
              onChange={(e) =>
                setForm({ ...form, ingredients: e.target.value })
              }
            />
            <input
              className="input"
              placeholder="Allergens (comma separated)"
              value={form.allergens}
              onChange={(e) => setForm({ ...form, allergens: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              className="input"
              placeholder="Delivery Time (e.g. 2-3 hours)"
              value={form.deliveryTime}
              onChange={(e) =>
                setForm({ ...form, deliveryTime: e.target.value })
              }
            />
            <div className="flex gap-2">
              <input
                className="input"
                type="number"
                placeholder="Weight"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
              />
              <select
                className="input w-20"
                value={form.weightUnit}
                onChange={(e) =>
                  setForm({ ...form, weightUnit: e.target.value })
                }
              >
                <option value="g">g</option>
                <option value="kg">kg</option>
                <option value="ml">ml</option>
                <option value="pcs">pcs</option>
              </select>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              "isFeatured",
              "isBestSeller",
              "isNewArrival",
              "isEggless",
              "isTrending",
            ].map((k) => (
              <label
                key={k}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={form[k]}
                  onChange={(e) => setForm({ ...form, [k]: e.target.checked })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                {k
                  .replace("is", "")
                  .replace(/([A-Z])/g, " $1")
                  .trim()}
              </label>
            ))}
          </div>
          <div>
            <label className="label">Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setFiles(Array.from(e.target.files))}
              className="input"
            />
          </div>
          <div className="flex gap-2 pt-2">
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

export default AdminProducts;
