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
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🎂</span>
              <h3 className="text-2xl font-display font-bold text-white">
                {settings?.siteName || "Cake Shop"}
              </h3>
            </div>
            <p className="text-sm mb-4">
              {settings?.description ||
                "Premium handcrafted cakes for every celebration."}
            </p>
            <div className="flex gap-3">
              {settings?.social?.facebook && (
                <a
                  href={settings.social.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-gray-800 hover:bg-primary-600 flex items-center justify-center transition"
                >
                  <Facebook size={16} />
                </a>
              )}
              {settings?.social?.instagram && (
                <a
                  href={settings.social.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-gray-800 hover:bg-primary-600 flex items-center justify-center transition"
                >
                  <Instagram size={16} />
                </a>
              )}
              {settings?.social?.twitter && (
                <a
                  href={settings.social.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-gray-800 hover:bg-primary-600 flex items-center justify-center transition"
                >
                  <Twitter size={16} />
                </a>
              )}
              {settings?.social?.youtube && (
                <a
                  href={settings.social.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-gray-800 hover:bg-primary-600 flex items-center justify-center transition"
                >
                  <Youtube size={16} />
                </a>
              )}
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-primary-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-primary-400 transition">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary-400 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-primary-400 transition"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-primary-400 transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Customer Service
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/account/orders"
                  className="hover:text-primary-400 transition"
                >
                  My Orders
                </Link>
              </li>
              <li>
                <Link
                  to="/account/wishlist"
                  className="hover:text-primary-400 transition"
                >
                  Wishlist
                </Link>
              </li>
              <li>
                <Link
                  to="/account/addresses"
                  className="hover:text-primary-400 transition"
                >
                  Addresses
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-primary-400 transition"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3 text-sm">
              {settings?.address && (
                <li className="flex items-start gap-2">
                  <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                  <span>{settings.address}</span>
                </li>
              )}
              {settings?.contactPhone && (
                <li className="flex items-center gap-2">
                  <Phone size={16} />
                  {settings.contactPhone}
                </li>
              )}
              {settings?.contactEmail && (
                <li className="flex items-center gap-2">
                  <Mail size={16} />
                  {settings.contactEmail}
                </li>
              )}
            </ul>
            <form onSubmit={handleSubscribe} className="mt-6">
              <label className="text-sm font-medium text-white block mb-2">
                Newsletter
              </label>
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:ring-1 focus:ring-primary-500 outline-none text-sm"
                  required
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="px-4 bg-primary-600 hover:bg-primary-700 rounded-r-lg transition disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4">
        <div className="container-custom flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
          <p>
            © {new Date().getFullYear()} {settings?.siteName || "Cake Shop"}.
            All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link to="/faq" className="hover:text-primary-400">
              Privacy
            </Link>
            <Link to="/faq" className="hover:text-primary-400">
              Terms
            </Link>
            <Link to="/contact" className="hover:text-primary-400">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
