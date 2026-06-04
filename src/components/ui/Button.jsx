import clsx from "clsx";
import { motion } from "framer-motion";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className,
  loading,
  disabled,
  type = "button",
  ...props
}) => {
  const variants = {
    primary:
      "bg-gradient-to-r from-primary-600 to-pink-600 text-white hover:from-primary-700 hover:to-pink-700 shadow-elegant hover:shadow-glow",
    secondary:
      "bg-gradient-to-r from-secondary-500 to-orange-500 text-white hover:from-secondary-600 hover:to-orange-600 shadow-soft",
    outline:
      "border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-500 dark:hover:text-white",
    ghost:
      "text-gray-700 hover:bg-primary-50 hover:text-primary-600 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-primary-400",
    danger:
      "bg-gradient-to-r from-red-500 to-rose-500 text-white hover:from-red-600 hover:to-rose-600 shadow-soft",
    success:
      "bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600 shadow-soft",
    premium:
      "bg-gradient-to-r from-amber-400 via-primary-500 to-pink-500 text-white hover:from-amber-500 hover:via-primary-600 hover:to-pink-600 shadow-elegant hover:shadow-glow animate-gradient",
  };
  const sizes = {
    sm: "px-3.5 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3 text-base",
  };
  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant] || variants.primary,
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </motion.button>
  );
};

export default Button;
