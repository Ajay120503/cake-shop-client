import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff } from "lucide-react";
import { authAPI } from "../../api/endpoints.js";
import { useSettings } from "../../store/settingsStore.js";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const { settings } = useSettings();
  const { token } = useParams();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.resetPassword(token, { password });
      toast.success("Password reset successful!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-cream-100 to-secondary-50 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link to="/" className="inline-block">
            <span className="text-5xl">🎂</span>
            <h1 className="text-2xl font-display font-bold gradient-text mt-2">
              {settings?.siteName || "Cake Shop"}
            </h1>
          </Link>
        </div>
        <div className="card p-8">
          <h2 className="text-2xl font-display font-bold text-center mb-2">
            Reset Password
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Enter your new password
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">New Password</label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPass ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            <Link to="/login" className="text-primary-600 hover:underline">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
