import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MapPin, Plus, Trash2, Star } from "lucide-react";
import { addressAPI } from "../../api/endpoints.js";
import Loader from "../../components/ui/Loader.jsx";
import toast from "react-hot-toast";

const Addresses = () => {
  const queryClient = useQueryClient();
  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: () => addressAPI.getAll().then((r) => r.data.data || []),
  });
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    label: "Home",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addressAPI.create(form);
      queryClient.invalidateQueries(["addresses"]);
      setForm({
        fullName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
        label: "Home",
      });
      setAdding(false);
      toast.success("Address added");
    } catch (err) {
      toast.error("Failed");
    }
  };
  const handleDelete = async (id) => {
    if (!confirm("Delete?")) return;
    try {
      await addressAPI.delete(id);
      queryClient.invalidateQueries(["addresses"]);
      toast.success("Deleted");
    } catch (_) {
      toast.error("Failed");
    }
  };
  const handleSetDefault = async (id) => {
    try {
      await addressAPI.setDefault(id);
      queryClient.invalidateQueries(["addresses"]);
      toast.success("Default updated");
    } catch (_) {
      toast.error("Failed");
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="container-custom py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-display font-bold">My Addresses</h1>
        <button
          onClick={() => setAdding(!adding)}
          className="btn-primary text-sm py-2"
        >
          <Plus size={16} className="mr-1" /> Add New
        </button>
      </div>
      {adding && (
        <form onSubmit={handleSubmit} className="card p-6 mb-6">
          <h2 className="font-semibold mb-4">New Address</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              className="input"
              placeholder="Full Name"
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
            <input
              className="input"
              placeholder="Phone"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <input
              className="input sm:col-span-2"
              placeholder="Address Line 1"
              required
              value={form.addressLine1}
              onChange={(e) =>
                setForm({ ...form, addressLine1: e.target.value })
              }
            />
            <input
              className="input"
              placeholder="City"
              required
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
            <input
              className="input"
              placeholder="State"
              required
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
            />
            <input
              className="input"
              placeholder="Postal Code"
              required
              value={form.postalCode}
              onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="btn-primary text-sm">
              Save Address
            </button>
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="btn-outline text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      {addresses.length === 0 ? (
        <div className="card p-12 text-center">
          <MapPin size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No addresses yet</h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div key={addr._id} className="card p-5">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="badge-primary">
                    {addr.label || "Address"}
                  </span>
                  {addr.isDefault && (
                    <Star
                      size={14}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  )}
                </div>
                <button
                  onClick={() => handleDelete(addr._id)}
                  className="text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <p className="font-medium">{addr.fullName}</p>
              <p className="text-sm text-gray-600">{addr.addressLine1}</p>
              <p className="text-sm text-gray-600">
                {addr.city}, {addr.state} {addr.postalCode}
              </p>
              <p className="text-sm text-gray-600">📞 {addr.phone}</p>
              {!addr.isDefault && (
                <button
                  onClick={() => handleSetDefault(addr._id)}
                  className="text-sm text-primary-600 hover:underline mt-2"
                >
                  Set as default
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Addresses;
