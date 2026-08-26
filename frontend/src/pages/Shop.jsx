import { useState, useMemo } from 'react';
import ProductCard from '../components/product/ProductCard';
import FilterSidebar from '../components/product/FilterSidebar';
import { products } from '../data/products';

export default function Shop() {
  const [filters, setFilters] = useState({
    types: ['Sapphire'],
    carats: ['2.00 - 5.00 ct'],
    cut: 'Cushion',
    priceRange: { min: 1000, max: 50000 },
    sortBy: 'Featured',
  });

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
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
      if (product.price > 0 && (product.price < filters.priceRange.min || product.price > filters.priceRange.max)) return false;
      return true;
    });
  }, [products, filters]);

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
        <FilterSidebar onFilterChange={handleFilterChange} />

        <div className="flex-grow">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-outline-variant/30">
            <p className="font-body text-body-md text-on-surface-variant">
              Showing {sortedProducts.length} exceptional stones
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} variant="grid" />
            ))}
          </div>

          {sortedProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="font-body text-body-lg text-on-surface-variant">No gemstones match your filters.</p>
              <p className="font-body text-body-md text-on-surface-variant/70 mt-2">Try adjusting your search criteria.</p>
            </div>
          )}

          <div className="mt-16 text-center">
            <button className="bg-primary-container text-on-primary font-button text-button rounded-lg px-8 py-4 hover:bg-primary-fixed-dim hover:text-primary-container transition-colors duration-300">
              View More Gemstones
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}