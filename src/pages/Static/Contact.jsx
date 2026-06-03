import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
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

  return (
    <div className="container-custom py-12">
      <h1 className="text-4xl font-display font-bold text-center mb-3">
        Get in Touch
      </h1>
      <p className="text-gray-600 text-center mb-10">
        We'd love to hear from you
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-4">
          <div className="card p-6">
            <Mail className="text-primary-600 mb-2" size={24} />
            <h3 className="font-semibold mb-1">Email</h3>
            <p className="text-sm text-gray-600">
              {settings?.contactEmail || "contact@cakeshop.com"}
            </p>
          </div>
          <div className="card p-6">
            <Phone className="text-primary-600 mb-2" size={24} />
            <h3 className="font-semibold mb-1">Phone</h3>
            <p className="text-sm text-gray-600">
              {settings?.contactPhone || "+91 9876543210"}
            </p>
          </div>
          <div className="card p-6">
            <MapPin className="text-primary-600 mb-2" size={24} />
            <h3 className="font-semibold mb-1">Address</h3>
            <p className="text-sm text-gray-600">
              {settings?.address || "123 Baker Street, Mumbai, India"}
            </p>
          </div>
        </div>
        <div className="card p-6 lg:col-span-2">
          <h2 className="text-2xl font-display font-bold mb-4">
            Send a Message
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                className="input"
                placeholder="Your Name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                className="input"
                type="email"
                placeholder="Your Email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                className="input"
                placeholder="Phone (Optional)"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <input
                className="input"
                placeholder="Subject"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />
            </div>
            <textarea
              className="input"
              rows={5}
              placeholder="Your Message"
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            ></textarea>
            <button type="submit" disabled={sending} className="btn-primary">
              <Send size={16} className="mr-2" />
              {sending ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
