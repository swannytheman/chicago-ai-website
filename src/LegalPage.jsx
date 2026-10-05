import { useEffect } from 'react';
import { SiteNav, SiteFooter } from './SiteChrome.jsx';
import { usePageMeta } from './usePageMeta.js';

// Both legal pages share this date so they cannot drift apart.
export const LAST_UPDATED = '5 October 2026';

// Long-form reading layout: one narrow column, generous leading, the site's chrome.
export function LegalPage({ title, intro, meta, children }) {
  usePageMeta(meta);
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-white text-zinc-900 overflow-x-hidden">
      <SiteNav solid />
      <main className="pt-36 pb-24">
        <div className="max-w-[720px] mx-auto px-6">
          <span className="t-eyebrow mb-4">Legal</span>
          <h1 className="t-h1 mb-6">{title}</h1>
          <p className="t-lede mb-5">{intro}</p>
          <p className="text-sm text-zinc-500 pb-12 mb-12 border-b border-zinc-200">Last updated {LAST_UPDATED}</p>
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
      <h2 className="text-2xl font-semibold tracking-[-0.025em] mb-4 flex gap-3">
        <span className="text-emerald-600/60 font-mono text-lg pt-1" aria-hidden="true">{String(n).padStart(2, '0')}</span>
        <span>{title}</span>
      </h2>
      <div className="space-y-4 text-zinc-700 leading-relaxed">{children}</div>
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
