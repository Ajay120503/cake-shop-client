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
            s.heroBanners.map((b) => ({
              ...emptyBanner,
              ...b,
              _id: b._id,
            }))
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
    // Compute the next state
    const next = paymentMethods.map((p, i) =>
      i === index ? { ...p, isActive: !p.isActive } : p
    );
    // Update UI immediately for snappy feedback
    setPaymentMethods(next);
    // Persist to the API right away
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
      // Revert on failure
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

  // Hero banner handlers
  const addBanner = () => {
    setHeroBanners((prev) => [...prev, { ...emptyBanner, order: prev.length }]);
  };

  const removeBanner = (index) => {
    setHeroBanners((prev) => prev.filter((_, i) => i !== index));
    setBannerFiles((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
    setBannerPreviews((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
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
    const preview = URL.createObjectURL(file);
    setBannerPreviews((prev) => ({ ...prev, [index]: preview }));
  };

  const handleSaveBanners = async () => {
    setSavingBanners(true);
    try {
      const fd = new FormData();
      const bannersData = heroBanners.map((b, i) => {
        const { _id, image, ...rest } = b;
        const bannerObj = { ...rest };
        if (_id) bannerObj._id = _id;
        // If we have an existing image and no new file, keep the existing image
        if (image?.url && !bannerFiles[i]) {
          bannerObj.image = image;
        }
        return bannerObj;
      });
      fd.append("heroBanners", JSON.stringify(bannersData));
      // Attach new files
      Object.entries(bannerFiles).forEach(([index, file]) => {
        fd.append(`bannerImage_${index}`, file);
      });
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
      <h1 className="text-3xl font-display font-bold mb-6">Store Settings</h1>

      {/* General Settings */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6 space-y-3">
          <h2 className="font-semibold">General</h2>
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
          ></textarea>
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

        <div className="card p-6 space-y-3">
          <h2 className="font-semibold">Contact</h2>
          <div className="grid grid-cols-2 gap-2">
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
          ></textarea>
        </div>

        <div className="card p-6 space-y-3">
          <h2 className="font-semibold">Shipping & Tax</h2>
          <div className="grid grid-cols-3 gap-2">
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

        <div className="card p-6 space-y-3">
          <h2 className="font-semibold">Social Links</h2>
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

        <button type="submit" disabled={saving} className="btn-primary">
          <Save size={16} className="mr-2" />
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>

      {/* Hero Banners Section */}
      <div className="card p-6 space-y-4 mt-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Hero Banners</h2>
          <button onClick={addBanner} className="btn-primary text-sm">
            <Plus size={14} className="mr-1" />
            Add Banner
          </button>
        </div>
        <p className="text-sm text-gray-500">
          Manage the carousel banners shown on the home page. Add an image,
          title, subtitle, and a call-to-action link.
        </p>

        {heroBanners.length === 0 && (
          <p className="text-gray-400 text-center py-8">
            No hero banners yet. Click "Add Banner" to create one.
          </p>
        )}

        <div className="space-y-4">
          {heroBanners.map((banner, index) => (
            <div
              key={banner._id || index}
              className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical size={16} className="text-gray-400" />
                  <span className="text-sm font-medium">
                    Banner {index + 1}
                  </span>
                  <label className="flex items-center gap-1 text-xs ml-2">
                    <input
                      type="checkbox"
                      checked={banner.isActive}
                      onChange={(e) =>
                        updateBanner(index, "isActive", e.target.checked)
                      }
                      className="rounded"
                    />
                    Active
                  </label>
                </div>
                <button
                  onClick={() => removeBanner(index)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                >
                  <Trash2 size={16} />
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
                  placeholder="Subtitle (e.g. Order Now for Free Delivery)"
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

              {/* Image upload */}
              <div>
                <label className="label">Banner Image</label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <div className="border-2 border-dashed rounded-lg p-3 text-center hover:border-primary transition-colors">
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
                      className="w-24 h-16 object-cover rounded-lg border"
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
            className="btn-primary"
          >
            <Save size={16} className="mr-2" />
            {savingBanners ? "Saving Banners..." : "Save Hero Banners"}
          </button>
        )}
      </div>

      {/* Payment Methods Section */}
      <div className="card p-6 space-y-4 mt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-lg">Payment Methods</h2>
            <p className="text-sm text-gray-500">
              Enable or disable payment methods shown to customers at checkout.
            </p>
          </div>
        </div>

        {paymentMethods.length === 0 ? (
          <p className="text-gray-400 text-center py-4">
            No payment methods configured. Loading defaults...
          </p>
        ) : (
          <div className="space-y-2">
            {paymentMethods.map((method, index) => (
              <div
                key={method.key}
                className={
                  "flex items-center justify-between p-4 rounded-lg border transition " +
                  (method.isActive
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50 border-gray-200")
                }
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{method.label}</p>
                    {method.isActive ? (
                      <span className="bg-green-100 text-green-700 text-[10px] font-medium px-2 py-0.5 rounded-full">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="bg-gray-200 text-gray-600 text-[10px] font-medium px-2 py-0.5 rounded-full">
                        DISABLED
                      </span>
                    )}
                  </div>
                  {method.description && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {method.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-0.5">
                    Key:{" "}
                    <code className="bg-gray-100 px-1 rounded">
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
            className="btn-primary"
          >
            <Save size={16} className="mr-2" />
            {savingPayments ? "Saving..." : "Save Payment Methods"}
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;
