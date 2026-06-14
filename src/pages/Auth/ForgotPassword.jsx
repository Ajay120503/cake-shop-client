import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { authAPI } from "../../api/endpoints.js";
import { useSettings } from "../../store/settingsStore.js";
import SEO from "../../components/common/SEO.jsx";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const { settings } = useSettings();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.forgotPassword({ email });
      setSent(true);
      toast.success("Reset link sent to your email");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 py-12 px-4">
      <SEO title="Forgot Password" />
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
          <Link
            to="/login"
            className="inline-flex items-center text-sm text-gray-500 hover:text-primary-600 mb-4"
          >
            <ArrowLeft size={16} className="mr-1" /> Back to login
          </Link>
          {sent ? (
            <div className="text-center">
              <h2 className="text-2xl font-display font-bold mb-2">
                Check your email
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <Link to="/login" className="btn-primary">
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-display font-bold text-center mb-2">
                Forgot Password?
              </h2>
              <p className="text-sm text-gray-500 text-center mb-6">
                Enter your email to receive a reset link
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Email</label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input pl-10"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
