import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { productAPI, uploadAPI, categoryAPI } from "../../api/endpoints.js";
import { formatPrice, getPlaceholderImage } from "../../utils/helpers.js";
import Loader from "../../components/ui/Loader.jsx";
import Modal from "../../components/ui/Modal.jsx";
import toast from "react-hot-toast";

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
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

  const { data, isLoading } = useQuery({
    queryKey: ["admin-products", search],
    queryFn: () =>
      productAPI.getAll({ search, limit: 100 }).then((r) => r.data),
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
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-3xl font-display font-bold">Products</h1>
        <div className="flex gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="input pl-10"
            />
          </div>
          <button
            onClick={() => openModal(null)}
            className="btn-primary text-sm py-2"
          >
            <Plus size={16} className="mr-1" /> Add Product
          </button>
        </div>
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 flex items-center gap-2">
                    <img
                      src={p.images?.[0]?.url || getPlaceholderImage(p.name)}
                      alt=""
                      className="w-10 h-10 rounded object-cover"
                    />
                    <span className="font-medium">{p.name}</span>
                  </td>
                  <td className="p-3">{p.category?.name || "-"}</td>
                  <td className="p-3">
                    {formatPrice(p.discountPrice || p.price)}
                  </td>
                  <td className="p-3">
                    <span className={p.stock < 10 ? "text-red-600" : ""}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={
                        "badge " +
                        (p.isAvailable ? "badge-success" : "badge-danger")
                      }
                    >
                      {p.isAvailable ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-3 flex gap-1">
                    <button
                      onClick={() => openModal(p)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
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
          ></textarea>
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
              <label key={k} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form[k]}
                  onChange={(e) => setForm({ ...form, [k]: e.target.checked })}
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

export default AdminProducts;
