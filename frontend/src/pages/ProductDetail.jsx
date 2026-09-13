import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/product/ProductCard';
import { fetchProductBySlug, fetchProducts } from '../lib/api';

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const staticProduct = products.find((p) => p.id === parseInt(id));

    if (id && !/^\d+$/.test(id)) {
      fetchProductBySlug(id)
        .then(async (p) => {
          const mapped = mapApiProduct(p);
          setProduct(mapped);
          try {
            const catalog = await fetchProducts({ page_size: 100 });
            setRelatedProducts(catalog
              .filter((item) => item.id !== mapped.id)
              .filter((item) => !mapped.type || item.category === mapped.type)
              .slice(0, 4)
              .map(mapApiProduct));
          } catch {
            setRelatedProducts([]);
          }
        })
        .catch(() => {
          setProduct(staticProduct || products[6]);
        })
        .finally(() => setLoading(false));
    } else {
      setProduct(staticProduct || products[6]);
      setRelatedProducts(products.filter((item) => item.id !== staticProduct?.id).slice(0, 4));
      setLoading(false);
    }
  }, [id]);

  function mapApiProduct(p) {
    const gem = p.gemstone_attributes || {};
    return {
      id: p.id,
      name: p.title,
      slug: p.slug,
      sku: p.sku || '',
      price: parseFloat(p.sale_price || p.base_price),
      priceOnRequest: parseFloat(p.base_price) === 0,
      image: p.images?.[0]?.image_url || '',
      images: p.images?.map((img) => img.image_url) || [],
      type: p.category?.name || '',
      carat: gem.carat_weight || '',
      cut: gem.cut_shape || '',
      description: p.description,
      tags: (p.tags || '').split(',').map((t) => t.trim()).filter(Boolean),
      details: {
        caratWeight: gem.carat_weight ? `${gem.carat_weight} ct` : '',
        color: gem.color_grade || '',
        clarity: gem.clarity_grade || '',
        treatment: gem.treatment || '',
        certificate: gem.certification_lab || '',
        origin: gem.origin_country || '',
      },
    };
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-on-surface-variant">Loading...</div>
      </div>
    );
  }

  if (!product) return null;

  const formatPrice = (price) => {
    if (product.priceOnRequest) return 'Price on Request';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const toggleAccordion = (key) => {
    setActiveAccordion((prev) => (prev === key ? null : key));
  };

  const thumbnailImages = product.images?.length ? product.images : [product.image];

  return (
    <div className="bg-background text-on-background antialiased font-body text-body-md flex flex-col min-h-screen">
      <main className="flex-grow pt-32 pb-section-gap max-w-[1440px] mx-auto px-5 md:px-20 w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-x-24">
          <div className="md:col-span-7 flex flex-col space-y-2">
            <div className="w-full bg-surface-container-lowest flex items-center justify-center overflow-hidden">
              <img
                alt={product.name}
                className="w-full h-auto object-cover transform hover:scale-[1.02] transition-transform duration-700 ease-in-out cursor-zoom-in"
                src={thumbnailImages[activeImage] || product.image}
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {thumbnailImages.slice(0, 4).map((img, index) => (
                <div
                  key={index}
                  className={`bg-surface-container-lowest overflow-hidden cursor-pointer transition-opacity ${
                    activeImage === index
                      ? 'opacity-100 ring-1 ring-outline/30 ring-inset'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <img
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-auto object-cover"
                    src={img}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-5 flex flex-col justify-start pt-8 md:pt-0">
            <nav className="font-label text-label-caps text-on-surface-variant mb-6 flex space-x-2" aria-label="Breadcrumb">
              <Link className="hover:text-primary transition-colors" to="/shop">Loose Gems</Link>
              <span>/</span>
              <Link className="hover:text-primary transition-colors" to="/shop">{product.type}s</Link>
            </nav>

            <div className="flex items-start justify-between gap-4">
              <h1 className="font-headline text-headline-lg-mobile md:text-headline-lg text-primary mb-3">{product.name}</h1>
              <button
                type="button"
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                onClick={() => setIsWishlisted((value) => !value)}
                className="shrink-0 rounded-full border border-outline-variant/60 p-3 text-primary transition-colors hover:border-primary hover:bg-surface-container-low"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <p className="font-headline text-headline-md text-on-surface">{formatPrice(product.price)}</p>
              {product.tags?.[0] && <span className="rounded-full bg-secondary-container/30 px-3 py-1 font-label text-[11px] uppercase tracking-wider text-primary">{product.tags[0]}</span>}
            </div>
            <p className="mb-6 font-mono text-xs uppercase tracking-wider text-on-surface-variant">SKU: {product.sku || 'Available on request'}</p>

            <div className="prose prose-sm font-body text-body-lg text-on-surface-variant mb-10 leading-relaxed">
              <p>{product.description || 'A carefully selected gemstone with exceptional character, documented provenance, and refined finishing.'}</p>
            </div>

            <div className="mb-10 space-y-3">
              {!product.priceOnRequest && (
                <div className="flex items-center gap-3">
                  <label htmlFor="quantity" className="font-label text-label-caps text-on-surface-variant">Quantity</label>
                  <div className="flex items-center rounded border border-outline-variant">
                    <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="px-3 py-2 text-primary hover:bg-surface-container-low" aria-label="Decrease quantity">−</button>
                    <span className="min-w-10 text-center text-sm">{quantity}</span>
                    <button type="button" onClick={() => setQuantity((value) => value + 1)} className="px-3 py-2 text-primary hover:bg-surface-container-low" aria-label="Increase quantity">+</button>
                  </div>
                </div>
              )}
              <button
                onClick={() => addItem(product, quantity)}
                className="w-full bg-primary-container text-on-primary font-button text-button py-4 px-8 rounded flex justify-center items-center hover:bg-primary transition-colors duration-300"
              >
                <span className="material-symbols-outlined mr-2 text-lg">shopping_bag</span>
                {product.priceOnRequest ? 'Request Availability' : 'Add to Bag'}
              </button>
              <Link to="/contact" className="block w-full border border-primary py-3 text-center font-button text-button uppercase tracking-wider text-primary transition-colors hover:bg-surface-container-low">Speak with a Gem Specialist</Link>
              <p className="font-body text-sm text-center text-on-surface-variant">Complimentary insured shipping and 30-day returns.</p>
            </div>

            <div className="mb-10 grid grid-cols-1 gap-3 border-y border-outline-variant/30 py-5 sm:grid-cols-3">
              {[['verified', 'Authenticity guaranteed'], ['local_shipping', 'Insured worldwide delivery'], ['workspace_premium', 'Independent certification']].map(([icon, label]) => (
                <div key={label} className="flex items-center gap-2 text-sm text-on-surface-variant"><span className="material-symbols-outlined text-secondary">{icon}</span>{label}</div>
              ))}
            </div>

            <div className="mb-10">
              <h2 className="mb-4 font-headline text-headline-sm text-primary">Gemstone specifications</h2>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-y border-outline-variant/30 py-5 text-sm sm:grid-cols-3">
                {product.details && Object.entries(product.details).filter(([, value]) => value).map(([key, value]) => (
                  <div key={key}><dt className="font-label text-[11px] uppercase tracking-wider text-on-surface-variant">{key.replace(/([A-Z])/g, ' $1')}</dt><dd className="mt-1 text-on-surface">{value}</dd></div>
                ))}
              </dl>
            </div>

            <div className="border-t border-outline-variant/30">
              <div className={`accordion-item border-b border-outline-variant/30 ${activeAccordion === 'certificate' ? 'active' : ''}`}>
                <button
                  className="w-full py-6 flex justify-between items-center text-left focus:outline-none"
                  onClick={() => toggleAccordion('certificate')}
                >
                  <span className="font-button text-button text-primary tracking-wider uppercase">Gemological Certificate details</span>
                  <span className={`material-symbols-outlined accordion-icon text-outline ${activeAccordion === 'certificate' ? 'active' : ''}`}>
                    expand_more
                  </span>
                </button>
                <div className="accordion-content">
                  <div className="pb-6 font-body text-body-md text-on-surface-variant space-y-4">
                    <p>Accompanied by a comprehensive GIA report verifying its origin and characteristics.</p>
                    <ul className="list-disc pl-5 space-y-1">
                      {product.details && Object.entries(product.details).filter(([, v]) => v).map(([key, value]) => (
                        <li key={key}><strong>{key}:</strong> {value}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className={`accordion-item border-b border-outline-variant/30 ${activeAccordion === 'shipping' ? 'active' : ''}`}>
                <button
                  className="w-full py-6 flex justify-between items-center text-left focus:outline-none"
                  onClick={() => toggleAccordion('shipping')}
                >
                  <span className="font-button text-button text-primary tracking-wider uppercase">Shipping details</span>
                  <span className={`material-symbols-outlined accordion-icon text-outline ${activeAccordion === 'shipping' ? 'active' : ''}`}>
                    expand_more
                  </span>
                </button>
                <div className="accordion-content">
                  <div className="pb-6 font-body text-body-md text-on-surface-variant space-y-2">
                    <p>We offer fully insured, complimentary overnight shipping for this item within the United States.</p>
                    <p>International shipping is available via FedEx Priority. Duties and taxes may apply.</p>
                    <p>A signature is required upon delivery for all fine jewelry pieces.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-20 border-t border-outline-variant/30 pt-12" aria-labelledby="related-products-heading">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="font-label text-label-caps text-secondary">Curated for you</p>
                <h2 id="related-products-heading" className="mt-2 font-headline text-headline-lg-mobile md:text-headline-lg text-primary">More from this collection</h2>
              </div>
              <Link to="/shop" className="hidden font-button text-button text-primary underline-offset-4 hover:underline sm:block">View all gemstones</Link>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((item) => <ProductCard key={item.id} product={item} variant="grid" />)}
            </div>
          </section>
        )}
      </main>

    </div>
  );
}
