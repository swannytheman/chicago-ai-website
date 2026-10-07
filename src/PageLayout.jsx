import { useState, useEffect, useRef } from 'react';

export const FadeInSection = ({ children, delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const currentRef = ref.current;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true); }, { threshold: 0.1 });
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); observer.disconnect(); };
  }, []);

  return (
    <div ref={ref} className={`transition-all duration-700 ${className}`} style={{ transitionDelay: `${delay}ms`, opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)' }}>
      {children}
    </div>
  );
};

// Marketing-page layout primitives, shared by the homepage and the vertical landing
// pages (/roofing) so they cannot drift apart. Sections are separated by a hairline inset to the
// content width and generous vertical space rather than each being boxed in a card;
// framing is kept for the two blocks meant to stand out, pricing and the guarantee.
export function Section({ id, labelledBy, rule = true, bottom = 'pb-24 md:pb-32', children }) {
  return (
    <section id={id} className="scroll-mt-16" aria-labelledby={labelledBy}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`${rule ? 'border-t border-zinc-200 pt-16 md:pt-24' : ''} ${bottom}`}>
          {children}
        </div>
      </div>
    </section>
  );
}

// Eyebrow and heading on the left, supporting line on the right, bottoms aligned.
// Stacks on narrower screens.
export function SectionHeader({ eyebrow, title, headingId, lede }) {
  return (
    <FadeInSection>
      <div className="grid lg:grid-cols-12 gap-x-16 gap-y-5 lg:items-end mb-14 md:mb-20">
        <div className="lg:col-span-7">
          <span className="t-eyebrow mb-4">{eyebrow}</span>
          <h2 id={headingId} className="t-h2">{title}</h2>
        </div>
        {lede && <p className="t-lede lg:col-span-5">{lede}</p>}
      </div>
    </FadeInSection>
  );
}

// A column opened by a hairline with a short emerald lead-in: the open-layout
// stand-in for a card.
export function AccentRule({ children }) {
  return (
    <div className="relative border-t border-zinc-200 pt-8 h-full">
      <span className="absolute -top-px left-0 h-0.5 w-12 bg-emerald-600" aria-hidden="true" />
      {children}
    </div>
  );
}
