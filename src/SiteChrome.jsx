import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import Logo from './Logo.jsx';
import { NAV_ITEMS, USE_CASES, EXTERNAL_URLS, SECURE_LINK_PROPS } from './siteConfig.js';
import { useSectionNav } from './useSectionNav.js';

// The "Industries" dropdown in the desktop bar: one link per trade landing page, from
// USE_CASES. It is a disclosure (a button that shows a list of links), not an ARIA
// menu, so it works with Tab like the rest of the bar. Opens on click, or on hover
// with a mouse; closes on Escape, a click outside, or focus leaving it.
function IndustriesMenu({ onMore }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const wrap = useRef(null);
  const button = useRef(null);
  const closeTimer = useRef(null);
  // How it was opened: null (closed), 'hover' or 'click'. A ref, not state, because a
  // mouse click fires right after the hover that opened it, before React re-renders;
  // that click pins the hover-open panel rather than toggling it shut.
  const openedBy = useRef(null);
  const onTradePage = USE_CASES.some(u => u.path === pathname);

  const close = () => { openedBy.current = null; setOpen(false); };

  useEffect(() => {
    if (!open) return undefined;
    const shut = () => { openedBy.current = null; setOpen(false); };
    const onPointerDown = (e) => { if (!wrap.current?.contains(e.target)) shut(); };
    const onKey = (e) => { if (e.key === 'Escape') { shut(); button.current?.focus(); } };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const hoverOpen = (e) => {
    if (e.pointerType !== 'mouse') return;
    clearTimeout(closeTimer.current);
    if (!openedBy.current) { openedBy.current = 'hover'; setOpen(true); }
  };
  const hoverClose = (e) => {
    if (e.pointerType !== 'mouse' || openedBy.current !== 'hover') return;
    closeTimer.current = setTimeout(close, 150);
  };
  const toggle = () => {
    clearTimeout(closeTimer.current);
    if (openedBy.current === 'click') { close(); return; }
    openedBy.current = 'click';
    setOpen(true);
  };

  return (
    <div
      ref={wrap}
      className="relative"
      onPointerEnter={hoverOpen}
      onPointerLeave={hoverClose}
      onBlur={(e) => { if (!wrap.current?.contains(e.relatedTarget)) close(); }}
    >
      <button
        ref={button}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls="industries-menu"
        className={`text-[0.9375rem] font-medium transition inline-flex items-center gap-1 whitespace-nowrap ${open || onTradePage ? 'text-zinc-900' : 'text-zinc-600 hover:text-zinc-900'}`}
      >
        Industries
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {/* pt-3, not mt-3: the gap stays inside the hover area, so moving the mouse from
          the button down to the panel does not close it. */}
      <div
        id="industries-menu"
        className={`absolute left-1/2 top-full -translate-x-1/2 pt-3 transition duration-150 ${open ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-1 pointer-events-none'}`}
      >
        <div className="w-[22rem] rounded-2xl border border-zinc-200 bg-white p-2 shadow-[0_1px_2px_rgba(24,24,27,0.04),0_24px_48px_-24px_rgba(24,24,27,0.25)]">
          <ul>
            {USE_CASES.map(u => {
              const current = u.path === pathname;
              return (
                <li key={u.path}>
                  <Link
                    to={u.path}
                    onClick={close}
                    aria-current={current ? 'page' : undefined}
                    className={`block rounded-xl px-4 py-3 transition ${current ? 'bg-emerald-50' : 'hover:bg-zinc-50'}`}
                  >
                    <span className="flex items-center gap-2 font-medium text-zinc-900">
                      {u.label}
                      {current && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />}
                    </span>
                    <span className="block text-sm text-zinc-500">{u.blurb}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-1 border-t border-zinc-200 px-4 pt-3 pb-2 text-sm text-zinc-500">
            Don&apos;t see your industry?{' '}
            <button type="button" onClick={() => { close(); onMore(); }} className="group inline-flex items-center gap-1 font-medium text-emerald-700 hover:text-emerald-800 transition">
              Let&apos;s talk <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// `solid` keeps the bar opaque on pages that have no full-bleed hero behind it.
export function SiteNav({ solid = false }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const goToSection = useSectionNav();
  const { pathname } = useLocation();

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
          <IndustriesMenu onMore={() => go('cta')} />
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => go(item.id)} className="text-[0.9375rem] font-medium text-zinc-600 hover:text-zinc-900 transition relative group whitespace-nowrap" type="button" aria-label={`Navigate to ${item.label} section`}>
              {item.label}<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-400 transition-all group-hover:w-full" aria-hidden="true" />
            </button>
          ))}
          <Link to="/try-it-free" className="text-emerald-700 px-5 py-2 rounded-full text-sm font-medium transition hover:text-emerald-800 border border-emerald-600/30 hover:border-emerald-600/60 whitespace-nowrap">Sample sequence</Link>
          <button onClick={() => go('cta')} className="bg-zinc-900 text-white px-6 py-2.5 rounded-full text-[0.9375rem] font-medium hover:bg-zinc-700 transition" type="button">Book a 15-minute call</button>
        </div>
        <button className="xl:hidden p-2.5 rounded-lg border border-zinc-200" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} type="button" aria-expanded={mobileMenuOpen} aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}>{mobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button>
      </div>
      {mobileMenuOpen && (
        // Scrolls inside itself if it is ever taller than the screen: the bar is fixed, so
        // anything below the fold would otherwise be out of reach.
        <div className="xl:hidden bg-white border border-zinc-200 shadow-lg mx-4 mt-2 rounded-2xl p-6 space-y-3 max-h-[calc(100dvh-6rem)] overflow-y-auto overscroll-contain" role="menu">
          {/* Industries first, as a wrapping row of pills, so the list can grow without
              pushing the call button off a small phone. */}
          <div className="pb-4 border-b border-zinc-200">
            <div className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500 mb-3">Industries</div>
            <div className="flex flex-wrap gap-2">
              {USE_CASES.map(u => (
                <Link key={u.path} to={u.path} className={`inline-flex items-center min-h-[44px] px-4 rounded-full border text-[0.9375rem] font-medium transition ${u.path === pathname ? 'border-emerald-600/30 bg-emerald-50 text-emerald-800' : 'border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:text-zinc-900'}`} aria-current={u.path === pathname ? 'page' : undefined} role="menuitem" onClick={() => setMobileMenuOpen(false)}>
                  {u.label}
                </Link>
              ))}
            </div>
          </div>
          {NAV_ITEMS.map(item => (<button key={item.id} onClick={() => go(item.id)} className="block w-full text-left text-zinc-700 hover:text-zinc-900 py-2.5" type="button" role="menuitem">{item.label}</button>))}
          <Link to="/try-it-free" className="block w-full text-center text-emerald-700 px-5 py-3 rounded-full text-sm font-medium border border-emerald-600/30" role="menuitem" onClick={() => setMobileMenuOpen(false)}>See a sample sequence</Link>
          {/* Straight to Calendly: on a phone, scrolling to the CTA band and tapping
              again is a step too many for the strongest action in the menu. */}
          <a href={EXTERNAL_URLS.appointments} {...SECURE_LINK_PROPS} className="block w-full text-center bg-zinc-900 text-white px-5 py-3 rounded-full font-medium" role="menuitem" onClick={() => setMobileMenuOpen(false)}>Book a 15-minute call</a>
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
            {USE_CASES.map(u => <Link key={u.path} to={u.path} className="hover:text-zinc-900 transition">{u.label}</Link>)}
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
