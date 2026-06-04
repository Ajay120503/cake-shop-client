import { useState } from "react";
import { Lock, Eye, EyeOff, Save } from "lucide-react";
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
      {/* Premium Header */}
      <div className="relative min-h-[18vh] flex items-center bg-gradient-to-br from-primary-50 via-cream-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-primary-900/20 rounded-3xl mb-8 overflow-hidden px-6 sm:px-8">
        <div className="absolute inset-0 overflow-hidden opacity-20 dark:opacity-5">
          <div className="absolute -top-10 left-1/3 w-40 h-40 rounded-full bg-primary-200 blur-3xl" />
          <div className="absolute bottom-0 right-10 w-40 h-40 rounded-full bg-pink-200 blur-3xl" />
        </div>
        <div className="relative z-10 py-8">
          <h1 className="text-3xl sm:text-4xl font-display font-bold gradient-text mb-2">
            Change Password
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Update your account password
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-soft border border-gray-100 dark:border-gray-700 space-y-4"
      >
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
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type={showPass ? "text" : "password"}
                required
                minLength={6}
                value={form[f.key]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        ))}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-pink-600 hover:from-primary-700 hover:to-pink-700 text-white rounded-xl font-semibold shadow-soft hover:shadow-elegant transition-all duration-200"
          >
            <Save size={16} />
            {loading ? "Changing..." : "Change Password"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
