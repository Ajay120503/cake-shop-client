import clsx from "clsx";

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
      "bg-primary-600 text-white hover:bg-primary-700 shadow-elegant hover:shadow-glow",
    secondary: "bg-secondary-500 text-white hover:bg-secondary-600",
    outline:
      "border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white",
    ghost:
      "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800",
    danger: "bg-red-500 text-white hover:bg-red-600",
    success: "bg-green-500 text-white hover:bg-green-600",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3 text-base",
  };
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
};

export default Button;
