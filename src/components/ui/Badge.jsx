import clsx from "clsx";

const variants = {
  primary: "bg-primary-500 text-white ring-primary-500/20",
  secondary: "bg-secondary-500 text-white ring-secondary-500/20",
  success: "bg-emerald-500 text-white ring-emerald-500/20",
  warning: "bg-amber-500 text-white ring-amber-500/20",
  danger: "bg-red-500 text-white ring-red-500/20",
  info: "bg-sky-500 text-white ring-sky-500/20",
  // Light variants
  "primary-light":
    "bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300",
  "success-light":
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "warning-light":
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "danger-light":
    "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  "info-light": "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
};

const sizes = {
  sm: "px-1.5 py-0.5 text-[10px]",
  md: "px-2.5 py-0.5 text-xs",
  lg: "px-3 py-1 text-sm",
};

const Badge = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  dot,
  pulse,
  removable,
  onRemove,
}) => {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full font-medium ring-1 ring-inset transition-all duration-200",
        variants[variant] || variants.primary,
        sizes[size],
        pulse && "animate-glow-pulse",
        className
      )}
    >
      {dot && (
        <span
          className={clsx(
            "w-1.5 h-1.5 rounded-full shrink-0",
            variant.includes("light") ? "bg-current" : "bg-white/80"
          )}
        />
      )}
      {children}
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 hover:bg-black/10 rounded-full p-0.5 transition-colors"
          aria-label="Remove"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M1 1l8 8M9 1l-8 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </span>
  );
};

export default Badge;
