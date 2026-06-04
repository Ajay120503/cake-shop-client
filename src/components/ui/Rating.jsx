import { Star } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";

const Rating = ({
  value = 0,
  max = 5,
  size = 16,
  showValue = true,
  className,
  interactive = false,
  onChange,
}) => {
  const stars = [...Array(max)];

  if (interactive) {
    return (
      <div className={clsx("inline-flex items-center gap-0.5", className)}>
        {stars.map((_, i) => {
          const filled = i < Math.round(value);
          return (
            <motion.button
              key={i}
              type="button"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onChange?.(i + 1)}
              className="p-0.5"
            >
              <Star
                size={size}
                className={clsx(
                  "transition-colors duration-150",
                  filled
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-300 dark:text-gray-600 hover:text-amber-300"
                )}
              />
            </motion.button>
          );
        })}
        {showValue && (
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 ml-1">
            ({value.toFixed(1)})
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={clsx("inline-flex items-center gap-0.5", className)}>
      {stars.map((_, i) => {
        const filled = i < Math.round(value);
        const half = !filled && i < value + 0.5;
        return (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08, type: "spring" }}
          >
            <Star
              size={size}
              className={clsx(
                "transition-colors",
                filled
                  ? "fill-amber-400 text-amber-400"
                  : half
                  ? "fill-amber-200 text-amber-300"
                  : "text-gray-300 dark:text-gray-600"
              )}
            />
          </motion.span>
        );
      })}
      {showValue && (
        <motion.span
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-sm font-semibold text-gray-600 dark:text-gray-400 ml-1"
        >
          ({value.toFixed(1)})
        </motion.span>
      )}
    </div>
  );
};

export default Rating;
