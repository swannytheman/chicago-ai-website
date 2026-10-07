import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Shield, Star, Inbox, ListChecks, CalendarCheck } from 'lucide-react';
import { SiteNav, SiteFooter } from './SiteChrome.jsx';
import { EXTERNAL_URLS, SECURE_LINK_PROPS, PLAN_PRICES } from './siteConfig.js';
import { usePageMeta } from './usePageMeta.js';
import HeroDemo from './HeroDemo.jsx';
import { HeadshotAvatar } from './Headshot.jsx';
import { FadeInSection, Section, SectionHeader, AccentRule } from './PageLayout.jsx';

// One template for the trade landing pages (/roofing, /hvac). Each is the one URL
// sales and ads use for that trade, and has to be the whole pitch for someone who
// never sees the homepage, so it carries its own example, pricing, guarantee and close.
// Structure, prices and the guarantee are shared; every trade-specific line comes from
// the `content` object the page passes in (see Roofing.jsx and Hvac.jsx). It reuses the
// homepage's layout primitives and type scale rather than introducing anything new.
//
// Section ids that match the global nav (how-it-works, testimonials, services, cta)
// are deliberate: useSectionNav scrolls to a matching section on the current page,
// so "Book a strategy call" and "Pricing" in the top bar stay on the landing page
// instead of sending a visitor to the homepage.

// Prices come from PLAN_PRICES in siteConfig.js, shared with the homepage plan picker.
// The only per-trade line is what Starter books (an inspection, a visit).
const plansFor = (bookItem) => [
  {
    tier: 'Starter',
    ...PLAN_PRICES.Starter,
    includes: [
      'One inbound source',
      'First response in about five minutes',
      'Qualify',
      bookItem,
      'Email follow-up',
      'We monitor it',
    ],
  },
  {
    tier: 'Pro',
    ...PLAN_PRICES.Pro,
    featured: true,
    includes: [
      'Everything in Starter',
      'Longer follow-up sequences',
      'SMS, if you want it and have permission',
      'Lead scoring',
      'Sync to the CRM you already use',
    ],
  },
  {
    tier: 'Enterprise',
    ...PLAN_PRICES.Enterprise,
    includes: [
      'Everything in Pro',
      'Additional sources or locations',
      'Copy tests',
      'Priority check-ins',
    ],
  },
];

// Catch, qualify, book: the icons are fixed, the words come from each trade.
const STEP_ICONS = [Inbox, ListChecks, CalendarCheck];

const LUIGI = {
  quote: "We were drowning in lead follow-ups—losing deals just because we couldn't respond fast enough. Now our AI handles first contact with the customer within just a few minutes, and our sales team closes 35% more deals. They paid for themselves in the first month.",
  author: 'Erik Sandoval',
  title: 'VP of Operations, Luigi Trucking Insurance',
};

function BookButton({ size = 'lg', children = 'Book a strategy call' }) {
  const pad = size === 'xl' ? 'px-10 py-5' : 'px-7 py-4';
  return (
    <a href={EXTERNAL_URLS.appointments} {...SECURE_LINK_PROPS} className={`group bg-zinc-900 text-white ${pad} rounded-full font-medium text-lg hover:bg-zinc-700 transition inline-flex items-center justify-center gap-2`}>
      {children} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
    </a>
  );
}

function SampleButton() {
  return (
    <Link to="/try-it-free" className="group text-emerald-700 border border-emerald-600/30 bg-white/70 px-7 py-4 rounded-full font-medium text-lg transition hover:border-emerald-600/60 hover:bg-white inline-flex items-center justify-center gap-2">
      See a sample sequence <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
    </Link>
  );
}

export default function VerticalLanding({ content: c }) {
  usePageMeta(c.meta);
  const plans = plansFor(c.pricing.bookItem);
  // The dark card follows the plan the visitor picks, as on the homepage plan picker.
  // Pro (the featured plan) starts selected. Selection is visual emphasis only: each
  // card's button books the same call, so there is no form value behind it.
  const [selectedTier, setSelectedTier] = useState(() => plans.find(p => p.featured)?.tier ?? plans[0].tier);

  return (
    <div className="min-h-screen bg-white text-zinc-900 overflow-x-hidden">
      <style>{`
        .text-gradient { background: linear-gradient(135deg, #18181b 0%, #059669 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        html { scroll-behavior: smooth; }
      `}</style>

      <SiteNav />

      {/* 1. Hero: the request that dies overnight. */}
      <section className="relative overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-20 md:pt-44 md:pb-28" aria-labelledby={`${c.slug}-hero-heading`}>
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50 via-white to-white" aria-hidden="true" />
        {/* Centered: the brief keeps the hero to words and two buttons, and left-aligned
            text alone leaves the right half of a wide screen empty. */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="max-w-5xl mx-auto">
            <FadeInSection>
              <div className="inline-flex items-center gap-3 text-sm mb-6 sm:mb-8">
                <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
                <span className="font-medium text-zinc-900">{c.audience}</span>
              </div>
            </FadeInSection>
            <FadeInSection delay={100}>
              <h1 id={`${c.slug}-hero-heading`} className="t-display text-[clamp(2.25rem,1.2rem+4.2vw,4.75rem)] mb-6 sm:mb-7">
                {c.headline.lead} <span className="text-gradient block">{c.headline.punch}</span>
              </h1>
            </FadeInSection>
            <FadeInSection delay={200}>
              <p className="t-lede md:text-xl text-zinc-700 max-w-2xl mx-auto mb-8 sm:mb-9">{c.subhead}</p>
            </FadeInSection>
            <FadeInSection delay={300}>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <BookButton />
                <SampleButton />
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* 2. The worked example, labelled as written after kickoff. */}
      <Section id="example" labelledBy={`${c.slug}-example-heading`}>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 xl:gap-16 items-center">
          <FadeInSection className="xl:col-span-5">
            <div>
              <span className="t-eyebrow mb-4">What it looks like</span>
              <h2 id={`${c.slug}-example-heading`} className="t-h2 mb-6">{c.example.title}</h2>
              <p className="t-lede mb-6">{c.example.body}</p>
              <p className="text-sm text-zinc-500 leading-relaxed">Example only, for an illustrative company. We write these in the client&apos;s voice after kickoff. It is not a transcript from a live account.</p>
            </div>
          </FadeInSection>
          <FadeInSection delay={100} className="xl:col-span-7 w-full max-w-xl mx-auto xl:max-w-none min-w-0">
            <HeroDemo caption="Example written in the client's voice after kickoff · not a live transcript" scenario={c.example.scenario} />
          </FadeInSection>
        </div>
      </Section>

      {/* 3. Three steps. The one mention of the agent, as the mechanism. */}
      <Section id="how-it-works" labelledBy={`${c.slug}-steps-heading`}>
        <SectionHeader
          eyebrow="How it works"
          headingId={`${c.slug}-steps-heading`}
          title={c.steps.title}
          lede={c.steps.lede}
        />
        <ol className="grid md:grid-cols-3 gap-x-12 gap-y-14">
          {c.steps.items.map((step, idx) => {
            const Icon = STEP_ICONS[idx];
            return (
            <li key={step.title}>
              <FadeInSection delay={idx * 120} className="h-full">
                <AccentRule>
                  <div className="flex items-center justify-between mb-10">
                    <span className="t-eyebrow">Step {idx + 1}</span>
                    <span className="text-sm font-medium text-zinc-400 tabular-nums" aria-hidden="true">{String(idx + 1).padStart(2, '0')}</span>
                  </div>
                  <Icon className="w-6 h-6 text-emerald-600 mb-5" strokeWidth={1.75} aria-hidden="true" />
                  <h3 className="t-h3 mb-3">{step.title}</h3>
                  <p className="text-zinc-600 leading-relaxed">{step.desc}</p>
                </AccentRule>
              </FadeInSection>
            </li>
            );
          })}
        </ol>
        <FadeInSection delay={200}>
          <p className="mt-14 text-zinc-600 flex items-start gap-3">
            <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <span>Only people who already contacted your company get a message.</span>
          </p>
        </FadeInSection>
      </Section>

      {/* 4. Who it is for, and who it is not. */}
      <Section id="fit" labelledBy={`${c.slug}-fit-heading`}>
        <SectionHeader
          eyebrow="Who it's for"
          headingId={`${c.slug}-fit-heading`}
          title={c.fit.title}
          lede="We work the leads you are already paying for. We do not create them."
        />
        <div className="grid md:grid-cols-2 gap-x-16 gap-y-16">
          <FadeInSection>
            <AccentRule>
              <h3 className="t-h3 mb-6">A good fit</h3>
              <ul className="space-y-5">
                {c.fit.good.map(item => (
                  <li key={item} className="flex gap-4">
                    <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-zinc-700 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </AccentRule>
          </FadeInSection>
          <FadeInSection delay={100}>
            <div className="relative border-t border-zinc-200 pt-8 h-full">
              <h3 className="t-h3 mb-6">Not a fit</h3>
              <ul className="space-y-5">
                {c.fit.notFit.map(item => (
                  <li key={item} className="flex gap-4">
                    <span className="w-5 text-center text-zinc-400 flex-shrink-0" aria-hidden="true">&minus;</span>
                    <span className="text-zinc-600 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeInSection>
        </div>
      </Section>

      {/* One client's result, clearly labelled as such. */}
      <Section id="testimonials" labelledBy={`${c.slug}-proof-heading`}>
        <FadeInSection>
          <figure className="max-w-4xl mx-auto">
            <span id={`${c.slug}-proof-heading`} className="t-eyebrow mb-6">One client&apos;s result</span>
            <div className="flex gap-1 mb-6" role="img" aria-label="5 star rating">{[...Array(5)].map((_, i) => (<Star key={i} className="w-4 h-4 fill-emerald-500 text-emerald-500" aria-hidden="true" />))}</div>
            <blockquote className="text-xl md:text-2xl font-medium tracking-[-0.02em] leading-[1.4] text-zinc-900">&ldquo;{LUIGI.quote}&rdquo;</blockquote>
            <figcaption className="mt-8">
              <div className="font-semibold">{LUIGI.author}</div>
              <div className="text-zinc-500 text-sm">{LUIGI.title}</div>
              <p className="text-sm text-zinc-500 mt-4">One client&apos;s result, in insurance rather than {c.trade}. It is not a promise of what you will see.</p>
            </figcaption>
          </figure>
        </FadeInSection>
      </Section>

      {/* 5. Pricing. Pro is the visual default. */}
      <Section id="services" labelledBy={`${c.slug}-pricing-heading`} bottom="pb-10 md:pb-14">
        <SectionHeader
          eyebrow="Pricing"
          headingId={`${c.slug}-pricing-heading`}
          title="Three plans. Same build, more surface area."
          lede="Setup is one-time and covers the build, the integration, and training it on your voice. Monthly billing starts at go-live. Cancel anytime."
        />
        <FadeInSection delay={100}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:items-stretch">
            {plans.map(plan => {
              const selected = plan.tier === selectedTier;
              return (
              <div
                key={plan.tier}
                // Click anywhere on a card to pick it; tabbing to its button picks it too,
                // so keyboard users see the same emphasis.
                onClick={() => setSelectedTier(plan.tier)}
                onFocusCapture={() => setSelectedTier(plan.tier)}
                data-selected={selected || undefined}
                className={`rounded-3xl p-7 md:p-8 flex flex-col border transition-all duration-300 ${selected
                  ? 'bg-zinc-900 border-zinc-900 text-white shadow-[0_32px_64px_-32px_rgba(24,24,27,0.45)] lg:-my-3 lg:py-11'
                  : 'bg-white border-zinc-200 cursor-pointer hover:border-zinc-300 hover:bg-zinc-50'}`}
              >
                <div className="flex items-center gap-2 mb-6">
                  <h3 className="text-lg font-semibold tracking-[-0.01em]">{plan.tier}</h3>
                  {plan.featured && <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${selected ? 'bg-white text-zinc-900' : 'bg-emerald-50 text-emerald-700 border border-emerald-600/20'}`}>Recommended</span>}
                </div>
                <div className="mb-1">
                  <span className="text-5xl font-semibold tracking-[-0.04em] tabular-nums">{plan.monthly}</span>
                  <span className={`text-base ${selected ? 'text-zinc-400' : 'text-zinc-500'}`}>/mo</span>
                </div>
                <div className={`text-sm font-medium tabular-nums mb-8 ${selected ? 'text-zinc-300' : 'text-zinc-700'}`}>+ {plan.setup} one-time setup</div>
                <ul className={`space-y-3 mb-10 pt-6 border-t ${selected ? 'border-white/15' : 'border-zinc-200'}`}>
                  {plan.includes.map(item => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed">
                      <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${selected ? 'text-emerald-400' : 'text-emerald-600'}`} strokeWidth={2.5} aria-hidden="true" />
                      <span className={selected ? 'text-zinc-200' : 'text-zinc-700'}>{item}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={EXTERNAL_URLS.appointments}
                  {...SECURE_LINK_PROPS}
                  aria-label={`Book a call about ${plan.tier}`}
                  className={`mt-auto w-full px-4 sm:px-6 py-3.5 rounded-full font-medium text-[0.9375rem] sm:text-base whitespace-nowrap transition inline-flex items-center justify-center gap-2 ${selected
                    ? 'bg-white text-zinc-900 hover:bg-zinc-200'
                    : 'border border-zinc-300 text-zinc-900 hover:border-zinc-400 hover:bg-zinc-50'}`}
                >
                  {/* The card already names the plan; narrow phones drop it from the label
                      so the button stays one line. */}
                  <span className="min-[360px]:hidden">Book a call</span>
                  <span className="hidden min-[360px]:inline">Book a call about {plan.tier}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
              );
            })}
          </div>
          <p className="mt-12 text-center text-2xl md:text-[1.75rem] font-medium tracking-[-0.02em] text-zinc-900 text-balance">{c.pricing.payback}</p>
          {c.pricing.paybackNote && <p className="mt-3 text-center text-sm text-zinc-500">{c.pricing.paybackNote}</p>}
        </FadeInSection>
      </Section>

      {/* 6. Guarantee, scoped exactly. */}
      <Section id="guarantee" labelledBy={`${c.slug}-guarantee-heading`} rule={false}>
        <FadeInSection>
          <div className="rounded-3xl border border-emerald-600/15 bg-gradient-to-b from-emerald-50 to-emerald-50/30 px-6 py-12 sm:p-10 md:p-16">
            <div className="text-center max-w-3xl mx-auto">
              <div className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-6 bg-white border border-emerald-600/20 shadow-sm">
                <Shield className="w-6 h-6 text-emerald-600" aria-hidden="true" />
              </div>
              <h2 id={`${c.slug}-guarantee-heading`} className="t-h2 mb-6">60-day results guarantee</h2>
              <p className="text-xl md:text-2xl text-zinc-900 font-medium tracking-[-0.015em] leading-[1.45]">For 60 days from go-live on your real lead flow, inbound leads wired into the agent get a first response typically within 5 minutes, and leads that meet the qualify rules get followed up and offered a time.</p>
              <p className="text-lg text-emerald-800 font-medium leading-relaxed mt-6">Miss either and you get the setup fee and every monthly fee back.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 md:gap-0 md:divide-x divide-emerald-600/15 mt-12 pt-10 border-t border-emerald-600/15 max-w-3xl mx-auto text-left">
              <div className="md:pr-8">
                <h3 className="t-eyebrow mb-3">What it does not cover</h3>
                <p className="text-sm text-zinc-700 leading-relaxed">It does not guarantee closed jobs or a volume of new leads.</p>
              </div>
              <div className="md:pl-8">
                <h3 className="t-eyebrow mb-3">What we do not do</h3>
                <p className="text-sm text-zinc-700 leading-relaxed">We do not run ads, rebuild your website, or close the job.</p>
              </div>
            </div>
          </div>
        </FadeInSection>
      </Section>

      {/* 7. Close. */}
      <section id="cta" className="relative overflow-hidden border-t border-zinc-200 scroll-mt-16" aria-labelledby={`${c.slug}-cta-heading`}>
        <div className="absolute inset-0 bg-gradient-to-b from-white via-emerald-50/50 to-emerald-50" aria-hidden="true" />
        <div className="relative max-w-4xl mx-auto px-6 py-24 md:py-36 text-center">
          <FadeInSection>
            <h2 id={`${c.slug}-cta-heading`} className="t-h1 mb-6">Is this worth building for your company?</h2>
            <p className="t-lede md:text-xl max-w-2xl mx-auto mb-10">One 30-minute call on how {c.close.requests} reach you now, where they go cold, and whether this is worth building. If it is, you&apos;re live in about <span className="whitespace-nowrap">2–4 weeks</span>.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <BookButton />
              <SampleButton />
            </div>
            <p className="text-zinc-500 text-sm mt-6 flex items-center justify-center gap-2.5">
              <HeadshotAvatar size={28} className="border border-white shadow-sm" />
              <span>Free • 30 minutes with Matt • Zero obligation</span>
            </p>
            <p className="text-zinc-600 leading-relaxed mt-14 pt-10 border-t border-emerald-600/15 max-w-xl mx-auto">
              The sample sequence is three follow-up emails written for your {c.close.company}. No credit card. It&apos;s a preview of the writing, not the live system; setup still starts with a call.
            </p>
          </FadeInSection>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
