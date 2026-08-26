import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';

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
    <main className="flex-grow pt-28 pb-section-gap max-w-[1440px] mx-auto px-5 md:px-20 w-full">
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
  );
}