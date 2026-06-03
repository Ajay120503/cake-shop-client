import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { authAPI } from "../../api/endpoints.js";
import toast from "react-hot-toast";

const ChangePassword = () => {
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword)
      return toast.error("Passwords do not match");
    if (form.newPassword.length < 6)
      return toast.error("Password must be at least 6 characters");
    setLoading(true);
    try {
      await authAPI.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast.success("Password changed");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom py-8 max-w-2xl">
      <h1 className="text-3xl font-display font-bold mb-6">Change Password</h1>
      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        {[
          { key: "currentPassword", label: "Current Password" },
          { key: "newPassword", label: "New Password" },
          { key: "confirmPassword", label: "Confirm New Password" },
        ].map((f) => (
          <div key={f.key}>
            <label className="label">{f.label}</label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type={showPass ? "text" : "password"}
                required
                minLength={6}
                value={form[f.key]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                className="input pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        ))}
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Changing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
