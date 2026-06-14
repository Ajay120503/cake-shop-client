import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showClose = true,
}) => {
  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
    "2xl": "max-w-4xl",
    full: "max-w-[95vw] sm:max-w-[90vw]",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{
              duration: 0.2,
              type: "spring",
              damping: 25,
              stiffness: 300,
            }}
            className={
              "w-full bg-white dark:bg-gray-800 rounded-3xl overflow-hidden " +
              sizes[size]
            }
            onClick={(e) => e.stopPropagation()}
          >
            {title && (
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white">
                  {title}
                </h3>
                {showClose && (
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-full hover:bg-primary-50 dark:hover:bg-gray-700 text-gray-400 hover:text-primary-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            )}
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
