import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from './Logo.jsx';
import { NAV_ITEMS } from './siteConfig.js';
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${opaque ? 'bg-zinc-950/80 backdrop-blur-md border-b border-white/5 py-3' : 'bg-transparent py-5'}`} role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" aria-label="Chicago AI Group home" className="transition hover:opacity-75">
          <Logo size="default" />
        </Link>
        {/* lg, not md: "Sample sequence" plus the call button no longer fit a 768px bar. */}
        <div className="hidden lg:flex items-center gap-8">
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => go(item.id)} className="text-zinc-400 hover:text-white transition relative group whitespace-nowrap" type="button" aria-label={`Navigate to ${item.label} section`}>
              {item.label}<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-400 transition-all group-hover:w-full" aria-hidden="true" />
            </button>
          ))}
          <Link to="/try-it-free" className="text-emerald-300 px-5 py-2 rounded-full text-sm font-medium transition hover:text-emerald-200 border border-emerald-500/30 hover:border-emerald-400/50 whitespace-nowrap">Sample sequence</Link>
          <button onClick={() => go('cta')} className="bg-white text-black px-6 py-2.5 rounded-full font-medium hover:bg-zinc-100 transition" type="button">Book a strategy call</button>
        </div>
        <button className="lg:hidden p-2 rounded-lg border border-white/10" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} type="button" aria-expanded={mobileMenuOpen} aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}>{mobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button>
      </div>
      {mobileMenuOpen && (
        <div className="lg:hidden bg-zinc-900 border border-white/10 mx-4 mt-2 rounded-2xl p-6 space-y-4" role="menu">
          {NAV_ITEMS.map(item => (<button key={item.id} onClick={() => go(item.id)} className="block w-full text-left text-zinc-300 hover:text-white py-2" type="button" role="menuitem">{item.label}</button>))}
          <Link to="/try-it-free" className="block w-full text-center text-emerald-300 px-5 py-3 rounded-full text-sm font-medium border border-emerald-500/30" role="menuitem" onClick={() => setMobileMenuOpen(false)}>See a sample sequence</Link>
          <button onClick={() => go('cta')} className="w-full bg-white text-black px-5 py-3 rounded-full font-medium" type="button" role="menuitem">Book a strategy call</button>
        </div>
      )}
    </nav>
  );
}

export function SiteFooter() {
  const goToSection = useSectionNav();

  return (
    <footer className="py-12 border-t border-white/5" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <Link to="/" aria-label="Chicago AI Group home" className="transition hover:opacity-75">
            <Logo size="small" />
          </Link>
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-zinc-400" aria-label="Footer navigation">
            <button onClick={() => goToSection('services')} className="hover:text-white transition" type="button">Pricing</button>
            <button onClick={() => goToSection('how-it-works')} className="hover:text-white transition" type="button">How It Works</button>
            <Link to="/try-it-free" className="hover:text-white transition">Sample sequence</Link>
            <Link to="/contact" className="hover:text-white transition">Contact</Link>
            <Link to="/privacy" className="hover:text-white transition">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition">Terms</Link>
          </nav>
          <div className="text-zinc-500 text-sm">© {new Date().getFullYear()} The Chicago AI Group. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}
