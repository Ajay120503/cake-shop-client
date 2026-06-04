import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Send,
  Sparkles,
} from "lucide-react";
import { useSettings } from "../../store/settingsStore.js";
import { contactAPI } from "../../api/endpoints.js";
import toast from "react-hot-toast";

const Footer = () => {
  const { settings } = useSettings();
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    try {
      await contactAPI.subscribe({ email });
      toast.success("Subscribed successfully!");
      setEmail("");
    } catch (err) {
      toast.error("Subscription failed");
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 text-gray-300 mt-20 relative overflow-hidden">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-pink-500 to-amber-400" />
      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container-custom py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🎂</span>
              <h3 className="text-2xl font-display font-bold text-white">
                {settings?.siteName || "Cake Shop"}
              </h3>
            </div>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              {settings?.description ||
                "Premium handcrafted cakes for every celebration. Made with love and the finest ingredients."}
            </p>
            <div className="flex gap-2">
              {settings?.social?.facebook && (
                <a
                  href={settings.social.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-gray-800 hover:bg-gradient-to-r hover:from-primary-600 hover:to-pink-600 flex items-center justify-center transition-all duration-200 hover:scale-110"
                >
                  <Facebook size={15} />
                </a>
              )}
              {settings?.social?.instagram && (
                <a
                  href={settings.social.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-gray-800 hover:bg-gradient-to-r hover:from-pink-500 hover:to-amber-500 flex items-center justify-center transition-all duration-200 hover:scale-110"
                >
                  <Instagram size={15} />
                </a>
              )}
              {settings?.social?.twitter && (
                <a
                  href={settings.social.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-gray-800 hover:bg-gradient-to-r hover:from-sky-500 hover:to-blue-600 flex items-center justify-center transition-all duration-200 hover:scale-110"
                >
                  <Twitter size={15} />
                </a>
              )}
              {settings?.social?.youtube && (
                <a
                  href={settings.social.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-gray-800 hover:bg-gradient-to-r hover:from-red-600 hover:to-red-500 flex items-center justify-center transition-all duration-200 hover:scale-110"
                >
                  <Youtube size={15} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-display font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-primary-500 rounded" />
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { to: "/", label: "Home" },
                { to: "/shop", label: "Shop All Cakes" },
                { to: "/about", label: "About Us" },
                { to: "/contact", label: "Contact" },
                { to: "/faq", label: "FAQ" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-gray-400 hover:text-primary-400 transition-colors inline-flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-primary-400 transition-colors" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-display font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-primary-500 rounded" />
              Customer Service
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { to: "/account/orders", label: "My Orders" },
                { to: "/account/wishlist", label: "Wishlist" },
                { to: "/account/addresses", label: "Addresses" },
                { to: "/contact", label: "Support" },
                { to: "/faq", label: "Shipping Info" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-gray-400 hover:text-primary-400 transition-colors inline-flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-primary-400 transition-colors" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="text-lg font-display font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-primary-500 rounded" />
              Contact Us
            </h4>
            <ul className="space-y-3 text-sm mb-6">
              {settings?.address && (
                <li className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={13} className="text-primary-400" />
                  </div>
                  <span className="text-gray-400">{settings.address}</span>
                </li>
              )}
              {settings?.contactPhone && (
                <li className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
                    <Phone size={13} className="text-primary-400" />
                  </div>
                  <span className="text-gray-400">{settings.contactPhone}</span>
                </li>
              )}
              {settings?.contactEmail && (
                <li className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
                    <Mail size={13} className="text-primary-400" />
                  </div>
                  <span className="text-gray-400">{settings.contactEmail}</span>
                </li>
              )}
            </ul>

            {/* Newsletter */}
            <form onSubmit={handleSubscribe}>
              <label className="text-xs font-semibold text-gray-300 block mb-2 flex items-center gap-1.5">
                <Sparkles size={12} className="text-primary-400" />
                Newsletter
              </label>
              <div className="flex rounded-xl overflow-hidden border border-gray-700 focus-within:border-primary-500 transition-colors">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="flex-1 px-3.5 py-2.5 bg-gray-800 outline-none text-sm text-gray-100 placeholder-gray-500"
                  required
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="px-4 bg-gradient-to-r from-primary-600 to-pink-600 hover:from-primary-700 hover:to-pink-700 transition-all disabled:opacity-50"
                >
                  {subscribing ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin block" />
                  ) : (
                    <Send size={15} />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 relative z-10">
        <div className="container-custom py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            {settings?.siteName || "Cake Shop"}. All rights reserved.{" "}
            <span className="text-primary-400">Crafted with love</span>
          </p>
          <div className="flex gap-5">
            <Link
              to="/faq"
              className="hover:text-primary-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/faq"
              className="hover:text-primary-400 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/contact"
              className="hover:text-primary-400 transition-colors"
            >
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
