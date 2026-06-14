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
      {/* Premium Header */}
      <div className="relative min-h-[18vh] flex items-center rounded-3xl mb-8 overflow-hidden px-6 sm:px-8">
        {/* <div className="absolute inset-0 overflow-hidden opacity-20 dark:opacity-5">
          <div className="absolute -top-10 left-1/3 w-40 h-40 rounded-full bg-primary-200 blur-3xl" />
          <div className="absolute bottom-0 right-10 w-40 h-40 rounded-full bg-pink-200 blur-3xl" />
        </div> */}
        <div className="relative w-full z-10 py-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold gradient-text mb-2">
              My Addresses
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Manage your delivery addresses
            </p>
          </div>
          <button
            onClick={() => setAdding(!adding)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-primary-500/20 hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-200"
          >
            <Plus size={16} /> {adding ? "Cancel" : "Add New"}
          </button>
        </div>
      </div>

      {adding && (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-gray-700 mb-6"
        >
          <h2 className="font-display font-semibold text-lg text-gray-900 dark:text-white mb-4">
            New Address
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
              placeholder="Full Name"
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
            <input
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
              placeholder="Phone"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <input
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all sm:col-span-2"
              placeholder="Address Line 1"
              required
              value={form.addressLine1}
              onChange={(e) =>
                setForm({ ...form, addressLine1: e.target.value })
              }
            />
            <input
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
              placeholder="City"
              required
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
            <input
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
              placeholder="State"
              required
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
            />
            <input
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
              placeholder="Postal Code"
              required
              value={form.postalCode}
              onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-primary-500/20 hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-200"
            >
              Save Address
            </button>
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white rounded-xl text-sm font-semibold transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {addresses.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-soft border border-gray-100 dark:border-gray-700">
          <MapPin
            size={48}
            className="mx-auto text-gray-300 dark:text-gray-600 mb-4"
          />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No addresses yet
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Add an address to start receiving deliveries.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-soft hover:shadow-elegant transition-all duration-200 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                    {addr.label || "Address"}
                  </span>
                  {addr.isDefault && (
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                  )}
                </div>
                <button
                  onClick={() => handleDelete(addr._id)}
                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {addr.fullName}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {addr.addressLine1}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {addr.city}, {addr.state} {addr.postalCode}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                📞 {addr.phone}
              </p>
              {!addr.isDefault && (
                <button
                  onClick={() => handleSetDefault(addr._id)}
                  className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:underline mt-2 transition-colors"
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
