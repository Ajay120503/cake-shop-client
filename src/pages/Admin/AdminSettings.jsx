import { useState, useEffect } from "react";
import {
  Save,
  Plus,
  Trash2,
  GripVertical,
  Image as ImageIcon,
} from "lucide-react";
import { settingsAPI } from "../../api/endpoints.js";
import Loader from "../../components/ui/Loader.jsx";
import toast from "react-hot-toast";

const emptyBanner = {
  title: "",
  subtitle: "",
  description: "",
  image: { public_id: "", url: "" },
  ctaText: "Shop Now",
  ctaLink: "/shop",
  isActive: true,
  order: 0,
};

const AdminSettings = () => {
  const [form, setForm] = useState({
    siteName: "",
    tagline: "",
    description: "",
    contactEmail: "",
    contactPhone: "",
    whatsapp: "",
    address: "",
    businessHours: "",
    shippingCharge: 50,
    freeShippingThreshold: 500,
    taxPercent: 5,
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
  });
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroBanners, setHeroBanners] = useState([]);
  const [bannerFiles, setBannerFiles] = useState({});
  const [bannerPreviews, setBannerPreviews] = useState({});
  const [savingBanners, setSavingBanners] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [savingPayments, setSavingPayments] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await settingsAPI.get();
        const s = data.data;
        setForm((f) => ({
          ...f,
          siteName: s.siteName || "",
          tagline: s.tagline || "",
          description: s.description || "",
          contactEmail: s.contactEmail || "",
          contactPhone: s.contactPhone || "",
          whatsapp: s.whatsapp || "",
          address: s.address || "",
          businessHours: s.businessHours || "",
          shippingCharge: s.shippingCharge ?? 50,
          freeShippingThreshold: s.freeShippingThreshold ?? 500,
          taxPercent: s.taxPercent ?? 5,
          facebook: s.social?.facebook || "",
          instagram: s.social?.instagram || "",
          twitter: s.social?.twitter || "",
          youtube: s.social?.youtube || "",
        }));
        if (s.heroBanners && s.heroBanners.length > 0) {
          setHeroBanners(
            s.heroBanners.map((b) => ({ ...emptyBanner, ...b, _id: b._id }))
          );
        }
        if (s.paymentMethods && s.paymentMethods.length > 0) {
          setPaymentMethods(
            s.paymentMethods
              .map((p) => ({ ...p }))
              .sort((a, b) => a.order - b.order)
          );
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const togglePaymentMethod = async (index) => {
    const next = paymentMethods.map((p, i) =>
      i === index ? { ...p, isActive: !p.isActive } : p
    );
    setPaymentMethods(next);
    try {
      const { data } = await settingsAPI.updatePaymentMethods(next);
      setPaymentMethods(
        (data.data.paymentMethods || []).map((p) => ({ ...p }))
      );
      const method = next[index];
      toast.success(
        `${method.label} ${method.isActive ? "enabled" : "disabled"}`
      );
    } catch (err) {
      setPaymentMethods(paymentMethods);
      toast.error("Failed to update payment method");
    }
  };

  const savePaymentMethods = async () => {
    setSavingPayments(true);
    try {
      const { data } = await settingsAPI.updatePaymentMethods(paymentMethods);
      setPaymentMethods(
        (data.data.paymentMethods || []).map((p) => ({ ...p }))
      );
      toast.success("Payment methods updated");
    } catch (err) {
      toast.error("Failed to update payment methods");
    } finally {
      setSavingPayments(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const social = {
        facebook: form.facebook,
        instagram: form.instagram,
        twitter: form.twitter,
        youtube: form.youtube,
      };
      const fd = new FormData();
      [
        "siteName",
        "tagline",
        "description",
        "contactEmail",
        "contactPhone",
        "whatsapp",
        "address",
        "businessHours",
        "shippingCharge",
        "freeShippingThreshold",
        "taxPercent",
      ].forEach((k) => fd.append(k, form[k] || ""));
      Object.entries(social).forEach(([k, v]) => fd.append(k, v || ""));
      if (logo) fd.append("logo", logo);
      await settingsAPI.update(fd);
      toast.success("Settings saved");
    } catch (_) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const addBanner = () =>
    setHeroBanners((prev) => [...prev, { ...emptyBanner, order: prev.length }]);
  const removeBanner = (index) => {
    setHeroBanners((prev) => prev.filter((_, i) => i !== index));
    setBannerFiles((prev) => {
      const n = { ...prev };
      delete n[index];
      return n;
    });
    setBannerPreviews((prev) => {
      const n = { ...prev };
      delete n[index];
      return n;
    });
  };
  const updateBanner = (index, field, value) => {
    setHeroBanners((prev) =>
      prev.map((b, i) => (i === index ? { ...b, [field]: value } : b))
    );
  };
  const handleBannerFile = (index, file) => {
    if (!file) return;
    setBannerFiles((prev) => ({ ...prev, [index]: file }));
    setBannerPreviews((prev) => ({
      ...prev,
      [index]: URL.createObjectURL(file),
    }));
  };

  const handleSaveBanners = async () => {
    setSavingBanners(true);
    try {
      const fd = new FormData();
      const bannersData = heroBanners.map((b, i) => {
        const { _id, image, ...rest } = b;
        const obj = { ...rest };
        if (_id) obj._id = _id;
        if (image?.url && !bannerFiles[i]) obj.image = image;
        return obj;
      });
      fd.append("heroBanners", JSON.stringify(bannersData));
      Object.entries(bannerFiles).forEach(([index, file]) =>
        fd.append(`bannerImage_${index}`, file)
      );
      const { data } = await settingsAPI.updateHeroBanners(fd);
      setHeroBanners(
        (data.data.heroBanners || []).map((b) => ({
          ...emptyBanner,
          ...b,
          _id: b._id,
        }))
      );
      setBannerFiles({});
      setBannerPreviews({});
      toast.success("Hero banners saved");
    } catch (err) {
      toast.error("Failed to save hero banners");
    } finally {
      setSavingBanners(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-3xl font-display font-bold mb-6 text-gray-900 dark:text-white">
        Store Settings
      </h1>

      {/* General Settings */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-gray-700 space-y-3">
          <h2 className="font-display font-semibold text-lg text-gray-900 dark:text-white">
            General
          </h2>
          <input
            className="input"
            placeholder="Site Name"
            value={form.siteName}
            onChange={(e) => setForm({ ...form, siteName: e.target.value })}
          />
          <input
            className="input"
            placeholder="Tagline"
            value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
          />
          <textarea
            className="input"
            rows={2}
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div>
            <label className="label">Site Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogo(e.target.files[0])}
              className="input"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-gray-700 space-y-3">
          <h2 className="font-display font-semibold text-lg text-gray-900 dark:text-white">
            Contact
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <input
              className="input"
              placeholder="Email"
              value={form.contactEmail}
              onChange={(e) =>
                setForm({ ...form, contactEmail: e.target.value })
              }
            />
            <input
              className="input"
              placeholder="Phone"
              value={form.contactPhone}
              onChange={(e) =>
                setForm({ ...form, contactPhone: e.target.value })
              }
            />
            <input
              className="input"
              placeholder="WhatsApp"
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            />
            <input
              className="input"
              placeholder="Business Hours"
              value={form.businessHours}
              onChange={(e) =>
                setForm({ ...form, businessHours: e.target.value })
              }
            />
          </div>
          <textarea
            className="input"
            rows={2}
            placeholder="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-gray-700 space-y-3">
          <h2 className="font-display font-semibold text-lg text-gray-900 dark:text-white">
            Shipping & Tax
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="label">Shipping (₹)</label>
              <input
                className="input"
                type="number"
                value={form.shippingCharge}
                onChange={(e) =>
                  setForm({ ...form, shippingCharge: e.target.value })
                }
              />
            </div>
            <div>
              <label className="label">Free Above (₹)</label>
              <input
                className="input"
                type="number"
                value={form.freeShippingThreshold}
                onChange={(e) =>
                  setForm({ ...form, freeShippingThreshold: e.target.value })
                }
              />
            </div>
            <div>
              <label className="label">Tax (%)</label>
              <input
                className="input"
                type="number"
                value={form.taxPercent}
                onChange={(e) =>
                  setForm({ ...form, taxPercent: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-gray-700 space-y-3">
          <h2 className="font-display font-semibold text-lg text-gray-900 dark:text-white">
            Social Links
          </h2>
          <input
            className="input"
            placeholder="Facebook URL"
            value={form.facebook}
            onChange={(e) => setForm({ ...form, facebook: e.target.value })}
          />
          <input
            className="input"
            placeholder="Instagram URL"
            value={form.instagram}
            onChange={(e) => setForm({ ...form, instagram: e.target.value })}
          />
          <input
            className="input"
            placeholder="Twitter URL"
            value={form.twitter}
            onChange={(e) => setForm({ ...form, twitter: e.target.value })}
          />
          <input
            className="input"
            placeholder="YouTube URL"
            value={form.youtube}
            onChange={(e) => setForm({ ...form, youtube: e.target.value })}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-pink-600 hover:from-primary-700 hover:to-pink-700 text-white rounded-xl font-semibold shadow-soft hover:shadow-elegant transition-all duration-200"
        >
          <Save size={16} /> {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>

      {/* Hero Banners Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-gray-700 space-y-4 mt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-semibold text-lg text-gray-900 dark:text-white">
              Hero Banners
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Manage the carousel banners shown on the home page.
            </p>
          </div>
          <button
            onClick={addBanner}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-pink-600 hover:from-primary-700 hover:to-pink-700 text-white rounded-xl text-sm font-semibold shadow-soft hover:shadow-elegant transition-all duration-200"
          >
            <Plus size={14} /> Add Banner
          </button>
        </div>

        {heroBanners.length === 0 && (
          <p className="text-gray-400 dark:text-gray-500 text-center py-8">
            No hero banners yet. Click "Add Banner" to create one.
          </p>
        )}

        <div className="space-y-4">
          {heroBanners.map((banner, index) => (
            <div
              key={banner._id || index}
              className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-900/50 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical size={16} className="text-gray-400" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    Banner {index + 1}
                  </span>
                  <label className="flex items-center gap-1 text-xs ml-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={banner.isActive}
                      onChange={(e) =>
                        updateBanner(index, "isActive", e.target.checked)
                      }
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    Active
                  </label>
                </div>
                <button
                  onClick={() => removeBanner(index)}
                  className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  className="input"
                  placeholder="Title (e.g. Handcrafted Cakes)"
                  value={banner.title}
                  onChange={(e) => updateBanner(index, "title", e.target.value)}
                />
                <input
                  className="input"
                  placeholder="Subtitle"
                  value={banner.subtitle}
                  onChange={(e) =>
                    updateBanner(index, "subtitle", e.target.value)
                  }
                />
                <input
                  className="input"
                  placeholder="CTA Text (e.g. Shop Now)"
                  value={banner.ctaText}
                  onChange={(e) =>
                    updateBanner(index, "ctaText", e.target.value)
                  }
                />
                <input
                  className="input"
                  placeholder="CTA Link (e.g. /shop)"
                  value={banner.ctaLink}
                  onChange={(e) =>
                    updateBanner(index, "ctaLink", e.target.value)
                  }
                />
                <input
                  className="input"
                  type="number"
                  placeholder="Order"
                  value={banner.order}
                  onChange={(e) =>
                    updateBanner(index, "order", Number(e.target.value))
                  }
                />
              </div>

              <div>
                <label className="label">Banner Image</label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-3 text-center hover:border-primary-400 transition-colors">
                      <ImageIcon
                        size={24}
                        className="mx-auto text-gray-400 mb-1"
                      />
                      <span className="text-xs text-gray-500">
                        {bannerFiles[index]
                          ? bannerFiles[index].name
                          : "Click to upload image"}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleBannerFile(index, e.target.files[0])
                      }
                    />
                  </label>
                  {(bannerPreviews[index] || banner.image?.url) && (
                    <img
                      src={bannerPreviews[index] || banner.image?.url}
                      alt={banner.title || "Banner"}
                      className="w-24 h-16 object-cover rounded-xl border border-gray-200 dark:border-gray-700"
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {heroBanners.length > 0 && (
          <button
            onClick={handleSaveBanners}
            disabled={savingBanners}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-pink-600 hover:from-primary-700 hover:to-pink-700 text-white rounded-xl font-semibold shadow-soft hover:shadow-elegant transition-all duration-200"
          >
            <Save size={16} />{" "}
            {savingBanners ? "Saving Banners..." : "Save Hero Banners"}
          </button>
        )}
      </div>

      {/* Payment Methods Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-gray-700 space-y-4 mt-6">
        <div>
          <h2 className="font-display font-semibold text-lg text-gray-900 dark:text-white">
            Payment Methods
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Enable or disable payment methods shown to customers at checkout.
          </p>
        </div>

        {paymentMethods.length === 0 ? (
          <p className="text-gray-400 dark:text-gray-500 text-center py-4">
            No payment methods configured. Loading defaults...
          </p>
        ) : (
          <div className="space-y-2">
            {paymentMethods.map((method, index) => (
              <div
                key={method.key}
                className={
                  "flex items-center justify-between p-4 rounded-xl border transition-all " +
                  (method.isActive
                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                    : "bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700")
                }
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {method.label}
                    </p>
                    {method.isActive ? (
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        DISABLED
                      </span>
                    )}
                  </div>
                  {method.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {method.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    Key:{" "}
                    <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                      {method.key}
                    </code>
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer ml-4">
                  <input
                    type="checkbox"
                    checked={method.isActive}
                    onChange={() => togglePaymentMethod(index)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            ))}
          </div>
        )}

        {paymentMethods.length > 0 && (
          <button
            onClick={savePaymentMethods}
            disabled={savingPayments}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-pink-600 hover:from-primary-700 hover:to-pink-700 text-white rounded-xl font-semibold shadow-soft hover:shadow-elegant transition-all duration-200"
          >
            <Save size={16} />{" "}
            {savingPayments ? "Saving..." : "Save Payment Methods"}
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;
