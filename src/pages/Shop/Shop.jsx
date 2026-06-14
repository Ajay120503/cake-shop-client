import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  X,
  SlidersHorizontal,
  Search,
  ChevronDown,
  Star,
} from "lucide-react";
import { productAPI, categoryAPI } from "../../api/endpoints.js";
import ProductGrid from "../../components/product/ProductGrid.jsx";
import Loader from "../../components/ui/Loader.jsx";
import SEO from "../../components/common/SEO.jsx";

/* ── Collapsible filter section ── */
const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 dark:border-gray-800 pb-5">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full mb-3 group"
      >
        <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-[0.1em]">
          {title}
        </span>
        <ChevronDown
          size={14}
          className={
            "text-gray-400 transition-transform duration-200 " +
            (open ? "rotate-180" : "")
          }
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Pill toggle button ── */
const PillBtn = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={
      "px-2.5 py-1 text-[11px] font-semibold rounded-full border transition-all duration-150 " +
      (active
        ? "border-primary-600 bg-primary-600 text-white"
        : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-primary-400 hover:text-primary-600")
    }
  >
    {children}
  </button>
);

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price ↑" },
  { value: "price-desc", label: "Price ↓" },
  { value: "rating-desc", label: "Top Rated" },
  { value: "best-selling", label: "Best Selling" },
];

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

  const activeFilterCount = Object.entries(filters).filter(
    ([k, v]) => v && k !== "sort" && k !== "page"
  ).length;

  /* Sidebar panel — shared between desktop and mobile drawer */
  const FilterPanel = () => (
    <div className="space-y-5">
      {/* Search */}
      <FilterSection title="Search" defaultOpen>
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search cakes..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-primary-500 outline-none transition-all"
          />
        </div>
      </FilterSection>

      {/* Categories */}
      <FilterSection title="Category" defaultOpen>
        <div className="flex flex-wrap gap-1.5">
          <PillBtn
            active={!filters.category}
            onClick={() => updateFilter("category", "")}
          >
            All
          </PillBtn>
          {categories.map((c) => (
            <PillBtn
              key={c._id}
              active={filters.category === c._id}
              onClick={() => updateFilter("category", c._id)}
            >
              {c.name}
            </PillBtn>
          ))}
        </div>
      </FilterSection>

      {/* Price */}
      <FilterSection title="Price Range">
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min ₹"
            value={filters.minPrice}
            onChange={(e) => updateFilter("minPrice", e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-primary-500 outline-none transition-all"
          />
          <input
            type="number"
            placeholder="Max ₹"
            value={filters.maxPrice}
            onChange={(e) => updateFilter("maxPrice", e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-primary-500 outline-none transition-all"
          />
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Min Rating">
        <div className="flex flex-wrap gap-1.5">
          {[4, 3, 2].map((r) => (
            <PillBtn
              key={r}
              active={filters.rating === String(r)}
              onClick={() =>
                updateFilter(
                  "rating",
                  filters.rating === String(r) ? "" : String(r)
                )
              }
            >
              <span className="flex items-center gap-0.5">
                <Star size={9} className="fill-current" /> {r}+
              </span>
            </PillBtn>
          ))}
        </div>
      </FilterSection>

      {/* Clear */}
      {activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border-2 border-gray-950 dark:border-white text-gray-950 dark:text-white text-xs font-bold hover:bg-gray-950 hover:text-white dark:hover:bg-white dark:hover:text-gray-950 transition-all duration-200"
        >
          <X size={13} /> Clear {activeFilterCount} filter
          {activeFilterCount !== 1 ? "s" : ""}
        </button>
      )}
    </div>
  );

  return (
    <div className="pb-20">
      <SEO
        title="Shop"
        description="Browse our collection of handcrafted cakes, pastries, and desserts."
      />

      {/* ── Shop header — dark, echoes footer/home CTA panels ── */}
      <div className="relative overflow-hidden">
        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="container-custom relative z-10 py-10 sm:py-12">
          <h1 className="text-3xl sm:text-4xl font-display font-bold leading-tight mb-2">
            Shop Collection
          </h1>
          <p className="text-gray-400 text-sm">
            {isLoading
              ? "Loading..."
              : `${pagination.total || 0} cake${
                  pagination.total !== 1 ? "s" : ""
                } found`}
          </p>
        </div>
      </div>

      <div className="container-custom pt-8">
        {/* ── Toolbar ── */}
        <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
          {/* Active filter chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowFilters(true)}
              className="lg:hidden inline-flex items-center gap-1.5 px-4 py-2 rounded-full border-2 border-gray-950 dark:border-white text-gray-950 dark:text-white text-xs font-bold hover:bg-gray-950 hover:text-white dark:hover:bg-white dark:hover:text-gray-950 transition-all"
            >
              <SlidersHorizontal size={13} />
              Filters{activeFilterCount > 0 ? ` · ${activeFilterCount}` : ""}
            </button>
            {/* Active chips */}
            {filters.search && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-[11px] font-semibold border border-primary-200 dark:border-primary-800">
                "{filters.search}"
                <button
                  onClick={() => updateFilter("search", "")}
                  className="ml-0.5 hover:text-rose-500"
                >
                  <X size={10} />
                </button>
              </span>
            )}
            {filters.category &&
              categories.find((c) => c._id === filters.category) && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-[11px] font-semibold border border-primary-200 dark:border-primary-800">
                  {categories.find((c) => c._id === filters.category)?.name}
                  <button
                    onClick={() => updateFilter("category", "")}
                    className="ml-0.5 hover:text-rose-500"
                  >
                    <X size={10} />
                  </button>
                </span>
              )}
          </div>

          {/* Sort tabs */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-full p-1 overflow-x-auto">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => updateFilter("sort", opt.value)}
                className={
                  "px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all duration-150 " +
                  (filters.sort === opt.value
                    ? "bg-gray-950 text-white dark:bg-white dark:text-gray-950"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white")
                }
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
          {/* ── Desktop sidebar ── */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 max-h-[calc(100vh-7rem)] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xs font-black text-gray-950 dark:text-white uppercase tracking-[0.12em]">
                  Filters
                </h2>
                {activeFilterCount > 0 && (
                  <span className="text-[10px] font-bold bg-primary-600 text-white rounded-full px-2 py-0.5">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <FilterPanel />
            </div>
          </aside>

          {/* ── Product area ── */}
          <div>
            {isLoading ? (
              <Loader />
            ) : products.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-16 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                  <Filter size={24} className="text-gray-400" />
                </div>
                <p className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                  No products found
                </p>
                <p className="text-sm text-gray-400 mb-6">
                  Try adjusting your filters to see more results.
                </p>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-full text-sm font-bold transition-all"
                >
                  Clear All Filters
                </button>
              </motion.div>
            ) : (
              <>
                <ProductGrid products={products} />

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center items-center gap-1.5 mt-10">
                    {Array.from(
                      { length: pagination.pages },
                      (_, i) => i + 1
                    ).map((page) => {
                      const isCurrent = filters.page === page;
                      const isNear =
                        Math.abs(page - filters.page) <= 2 ||
                        page === 1 ||
                        page === pagination.pages;
                      if (!isNear) {
                        if (page === 2 || page === pagination.pages - 1)
                          return (
                            <span key={page} className="text-gray-400 px-1">
                              …
                            </span>
                          );
                        return null;
                      }
                      return (
                        <button
                          key={page}
                          onClick={() => setFilters((f) => ({ ...f, page }))}
                          className={
                            "w-9 h-9 rounded-full text-sm font-bold transition-all duration-150 " +
                            (isCurrent
                              ? "bg-gray-950 dark:bg-white text-white dark:text-gray-950"
                              : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-primary-400 hover:text-primary-600")
                          }
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile filter drawer ── */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-[80vw] max-w-sm bg-white dark:bg-gray-900 overflow-y-auto lg:hidden"
            >
              {/* Drawer header */}
              <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-5 py-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-black text-gray-950 dark:text-white uppercase tracking-[0.1em]">
                    Filters
                  </h2>
                  {activeFilterCount > 0 && (
                    <span className="text-[10px] font-bold bg-primary-600 text-white rounded-full px-2 py-0.5">
                      {activeFilterCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="p-5">
                <FilterPanel />
              </div>
              {/* Drawer footer */}
              <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 p-4">
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full py-3 rounded-full bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold transition-all"
                >
                  Show {pagination.total || 0} Results
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;
