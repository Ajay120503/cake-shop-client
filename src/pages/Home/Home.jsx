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

      <div className="container-custom pt-8 sm:pt-14">
        {/* Categories */}
        <section className="py-10 sm:py-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <p className="text-primary-600 font-medium mb-2 text-sm sm:text-base tracking-wide uppercase">
              Shop by Category
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold">
              Browse Our Collections
            </h2>
            <div className="w-16 h-1 bg-primary-600 mx-auto mt-4 rounded-full" />
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
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
                  className="block group relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-primary-50 shadow-sm hover:shadow-xl transition-shadow duration-500"
                >
                  <img
                    src={cat.image?.url || getPlaceholderImage(cat.name)}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-out"
                    onError={(e) => {
                      e.currentTarget.src = getPlaceholderImage(cat.name);
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute inset-0 flex items-end p-3 sm:p-5">
                    <div>
                      <h3 className="text-white font-display font-semibold text-base sm:text-lg md:text-xl leading-tight">
                        {cat.name}
                      </h3>
                      <span className="text-white/80 text-xs sm:text-sm flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Shop now <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Featured Cakes */}
        <section className="py-10 sm:py-14">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6 sm:mb-10">
            <div>
              <p className="text-primary-600 font-medium mb-1 text-sm sm:text-base flex items-center gap-2 tracking-wide uppercase">
                <Cake size={16} /> Featured
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold">
                Handpicked
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 group self-start sm:self-auto"
            >
              View All
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
          {featuredLoading ? <Loader /> : <ProductGrid products={featured} />}
        </section>

        {/* Why Choose Us */}
        <section className="py-12 sm:py-16 rounded-2xl sm:rounded-3xl my-8 sm:my-12 px-4 sm:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <p className="text-primary-600 font-medium mb-2 text-sm tracking-wide uppercase">
              Our Promise
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-3">
              Why Choose Us
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-sm sm:text-base px-4">
              Baked with passion, delivered with care. Here's what makes us
              special.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
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
                className="group text-center p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                  <f.icon size={24} className="sm:w-7 sm:h-7" />
                </div>
                <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">
                  {f.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Best Sellers */}
        <section className="py-10 sm:py-14">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6 sm:mb-10">
            <div>
              <p className="text-primary-600 font-medium mb-1 text-sm sm:text-base tracking-wide uppercase">
                Most Popular
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold">
                Best Sellers
              </h2>
            </div>
            <Link
              to="/shop?isBestSeller=true"
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 group self-start sm:self-auto"
            >
              View All
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
          {bestSellersLoading ? (
            <Loader />
          ) : (
            <ProductGrid products={bestSellers} />
          )}
        </section>

        {/* New Arrivals */}
        <section className="py-10 sm:py-14">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6 sm:mb-10">
            <div>
              <p className="text-primary-600 font-medium mb-1 text-sm sm:text-base tracking-wide uppercase">
                Just Landed
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold">
                New Arrivals
              </h2>
            </div>
            <Link
              to="/shop?isNewArrival=true"
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 group self-start sm:self-auto"
            >
              View All
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
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
