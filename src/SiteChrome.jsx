import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from './Logo.jsx';
import { NAV_ITEMS, EXTERNAL_URLS, SECURE_LINK_PROPS } from './siteConfig.js';
import { useSectionNav } from './useSectionNav.js';

// `solid` keeps the bar opaque on pages that have no full-bleed hero behind it.
export function SiteNav({ solid = false }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const goToSection = useSectionNav();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const opaque = solid || scrolled;

  const go = (id) => { goToSection(id); setMobileMenuOpen(false); };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${opaque ? 'bg-white/80 backdrop-blur-md border-b border-zinc-200 py-3' : 'bg-transparent py-5'}`} role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" aria-label="Chicago AI Group home" className="block py-1.5 -my-1.5 transition hover:opacity-75">
          <Logo size="default" />
        </Link>
        {/* xl, not lg: with About added, the five links, "Sample sequence" and the call
            button no longer fit a 1024px bar (the button wrapped and the links ran into
            the logo). Below 1280 the menu button takes over. */}
        <div className="hidden xl:flex items-center gap-8">
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => go(item.id)} className="text-[0.9375rem] font-medium text-zinc-600 hover:text-zinc-900 transition relative group whitespace-nowrap" type="button" aria-label={`Navigate to ${item.label} section`}>
              {item.label}<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-400 transition-all group-hover:w-full" aria-hidden="true" />
            </button>
          ))}
          <Link to="/try-it-free" className="text-emerald-700 px-5 py-2 rounded-full text-sm font-medium transition hover:text-emerald-800 border border-emerald-600/30 hover:border-emerald-600/60 whitespace-nowrap">Sample sequence</Link>
          <button onClick={() => go('cta')} className="bg-zinc-900 text-white px-6 py-2.5 rounded-full text-[0.9375rem] font-medium hover:bg-zinc-700 transition" type="button">Book a strategy call</button>
        </div>
        <button className="xl:hidden p-2.5 rounded-lg border border-zinc-200" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} type="button" aria-expanded={mobileMenuOpen} aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}>{mobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button>
      </div>
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border border-zinc-200 shadow-lg mx-4 mt-2 rounded-2xl p-6 space-y-3" role="menu">
          {NAV_ITEMS.map(item => (<button key={item.id} onClick={() => go(item.id)} className="block w-full text-left text-zinc-700 hover:text-zinc-900 py-2.5" type="button" role="menuitem">{item.label}</button>))}
          <Link to="/try-it-free" className="block w-full text-center text-emerald-700 px-5 py-3 rounded-full text-sm font-medium border border-emerald-600/30" role="menuitem" onClick={() => setMobileMenuOpen(false)}>See a sample sequence</Link>
          {/* Straight to Calendly: on a phone, scrolling to the CTA band and tapping
              again is a step too many for the strongest action in the menu. */}
          <a href={EXTERNAL_URLS.appointments} {...SECURE_LINK_PROPS} className="block w-full text-center bg-zinc-900 text-white px-5 py-3 rounded-full font-medium" role="menuitem" onClick={() => setMobileMenuOpen(false)}>Book a strategy call</a>
        </div>
      )}
    </nav>
  );
}

export function SiteFooter() {
  const goToSection = useSectionNav();

  return (
    <footer className="py-12 border-t border-zinc-200" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <Link to="/" aria-label="Chicago AI Group home" className="block py-1.5 -my-1.5 transition hover:opacity-75">
            <Logo size="small" />
          </Link>
          {/* Each link gets a 44px-tall tap area (py-2.5 on 24px text); the row gap
              shrinks to match, so the footer looks the same. */}
          <nav className="flex flex-wrap justify-center gap-x-8 text-zinc-600 [&>*]:py-2.5 [&>*]:min-h-[44px] [&>*]:min-w-[44px]" aria-label="Footer navigation">
            <button onClick={() => goToSection('services')} className="hover:text-zinc-900 transition" type="button">Pricing</button>
            <button onClick={() => goToSection('how-it-works')} className="hover:text-zinc-900 transition" type="button">How It Works</button>
            <button onClick={() => goToSection('about')} className="hover:text-zinc-900 transition" type="button">About</button>
            <Link to="/try-it-free" className="hover:text-zinc-900 transition">Sample sequence</Link>
            <Link to="/roofing" className="hover:text-zinc-900 transition">Roofing</Link>
            <Link to="/hvac" className="hover:text-zinc-900 transition">HVAC</Link>
            <Link to="/contact" className="hover:text-zinc-900 transition">Contact</Link>
            <Link to="/privacy" className="hover:text-zinc-900 transition">Privacy</Link>
            <Link to="/terms" className="hover:text-zinc-900 transition">Terms</Link>
          </nav>
          <div className="text-zinc-500 text-sm">© {new Date().getFullYear()} The Chicago AI Group. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}
