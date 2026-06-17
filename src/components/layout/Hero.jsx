import { useState, useEffect, useRef } from "react";
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
import { useTheme } from "../../context/ThemeContext.jsx";

const Hero = () => {
  const heroRef = useRef(null);
  const layerBgRef = useRef(null);
  const layerMidRef = useRef(null);
  const layerFgRef = useRef(null);

  const { settings } = useSettings();
  const { theme } = useTheme();
  const isDark = theme === "dark";
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

  // ── Synced parallax: all three layers now move together as one unit ──
  useEffect(() => {
    let tgt = { x: 0, y: 0 };
    let cur = { x: 0, y: 0 };
    let raf;

    const onMove = (e) => {
      const r = heroRef.current?.getBoundingClientRect();
      if (!r) return;
      const mx = (e.clientX - r.left) / r.width - 0.5;
      const my = (e.clientY - r.top) / r.height - 0.5;
      tgt = { x: mx * -28, y: my * -20 };
    };

    const onLeave = () => {
      tgt = { x: 0, y: 0 };
    };

    const lerp = (a, b, t) => ({
      x: a.x + (b.x - a.x) * t,
      y: a.y + (b.y - a.y) * t,
    });

    const loop = () => {
      cur = lerp(cur, tgt, 0.07);
      const transform = `translate(${cur.x.toFixed(2)}px, ${cur.y.toFixed(
        2
      )}px) scale(1.12)`;

      if (layerBgRef.current) layerBgRef.current.style.transform = transform;
      if (layerMidRef.current) layerMidRef.current.style.transform = transform;
      if (layerFgRef.current) layerFgRef.current.style.transform = transform;

      raf = requestAnimationFrame(loop);
    };

    const el = heroRef.current;
    el?.addEventListener("mousemove", onMove);
    el?.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      el?.removeEventListener("mousemove", onMove);
      el?.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const features = [
    { icon: Truck, title: "Free Delivery", desc: "On ₹500+" },
    { icon: Award, title: "Premium Quality", desc: "Chef crafted" },
    { icon: Clock, title: "Same Day", desc: "Fast delivery" },
    { icon: Heart, title: "Fresh Baked", desc: "No preservatives" },
  ];

  // No banners fallback — light/dark aware
  if (banners.length === 0) {
    return (
      <section className="relative min-h-[78vh] sm:min-h-[85vh] flex items-center overflow-hidden bg-primary-50 dark:bg-gray-950">
        {/* subtle decorative blobs */}
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-primary-200/40 dark:bg-primary-900/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-primary-300/30 dark:bg-primary-800/20 blur-3xl" />

        <div className="container-custom relative z-10 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <span className="inline-block mb-4 px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium tracking-wide bg-white/70 dark:bg-white/10 text-primary-700 dark:text-primary-300 border border-primary-100 dark:border-white/10 backdrop-blur">
              Freshly baked daily
            </span>
            <h1 className="text-[2.5rem] leading-[1.05] sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold mb-5 text-gray-900 dark:text-white">
              Handcrafted
              <br />
              <span className="text-primary-600 dark:text-primary-400">
                Cakes
              </span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-xl leading-relaxed sm:leading-8">
              Every slice tells a story of passion, quality, and love.
            </p>
            <Link
              to="/shop"
              className="mt-7 sm:mt-8 inline-flex items-center gap-2 rounded-full bg-gray-900 dark:bg-white px-6 sm:px-7 py-3 sm:py-3.5 text-sm font-semibold text-white dark:text-gray-900 hover:bg-primary-700 dark:hover:bg-primary-100 transition-all duration-200 shadow-lg shadow-black/10"
            >
              Shop Collection <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* ── Premium Slider ── */}
      <section
        ref={heroRef}
        className="relative min-h-[78vh] sm:min-h-[88vh] overflow-hidden bg-white dark:bg-gray-950"
      >
        {/* Background Slider */}
        <AnimatePresence mode="wait">
          {banners.map(
            (banner, idx) =>
              idx === current && (
                <motion.div
                  key={idx}
                  className="absolute inset-0 overflow-hidden"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                >
                  {/* Layer 1 — Background: blurred */}
                  <div
                    ref={layerBgRef}
                    className="absolute inset-4 sm:inset-10 lg:inset-16 will-change-transform"
                    style={{
                      filter: "blur(6px) brightness(0.4) saturate(0.8)",
                    }}
                  >
                    <img
                      src={
                        banner.image?.url || getPlaceholderImage(banner.title)
                      }
                      alt=""
                      className="w-full h-full object-contain object-center"
                    />
                  </div>

                  {/* Layer 2 — Midground */}
                  <div
                    ref={layerMidRef}
                    className="absolute inset-4 sm:inset-10 lg:inset-16 will-change-transform"
                    style={{ opacity: 0.5, mixBlendMode: "soft-light" }}
                  >
                    <img
                      src={
                        banner.image?.url || getPlaceholderImage(banner.title)
                      }
                      alt=""
                      className="w-full h-full object-contain object-center"
                    />
                  </div>

                  {/* Layer 3 — Foreground */}
                  <div
                    ref={layerFgRef}
                    className="absolute inset-4 sm:inset-10 lg:inset-16 will-change-transform"
                    style={{
                      filter:
                        "drop-shadow(-30px 16px 50px rgba(0,0,0,0.45)) drop-shadow(30px 16px 50px rgba(0,0,0,0.45)) brightness(1.05) contrast(1.05)",
                    }}
                  >
                    <img
                      src={
                        banner.image?.url || getPlaceholderImage(banner.title)
                      }
                      alt={banner.title}
                      className="w-full h-full object-contain object-center"
                    />
                  </div>
                </motion.div>
              )
          )}
        </AnimatePresence>

        {/* Content */}
        <div className="absolute inset-0 flex items-end sm:items-center pb-28 sm:pb-0">
          <div className="container-custom px-4 sm:px-6">
            <motion.div
              key={current + "-content"}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-2xl"
            >
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold leading-[1.05] max-w-3xl text-white dark:text-white break-words"
                style={{
                  textShadow:
                    "0 2px 24px rgba(0,0,0,0.45), 0 1px 4px rgba(0,0,0,0.5)",
                }}
              >
                {banners[current]?.title}
              </motion.h1>

              {banners[current]?.subtitle && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="inline-flex items-center mt-4 max-w-full text-[11px] sm:text-sm md:text-base font-medium tracking-wide
                  px-3 sm:px-4 py-1.5 rounded-full
                  text-gray-900 dark:text-white
                  bg-white/85 dark:bg-white/10
                  backdrop-blur-md
                  border border-black/10 dark:border-white/20
                  shadow-lg shadow-black/10 dark:shadow-black/20"
                >
                  {banners[current]?.subtitle}
                </motion.p>
              )}

              {banners[current]?.description && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="text-sm sm:text-base text-white/85 mt-3 sm:mt-4 max-w-md leading-relaxed line-clamp-3 sm:line-clamp-none"
                >
                  {banners[current]?.description}
                </motion.p>
              )}

              {banners[current]?.ctaText && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="mt-6 sm:mt-8"
                >
                  <Link
                    to={banners[current]?.ctaLink || "/shop"}
                    className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full font-semibold text-sm transition-all duration-300 group
                    bg-primary-700 hover:bg-primary-600 text-white shadow-lg shadow-primary-900/30 active:scale-[0.98]"
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
              aria-label="Previous slide"
              onClick={() =>
                setCurrent((c) => (c - 1 + banners.length) % banners.length)
              }
              className="hidden sm:flex absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full
              bg-black/20 hover:bg-black/40 border border-black/20 text-gray-900
              dark:bg-white/10 dark:hover:bg-white/25 dark:border-white/10 dark:text-white
              backdrop-blur-md transition-all items-center justify-center"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              aria-label="Next slide"
              onClick={() => setCurrent((c) => (c + 1) % banners.length)}
              className="hidden sm:flex absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full
              bg-black/20 hover:bg-black/40 border border-black/20 text-gray-900
              dark:bg-white/10 dark:hover:bg-white/25 dark:border-white/10 dark:text-white
              backdrop-blur-md transition-all items-center justify-center"
            >
              <ChevronRight size={20} />
            </button>

            {/* Dots — visible on all screens */}
            <div className="absolute flex bottom-16 sm:bottom-24 left-1/2 -translate-x-1/2 gap-2 sm:gap-2.5 z-10">
              {banners.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setCurrent(i)}
                  className={`transition-all duration-300 rounded-full ${
                    i === current
                      ? "w-8 sm:w-10 h-2 sm:h-2.5 bg-primary-500 dark:bg-primary-400"
                      : "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/40 hover:bg-white/70 dark:bg-white/30 dark:hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* ── Premium Feature Strip ── */}
      <div className="relative z-20 -mt-8 sm:-mt-12 px-3 sm:px-4">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-y-1 bg-white dark:bg-gray-900 rounded-2xl px-2 sm:px-6 py-3 sm:py-4 border border-gray-200 dark:border-gray-800 shadow-xl shadow-black/5 dark:shadow-black/30"
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                className="flex items-center gap-2.5 sm:gap-3 py-2 sm:py-3 px-1.5 sm:px-2 md:border-r md:last:border-r-0 border-gray-200 dark:border-gray-800 min-w-0"
              >
                <div className="w-9 h-9 sm:w-12 sm:h-12 shrink-0 rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                  <f.icon size={16} className="sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white truncate">
                    {f.title}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 truncate">
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
