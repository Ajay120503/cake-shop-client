import { useEffect } from "react";
import { Cake, Heart, Award, Users, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import SEO from "../../components/common/SEO.jsx";
import { useSettings } from "../../store/settingsStore.js";
import Loader from "../../components/ui/Loader.jsx";
import Button from "../../components/ui/Button.jsx";
import { Link } from "react-router-dom";

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
    {
      icon: Cake,
      title: "Quality",
      desc: "Finest ingredients, always fresh",
      color: "from-pink-500 to-rose-500",
    },
    {
      icon: Heart,
      title: "Love",
      desc: "Handcrafted with care",
      color: "from-red-500 to-pink-500",
    },
    {
      icon: Award,
      title: "Excellence",
      desc: "Award-winning recipes",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: Users,
      title: "Community",
      desc: "Serving since 2010",
      color: "from-primary-500 to-purple-500",
    },
  ];

  return (
    <div>
      <SEO title={`About Us — ${siteName}`} />

      {/* Premium Hero Section */}
      <section className="relative min-h-[50vh] flex items-center bg-gradient-to-br from-primary-50 via-cream-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-primary-900/20 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute inset-0 overflow-hidden opacity-30 dark:opacity-10">
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-primary-200 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-pink-200 blur-3xl" />
        </div>

        {bannerImageUrl && (
          <img
            src={bannerImageUrl}
            alt={storyTitle}
            className="absolute inset-0 w-full h-full object-cover opacity-10 dark:opacity-5"
          />
        )}

        <div className="container-custom text-center relative z-10 py-20">
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
              About {siteName}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl sm:text-6xl md:text-7xl font-display font-bold gradient-text mb-4"
            >
              {storyTitle}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed"
            >
              {storySubtitle}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Premium Story Section */}
      <section className="py-20 relative">
        {/* Decorative divider */}
        <div className="absolute top-0 left-0 right-0 flex justify-center">
          <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-pink-500 rounded-full" />
        </div>

        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl sm:text-5xl font-display font-bold mb-6 text-gray-900 dark:text-white">
                Crafted with <span className="gradient-text">Passion</span>
              </h2>

              <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                <p>{description}</p>
                <p>
                  From birthdays to weddings, from intimate gatherings to grand
                  celebrations, we are honored to be part of your special
                  moments. Every cake we bake carries the warmth of our kitchen
                  and the love of our craft.
                </p>
              </div>

              <div className="mt-8 space-y-3">
                {[
                  "100% Fresh Ingredients",
                  "Handcrafted with Love",
                  "Same Day Delivery",
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2
                      size={18}
                      className="text-primary-500 shrink-0"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item}
                    </span>
                  </motion.div>
                ))}
              </div>

              {(contactEmail || contactPhone) && (
                <div className="mt-8 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Get in Touch
                  </p>
                  <div className="space-y-1.5 text-sm text-gray-500 dark:text-gray-400">
                    {contactEmail && <p>Email: {contactEmail}</p>}
                    {contactPhone && <p>Phone: {contactPhone}</p>}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <Link to="/shop">
                  <Button variant="primary" size="lg">
                    Explore Our Cakes
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl overflow-hidden shadow-elegant border-4 border-white dark:border-gray-800">
                {bannerImageUrl ? (
                  <img
                    src={bannerImageUrl}
                    alt={siteName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-100 to-cream-100 dark:from-primary-900/30 dark:to-gray-800 flex items-center justify-center text-9xl">
                    🎂
                  </div>
                )}
              </div>
              {/* Decorative accent */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary-200 to-pink-200 dark:from-primary-800 dark:to-pink-800 rounded-2xl -z-10" />
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-amber-200 to-primary-200 dark:from-amber-800 dark:to-primary-800 rounded-xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Premium Values Section */}
      <section className="py-20 bg-gradient-to-b from-white to-cream-50 dark:from-gray-900 dark:to-gray-800/50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 text-xs font-semibold mb-3">
              What Drives Us
            </span>
            <h2 className="text-4xl sm:text-5xl font-display font-bold text-gray-900 dark:text-white">
              Our Values
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-lg mx-auto">
              The principles that guide everything we bake
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
                whileHover={{ y: -6 }}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 text-center shadow-soft hover:shadow-elegant transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                {/* Icon container */}
                <div
                  className={`w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br ${v.color} text-white flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                >
                  <v.icon size={28} />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                  {v.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {v.desc}
                </p>

                {/* Hover glow */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${v.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
