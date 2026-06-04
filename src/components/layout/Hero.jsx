import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Truck,
  Award,
  Clock,
  Heart,
  Sparkles,
} from "lucide-react";
import { useSettings } from "../../store/settingsStore.js";
import { getPlaceholderImage } from "../../utils/helpers.js";

const Hero = () => {
  const { settings } = useSettings();
  const banners = settings?.heroBanners?.filter((b) => b.isActive) || [];
  const [current, setCurrent] = useState(0);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [5, -5]);
  const rotateY = useTransform(x, [-100, 100], [-5, 5]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const features = [
    { icon: Truck, title: "Free Delivery", desc: "On ₹500+" },
    { icon: Award, title: "Premium Quality", desc: "Chef crafted" },
    { icon: Clock, title: "Same Day", desc: "Fast delivery" },
    { icon: Heart, title: "Fresh Baked", desc: "No preservatives" },
  ];

  if (banners.length === 0) {
    return (
      <section className="relative h-[85vh] flex items-center bg-gradient-to-br from-pink-50 via-cream-50 to-yellow-50 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-primary-300 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-pink-300 blur-3xl" />
        </div>
        <div className="container-custom text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles size={12} />
              Premium Bakery Since 2010
            </motion.span>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-bold gradient-text mb-4">
              Handcrafted
              <br />
              <span className="text-gray-900 dark:text-white">Cakes</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              Every slice tells a story of passion, quality, and love.
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* ── Premium Slider ── */}
      <section className="relative h-[85vh] sm:h-[90vh] overflow-hidden bg-black">
        {/* Background Slider */}
        <AnimatePresence mode="wait">
          {banners.map(
            (banner, idx) =>
              idx === current && (
                <motion.div
                  key={idx}
                  className="absolute inset-0 overflow-hidden"
                  style={{ x, y, rotateX, rotateY }}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                >
                  <img
                    src={banner.image?.url || getPlaceholderImage(banner.title)}
                    alt={banner.title}
                    className="w-full h-full object-cover object-[center_30%]"
                  />
                  {/* Premium gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
                </motion.div>
              )
          )}
        </AnimatePresence>

        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="container-custom text-white">
            <motion.div
              key={current + "-content"}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-2xl"
            >
              {/* Category badge */}
              <motion.span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-xs font-semibold mb-4 border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Sparkles size={12} />
                Featured Collection
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold leading-tight"
              >
                {banners[current]?.title}
              </motion.h1>

              {banners[current]?.subtitle && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="text-lg sm:text-xl text-white/80 mt-4 max-w-lg"
                >
                  {banners[current]?.subtitle}
                </motion.p>
              )}

              {banners[current]?.description && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="text-sm sm:text-base text-white/50 mt-3 max-w-md leading-relaxed"
                >
                  {banners[current]?.description}
                </motion.p>
              )}

              {banners[current]?.ctaText && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="mt-8"
                >
                  <Link
                    to={banners[current]?.ctaLink || "/shop"}
                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-white to-cream-100 text-gray-900 rounded-full font-semibold hover:scale-105 hover:shadow-glow transition-all duration-300 group"
                  >
                    <span>{banners[current]?.ctaText}</span>
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Premium Controls */}
        {banners.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrent((c) => (c - 1 + banners.length) % banners.length)
              }
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/25 transition-all border border-white/10 text-white flex items-center justify-center"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={() => setCurrent((c) => (c + 1) % banners.length)}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/25 transition-all border border-white/10 text-white flex items-center justify-center"
            >
              <ChevronRight size={20} />
            </button>

            {/* Premium Dots */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`transition-all duration-300 rounded-full ${
                    i === current
                      ? "w-10 h-2.5 bg-gradient-to-r from-primary-400 to-pink-400 shadow-glow"
                      : "w-2.5 h-2.5 bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* ── Premium Feature Strip ── */}
      <div className="relative z-20 -mt-12 px-4">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 bg-white dark:bg-gray-900 rounded-2xl shadow-elegant px-4 sm:px-6 py-5 border border-gray-100 dark:border-gray-800"
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 py-3 px-2 border-r last:border-r-0 border-gray-100 dark:border-gray-800"
              >
                <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-primary-50 to-pink-50 dark:from-primary-900/30 dark:to-pink-900/20 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                  <f.icon size={20} />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">
                    {f.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Hero;
