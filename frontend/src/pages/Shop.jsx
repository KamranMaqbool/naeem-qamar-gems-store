import { useState, useEffect, useMemo } from 'react';
import ProductCard from '../components/product/ProductCard';
import FilterSidebar from '../components/product/FilterSidebar';
import { products as staticProducts } from '../data/products';
import { fetchProducts } from '../lib/api';

export default function Shop() {
  const [apiProducts, setApiProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({
    types: [],
    carats: [],
    cut: '',
    // Keep the catalog unfiltered by price until the shopper chooses a range.
    priceRange: { min: '', max: '' },
    inStock: false,
    sortBy: 'Featured',
  });

  useEffect(() => {
    setPage(1);
  }, [filters.types, filters.carats, filters.cut, filters.priceRange.min, filters.priceRange.max, filters.inStock, filters.sortBy]);

  useEffect(() => {
    setLoading(true);
    const caratCodes = { 'Under 1.00 ct': 'under', '1.00 - 2.00 ct': 'one_two', '2.00 - 5.00 ct': 'two_five', 'Over 5.00 ct': 'over' };
    const ordering = { Featured: '-is_featured,-created_at', 'Price: Low to High': 'base_price', 'Price: High to Low': '-base_price', 'Carat: High to Low': '-gemstone_attributes__carat_weight', 'Newest Arrivals': '-created_at' }[filters.sortBy];
    fetchProducts({
      gemstone_type: filters.types.join(','),
      carat_ranges: filters.carats.map((item) => caratCodes[item]).join(','),
      cut_shape: filters.cut,
      min_price: filters.priceRange.min,
      max_price: filters.priceRange.max,
      stock_status: filters.inStock ? 'IN_STOCK' : '',
      ordering,
      page,
      page_size: 9,
      withMeta: true,
    })
      .then((data) => {
        const products = data.results || data;
        const mapped = products.map((p) => ({
          id: p.id,
          name: p.title,
          slug: p.slug,
          carat: p.gemstone_attributes?.carat_weight || '',
          cut: p.gemstone_attributes?.cut_shape || '',
          price: parseFloat(p.sale_price || p.base_price),
          image: (typeof p.primary_image === 'object' ? p.primary_image?.image_url : p.primary_image) || p.images?.[0]?.image_url || '',
          alt: p.title,
          tags: (p.tags || '').split(',').map((t) => t.trim()).filter(Boolean),
          type: p.category?.name || p.category || '',
          category: 'loose',
          priceOnRequest: parseFloat(p.base_price) === 0,
        }));
        setApiProducts((current) => page === 1 || !current ? mapped : [...current, ...mapped]);
        setTotalCount(data.count ?? mapped.length);
        setHasMore(Boolean(data.next));
      })
      .catch(() => { if (page === 1) setApiProducts(null); setHasMore(false); })
      .finally(() => setLoading(false));
  }, [page, filters.types, filters.carats, filters.cut, filters.priceRange.min, filters.priceRange.max, filters.inStock, filters.sortBy]);

  const products = apiProducts || staticProducts;

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({ types: [], carats: [], cut: '', priceRange: { min: '', max: '' }, inStock: false, sortBy: 'Featured' });
    setPage(1);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (apiProducts !== null) return true;
      if (filters.types.length > 0 && !filters.types.includes(product.type)) return false;
      if (filters.carats.length > 0) {
        const carat = parseFloat(product.carat);
        const inRange = filters.carats.some((range) => {
          if (range === 'Under 1.00 ct') return carat < 1;
          if (range === '1.00 - 2.00 ct') return carat >= 1 && carat <= 2;
          if (range === '2.00 - 5.00 ct') return carat >= 2 && carat <= 5;
          if (range === 'Over 5.00 ct') return carat > 5;
          return false;
        });
        if (!inRange) return false;
      }
      if (filters.cut && product.cut !== filters.cut) return false;
      if (filters.priceRange.min !== '' && product.price < Number(filters.priceRange.min)) return false;
      if (filters.priceRange.max !== '' && product.price > Number(filters.priceRange.max)) return false;
      return true;
    });
  }, [products, filters, apiProducts]);

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    switch (filters.sortBy) {
      case 'Price: Low to High':
        return sorted.sort((a, b) => a.price - b.price);
      case 'Price: High to Low':
        return sorted.sort((a, b) => b.price - a.price);
      case 'Carat: High to Low':
        return sorted.sort((a, b) => parseFloat(b.carat) - parseFloat(a.carat));
      case 'Newest Arrivals':
        return sorted.sort((a, b) => b.id - a.id);
      default:
        return sorted;
    }
  }, [filteredProducts, filters.sortBy]);

  return (
    <main className="flex-grow pt-28 pb-section-gap max-w-[1440px] mx-auto px-5 md:px-20 w-full">
      <div className="mb-16 text-center max-w-2xl mx-auto">
        <h1 className="font-display text-display-lg text-primary mb-4">Loose Gemstones</h1>
        <p className="font-body text-body-lg text-on-surface-variant">
          Discover our curated collection of ethically sourced, masterfully cut loose gemstones. Ready to be set in your bespoke creation.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 md:gap-24">
        <FilterSidebar onFilterChange={handleFilterChange} onReset={resetFilters} initialFilters={filters} />

        <div className="flex-grow">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-outline-variant/30">
            <p className="font-body text-body-md text-on-surface-variant">
              {loading && page === 1 ? 'Loading...' : `Showing ${apiProducts !== null ? totalCount : sortedProducts.length} exceptional stones`}
            </p>
            <div className="flex items-center gap-2">
              <span className="font-label text-label-caps text-on-surface-variant">SORT BY:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value }))}
                className="bg-transparent border-none text-primary font-button text-button focus:ring-0 cursor-pointer py-1 pl-2 pr-8 border-b border-primary-container"
              >
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Carat: High to Low</option>
                <option>Newest Arrivals</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-surface-container-low h-64 rounded-lg mb-4" />
                  <div className="bg-surface-container-low h-4 rounded w-3/4 mb-2" />
                  <div className="bg-surface-container-low h-4 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} variant="grid" />
              ))}
            </div>
          )}

          {!loading && sortedProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="font-body text-body-lg text-on-surface-variant">No gemstones match your filters.</p>
              <p className="font-body text-body-md text-on-surface-variant/70 mt-2">Try adjusting your search criteria.</p>
            </div>
          )}

          <div className="mt-16 text-center">
            {hasMore && <button type="button" disabled={loading} onClick={() => setPage((current) => current + 1)} className="bg-primary-container text-on-primary font-button text-button rounded-lg px-8 py-4 hover:bg-primary-fixed-dim hover:text-primary-container transition-colors duration-300 disabled:cursor-wait disabled:opacity-60">
              {loading ? 'Loading…' : 'View More Gemstones'}
            </button>}
          </div>
        </div>
      </div>
    </main>
  );
}
