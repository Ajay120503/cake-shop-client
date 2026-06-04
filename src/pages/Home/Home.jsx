import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Cake, ArrowRight, Heart, Shield, Truck, Award } from "lucide-react";
import Hero from "../../components/layout/Hero.jsx";
import ProductGrid from "../../components/product/ProductGrid.jsx";
import Loader from "../../components/ui/Loader.jsx";
import { productAPI, categoryAPI } from "../../api/endpoints.js";
import { getPlaceholderImage } from "../../utils/helpers.js";
import SEO from "../../components/common/SEO.jsx";

const Home = () => {
  const { data: featuredData, isLoading: featuredLoading } = useQuery({
    queryKey: ["featured-products"],
    queryFn: () => productAPI.getFeatured(8).then((r) => r.data.data),
  });
  const { data: bestSellersData, isLoading: bestSellersLoading } = useQuery({
    queryKey: ["best-sellers"],
    queryFn: () => productAPI.getBestSellers(8).then((r) => r.data.data),
  });
  const { data: newArrivalsData, isLoading: newArrivalsLoading } = useQuery({
    queryKey: ["new-arrivals"],
    queryFn: () => productAPI.getNewArrivals(8).then((r) => r.data.data),
  });
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryAPI.getAll().then((r) => r.data.data),
  });

  const categories = (categoriesData || [])
    .filter((c) => c.isActive)
    .slice(0, 8);
  const featured = featuredData || [];
  const bestSellers = bestSellersData || [];
  const newArrivals = newArrivalsData || [];

  return (
    <div className="pb-20">
      <SEO
        title="Home"
        description="Browse our handcrafted premium cakes, pastries, and desserts. Same day delivery available."
      />
      <Hero />

      <div className="container-custom pt-14">
        {/* Categories */}
        <section className="py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <p className="text-primary-600 font-medium mb-2 flex items-center justify-center gap-2">
              Shop by Category
            </p>
            <h2 className="text-3xl sm:text-4xl font-display font-bold">
              Browse Our Collections
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat._id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={"/shop?category=" + cat._id}
                  className="block group relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary-100 to-cream-100"
                >
                  <img
                    src={cat.image?.url || getPlaceholderImage(cat.name)}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    onError={(e) => {
                      e.currentTarget.src = getPlaceholderImage(cat.name);
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                    <h3 className="text-white font-display font-semibold text-lg">
                      {cat.name}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Featured Cakes */}
        <section className="py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-primary-600 font-medium mb-1 flex items-center gap-2">
                <Cake size={16} /> Featured
              </p>
              <h2 className="text-3xl sm:text-4xl font-display font-bold">
                Handpicked For You
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-primary-600 hover:underline flex items-center gap-1"
            >
              View All <ArrowRight size={16} />
            </Link>
          </div>
          {featuredLoading ? <Loader /> : <ProductGrid products={featured} />}
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-gradient-to-r from-primary-50 to-cream-100 rounded-3xl my-12 px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-3">
              Why Choose Us
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Baked with passion, delivered with care. Here's what makes us
              special.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Award,
                title: "Premium Quality",
                desc: "Finest ingredients sourced globally",
              },
              {
                icon: Truck,
                title: "Same Day Delivery",
                desc: "Order before 6 PM",
              },
              {
                icon: Heart,
                title: "Made with Love",
                desc: "Handcrafted by expert bakers",
              },
              {
                icon: Shield,
                title: "100% Fresh",
                desc: "No artificial preservatives",
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 bg-white rounded-2xl shadow-soft"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                  <f.icon size={28} />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Best Sellers */}
        <section className="py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-primary-600 font-medium mb-1">Most Popular</p>
              <h2 className="text-3xl sm:text-4xl font-display font-bold">
                Best Sellers
              </h2>
            </div>
            <Link
              to="/shop?isBestSeller=true"
              className="text-primary-600 hover:underline flex items-center gap-1"
            >
              View All <ArrowRight size={16} />
            </Link>
          </div>
          {bestSellersLoading ? (
            <Loader />
          ) : (
            <ProductGrid products={bestSellers} />
          )}
        </section>

        {/* New Arrivals */}
        <section className="py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-primary-600 font-medium mb-1">Just Landed</p>
              <h2 className="text-3xl sm:text-4xl font-display font-bold">
                New Arrivals
              </h2>
            </div>
            <Link
              to="/shop?isNewArrival=true"
              className="text-primary-600 hover:underline flex items-center gap-1"
            >
              View All <ArrowRight size={16} />
            </Link>
          </div>
          {newArrivalsLoading ? (
            <Loader />
          ) : (
            <ProductGrid products={newArrivals} />
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
