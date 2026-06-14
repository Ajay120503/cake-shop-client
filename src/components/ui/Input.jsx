import { forwardRef } from "react";
import clsx from "clsx";

const Input = forwardRef(
  (
    {
      label,
      error,
      className,
      type = "text",
      prefix,
      suffix,
      helpText,
      ...props
    },
    ref
  ) => {
    const isTextarea = type === "textarea";
    const inputClasses = clsx(
      "w-full bg-white dark:bg-gray-800 border-2 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-500 transition-all duration-200 outline-none",
      "border-gray-200 dark:border-gray-700",
      "focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-400/20 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500",
      "hover:border-gray-300 dark:hover:border-gray-600",
      error && "border-red-400 focus:border-red-500 focus:ring-red-500/20",
      prefix && "pl-10",
      suffix && "pr-10",
      !prefix && !suffix && "px-4 py-2.5",
      isTextarea && "px-4 py-3 min-h-[100px] resize-y",
      className
    );

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {prefix && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              {prefix}
            </div>
          )}
          {isTextarea ? (
            <textarea ref={ref} className={inputClasses} {...props} />
          ) : (
            <input ref={ref} type={type} className={inputClasses} {...props} />
          )}
          {suffix && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
              {suffix}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-xs font-medium text-red-500 flex items-center gap-1">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="6"
                cy="6"
                r="5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M6 3.5v3M6 8v.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            {error}
          </p>
        )}
        {helpText && !error && (
          <p className="mt-1.5 text-xs text-gray-400">{helpText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
