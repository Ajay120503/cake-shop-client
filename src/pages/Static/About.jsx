import { useEffect } from "react";
import { Cake, Heart, Award, Users } from "lucide-react";
import { motion } from "framer-motion";
import SEO from "../../components/common/SEO.jsx";
import { useSettings } from "../../store/settingsStore.js";
import Loader from "../../components/ui/Loader.jsx";

const About = () => {
  const { settings, loading, fetchSettings } = useSettings();

  useEffect(() => {
    if (!settings) fetchSettings();
  }, [settings, fetchSettings]);

  if (loading || !settings) return <Loader />;

  const {
    siteName = "Cake Shop",
    tagline = "Baked with love",
    description = "At Cake Shop, every cake tells a story. Our master bakers combine traditional techniques with modern flavors to create unforgettable experiences.",
    heroBanners = [],
    social = {},
    contactEmail = "contact@cakeshop.com",
    contactPhone = "+91 9876543210",
    address = "",
    businessHours = "",
  } = settings;

  const firstBanner =
    heroBanners.find((b) => b.isActive !== false) || heroBanners[0];
  const bannerImageUrl = firstBanner?.image?.url;
  const storyTitle = firstBanner?.title || "Our Story";
  const storySubtitle =
    firstBanner?.subtitle ||
    "Baking happiness since 2010. From a small kitchen to your celebrations.";

  const values = [
    { icon: Cake, title: "Quality", desc: "Finest ingredients, always fresh" },
    { icon: Heart, title: "Love", desc: "Handcrafted with care" },
    { icon: Award, title: "Excellence", desc: "Award-winning recipes" },
    { icon: Users, title: "Community", desc: `Serving since 2010` },
  ];

  return (
    <div>
      <SEO title={`About Us — ${siteName}`} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-cream-100 py-20 overflow-hidden">
        {/* {bannerImageUrl && (
          <img
            src={bannerImageUrl}
            alt={storyTitle}
            className="absolute inset-0 w-full h-full object-contain opacity-20"
          />
        )} */}
        <div className="container-custom text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-display font-bold gradient-text mb-4"
          >
            {storyTitle}
          </motion.h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {storySubtitle}
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="container-custom py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-display font-bold mb-4">
              Crafted with Passion
            </h2>
            <p className="text-gray-600 mb-4">{description}</p>
            <p className="text-gray-600">
              From birthdays to weddings, from intimate gatherings to grand
              celebrations, we are honored to be part of your special moments.
            </p>
            {(contactEmail || contactPhone) && (
              <div className="mt-6 space-y-2 text-sm text-gray-500">
                {contactEmail && (
                  <p>
                    <span className="font-medium">Email:</span> {contactEmail}
                  </p>
                )}
                {contactPhone && (
                  <p>
                    <span className="font-medium">Phone:</span> {contactPhone}
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="aspect-square bg-gradient-to-br from-primary-100 to-cream-100 rounded-3xl flex items-center justify-center overflow-hidden">
            {bannerImageUrl ? (
              <img
                src={bannerImageUrl}
                alt={siteName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-9xl">🎂</span>
            )}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="container-custom py-16">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-display font-bold mb-3">Our Values</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <div key={i} className="card p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                <v.icon size={28} />
              </div>
              <h3 className="font-semibold mb-2">{v.title}</h3>
              <p className="text-sm text-gray-600">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
