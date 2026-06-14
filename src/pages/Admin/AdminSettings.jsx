import { useState, useEffect, useCallback } from "react";
import {
  Save,
  Plus,
  Trash2,
  GripVertical,
  Image as ImageIcon,
  Wand2,
  Users,
  Package,
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
  const [removingBg, setRemovingBg] = useState({});
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

  const handleRemoveBackground = useCallback(
    async (index) => {
      const file = bannerFiles[index];
      if (!file) {
        toast.error("Please upload an image first");
        return;
      }
      setRemovingBg((prev) => ({ ...prev, [index]: true }));
      try {
        const { removeBackground } = await import("@imgly/background-removal");
        const imageBlob = await removeBackground(file);
        const processedFile = new File(
          [imageBlob],
          file.name.replace(/\.[^.]+$/, ".png"),
          { type: "image/png" }
        );
        setBannerFiles((prev) => ({ ...prev, [index]: processedFile }));
        setBannerPreviews((prev) => {
          URL.revokeObjectURL(prev[index]);
          return { ...prev, [index]: URL.createObjectURL(processedFile) };
        });
        toast.success("Background removed!");
      } catch (err) {
        toast.error("Failed to remove background. Try a different image.");
      } finally {
        setRemovingBg((prev) => ({ ...prev, [index]: false }));
      }
    },
    [bannerFiles]
  );

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
    <div className="space-y-8">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Store Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Configure your store preferences and appearance
          </p>
        </div>
      </div>

      {/* General Settings */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="admin-section-card">
          <div className="flex items-center gap-2 pb-1">
            <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <Save
                size={16}
                className="text-primary-600 dark:text-primary-400"
              />
            </div>
            <h2 className="font-display font-semibold text-lg text-gray-900 dark:text-white">
              General
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
          </div>
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

        <div className="admin-section-card">
          <div className="flex items-center gap-2 pb-1">
            <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <Users
                size={16}
                className="text-primary-600 dark:text-primary-400"
              />
            </div>
            <h2 className="font-display font-semibold text-lg text-gray-900 dark:text-white">
              Contact
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

        <div className="admin-section-card">
          <div className="flex items-center gap-2 pb-1">
            <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <Package
                size={16}
                className="text-primary-600 dark:text-primary-400"
              />
            </div>
            <h2 className="font-display font-semibold text-lg text-gray-900 dark:text-white">
              Shipping & Tax
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

        <div className="admin-section-card">
          <div className="flex items-center gap-2 pb-1">
            <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <Users
                size={16}
                className="text-primary-600 dark:text-primary-400"
              />
            </div>
            <h2 className="font-display font-semibold text-lg text-gray-900 dark:text-white">
              Social Links
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="admin-btn-primary px-8 py-3"
          >
            <Save size={16} /> {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>

      {/* Hero Banners Section */}
      <div className="admin-section-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <ImageIcon
                size={16}
                className="text-primary-600 dark:text-primary-400"
              />
            </div>
            <div>
              <h2 className="font-display font-semibold text-lg text-gray-900 dark:text-white">
                Hero Banners
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage the carousel banners shown on the home page.
              </p>
            </div>
          </div>
          <button onClick={addBanner} className="admin-btn-primary shrink-0">
            <Plus size={14} /> Add Banner
          </button>
        </div>

        {heroBanners.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon
              size={40}
              className="mx-auto text-gray-300 dark:text-gray-600 mb-3"
            />
            <p className="text-gray-400 dark:text-gray-500">
              No hero banners yet. Click "Add Banner" to create one.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {heroBanners.map((banner, index) => (
            <div
              key={banner._id || index}
              className="border border-gray-200 dark:border-gray-700/80 rounded-xl p-4 sm:p-5 bg-gray-50/50 dark:bg-gray-900/30 space-y-4 hover:border-primary-200 dark:hover:border-primary-800/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GripVertical
                    size={16}
                    className="text-gray-400 cursor-grab"
                  />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-800 px-3 py-1 rounded-lg shadow-sm">
                    Banner {index + 1}
                  </span>
                  <label className="admin-toggle">
                    <input
                      type="checkbox"
                      checked={banner.isActive}
                      onChange={(e) =>
                        updateBanner(index, "isActive", e.target.checked)
                      }
                    />
                    <span className="admin-toggle-track" />
                  </label>
                </div>
                <button
                  onClick={() => removeBanner(index)}
                  className="admin-action-delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  className="input"
                  placeholder="Title (e.g. Fresh Baked Cakes)"
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
                <div className="flex flex-wrap items-center gap-4">
                  <label className="cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 text-center hover:border-primary-400 dark:hover:border-primary-500 transition-colors w-48">
                      <ImageIcon
                        size={24}
                        className="mx-auto text-gray-400 mb-1"
                      />
                      <span className="text-xs text-gray-500">
                        {bannerFiles[index]
                          ? bannerFiles[index].name
                          : "Click to upload"}
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
                  <div className="flex items-center gap-3">
                    {(bannerPreviews[index] || banner.image?.url) && (
                      <img
                        src={bannerPreviews[index] || banner.image?.url}
                        alt={banner.title || "Banner"}
                        className="w-24 h-20 object-cover rounded-xl ring-1 ring-gray-200 dark:ring-gray-700"
                      />
                    )}
                    {bannerFiles[index] && (
                      <button
                        type="button"
                        onClick={() => handleRemoveBackground(index)}
                        disabled={removingBg[index]}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg text-xs font-medium transition-all"
                      >
                        {removingBg[index] ? (
                          <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Wand2 size={14} />
                        )}
                        {removingBg[index] ? "Processing..." : "Remove BG"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {heroBanners.length > 0 && (
          <div className="flex justify-end pt-2">
            <button
              onClick={handleSaveBanners}
              disabled={savingBanners}
              className="admin-btn-primary px-8 py-3"
            >
              <Save size={16} />{" "}
              {savingBanners ? "Saving Banners..." : "Save Hero Banners"}
            </button>
          </div>
        )}
      </div>

      {/* Payment Methods Section */}
      <div className="admin-section-card">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <Package
              size={16}
              className="text-primary-600 dark:text-primary-400"
            />
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg text-gray-900 dark:text-white">
              Payment Methods
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enable or disable payment methods shown to customers at checkout.
            </p>
          </div>
        </div>

        {paymentMethods.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center">
              <Package size={20} className="text-gray-400" />
            </div>
            <p className="text-gray-400 dark:text-gray-500">
              No payment methods configured. Loading defaults...
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {paymentMethods.map((method, index) => (
              <div
                key={method.key}
                className={
                  "flex items-center justify-between p-4 rounded-xl border transition-all duration-200 " +
                  (method.isActive
                    ? "bg-green-50/80 dark:bg-green-900/20 border-green-200 dark:border-green-800/50 shadow-sm"
                    : "bg-gray-50/50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-700/50")
                }
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {method.label}
                    </p>
                    {method.isActive ? (
                      <span className="admin-badge-success text-[10px] px-2 py-0.5">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        DISABLED
                      </span>
                    )}
                  </div>
                  {method.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {method.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    Key:{" "}
                    <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-[10px]">
                      {method.key}
                    </code>
                  </p>
                </div>
                <label className="admin-toggle ml-4 shrink-0">
                  <input
                    type="checkbox"
                    checked={method.isActive}
                    onChange={() => togglePaymentMethod(index)}
                  />
                  <span className="admin-toggle-track" />
                </label>
              </div>
            ))}
          </div>
        )}

        {paymentMethods.length > 0 && (
          <div className="flex justify-end pt-2">
            <button
              onClick={savePaymentMethods}
              disabled={savingPayments}
              className="admin-btn-primary px-8 py-3"
            >
              <Save size={16} />{" "}
              {savingPayments ? "Saving..." : "Save Payment Methods"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;
