import { trustItems } from '../../data/products';

export default function TrustBanner() {
  return (
    <section className="py-16 bg-surface-container-low">
      <div className="max-w-[1440px] mx-auto px-5 md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-outline-variant/30">
          {trustItems.map((item, index) => (
            <div key={index} className="flex flex-col items-center pt-6 md:pt-0">
              <span class="material-symbols-outlined text-secondary text-3xl mb-4" data-icon={item.icon}>
                {item.icon}
              </span>
              <h4 className="font-headline text-[20px] text-primary mb-2">{item.title}</h4>
              <p className="font-body text-body-md text-on-surface-variant max-w-xs">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}