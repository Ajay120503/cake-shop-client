import { useState } from "react";
import { useAuth } from "../../store/authStore.js";
import { authAPI } from "../../api/endpoints.js";
import { User, Mail, Phone, Save } from "lucide-react";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await authAPI.updateProfile(form);
      updateUser(data.data);
      toast.success("Profile updated");
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container-custom py-8 max-w-3xl">
      <h1 className="text-3xl font-display font-bold mb-6">My Profile</h1>
      <div className="card p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b">
          <div className="w-20 h-20 rounded-full bg-primary-600 text-white flex items-center justify-center text-2xl font-semibold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user?.name}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <p className="text-xs text-primary-600 mt-1 capitalize">
              {user?.role}
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input pl-10"
                required
              />
            </div>
          </div>
          <div>
            <label className="label">Email</label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={user?.email || ""}
                disabled
                className="input pl-10 bg-gray-50"
              />
            </div>
          </div>
          <div>
            <label className="label">Phone</label>
            <div className="relative">
              <Phone
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="input pl-10"
              />
            </div>
          </div>
          <button type="submit" disabled={saving} className="btn-primary">
            <Save size={16} className="mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
