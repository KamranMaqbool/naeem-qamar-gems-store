import { Link } from 'react-router-dom';

export default function ProductCard({ product, variant = 'default' }) {
  const { name, carat, cut, price, image, alt, tags = [], priceOnRequest } = product;

  const formatPrice = (price) => {
    if (priceOnRequest) return 'Price on Request';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (variant === 'featured') {
    return (
      <Link to={`/product/${product.id}`} className="group cursor-pointer block">
        <div className="relative aspect-square overflow-hidden bg-surface-container-lowest mb-6 border border-outline-variant/30">
          <img
            alt={alt}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            src={image}
          />
          {tags.length > 0 && (
            <div className="absolute top-4 left-4 border border-secondary/30 text-primary font-label text-label-caps px-3 py-1 bg-surface-container-lowest/80 backdrop-blur-sm">
              {tags[0]}
            </div>
          )}
        </div>
        <div className="text-center">
          <h3 className="font-headline text-[24px] text-primary mb-2">{name}</h3>
          <p className="font-body text-body-md text-on-surface-variant mb-3">{carat} • {cut}</p>
          <p className="font-body text-body-lg text-primary">{formatPrice(price)}</p>
        </div>
      </Link>
    );
  }

  if (variant === 'grid') {
    return (
      <Link to={`/product/${product.id}`} className="group block image-scale">
        <div className="relative bg-surface-container-lowest aspect-square mb-6 overflow-hidden flex items-center justify-center p-4">
          {tags.length > 0 && (
            <div className="absolute top-4 left-4 z-10 px-3 py-1 border border-[#D4AF37] font-label text-label-caps text-primary bg-background/80 backdrop-blur-sm rounded-sm uppercase tracking-widest text-[10px]">
              {tags[0]}
            </div>
          )}
          <img
            alt={alt}
            className="w-full h-full object-cover"
            src={image}
          />
        </div>
        <div className="text-center">
          <h4 className="font-headline text-headline-md text-primary mb-1">{name}</h4>
          <p className="font-body text-body-md text-on-surface-variant mb-2">{carat} Carat • {cut}</p>
          <p className="font-button text-button text-primary">{formatPrice(price)}</p>
        </div>
      </Link>
    );
  }

  return (
    <article className="group">
      <div className="relative aspect-square overflow-hidden bg-surface-container-lowest mb-6 border border-outline-variant/30">
        <img
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          src={image}
        />
        {tags.length > 0 && (
          <div className="absolute top-4 left-4 border border-secondary/30 text-primary font-label text-label-caps px-3 py-1 bg-surface-container-lowest/80 backdrop-blur-sm">
            {tags[0]}
          </div>
        )}
      </div>
      <div className="text-center">
        <h3 className="font-headline text-headline-md text-primary mb-2">{name}</h3>
        <p className="font-body text-body-md text-on-surface-variant mb-3">{carat} • {cut}</p>
        <p className="font-body text-body-lg text-primary">{formatPrice(price)}</p>
      </div>
    </article>
  );
}