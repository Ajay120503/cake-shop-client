import { motion } from "framer-motion";
import clsx from "clsx";

const Loader = ({ fullScreen = false, size = "md", className = "" }) => {
  const sizes = { sm: "w-6 h-6", md: "w-10 h-10", lg: "w-14 h-14" };
  const content = (
    <div
      className={clsx(
        "flex flex-col items-center justify-center gap-4",
        className
      )}
    >
      {/* Premium animated spinner */}
      <div className="relative">
        <motion.div
          className={clsx(
            "rounded-full border-[3px] border-primary-100 border-t-primary-500",
            sizes[size]
          )}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.span
          className="absolute inset-0 flex items-center justify-center text-lg"
          animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          🎂
        </motion.span>
      </div>
      <motion.p
        className="text-sm font-medium text-primary-600 dark:text-primary-400"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        Loading sweetness...
      </motion.p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-cream-50/90 via-white/90 to-pink-50/90 backdrop-blur-md dark:from-gray-900/90 dark:via-gray-900/90 dark:to-primary-900/20">
        {content}
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center py-12">{content}</div>
  );
};

export default Loader;
