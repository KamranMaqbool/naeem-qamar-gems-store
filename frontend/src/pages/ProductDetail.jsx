import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { brandConfig, footerLinks } from '../config/brand';

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState(null);

  const product = products.find((p) => p.id === parseInt(id)) || products[6];

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

  return (
    <div className="bg-background text-on-background antialiased font-body text-body-md flex flex-col min-h-screen">
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-5 md:px-20 flex justify-between items-center h-20">
          <nav className="hidden md:flex space-x-6">
            <Link className="font-label text-label-caps text-on-surface-variant hover:text-primary transition-all active:scale-95" to="/shop">Shop</Link>
            <Link className="font-label text-label-caps text-secondary relative after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-secondary after:rounded-full transition-all active:scale-95" to="/shop">Loose Gems</Link>
            <Link className="font-label text-label-caps text-on-surface-variant hover:text-primary transition-all active:scale-95" to="/education">Education</Link>
            <Link className="font-label text-label-caps text-on-surface-variant hover:text-primary transition-all active:scale-95" to="/about">About</Link>
          </nav>

          <div className="flex-shrink-0 flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity duration-300">
            <span className="font-headline text-headline-md text-primary tracking-tighter">{brandConfig.name}</span>
          </div>

          <div className="flex items-center space-x-2 cursor-pointer transition-all active:scale-95">
            <button aria-label="Search" className="p-2 text-on-surface-variant hover:text-primary hover:opacity-70 transition-opacity duration-300">
              <span class="material-symbols-outlined" data-icon="search">search</span>
            </button>
            <button aria-label="Profile" className="p-2 text-on-surface-variant hover:text-primary hover:opacity-70 transition-opacity duration-300 hidden md:block">
              <span class="material-symbols-outlined" data-icon="person">person</span>
            </button>
            <Link to="/cart" aria-label="Cart" className="p-2 text-on-surface-variant hover:text-primary hover:opacity-70 transition-opacity duration-300">
              <span class="material-symbols-outlined" data-icon="shopping_bag">shopping_bag</span>
            </Link>
            <div className="md:hidden flex items-center">
              <button aria-label="Menu" className="p-2 text-on-surface-variant hover:text-primary">
                <span class="material-symbols-outlined" data-icon="menu">menu</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-[140px] pb-section-gap max-w-[1440px] mx-auto px-5 md:px-20 w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-x-24">
          <div className="md:col-span-7 flex flex-col space-y-2">
            <div className="w-full bg-surface-container-lowest flex items-center justify-center overflow-hidden">
              <img
                alt={product.name}
                className="w-full h-auto object-cover transform hover:scale-[1.02] transition-transform duration-700 ease-in-out cursor-zoom-in"
                src={product.images?.[activeImage] || product.image}
              />
            </div>

            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, index) => (
                  <div
                    key={index}
                    className={`bg-surface-container-lowest overflow-hidden cursor-pointer transition-opacity ${
                      activeImage === index ? 'opacity-100 ring-1 ring-primary ring-inset' : 'opacity-60 hover:opacity-100'
                    }`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img alt={`${product.name} view ${index + 1}`} className="w-full h-auto object-cover" src={img} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-5 flex flex-col justify-start pt-8 md:pt-0">
            <nav className="font-label text-label-caps text-on-surface-variant mb-6 flex space-x-2" aria-label="Breadcrumb">
              <Link className="hover:text-primary transition-colors" to="/shop">Loose Gems</Link>
              <span>/</span>
              <Link className="hover:text-primary transition-colors" to="/shop">{product.type}s</Link>
            </nav>

            <h1 className="font-headline text-headline-lg-mobile md:text-headline-lg text-primary mb-4">{product.name}</h1>
            <p className="font-headline text-headline-md text-on-surface mb-8">{formatPrice(product.price)}</p>

            <div className="prose prose-sm font-body text-body-lg text-on-surface-variant mb-10 leading-relaxed">
              <p>{product.description}</p>
            </div>

            <div className="mb-12">
              <button
                onClick={() => addItem(product)}
                className="w-full bg-primary-container text-on-primary font-button text-button py-4 px-8 rounded flex justify-center items-center hover:bg-primary transition-colors duration-300"
              >
                Add to Bag
              </button>
              <p className="font-body text-sm text-center text-on-surface-variant mt-4">Complimentary shipping & returns on all orders.</p>
            </div>

            <div className="border-t border-outline-variant/30">
              <div className="accordion-item border-b border-outline-variant/30">
                <button
                  className={`w-full py-6 flex justify-between items-center text-left focus:outline-none ${
                    activeAccordion === 'certificate' ? 'active' : ''
                  }`}
                  onClick={() => toggleAccordion('certificate')}
                >
                  <span className="font-button text-button text-primary tracking-wider uppercase">Gemological Certificate details</span>
                  <span className={`material-symbols-outlined accordion-icon text-outline ${activeAccordion === 'certificate' ? 'active' : ''}`} data-icon="expand_more">
                    expand_more
                  </span>
                </button>
                <div className="accordion-content">
                  <div className="pb-6 font-body text-body-md text-on-surface-variant space-y-4">
                    <p>Accompanied by a comprehensive GIA report verifying its origin and characteristics.</p>
                    <ul className="list-disc pl-5 space-y-1">
                      {product.details && Object.entries(product.details).map(([key, value]) => (
                        <li key={key}><strong>{key}:</strong> {value}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="accordion-item border-b border-outline-variant/30">
                <button
                  className={`w-full py-6 flex justify-between items-center text-left focus:outline-none ${
                    activeAccordion === 'shipping' ? 'active' : ''
                  }`}
                  onClick={() => toggleAccordion('shipping')}
                >
                  <span className="font-button text-button text-primary tracking-wider uppercase">Shipping details</span>
                  <span className={`material-symbols-outlined accordion-icon text-outline ${activeAccordion === 'shipping' ? 'active' : ''}`} data-icon="expand_more">
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
      </main>

      <footer className="bg-surface-container-low border-t border-outline-variant/30 w-full py-section-gap mt-auto">
        <div className="max-w-[1440px] mx-auto px-5 md:px-20 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-24">
          <div className="flex flex-col space-y-4">
            <span className="font-headline text-headline-md text-primary">{brandConfig.name}</span>
            <p className="font-body text-body-md text-on-surface-variant">{brandConfig.getCopyright()}</p>
          </div>
          <div className="flex flex-col space-y-2 font-body text-body-md">
            {footerLinks.support.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-on-surface-variant hover:text-secondary transition-colors duration-200 w-fit"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col space-y-2 font-body text-body-md">
            <Link className="text-on-surface-variant hover:text-secondary transition-colors duration-200 w-fit" to="/terms">Terms</Link>
            <Link className="text-on-surface-variant hover:text-secondary transition-colors duration-200 w-fit" to="/contact">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}