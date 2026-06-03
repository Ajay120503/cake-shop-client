import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useWishlist } from "../../store/wishlistStore.js";
import ProductGrid from "../../components/product/ProductGrid.jsx";

const Wishlist = () => {
  const { wishlist } = useWishlist();
  const products =
    wishlist?.products?.map((p) => p.product).filter(Boolean) || [];

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-display font-bold mb-6">My Wishlist</h1>
      {products.length === 0 ? (
        <div className="card p-12 text-center">
          <Heart size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
          <Link to="/shop" className="btn-primary inline-flex mt-4">
            Browse Products
          </Link>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
};

export default Wishlist;
