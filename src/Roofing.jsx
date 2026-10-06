import { Link } from 'react-router-dom';
import { ArrowRight, Check, Shield, Star, Inbox, ListChecks, CalendarCheck } from 'lucide-react';
import { SiteNav, SiteFooter } from './SiteChrome.jsx';
import { EXTERNAL_URLS, SECURE_LINK_PROPS } from './siteConfig.js';
import { usePageMeta } from './usePageMeta.js';
import { PAGE_META } from './seo.js';
import HeroDemo from './HeroDemo.jsx';
import { HeadshotAvatar } from './Headshot.jsx';
import { FadeInSection, Section, SectionHeader, AccentRule } from './PageLayout.jsx';

// /roofing: the one URL sales and ads use for residential roofers. It has to be the
// whole pitch for someone who never sees the homepage, so it carries its own example,
// pricing, guarantee and close. It reuses the homepage's layout primitives and type
// scale rather than introducing anything new.
//
// Section ids that match the global nav (how-it-works, testimonials, services, cta)
// are deliberate: useSectionNav scrolls to a matching section on the current page,
// so "Book a strategy call" and "Pricing" in the top bar stay on this page instead of
// sending a roofer to the homepage's general pricing.
//
// Prices here are the roofing prices and are independent of the homepage plans.

const PLANS = [
  {
    tier: 'Starter',
    monthly: '$499',
    setup: '$2,500',
    includes: [
      'One inbound source',
      'First response in about five minutes',
      'Qualify',
      'Book the inspection',
      'Email follow-up',
      'We monitor it',
    ],
  },
  {
    tier: 'Pro',
    monthly: '$999',
    setup: '$3,500',
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
    monthly: '$1,800',
    setup: '$5,900',
    includes: [
      'Everything in Pro',
      'Additional sources or locations',
      'Copy tests',
      'Priority check-ins',
    ],
  },
];

const STEPS = [
  {
    icon: Inbox,
    title: 'Catch the lead',
    desc: 'We wire the one inbound source you already have — your website form, Google, Local Services Ads, Angi, or a storm campaign. A new quote request gets a reply in about five minutes, day or night, even while your crew is on a roof.',
  },
  {
    icon: ListChecks,
    title: 'Qualify it',
    desc: 'A short set of rules we write with you: type of job, address, timing, and fit. Homeowners who go quiet get followed up until they reply or opt out. The ones that are not a fit get a polite close, not a slot on your calendar.',
  },
  {
    icon: CalendarCheck,
    title: 'Book the inspection',
    desc: 'Qualified homeowners are offered a time on the calendar you already use. The inspection lands there with the whole conversation attached, so whoever shows up knows the job.',
  },
];

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

export default function Roofing() {
  usePageMeta(PAGE_META.roofing);

  return (
    <div className="min-h-screen bg-white text-zinc-900 overflow-x-hidden">
      <style>{`
        .text-gradient { background: linear-gradient(135deg, #18181b 0%, #059669 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        html { scroll-behavior: smooth; }
      `}</style>

      <SiteNav />

      {/* 1. Hero: the quote request that dies overnight. */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-44 md:pb-28" aria-labelledby="roofing-hero-heading">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50 via-white to-white" aria-hidden="true" />
        {/* Centered: the brief keeps the hero to words and two buttons, and left-aligned
            text alone leaves the right half of a wide screen empty. */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="max-w-5xl mx-auto">
            <FadeInSection>
              <div className="inline-flex items-center gap-3 text-sm mb-8">
                <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
                <span className="font-medium text-zinc-900">For residential roofing companies</span>
              </div>
            </FadeInSection>
            <FadeInSection delay={100}>
              <h1 id="roofing-hero-heading" className="t-display text-[clamp(2.5rem,1.2rem+4.2vw,4.75rem)] mb-7">
                The quote request came in at 8:30pm. <span className="text-gradient block">Someone else booked the inspection.</span>
              </h1>
            </FadeInSection>
            <FadeInSection delay={200}>
              <p className="t-lede md:text-xl text-zinc-700 max-w-2xl mx-auto mb-9">We reply to your inbound roofing leads in about five minutes, in your voice, and book the ones worth a visit. You take the meeting. Live in <span className="whitespace-nowrap">2–4 weeks</span>.</p>
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

      {/* 2. The Summit Roofing example, labelled as written after kickoff. */}
      <Section id="example" labelledBy="roofing-example-heading">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 xl:gap-16 items-center">
          <FadeInSection className="xl:col-span-5">
            <div>
              <span className="t-eyebrow mb-4">What it looks like</span>
              <h2 id="roofing-example-heading" className="t-h2 mb-6">Tuesday night form. Reply four minutes later. Inspection on Thursday.</h2>
              <p className="t-lede mb-6">A homeowner fills in your quote form at 8:30 on a Tuesday night, while your crew is packing up. Four minutes later they have a reply that sounds like your office, with two inspection times. They pick Thursday morning, and it is on your calendar before anyone at your company has seen the lead.</p>
              <p className="text-sm text-zinc-500 leading-relaxed">Example only, for an illustrative company. We write these in the client&apos;s voice after kickoff. It is not a transcript from a live account.</p>
            </div>
          </FadeInSection>
          <FadeInSection delay={100} className="xl:col-span-7 w-full max-w-xl mx-auto xl:max-w-none min-w-0">
            <HeroDemo caption="Example written in the client's voice after kickoff · not a live transcript" />
          </FadeInSection>
        </div>
      </Section>

      {/* 3. Three steps. The one mention of the agent, as the mechanism. */}
      <Section id="how-it-works" labelledBy="roofing-steps-heading">
        <SectionHeader
          eyebrow="How it works"
          headingId="roofing-steps-heading"
          title="Catch it. Qualify it. Book the inspection."
          lede="We build it and run it. You take the meeting. The writing is handled by an agent trained on how your office actually emails customers, so it reads like you sent it."
        />
        <ol className="grid md:grid-cols-3 gap-x-12 gap-y-14">
          {STEPS.map((step, idx) => (
            <li key={step.title}>
              <FadeInSection delay={idx * 120} className="h-full">
                <AccentRule>
                  <div className="flex items-center justify-between mb-10">
                    <span className="t-eyebrow">Step {idx + 1}</span>
                    <span className="text-sm font-medium text-zinc-400 tabular-nums" aria-hidden="true">{String(idx + 1).padStart(2, '0')}</span>
                  </div>
                  <step.icon className="w-6 h-6 text-emerald-600 mb-5" strokeWidth={1.75} aria-hidden="true" />
                  <h3 className="t-h3 mb-3">{step.title}</h3>
                  <p className="text-zinc-600 leading-relaxed">{step.desc}</p>
                </AccentRule>
              </FadeInSection>
            </li>
          ))}
        </ol>
        <FadeInSection delay={200}>
          <p className="mt-14 text-zinc-600 flex items-start gap-3">
            <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <span>Only people who already contacted your company get a message.</span>
          </p>
        </FadeInSection>
      </Section>

      {/* 4. Who it is for, and who it is not. */}
      <Section id="fit" labelledBy="roofing-fit-heading">
        <SectionHeader
          eyebrow="Who it's for"
          headingId="roofing-fit-heading"
          title="For roofers who already get the quote requests."
          lede="We work the leads you are already paying for. We do not create them."
        />
        <div className="grid md:grid-cols-2 gap-x-16 gap-y-16">
          <FadeInSection>
            <AccentRule>
              <h3 className="t-h3 mb-6">A good fit</h3>
              <ul className="space-y-5">
                {[
                  'Residential roofing companies already getting inbound quote requests — from a website form, Google, Local Services Ads, Angi, or storm campaigns.',
                  'Owners losing jobs because nobody answers while the crew is on a roof.',
                  'Someone at your company who will show up to the inspections it books.',
                ].map(item => (
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
                {[
                  'Companies that need ads run for them.',
                  'Companies that need a new website.',
                  'Companies that need leads created from scratch. If quote requests are not coming in yet, this has nothing to answer.',
                ].map(item => (
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
      <Section id="testimonials" labelledBy="roofing-proof-heading">
        <FadeInSection>
          <figure className="max-w-4xl mx-auto">
            <span id="roofing-proof-heading" className="t-eyebrow mb-6">One client&apos;s result</span>
            <div className="flex gap-1 mb-6" role="img" aria-label="5 star rating">{[...Array(5)].map((_, i) => (<Star key={i} className="w-4 h-4 fill-emerald-500 text-emerald-500" aria-hidden="true" />))}</div>
            <blockquote className="text-xl md:text-2xl font-medium tracking-[-0.02em] leading-[1.4] text-zinc-900">&ldquo;{LUIGI.quote}&rdquo;</blockquote>
            <figcaption className="mt-8">
              <div className="font-semibold">{LUIGI.author}</div>
              <div className="text-zinc-500 text-sm">{LUIGI.title}</div>
              <p className="text-sm text-zinc-500 mt-4">One client&apos;s result, in insurance rather than roofing. It is not a promise of what you will see.</p>
            </figcaption>
          </figure>
        </FadeInSection>
      </Section>

      {/* 5. Pricing. Pro is the visual default. */}
      <Section id="services" labelledBy="roofing-pricing-heading" bottom="pb-10 md:pb-14">
        <SectionHeader
          eyebrow="Pricing"
          headingId="roofing-pricing-heading"
          title="Three plans. Same build, more surface area."
          lede="Setup is one-time and covers the build, the integration, and training it on your voice. Monthly billing starts at go-live. Cancel anytime."
        />
        <FadeInSection delay={100}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:items-stretch">
            {PLANS.map(plan => (
              <div
                key={plan.tier}
                className={`rounded-3xl p-7 md:p-8 flex flex-col border ${plan.featured
                  ? 'bg-zinc-900 border-zinc-900 text-white shadow-[0_32px_64px_-32px_rgba(24,24,27,0.45)] lg:-my-3 lg:py-11'
                  : 'bg-white border-zinc-200'}`}
              >
                <div className="flex items-center gap-2 mb-6">
                  <h3 className="text-lg font-semibold tracking-[-0.01em]">{plan.tier}</h3>
                  {plan.featured && <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white text-zinc-900">Recommended</span>}
                </div>
                <div className="mb-1">
                  <span className="text-5xl font-semibold tracking-[-0.04em] tabular-nums">{plan.monthly}</span>
                  <span className={`text-base ${plan.featured ? 'text-zinc-400' : 'text-zinc-500'}`}>/mo</span>
                </div>
                <div className={`text-sm font-medium tabular-nums mb-8 ${plan.featured ? 'text-zinc-300' : 'text-zinc-700'}`}>+ {plan.setup} one-time setup</div>
                <ul className={`space-y-3 mb-10 pt-6 border-t ${plan.featured ? 'border-white/15' : 'border-zinc-200'}`}>
                  {plan.includes.map(item => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed">
                      <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.featured ? 'text-emerald-400' : 'text-emerald-600'}`} strokeWidth={2.5} aria-hidden="true" />
                      <span className={plan.featured ? 'text-zinc-200' : 'text-zinc-700'}>{item}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={EXTERNAL_URLS.appointments}
                  {...SECURE_LINK_PROPS}
                  aria-label={`Book a call about ${plan.tier}`}
                  className={`mt-auto w-full px-4 sm:px-6 py-3.5 rounded-full font-medium text-[0.9375rem] sm:text-base whitespace-nowrap transition inline-flex items-center justify-center gap-2 ${plan.featured
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
            ))}
          </div>
          <p className="mt-12 text-center text-2xl md:text-[1.75rem] font-medium tracking-[-0.02em] text-zinc-900 text-balance">One extra booked inspection pays for the year.</p>
          <p className="mt-3 text-center text-sm text-zinc-500">Roof replacements commonly run $8,000 to $15,000.</p>
        </FadeInSection>
      </Section>

      {/* 6. Guarantee, scoped exactly. */}
      <Section id="guarantee" labelledBy="roofing-guarantee-heading" rule={false}>
        <FadeInSection>
          <div className="rounded-3xl border border-emerald-600/15 bg-gradient-to-b from-emerald-50 to-emerald-50/30 px-6 py-12 sm:p-10 md:p-16">
            <div className="text-center max-w-3xl mx-auto">
              <div className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-6 bg-white border border-emerald-600/20 shadow-sm">
                <Shield className="w-6 h-6 text-emerald-600" aria-hidden="true" />
              </div>
              <h2 id="roofing-guarantee-heading" className="t-h2 mb-6">60-day results guarantee</h2>
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
      <section id="cta" className="relative overflow-hidden border-t border-zinc-200 scroll-mt-16" aria-labelledby="roofing-cta-heading">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-emerald-50/50 to-emerald-50" aria-hidden="true" />
        <div className="relative max-w-4xl mx-auto px-6 py-24 md:py-36 text-center">
          <FadeInSection>
            <h2 id="roofing-cta-heading" className="t-h1 mb-6">Is this worth building for your company?</h2>
            <p className="t-lede md:text-xl max-w-2xl mx-auto mb-10">One 30-minute call on how quote requests reach you now, where they go cold, and whether this is worth building. If it is, you&apos;re live in about <span className="whitespace-nowrap">2–4 weeks</span>.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <BookButton />
              <SampleButton />
            </div>
            <p className="text-zinc-500 text-sm mt-6 flex items-center justify-center gap-2.5">
              <HeadshotAvatar size={28} className="border border-white shadow-sm" />
              <span>Free • 30 minutes with Matt • Zero obligation</span>
            </p>
            <p className="text-zinc-600 leading-relaxed mt-14 pt-10 border-t border-emerald-600/15 max-w-xl mx-auto">
              The sample sequence is three follow-up emails written for your roofing company. No credit card. It&apos;s a preview of the writing, not the live system; setup still starts with a call.
            </p>
          </FadeInSection>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
