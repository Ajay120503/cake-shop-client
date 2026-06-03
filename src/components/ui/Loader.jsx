import { motion } from "framer-motion";
import clsx from "clsx";

const Loader = ({ fullScreen = false, size = "md", className = "" }) => {
  const sizes = { sm: "w-6 h-6", md: "w-12 h-12", lg: "w-16 h-16" };
  const content = (
    <div
      className={clsx(
        "flex flex-col items-center justify-center gap-3",
        className
      )}
    >
      <motion.div
        className={
          "rounded-full border-4 border-primary-200 border-t-primary-600 " +
          sizes[size]
        }
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.p
        className="text-sm text-gray-600 dark:text-gray-400"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Loading sweetness...
      </motion.p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-cream-50/80 backdrop-blur-sm dark:bg-gray-900/80">
        {content}
      </div>
    );
  }
  return <div className="flex items-center justify-center p-8">{content}</div>;
};

export default Loader;
