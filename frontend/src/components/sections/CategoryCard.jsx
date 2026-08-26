import { Link } from 'react-router-dom';

export default function CategoryCard({ category, variant = 'default' }) {
  const { name, image, alt, href, description, icon } = category;

  if (variant === 'bento-large') {
    return (
      <Link
        to={href}
        className="group relative overflow-hidden bg-surface-container-lowest h-[400px] md:h-full flex flex-col justify-end p-8 border border-outline-variant/30 transition-shadow duration-300 hover:shadow-luxury"
      >
        <img
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          src={image}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="relative z-10 text-surface-container-lowest">
          <h3 className="font-headline text-headline-md mb-2">{name}</h3>
          <p className="font-body text-body-md opacity-90 flex items-center gap-2">
            Explore <span class="material-symbols-outlined text-sm" data-icon="arrow_forward">arrow_forward</span>
          </p>
        </div>
      </Link>
    );
  }

  if (variant === 'bento-small') {
    return (
      <Link
        to={href}
        className="group relative overflow-hidden bg-surface-container-lowest flex flex-col justify-end p-8 border border-outline-variant/30 transition-shadow duration-300 hover:shadow-luxury"
      >
        <img
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          src={image}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="relative z-10 text-surface-container-lowest">
          <h3 className="font-headline text-headline-md mb-2">{name}</h3>
        </div>
      </Link>
    );
  }

  if (variant === 'info') {
    return (
      <div className="bg-surface-container-low p-10 flex flex-col justify-center border border-outline-variant/30">
        <span class="material-symbols-outlined text-secondary text-4xl mb-6" data-icon={icon || 'diamond'}>
          {icon || 'diamond'}
        </span>
        <h3 className="font-headline text-headline-md text-primary mb-4">{name}</h3>
        <p className="font-body text-body-md text-on-surface-variant mb-8">
          {description}
        </p>
        <Link
          to={href}
          className="inline-flex items-center text-primary-container font-button text-button border-b border-primary-container pb-1 w-max hover:opacity-70 transition-opacity"
        >
          Learn Our Process
        </Link>
      </div>
    );
  }

  return (
    <article className="group">
      <div className="relative aspect-square overflow-hidden bg-surface-container-lowest mb-6">
        <img
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          src={image}
        />
      </div>
      <div className="text-center">
        <h3 className="font-headline text-headline-md text-primary mb-2">{name}</h3>
      </div>
    </article>
  );
}