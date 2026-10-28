import { ArrowRight, Shield, Tag } from 'lucide-react';
import { FOUNDING_ACTIVE, SETUP_ONLY, EXTERNAL_URLS, SECURE_LINK_PROPS } from './siteConfig.js';

// Pricing pieces shared by the homepage and the industry landing pages, so the founding
// offer, the setup prices and Setup Only read the same everywhere. Everything founding
// related keys off FOUNDING_ACTIVE in siteConfig.js: switch it off and the banner, the
// struck-through prices and the "founding price" labels all disappear together.

// Shown above the managed plans while the founding offer runs. No counter and no end
// date, on purpose: it ends when 3 founding clients have signed, and then the flag goes.
export function FoundingBanner({ className = '' }) {
  if (!FOUNDING_ACTIVE) return null;
  return (
    <div className={`flex gap-4 rounded-2xl border border-emerald-600/20 bg-emerald-50 px-5 py-4 sm:px-6 sm:py-5 ${className}`}>
      <div className="w-9 h-9 rounded-xl bg-white border border-emerald-600/20 flex items-center justify-center flex-shrink-0">
        <Tag className="w-4 h-4 text-emerald-700" aria-hidden="true" />
      </div>
      <div>
        <p className="font-semibold text-emerald-950 leading-snug">Founding client pricing: 25% off setup for our first 3 clients.</p>
        <p className="mt-1 text-sm text-emerald-900/80 leading-relaxed">Applies to the one-time setup fee on Starter, Pro, and Enterprise. Monthly pricing stays the same. The offer ends once 3 founding clients have signed on. Not available on Setup Only.</p>
      </div>
    </div>
  );
}

// A managed plan's setup fee: the regular price, or the regular price struck through
// next to the founding price. Screen readers do not announce strikethrough, so the
// two prices are labelled in words. `founding` adds the visible "(founding price)".
export function SetupPrice({ plan, suffix = 'one-time setup', founding = true, strikeClass = '' }) {
  if (!FOUNDING_ACTIVE) return <>{plan.setup} {suffix}</>;
  return (
    <>
      <s className={`font-normal ${strikeClass}`}><span className="sr-only">Regular setup price </span>{plan.setup}</s>{' '}
      <span className="sr-only">founding price </span>{plan.foundingSetup} {suffix}
      {founding && <> (founding price)</>}
    </>
  );
}

// The visible "Founding price" label for a plan card where the inline "(founding price)"
// would wrap. Nothing when the offer is off.
export function FoundingTag({ className = '' }) {
  if (!FOUNDING_ACTIVE) return null;
  return <div className={`text-xs font-semibold uppercase tracking-[0.08em] ${className}`}>Founding price</div>;
}

// The do-it-yourself option, below the managed plans and deliberately lighter than them.
// `onBook` is how the page books a call: the homepage scrolls to its booking section,
// like its managed plans do; the industry pages link straight to the calendar.
export function SetupOnlyCard({ onBook, className = '' }) {
  const label = <>Book a call about Setup Only <ArrowRight className="w-4 h-4" aria-hidden="true" /></>;
  const btn = 'w-full md:w-auto px-7 py-3.5 rounded-full font-medium border border-zinc-300 text-zinc-900 hover:border-zinc-400 hover:bg-white transition inline-flex items-center justify-center gap-2 whitespace-nowrap';
  return (
    <div className={`rounded-3xl border border-zinc-200 bg-zinc-50/70 p-7 md:p-10 ${className}`} aria-labelledby="setup-only-heading" role="region">
      <div className="grid md:grid-cols-12 gap-6 md:gap-10 md:items-center">
        <div className="md:col-span-8">
          <p className="text-sm text-zinc-500 mb-1">Prefer to run it yourself?</p>
          <h3 id="setup-only-heading" className="text-2xl font-semibold tracking-[-0.025em] mb-2">Setup Only</h3>
          <p className="text-lg font-medium text-zinc-900 mb-4">{SETUP_ONLY.setup} one-time. No monthly fee.</p>
          <p className="text-zinc-600 leading-relaxed">We build it, connect one inbound source, train it on your voice, and hand it over. After handoff, you run it. No ongoing monitoring or management from us.</p>
          <p className="mt-4 flex gap-2 text-sm text-zinc-500 leading-relaxed">
            <Shield className="w-4 h-4 flex-shrink-0 mt-0.5 text-zinc-400" aria-hidden="true" />
            <span>Covered by our 14-day workmanship guarantee.{FOUNDING_ACTIVE && ' Founding pricing does not apply.'}</span>
          </p>
        </div>
        <div className="md:col-span-4 md:flex md:justify-end">
          {onBook
            ? <button type="button" onClick={onBook} className={btn}>{label}</button>
            : <a href={EXTERNAL_URLS.appointments} {...SECURE_LINK_PROPS} className={btn}>{label}</a>}
        </div>
      </div>
    </div>
  );
}

// The Setup Only line in each guarantee section, so nobody reads the 60-day Results
// Guarantee as covering it.
export function SetupOnlyGuaranteeNote({ className = '' }) {
  return (
    <div className={`rounded-2xl border border-emerald-600/15 bg-white/70 px-6 py-5 text-left ${className}`}>
      <h3 className="font-semibold text-zinc-900 mb-1">Setup Only: 14-day workmanship guarantee</h3>
      <p className="text-sm text-zinc-700 leading-relaxed">Setup Only is not covered by the 60-day Results Guarantee. If something we built does not work as scoped within 14 days of handoff, we fix it at no charge.</p>
    </div>
  );
}
