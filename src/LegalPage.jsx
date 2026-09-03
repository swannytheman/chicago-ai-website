import { useEffect } from 'react';
import { SiteNav, SiteFooter } from './SiteChrome.jsx';

// Both legal pages share this date so they cannot drift apart.
export const LAST_UPDATED = '2 September 2026';

// Long-form reading layout: one narrow column, generous leading, the site's chrome.
export function LegalPage({ title, intro, docTitle, children }) {
  useEffect(() => {
    const prev = document.title;
    document.title = docTitle;
    window.scrollTo(0, 0);
    return () => { document.title = prev; };
  }, [docTitle]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-x-hidden">
      <SiteNav solid />
      <main className="pt-36 pb-24">
        <div className="max-w-[720px] mx-auto px-6">
          <span className="text-sm uppercase tracking-widest text-emerald-400 mb-4 block">Legal</span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">{title}</h1>
          <p className="text-lg text-zinc-300 leading-relaxed mb-5">{intro}</p>
          <p className="text-sm text-zinc-500 pb-12 mb-12 border-b border-white/10">Last updated {LAST_UPDATED}</p>
          <div className="space-y-12">{children}</div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

export function Section({ n, title, children }) {
  return (
    <section>
      <h2 className="text-2xl font-bold tracking-tight mb-4 flex gap-3">
        <span className="text-emerald-400/60 font-mono text-lg pt-1" aria-hidden="true">{String(n).padStart(2, '0')}</span>
        <span>{title}</span>
      </h2>
      <div className="space-y-4 text-zinc-300 leading-relaxed">{children}</div>
    </section>
  );
}

export function Bullets({ items }) {
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-emerald-400/70 flex-shrink-0" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
