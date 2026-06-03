import { motion } from "framer-motion";
import ProductCard from "./ProductCard.jsx";

const ProductGrid = ({ products, columns = 4 }) => {
  const colClasses = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
  };

  return (
    <div className={"grid gap-6 " + colClasses[columns]}>
      {products.map((product, idx) => (
        <motion.div
          key={product._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05, duration: 0.3 }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </div>
  );
};

export default ProductGrid;
