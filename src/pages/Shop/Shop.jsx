import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Filter, X, SlidersHorizontal } from "lucide-react";
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold">Shop</h1>
          <p className="text-sm text-gray-500">
            {pagination.total || 0} products
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden btn-outline text-sm py-2"
          >
            <SlidersHorizontal size={16} /> Filters
          </button>
          <select
            value={filters.sort}
            onChange={(e) => updateFilter("sort", e.target.value)}
            className="input py-2 w-auto"
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside
          className={
            "lg:block " +
            (showFilters
              ? "block fixed inset-0 z-50 bg-white p-6 overflow-y-auto"
              : "hidden")
          }
        >
          {showFilters && (
            <div className="flex justify-between items-center mb-4 lg:hidden">
              <h2 className="font-semibold text-lg">Filters</h2>
              <button onClick={() => setShowFilters(false)}>
                <X size={20} />
              </button>
            </div>
          )}
          <div className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
                className="input"
              />
            </div>
            <div>
              <h3 className="font-semibold mb-3">Categories</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={!filters.category}
                    onChange={() => updateFilter("category", "")}
                    className="text-primary-600"
                  />{" "}
                  All
                </label>
                {categories.map((c) => (
                  <label
                    key={c._id}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="category"
                      checked={filters.category === c._id}
                      onChange={() => updateFilter("category", c._id)}
                      className="text-primary-600"
                    />{" "}
                    {c.name}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Price Range</h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => updateFilter("minPrice", e.target.value)}
                  className="input"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => updateFilter("maxPrice", e.target.value)}
                  className="input"
                />
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Rating</h3>
              <div className="space-y-2">
                {[4, 3, 2, 1].map((r) => (
                  <label
                    key={r}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.rating === String(r)}
                      onChange={() => updateFilter("rating", String(r))}
                      className="text-primary-600"
                    />{" "}
                    {r}+ stars
                  </label>
                ))}
              </div>
            </div>
            <button
              onClick={clearFilters}
              className="btn-outline w-full text-sm"
            >
              Clear All Filters
            </button>
          </div>
        </aside>

        <div className="lg:col-span-3">
          {isLoading ? (
            <Loader />
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500">No products found</p>
              <button onClick={clearFilters} className="btn-primary mt-4">
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
                        "w-10 h-10 rounded-full " +
                        (filters.page === i + 1
                          ? "bg-primary-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200")
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
