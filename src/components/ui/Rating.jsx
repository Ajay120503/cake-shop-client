import { Star } from "lucide-react";
import clsx from "clsx";

const Rating = ({
  value = 0,
  max = 5,
  size = 16,
  showValue = true,
  className,
}) => {
  return (
    <div className={clsx("inline-flex items-center gap-1", className)}>
      {[...Array(max)].map((_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < Math.round(value)
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }
        />
      ))}
      {showValue && (
        <span className="text-sm text-gray-600 ml-1">({value.toFixed(1)})</span>
      )}
    </div>
  );
};

export default Rating;
