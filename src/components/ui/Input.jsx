import { forwardRef } from "react";
import clsx from "clsx";

const Input = forwardRef(
  ({ label, error, className, type = "text", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={clsx(
            "w-full px-4 py-2.5 bg-white dark:bg-gray-800 border-2 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200",
            "border-gray-200 dark:border-gray-700",
            "focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-400/20",
            "hover:border-gray-300 dark:hover:border-gray-600",
            error &&
              "border-red-400 focus:border-red-500 focus:ring-red-500/20",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs font-medium text-red-500 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-red-500" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
