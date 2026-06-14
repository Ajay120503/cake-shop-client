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
  Heart,
} from "lucide-react";
import { useSettings } from "../../store/settingsStore.js";
import { contactAPI } from "../../api/endpoints.js";
import toast from "react-hot-toast";

const Footer = () => {
  const { settings } = useSettings();
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const logoSrc =
    settings?.logo?.url ||
    (typeof settings?.logo === "string" ? settings.logo : null) ||
    "/logo.png";

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

  const socialLinks = [
    { key: "facebook", icon: Facebook, hoverColor: "hover:bg-primary-600" },
    { key: "instagram", icon: Instagram, hoverColor: "hover:bg-pink-600" },
    { key: "twitter", icon: Twitter, hoverColor: "hover:bg-sky-500" },
    { key: "youtube", icon: Youtube, hoverColor: "hover:bg-red-600" },
  ];

  return (
    <footer className="bg-gray-950 text-gray-300 mt-20 relative overflow-hidden border-t-2 border-white/10">
      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container-custom py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.25fr_0.8fr_0.8fr_1.15fr] gap-9">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                <img
                  src={logoSrc}
                  alt={settings?.siteName || "Cake Shop"}
                  className="h-9 w-9 object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "/favicon.svg";
                  }}
                />
              </span>
              <h3 className="text-2xl font-display font-bold text-white">
                {settings?.siteName || "Cake Shop"}
              </h3>
            </div>
            <p className="text-sm text-gray-400 mb-5 leading-relaxed">
              {settings?.description ||
                "Premium handcrafted cakes for every celebration. Made with love and the finest ingredients."}
            </p>
            <div className="flex gap-2">
              {socialLinks.map(
                ({ key, icon: Icon, hoverColor }) =>
                  settings?.social?.[key] && (
                    <a
                      key={key}
                      href={settings.social[key]}
                      target="_blank"
                      rel="noreferrer"
                      className={`w-11 h-11 rounded-full bg-white/10 ${hoverColor} flex items-center justify-center transition-all duration-200 hover:scale-110 min-h-[44px] min-w-[44px]`}
                    >
                      <Icon size={15} />
                    </a>
                  )
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-display font-semibold text-white mb-5 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-primary-500 rounded" />
              Quick Links
            </h4>
            <ul className="space-y-1 text-sm">
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
                    className="text-gray-400 hover:text-primary-400 transition-colors inline-flex items-center gap-2 group min-h-[44px] py-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500/60 group-hover:bg-primary-400 transition-colors" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-display font-semibold text-white mb-5 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-primary-500 rounded" />
              Customer Service
            </h4>
            <ul className="space-y-1 text-sm">
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
                    className="text-gray-400 hover:text-primary-400 transition-colors inline-flex items-center gap-2 group min-h-[44px] py-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500/60 group-hover:bg-primary-400 transition-colors" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="text-lg font-display font-semibold text-white mb-5 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-primary-500 rounded" />
              Contact Us
            </h4>
            <ul className="space-y-3 text-sm mb-6">
              {settings?.address && (
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={13} className="text-primary-400" />
                  </div>
                  <span className="text-gray-400">{settings.address}</span>
                </li>
              )}
              {settings?.contactPhone && (
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
                    <Phone size={13} className="text-primary-400" />
                  </div>
                  <span className="text-gray-400">{settings.contactPhone}</span>
                </li>
              )}
              {settings?.contactEmail && (
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
                    <Mail size={13} className="text-primary-400" />
                  </div>
                  <span className="text-gray-400">{settings.contactEmail}</span>
                </li>
              )}
            </ul>

            {/* Newsletter */}
            <form onSubmit={handleSubscribe}>
              <label className="text-xs font-semibold text-gray-300 mb-2 flex items-center gap-1.5">
                <Heart size={11} className="text-primary-400" />
                Newsletter
              </label>
              <div className="flex rounded-xl overflow-hidden border border-white/10 bg-white/5 focus-within:border-primary-500 transition-all duration-200 group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="flex-1 px-4 py-2.5 bg-transparent outline-none text-sm text-gray-100 placeholder-gray-500"
                  required
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="px-4 bg-primary-600 hover:bg-primary-700 transition-all disabled:opacity-50 flex items-center justify-center"
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
      <div className="border-t border-gray-800/80 relative z-10">
        <div className="container-custom py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            {settings?.siteName || "Cake Shop"}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              to="/faq"
              className="hover:text-primary-400 transition-colors min-h-[44px] inline-flex items-center"
            >
              Privacy Policy
            </Link>
            <Link
              to="/faq"
              className="hover:text-primary-400 transition-colors min-h-[44px] inline-flex items-center"
            >
              Terms of Service
            </Link>
            <Link
              to="/contact"
              className="hover:text-primary-400 transition-colors min-h-[44px] inline-flex items-center"
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
