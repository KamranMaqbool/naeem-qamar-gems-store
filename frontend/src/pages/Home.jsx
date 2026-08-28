import { useState, useEffect } from 'react';
import HeroSection from '../components/sections/HeroSection';
import CategoryCard from '../components/sections/CategoryCard';
import ProductGrid from '../components/product/ProductGrid';
import TrustBanner from '../components/sections/TrustBanner';
import { categories as staticCategories, featuredProducts as staticFeatured } from '../data/products';
import { fetchProducts, fetchCategories } from '../lib/api';

export default function Home() {
  const [featured, setFeatured] = useState(staticFeatured);
  const [categories, setCategories] = useState(staticCategories);

  useEffect(() => {
    fetchProducts({ is_featured: 'true' })
      .then((products) => {
        const mapped = products.map((p) => ({
          id: p.id,
          name: p.title,
          carat: p.gemstone_attributes?.carat_weight
            ? `${p.gemstone_attributes.carat_weight}ct`
            : '',
          cut: p.gemstone_attributes?.cut_shape || '',
          price: parseFloat(p.sale_price || p.base_price),
          image: typeof p.primary_image === 'object' ? p.primary_image?.image_url : p.primary_image,
          tag: (p.tags || '').split(',')[0]?.trim() || '',
          slug: p.slug,
        }));
        if (mapped.length > 0) setFeatured(mapped);
      })
      .catch(() => {});

    fetchCategories()
      .then((cats) => {
        const catImages = {
          'loose-gemstones': staticCategories[0]?.image,
          'bespoke-rings': staticCategories[1]?.image,
          'fine-necklaces': staticCategories[2]?.image,
        };
        const mapped = cats.slice(0, 3).map((c, i) => ({
          id: c.slug,
          name: c.name,
          image: c.image || catImages[c.slug] || staticCategories[i]?.image || '',
          alt: c.name,
          href: '/shop',
        }));
        if (mapped.length > 0) setCategories(mapped);
      })
      .catch(() => {});
  }, []);

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
              <CategoryCard category={categories[2] || categories[0]} variant="bento-small" />
            </div>
            <CategoryCard category={{ ...categories[0], name: 'The Aurelian Standard', description: 'Every gem in our collection is rigorously inspected for cut, color, clarity, and provenance. We offer only the top 1% of ethically sourced stones.', href: '#', icon: 'diamond' }} variant="info" />
          </div>
        </section>

        <ProductGrid products={featured} />

        <TrustBanner />
      </main>
    </div>
  );
}
