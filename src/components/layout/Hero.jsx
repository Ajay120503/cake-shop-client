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
      <section className="relative h-[80vh] flex items-center bg-gradient-to-br from-pink-50 via-cream-100 to-yellow-50">
        <div className="container-custom text-center">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-7xl font-bold gradient-text"
          >
            Handcrafted Cakes
          </motion.h1>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* ── Slider ── */}
      <section className="relative h-[85vh] overflow-hidden bg-black">
        {/* Background Slider */}
        <AnimatePresence mode="wait">
          {banners.map(
            (banner, idx) =>
              idx === current && (
                <motion.div
                  key={idx}
                  className="absolute inset-0 overflow-hidden"
                  style={{ x, y, rotateX, rotateY, scale: 1 }} // ← no extra zoom
                  initial={{ opacity: 0 }} // ← removed scale animation
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                >
                  <img
                    src={banner.image?.url || getPlaceholderImage(banner.title)}
                    alt={banner.title}
                    className="w-full h-full object-cover object-[center_30%]" // ← focus at 30% from top
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_50%)]" />
                </motion.div>
              )
          )}
        </AnimatePresence>

        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="container-custom text-white">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-bold leading-tight"
              >
                {banners[current]?.title}
              </motion.h1>

              {banners[current]?.subtitle && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl text-white/80 mt-4"
                >
                  {banners[current]?.subtitle}
                </motion.p>
              )}

              {banners[current]?.description && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-white/60 mt-4"
                >
                  {banners[current]?.description}
                </motion.p>
              )}

              {banners[current]?.ctaText && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-6"
                >
                  <Link
                    to={banners[current]?.ctaLink || "/shop"}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-medium hover:scale-105 transition"
                  >
                    {banners[current]?.ctaText}
                    <ArrowRight size={16} />
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Controls */}
        {banners.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrent((c) => (c - 1 + banners.length) % banners.length)
              }
              className="absolute left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition flex items-center justify-center"
            >
              <ChevronLeft />
            </button>

            <button
              onClick={() => setCurrent((c) => (c + 1) % banners.length)}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition flex items-center justify-center"
            >
              <ChevronRight />
            </button>

            {/* Dots — raised above feature strip overlap zone */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`transition-all rounded-full ${
                    i === current ? "w-8 h-2 bg-white" : "w-2 h-2 bg-white/40"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* ── Feature Strip — half overlapping hero bottom ── */}
      <div className="relative z-20 -mt-10 px-4">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl px-6 py-5">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 py-2"
              >
                <div className="w-12 h-12 shrink-0 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center">
                  <f.icon size={20} />
                </div>
                <div>
                  <p className="font-semibold text-sm">{f.title}</p>
                  <p className="text-xs text-gray-500">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
