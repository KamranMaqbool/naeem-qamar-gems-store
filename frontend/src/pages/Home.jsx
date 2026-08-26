import HeroSection from '../components/sections/HeroSection';
import CategoryCard from '../components/sections/CategoryCard';
import ProductGrid from '../components/product/ProductGrid';
import TrustBanner from '../components/sections/TrustBanner';
import { categories, featuredProducts } from '../data/products';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <HeroSection />
        
        <section className="py-section-gap px-5 md:px-20 max-w-[1440px] mx-auto" id="shop">
          <div className="text-center mb-16">
            <h2 className="font-headline text-headline-lg text-primary mb-4">Curated Collections</h2>
            <p className="font-body text-body-md text-on-surface-variant max-w-xl mx-auto">
              Explore our masterfully crafted pieces and ethically sourced loose stones, designed for exceptional beauty.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px]">
            <CategoryCard category={categories[0]} variant="bento-large" />
            <div className="grid grid-cols-1 grid-rows-2 gap-6 h-[800px] md:h-full">
              <CategoryCard category={categories[1]} variant="bento-small" />
              <CategoryCard category={categories[2]} variant="bento-small" />
            </div>
            <CategoryCard category={{ ...categories[0], name: 'The Aurelian Standard', description: 'Every gem in our collection is rigorously inspected for cut, color, clarity, and provenance. We offer only the top 1% of ethically sourced stones.', href: '#', icon: 'diamond' }} variant="info" />
          </div>
        </section>

        <ProductGrid products={featuredProducts} />

        <TrustBanner />
      </main>
    </div>
  );
}