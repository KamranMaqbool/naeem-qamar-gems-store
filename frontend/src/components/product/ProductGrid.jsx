import ProductCard from './ProductCard';

export default function ProductGrid({ products, title = 'Featured Acquisitions', subtitle = 'Exceptional pieces recently added to the vault.', showViewAll = true, onViewAllClick }) {
  return (
    <section className="py-section-gap px-5 md:px-20 bg-surface-bright border-y border-outline-variant/30">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="font-headline text-headline-lg text-primary mb-2">{title}</h2>
            <p className="font-body text-body-md text-on-surface-variant">{subtitle}</p>
          </div>
          {showViewAll && (
            <a
              href="#"
              onClick={onViewAllClick}
              className="hidden md:inline-flex items-center text-primary font-button text-button border border-secondary/30 px-6 py-3 rounded hover:bg-surface-container transition-colors"
            >
              View All
            </a>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} variant="featured" />
          ))}
        </div>
        {showViewAll && (
          <div className="mt-12 text-center md:hidden">
            <a
              href="#"
              onClick={onViewAllClick}
              className="inline-flex items-center text-primary font-button text-button border border-secondary/30 px-6 py-3 rounded hover:bg-surface-container transition-colors w-full justify-center"
            >
              View All
            </a>
          </div>
        )}
      </div>
    </section>
  );
}