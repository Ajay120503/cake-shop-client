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
  fullWidth,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  ...props
}) => {
  const variants = {
    primary:
      "bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-600/25",
    secondary: "bg-secondary-500 text-white hover:bg-secondary-600",
    outline:
      "border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-500 dark:hover:text-white",
    ghost:
      "text-gray-700 hover:bg-primary-50 hover:text-primary-600 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-primary-400",
    danger: "bg-red-500 text-white hover:bg-red-600",
    success: "bg-emerald-500 text-white hover:bg-emerald-600",
    premium:
      "bg-gradient-to-r from-primary-500 via-pink-500 to-primary-600 text-white hover:from-primary-600 hover:via-pink-600 hover:to-primary-700",
    "outline-white":
      "border-2 border-white text-white hover:bg-white hover:text-gray-900",
    "outline-dark":
      "border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white dark:border-gray-100 dark:text-gray-100 dark:hover:bg-gray-100 dark:hover:text-gray-900",
  };

  const sizes = {
    xs: "px-3 py-1.5 text-xs rounded-lg",
    sm: "px-3.5 py-1.5 text-xs rounded-full",
    md: "px-5 py-2.5 text-sm rounded-full",
    lg: "px-7 py-3 text-base rounded-full",
    xl: "px-9 py-4 text-lg rounded-full",
  };

  const loadingSizes = {
    xs: "w-3 h-3",
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
    xl: "w-5 h-5",
  };

  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.05 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.95 } : {}}
      className={clsx(
        "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500",
        variants[variant] || variants.primary,
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <span
            className={clsx(
              "border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0",
              loadingSizes[size]
            )}
          />
          <span className="opacity-80">
            {loading === true ? "Loading..." : loading}
          </span>
        </>
      ) : (
        <>
          {LeftIcon && (
            <LeftIcon
              size={
                size === "xs"
                  ? 14
                  : size === "sm"
                  ? 14
                  : size === "lg"
                  ? 18
                  : 16
              }
              className="shrink-0"
            />
          )}
          {children}
          {RightIcon && (
            <RightIcon
              size={
                size === "xs"
                  ? 14
                  : size === "sm"
                  ? 14
                  : size === "lg"
                  ? 18
                  : 16
              }
              className="shrink-0"
            />
          )}
        </>
      )}
    </motion.button>
  );
};

export default Button;
