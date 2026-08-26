import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { heroSlides } from '../../data/products';

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slidesRef = useRef(null);
  const dotsRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const showSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section
      className="relative h-screen min-h-[800px] w-full flex items-center justify-center overflow-hidden mt-20 md:mt-0"
      id="hero-slider"
      ref={slidesRef}
    >
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`hero-slide absolute inset-0 transition-opacity duration-1000 z-0 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
          role="img"
          aria-label={slide.alt}
        >
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img
            className="absolute inset-0 w-full h-full object-cover object-center z-0"
            src={slide.image}
            alt={slide.alt}
          />
        </div>
      ))}

      <div className="relative z-20 text-center px-5 md:px-20 max-w-4xl mx-auto flex flex-col items-center pointer-events-none">
        <h1 className="font-display text-display-lg-mobile md:text-display-lg text-surface-container-lowest mb-6 drop-shadow-md pointer-events-auto">
          Discover Earth's Rarest Treasures
        </h1>
        <p className="font-body text-body-lg text-surface-container-lowest/90 mb-10 max-w-2xl text-center pointer-events-auto drop-shadow">
          Curated loose gemstones and bespoke jewelry for the discerning collector.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center justify-center bg-primary-container text-on-primary font-button text-button px-8 py-4 rounded hover:bg-primary transition-colors duration-300 cursor-pointer pointer-events-auto"
        >
          Shop the Collection
        </Link>
      </div>

      <div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 z-20"
        ref={dotsRef}
        role="tablist"
        aria-label="Hero slides"
      >
        {heroSlides.map((_, index) => (
          <button
            key={index}
            role="tab"
            aria-selected={index === currentSlide}
            aria-label={`Slide ${index + 1}`}
            className={`hero-dot w-3 h-3 rounded-full border border-surface-container-lowest transition-opacity ${
              index === currentSlide ? 'bg-surface-container-lowest opacity-100' : 'bg-transparent opacity-50 hover:opacity-100'
            }`}
            onClick={() => showSlide(index)}
          />
        ))}
      </div>
    </section>
  );
}