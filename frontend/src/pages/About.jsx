import { Link } from 'react-router-dom';
import { brandConfig, footerLinks } from '../config/brand';

export default function About() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-grow">
        <section className="relative h-[70vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden">
          <video
            className="absolute inset-0 w-full h-full object-cover z-0"
            autoPlay
            muted
            loop
            playsInline
            poster="/logo.svg"
          >
            <source src="/about-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-primary/60 z-10" />
          <div className="relative z-20 text-center px-5 md:px-20 max-w-4xl mx-auto">
            <h1 className="font-display text-display-lg-mobile md:text-display-lg text-surface-container-lowest mb-6 drop-shadow-md">
              Our Story
            </h1>
            <p className="font-body text-body-lg text-surface-container-lowest/90 mb-10 max-w-2xl mx-auto drop-shadow">
              Three generations of gemstone expertise, one unwavering commitment to excellence.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center bg-secondary text-on-secondary font-button text-button px-8 py-4 rounded hover:bg-secondary-fixed-dim transition-colors duration-300"
            >
              Explore Our Collection
            </Link>
          </div>
        </section>

        <section className="py-section-gap px-5 md:px-20 bg-surface-bright">
          <div className="max-w-[1440px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <div className="relative aspect-[4/3] bg-surface-container-low overflow-hidden">
                <img
                  alt="Naeem Qamar Gems workshop"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuABuk_j_HckpFbumdF99nS_4qIJCEoEqd9mY72_mOK7nxgxHyf9AX7lxFcOx3oxj8me6j_me4mKj83jHRA0Gubgymc3oOImEnNCISoewsUIVXUIUHLtOOT1043RSVCHOR1xO6AbYcmCQDFMM7yOmttiNw6DFB9rp7akqjnV6ajdaOBK1dEeHZfX5InOq-DMXtzhl5CFkH-DkerTmjwqLA_c4XoaJvNerxqrd8u5aodT4fr1-QBEez6C"
                />
              </div>
              <div>
                <span className="font-label text-label-caps text-secondary mb-4 block">Our Heritage</span>
                <h2 className="font-headline text-headline-lg text-primary mb-6">
                  Crafting Legacies Since 1978
                </h2>
                <div className="space-y-4 text-on-surface-variant font-body text-body-lg leading-relaxed">
                  <p>
                    Founded in the heart of Jaipur's historic gem district, Naeem Qamar Gems began as a
                    small family workshop where master artisans hand-cut and polished stones for local
                    jewelers. What started with three brothers and a single cutting wheel has grown into
                    a globally recognized name in ethically sourced, exceptional gemstones.
                  </p>
                  <p>
                    Today, under the leadership of the third generation, we continue the legacy of
                    precision and passion. Every gemstone that bears our name has passed through the
                    hands of experts who understand that true value lies not just in carat weight or
                    clarity grades, but in the story each stone carries from earth to heirloom.
                  </p>
                  <p>
                    We believe that luxury is not about excess—it's about intention. Every piece in our
                    collection represents countless hours of careful selection, ethical sourcing, and
                    masterful craftsmanship.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-section-gap px-5 md:px-20 bg-background">
          <div className="max-w-[1440px] mx-auto">
            <div className="text-center mb-16">
              <span className="font-label text-label-caps text-secondary mb-4 block">Our Philosophy</span>
              <h2 className="font-headline text-headline-lg text-primary mb-4">The Three Pillars</h2>
              <p className="font-body text-body-md text-on-surface-variant max-w-xl mx-auto">
                Every decision we make is guided by these fundamental principles
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: 'diamond',
                  title: 'Exceptional Quality',
                  description: 'We source only the top 1% of gemstones worldwide. Each stone is hand-selected for superior cut, color, and clarity by our certified gemologists.',
                },
                {
                  icon: 'eco',
                  title: 'Ethical Sourcing',
                  description: 'Full traceability from mine to market. We partner exclusively with mines that uphold fair labor practices, environmental stewardship, and community development.',
                },
                {
                  icon: 'handshake',
                  title: 'Lifetime Trust',
                  description: 'Every purchase includes a GIA certificate, lifetime warranty, and our personal commitment to your satisfaction. We build relationships, not transactions.',
                },
              ].map((pillar, index) => (
                <div
                  key={index}
                  className="bg-surface-container-lowest border border-outline-variant/30 p-8 text-center hover:shadow-luxury transition-shadow duration-300"
                >
                  <span class="material-symbols-outlined text-secondary text-4xl mb-6 block" data-icon={pillar.icon}>
                    {pillar.icon}
                  </span>
                  <h3 className="font-headline text-headline-md text-primary mb-4">{pillar.title}</h3>
                  <p className="font-body text-body-md text-on-surface-variant">{pillar.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-section-gap px-5 md:px-20 bg-surface-container-low">
          <div className="max-w-[1440px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <div>
                <span className="font-label text-label-caps text-secondary mb-4 block">Master Craftsmanship</span>
                <h2 className="font-headline text-headline-lg text-primary mb-6">
                  Where Science Meets Art
                </h2>
                <div className="space-y-4 text-on-surface-variant font-body text-body-lg leading-relaxed">
                  <p>
                    Our master cutters combine generations of traditional knowledge with
                    state-of-the-art technology. Using precision laser mapping and 3D modeling,
                    we reveal the maximum brilliance within each rough crystal while preserving
                    its natural character.
                  </p>
                  <p>
                    From the initial rough assessment to the final polish, every step is
                    documented and verified. Our in-house laboratory, equipped with
                    spectrometers, microscopes, and photoluminescence imaging, ensures
                    complete transparency about each stone's identity and treatment history.
                  </p>
                  <p>
                    This meticulous approach means that when you choose a Naeem Qamar gem,
                    you're not just buying a stone—you're inheriting a legacy of excellence
                    that spans decades.
                  </p>
                </div>
                <Link
                  to="/shop"
                  className="inline-flex items-center text-primary-container font-button text-button border-b border-primary-container pb-1 mt-6 hover:opacity-70 transition-opacity"
                >
                  View Our Certified Collection <span class="material-symbols-outlined text-sm ml-2" data-icon="arrow_forward">arrow_forward</span>
                </Link>
              </div>
              <div className="relative aspect-[4/3] bg-surface-container overflow-hidden">
                <img
                  alt="Gemstone cutting workshop"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrtLmBSeitG0EPhb0crByr1GkSIq5i-89_tYQ41xGZHb1xxTGjNpyJsmD9I5NxB0msXxMfhj9TVPP_JZ_cs18MT63GKFnrkqY7DjrOo0jggC_Xl7gwylRP0oqfOlLx4ru6Fp5uipt7fIiiZm1f8fK33-mLJtqwaFYuM4GsDKZrwxybLAXsYCmjnboi5BRsEe6IiyxCKOFW6Ag2Sj31nnOvFbMVWq_xTe_YRqlwicWVtjd6lffUbh6l"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-section-gap px-5 md:px-20 bg-background">
          <div className="max-w-[1440px] mx-auto text-center">
            <span className="font-label text-label-caps text-secondary mb-4 block">Our Journey</span>
            <h2 className="font-headline text-headline-lg text-primary mb-12">Milestones</h2>
            <div className="max-w-3xl mx-auto space-y-8">
              {[
                { year: '1978', title: 'Foundation', description: 'Workshop established in Jaipur by three master craftsmen brothers.' },
                { year: '1995', title: 'First International Export', description: 'Began supplying loose gemstones to European jewelry houses.' },
                { year: '2003', title: 'GIA Partnership', description: 'Became authorized partners for certified gemstone grading and reports.' },
                { year: '2012', title: 'Ethical Sourcing Initiative', description: 'Launched traceable mine-to-market program with Fair Trade certification.' },
                { year: '2020', title: 'Digital Transformation', description: 'Launched global e-commerce platform with virtual gemstone consultations.' },
                { year: '2024', title: 'Third Generation Leadership', description: 'Next generation takes helm, combining heritage with innovation.' },
              ].map((milestone, index) => (
                <div
                  key={index}
                  className="flex gap-6 md:gap-8 text-left relative"
                >
                  {index < 5 && (
                    <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-outline-variant/30 hidden md:block" />
                  )}
                  <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary-container flex items-center justify-center text-on-primary font-headline text-headline-md z-10">
                    {milestone.year}
                  </div>
                  <div className="flex-1 pt-2 md:pt-0">
                    <h3 className="font-headline text-headline-md text-primary mb-2">{milestone.title}</h3>
                    <p className="font-body text-body-md text-on-surface-variant">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-section-gap px-5 md:px-20 bg-primary-container">
          <div className="max-w-[1440px] mx-auto text-center">
            <h2 className="font-headline text-headline-lg text-on-primary mb-6">
              Experience the Naeem Qamar Difference
            </h2>
            <p className="font-body text-body-lg text-on-primary/80 mb-10 max-w-2xl mx-auto">
              Whether you're a collector seeking a rare investment stone or a designer crafting
              the next masterpiece, our team is here to guide you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center bg-secondary text-on-secondary font-button text-button px-8 py-4 rounded hover:bg-secondary-fixed-dim transition-colors duration-300"
              >
                Browse Collection
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center bg-transparent border border-secondary text-secondary font-button text-button px-8 py-4 rounded hover:bg-secondary hover:text-on-secondary transition-colors duration-300"
              >
                Schedule Consultation
              </Link>
            </div>
          </div>
        </section>
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