import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Filter, X, SlidersHorizontal, Search } from "lucide-react";
import { productAPI, categoryAPI } from "../../api/endpoints.js";
import ProductGrid from "../../components/product/ProductGrid.jsx";
import Loader from "../../components/ui/Loader.jsx";
import { formatPrice } from "../../utils/helpers.js";
import SEO from "../../components/common/SEO.jsx";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    rating: searchParams.get("rating") || "",
    sort: searchParams.get("sort") || "newest",
    page: Number(searchParams.get("page")) || 1,
  });

  useEffect(() => {
    const params = {};
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params[k] = v;
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryAPI.getAll().then((r) => r.data.data),
  });
  const { data, isLoading } = useQuery({
    queryKey: ["products", filters],
    queryFn: () => productAPI.getAll(filters).then((r) => r.data),
  });

  const products = data?.data || [];
  const pagination = data?.pagination || {};
  const categories = (categoriesData || []).filter((c) => c.isActive);

  const updateFilter = (key, value) =>
    setFilters((f) => ({ ...f, [key]: value, page: 1 }));
  const clearFilters = () =>
    setFilters({
      search: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      rating: "",
      sort: "newest",
      page: 1,
    });

  return (
    <div className="container-custom py-8">
      <SEO
        title="Shop"
        description="Browse our collection of handcrafted cakes, pastries, and desserts."
      />

      {/* Premium Header */}
      <div className="relative min-h-[18vh] flex items-center bg-gradient-to-br from-primary-50 via-cream-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-primary-900/20 rounded-3xl mb-8 overflow-hidden px-6 sm:px-8">
        <div className="absolute inset-0 overflow-hidden opacity-20 dark:opacity-5">
          <div className="absolute -top-10 left-1/3 w-60 h-60 rounded-full bg-primary-200 blur-3xl" />
          <div className="absolute bottom-0 right-10 w-40 h-40 rounded-full bg-pink-200 blur-3xl" />
        </div>
        <div className="relative z-10 py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold gradient-text mb-1">
              Shop
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {pagination.total || 0} product{pagination.total !== 1 ? "s" : ""}{" "}
              available
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white rounded-xl text-sm font-semibold transition-all duration-200 lg:hidden"
            >
              <SlidersHorizontal size={15} /> Filters
            </button>
            <select
              value={filters.sort}
              onChange={(e) => updateFilter("sort", e.target.value)}
              className="w-auto px-4 py-2.5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Top Rated</option>
              <option value="best-selling">Best Selling</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside
          className={
            "lg:block " +
            (showFilters
              ? "block fixed inset-0 z-50 bg-white dark:bg-gray-900 p-6 overflow-y-auto"
              : "hidden")
          }
        >
          {showFilters && (
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <h2 className="text-xl font-display font-bold gradient-text">
                Filters
              </h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-soft border border-gray-100 dark:border-gray-700 space-y-6">
            {/* Search */}
            <div>
              <label className="text-sm font-semibold text-gray-900 dark:text-white mb-2 block">
                Search
              </label>
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => updateFilter("search", e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Categories
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors">
                  <input
                    type="radio"
                    name="category"
                    checked={!filters.category}
                    onChange={() => updateFilter("category", "")}
                    className="accent-primary-600"
                  />{" "}
                  All
                </label>
                {categories.map((c) => (
                  <label
                    key={c._id}
                    className="flex items-center gap-2 text-sm cursor-pointer text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors"
                  >
                    <input
                      type="radio"
                      name="category"
                      checked={filters.category === c._id}
                      onChange={() => updateFilter("category", c._id)}
                      className="accent-primary-600"
                    />{" "}
                    {c.name}
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Price Range
              </h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => updateFilter("minPrice", e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => updateFilter("maxPrice", e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* Rating */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Minimum Rating
              </h3>
              <div className="space-y-2">
                {[4, 3, 2, 1].map((r) => (
                  <label
                    key={r}
                    className="flex items-center gap-2 text-sm cursor-pointer text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors"
                  >
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.rating === String(r)}
                      onChange={() => updateFilter("rating", String(r))}
                      className="accent-primary-600"
                    />{" "}
                    {r}+ stars
                  </label>
                ))}
              </div>
            </div>

            {/* Clear */}
            <button
              onClick={clearFilters}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white rounded-xl text-sm font-semibold transition-all duration-200"
            >
              <Filter size={14} /> Clear All Filters
            </button>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <Loader />
          ) : products.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-soft border border-gray-100 dark:border-gray-700">
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">
                No products found
              </p>
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-pink-600 hover:from-primary-700 hover:to-pink-700 text-white rounded-full font-semibold shadow-elegant hover:shadow-glow transition-all duration-200"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <ProductGrid products={products} />
              {pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: pagination.pages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => updateFilter("page", i + 1)}
                      className={
                        "w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-150 " +
                        (filters.page === i + 1
                          ? "bg-gradient-to-r from-primary-600 to-pink-600 text-white shadow-elegant"
                          : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-primary-50 dark:hover:bg-gray-700")
                      }
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
