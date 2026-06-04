import { useState } from "react";
import { Mail, Phone, MapPin, Send, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { contactAPI } from "../../api/endpoints.js";
import { useSettings } from "../../store/settingsStore.js";
import toast from "react-hot-toast";

const Contact = () => {
  const { settings } = useSettings();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await contactAPI.submit(form);
      toast.success("Message sent! We will get back to you soon.");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      toast.error("Failed to send");
    } finally {
      setSending(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: settings?.contactEmail || "contact@cakeshop.com",
      color: "from-primary-500 to-pink-500",
    },
    {
      icon: Phone,
      label: "Phone",
      value: settings?.contactPhone || "+91 9876543210",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: MapPin,
      label: "Address",
      value: settings?.address || "123 Baker Street, Mumbai, India",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: Clock,
      label: "Business Hours",
      value: settings?.businessHours || "Mon–Sat: 9 AM – 9 PM",
      color: "from-purple-500 to-indigo-500",
    },
  ];

  return (
    <div>
      {/* Premium Header */}
      <section className="relative min-h-[35vh] flex items-center bg-gradient-to-br from-primary-50 via-cream-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-primary-900/20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-20 dark:opacity-5">
          <div className="absolute top-10 right-10 w-60 h-60 rounded-full bg-primary-200 blur-3xl" />
          <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full bg-pink-200 blur-3xl" />
        </div>
        <div className="container-custom text-center relative z-10 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 text-xs font-semibold mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
            >
              Get in Touch
            </motion.span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold gradient-text mb-3">
              Contact Us
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              We'd love to hear from you. Drop us a message and we'll get back
              to you.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container-custom py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Contact Info Cards */}
          <div className="space-y-4">
            {contactInfo.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-soft hover:shadow-elegant transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center shadow-sm`}
                  >
                    <item.icon size={19} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                      {item.label}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      {item.value}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-elegant border border-gray-100 dark:border-gray-700"
            >
              <h2 className="text-2xl sm:text-3xl font-display font-bold mb-2 text-gray-900 dark:text-white">
                Send a Message
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Fill out the form and our team will respond within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                    placeholder="Your Name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <input
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                    type="email"
                    placeholder="Your Email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                    placeholder="Phone (Optional)"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
                  <input
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                    placeholder="Subject"
                    required
                    value={form.subject}
                    onChange={(e) =>
                      setForm({ ...form, subject: e.target.value })
                    }
                  />
                </div>

                <textarea
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all resize-none"
                  rows={5}
                  placeholder="Your Message"
                  required
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                />

                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-pink-600 hover:from-primary-700 hover:to-pink-700 text-white rounded-full font-semibold shadow-elegant hover:shadow-glow transition-all duration-200 disabled:opacity-50"
                >
                  <Send size={16} />
                  {sending ? "Sending..." : "Send Message"}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
