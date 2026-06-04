import clsx from "clsx";

const Badge = ({ children, variant = "primary", className }) => {
  const variants = {
    primary:
      "bg-gradient-to-r from-primary-500 to-pink-500 text-white shadow-sm",
    secondary: "bg-gradient-to-r from-secondary-400 to-orange-500 text-white",
    success:
      "bg-gradient-to-r from-emerald-400 to-green-500 text-white shadow-sm",
    warning:
      "bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-sm",
    danger: "bg-gradient-to-r from-red-400 to-rose-500 text-white shadow-sm",
    info: "bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-sm",
    outline:
      "border border-primary-300 text-primary-700 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-300 dark:border-primary-700",
    soft: "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300",
  };
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide",
        variants[variant] || variants.primary,
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
