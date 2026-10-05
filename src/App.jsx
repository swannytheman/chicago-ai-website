import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Users, ChevronRight, Check, Star, ArrowRight, Zap, Plus, MessageSquare, BarChart3, Shield, Sparkles, Calendar, Rocket } from 'lucide-react';
import TryItFree from './TryItFree.jsx';
import Contact from './Contact.jsx';
import Privacy from './Privacy.jsx';
import Terms from './Terms.jsx';
import { SiteNav, SiteFooter } from './SiteChrome.jsx';
import { EXTERNAL_URLS, SECURE_LINK_PROPS, sectionId } from './siteConfig.js';
import { usePageMeta } from './usePageMeta.js';
import { PAGE_META } from './seo.js';
import EmailPreview from './EmailPreview.jsx';
import HeroDemo from './HeroDemo.jsx';

const FadeInSection = ({ children, delay = 0, className = '' }) => {
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

// Home page layout primitives. Sections are separated by a hairline inset to the
// content width and generous vertical space rather than each being boxed in a card;
// framing is kept for the two blocks meant to stand out, pricing and the guarantee.
function Section({ id, labelledBy, rule = true, bottom = 'pb-24 md:pb-32', children }) {
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
function SectionHeader({ eyebrow, title, headingId, lede }) {
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
function AccentRule({ children }) {
  return (
    <div className="relative border-t border-zinc-200 pt-8 h-full">
      <span className="absolute -top-px left-0 h-0.5 w-12 bg-emerald-600" aria-hidden="true" />
      {children}
    </div>
  );
}

function MainSite() {
  usePageMeta(PAGE_META.home);
  const [activeFaq, setActiveFaq] = useState(null);
  const [selectedTier, setSelectedTier] = useState(1);
  const planRefs = useRef([]);
  const { hash } = useLocation();

  // A radiogroup is expected to move selection with the arrow keys and expose a single
  // tab stop; three plain tabbable buttons is not that pattern. Selection follows focus
  // here, which is correct for radios and keeps the includes panel in step.
  const onPlanKeyDown = useCallback((e, count) => {
    const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    let next = null;
    if (e.key in keys) next = (selectedTier + keys[e.key] + count) % count;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = count - 1;
    if (next === null) return;
    e.preventDefault();
    setSelectedTier(next);
    planRefs.current[next]?.focus();
  }, [selectedTier]);

  const scrollTo = useCallback((id) => {
    document.getElementById(sectionId(id))?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Arriving from a subpage's nav as /#pricing: sections are in the DOM immediately
  // (FadeInSection only animates opacity), so one frame is enough before scrolling.
  useEffect(() => {
    if (!hash) return;
    const target = sectionId(hash.slice(1));
    const timer = setTimeout(() => {
      document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
    }, 80);
    return () => clearTimeout(timer);
  }, [hash]);

  const salesAgent = useMemo(() => ({
    icon: Users,
    name: "Sales AI Agent",
    tagline: "A managed AI sales agent for businesses that live on inbound leads",
    // `forWho` and `includes` live on the plan, not beside it. The section used to
    // pair a plan picker with one frozen capability list that hedged the difference in
    // parentheses ("SMS on Pro and above", "CRM ... (Pro and Enterprise)"), so choosing
    // a plan changed the price and nothing else. These lines agree with the "How the
    // plans differ" rows in #scope; keep the two in step if either changes.
    pricing: [
      {
        tier: "Starter", monthly: "$179", setup: "$2,200",
        details: "One inbound source. Qualify, follow up, book.",
        forWho: "Your first inbound source — an owner-led service business that just needs follow-up on.",
        includes: [
          "One inbound lead source (form, ad inbox, or email)",
          "First reply typically within 5 minutes",
          "Qualify rules, and booking into the calendar you already use",
          "Email follow-up",
          "We monitor it after go-live"
        ]
      },
      {
        tier: "Pro", monthly: "$399", setup: "$3,500",
        details: "Sequences, scoring, and CRM sync on top of Starter.", popular: true,
        forWho: "Teams that already have a CRM, or want SMS and longer sequences.",
        includes: [
          "Everything in Starter",
          "Longer follow-up sequences",
          "SMS, if you want it and have permission",
          "Lead scoring",
          "Sync to the CRM you already use"
        ]
      },
      {
        tier: "Enterprise", monthly: "$649", setup: "$5,900",
        details: "More sources and locations, copy tests, priority support.",
        forWho: "More than one location, brand, or lead source.",
        includes: [
          "Everything in Pro",
          "Additional inbound sources and locations",
          "Copy tests",
          "Priority check-ins",
          "Not cold outbound — more of your existing inbound channels"
        ]
      }
    ]
  }), []);

  const testimonial = useMemo(() => ({
    quote: "We were drowning in lead follow-ups—losing deals just because we couldn't respond fast enough. Now our AI handles first contact with the customer within just a few minutes, and our sales team closes 35% more deals. They paid for themselves in the first month.",
    author: "Erik Sandoval",
    title: "VP of Operations, Luigi Trucking Insurance"
  }), []);

  const faqs = useMemo(() => [
    { q: "Is this software we log into, or do you run it for us?", a: "We run it. We build the agent, train it on how you talk to customers, connect it to your calendar and inbox, and keep managing it after go-live. You approve how it sounds and you take the meetings. There is no tool for your team to learn and nothing technical for you to do — most of our clients are owners, not engineers." },
    { q: "Who is this for, and who is it not for?", a: "It is for service businesses that already get inbound leads and lose some of them to slow follow-up — commercial insurance, home services and trades, counseling and group practices, property management, and similar appointment businesses. It is not a fit if you have no inbound demand yet, or if what you actually need is a custom CRM rebuild." },
    { q: "What can the agent actually do on day one?", a: "Reply to your inbound leads, qualify them on things like job type, timing and fit, follow up by email (SMS on Pro and above), and book the ones worth your time into your calendar. Which channels it covers is set on the strategy call. It only ever contacts people who already reached out to you." },
    { q: "What does the 60-day guarantee actually cover?", a: "Two things we operate: a first response typically within 5 minutes on inbound leads wired into the agent, and follow-up plus a meeting offer for leads that meet the qualify rules we set with you. The 60 days starts when the agent goes live on your real lead flow, not at the kickoff call. Miss either and you get the setup fee and every monthly fee back. It does not guarantee a number of closed deals or a volume of new leads — if the leads are not coming in, that is not something the agent can fix." },
    { q: "What do you actually turn on in the first month?", a: "One inbound source you already have, a first reply typically within 5 minutes, the qualify rules we write with you, and booking into the calendar you already use. Pro and Enterprise add the extra channels and systems we name on the call. We do not turn on the whole internet in week four." },
    { q: "How fast can I get started?", a: "Most clients are live within 2-4 weeks. We move fast because we know your time is money. After a quick discovery call, we get to work immediately." },
    { q: "Will the AI sound like a robot?", a: "No. We train each AI on your business, your tone, and your way of talking to customers. People often can't tell they're chatting with AI—that's the whole point." },
    { q: "What if something goes wrong?", a: "We've got your back. All plans include support, and Pro/Enterprise clients get priority access plus regular check-ins to make sure everything runs smoothly." }
  ], []);

  const process = useMemo(() => [
    { icon: MessageSquare, when: "Day 1", title: "Quick Call", desc: "Tell us what's slowing you down" },
    { icon: BarChart3, when: "Week 1", title: "Custom Plan", desc: "We map your leads, tools, and follow-up gaps" },
    { icon: Zap, when: "Weeks 2–3", title: "We Build It", desc: "Connect the agreed source, write qualify rules, train your voice, and test before anything reaches customers" },
    { icon: Rocket, when: "Week 4", title: "Go Live", desc: "Live on that source. We watch replies at the start; you take the calendar" }
  ], []);


  const selectedPlan = salesAgent.pricing[selectedTier];

  return (
    <div className="min-h-screen bg-white text-zinc-900 overflow-x-hidden">
      <style>{`
        .text-gradient { background: linear-gradient(135deg, #18181b 0%, #059669 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        html { scroll-behavior: smooth; }
      `}</style>

      <SiteNav />

      {/* Not full-height on purpose: the top of the next section showing below the fold
          invites the scroll that the old bouncing arrow used to ask for. */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28" aria-labelledby="hero-heading">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50 via-white to-white" aria-hidden="true" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 xl:grid-cols-12 gap-14 xl:gap-16 items-center">
          <div className="xl:col-span-6 text-center xl:text-left">
            <FadeInSection>
              <div className="inline-flex items-center gap-3 text-sm mb-8">
                <span className="relative flex w-2 h-2" aria-hidden="true">
                  <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-60 motion-safe:animate-ping" />
                  <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-500" />
                </span>
                <span className="hidden sm:inline font-medium text-zinc-900">Expert AI &amp; Automation Team</span>
                <span className="hidden sm:inline w-px h-4 bg-zinc-300" aria-hidden="true" />
                <span className="text-zinc-600">Chicago, IL</span>
              </div>
            </FadeInSection>
            {/* Sized down from the full t-display scale: on wide screens it shares the row with the
                demo. The layout only splits at xl -- below that the demo is too tall to sit
                beside the copy without pushing the buttons under the fold. */}
            <FadeInSection delay={100}><h1 id="hero-heading" className="t-display text-[clamp(2.5rem,1.3rem+4vw,4.75rem)] mb-6">AI That Books Meetings <span className="text-gradient block">While You Sleep</span></h1></FadeInSection>
            <FadeInSection delay={200}>
              <p className="t-lede md:text-xl text-zinc-700 max-w-xl mx-auto xl:mx-0 mb-9">We build and run an AI sales agent for service businesses that already get inbound leads. We cultivate your leads, you take the meetings. Live in about <span className="whitespace-nowrap">2–4 weeks</span>.</p>
            </FadeInSection>
            <FadeInSection delay={300}>
              <div className="flex flex-col sm:flex-row gap-3 justify-center xl:justify-start">
                <button onClick={() => scrollTo('cta')} className="group bg-zinc-900 text-white px-7 py-4 rounded-full font-medium text-lg hover:bg-zinc-700 transition flex items-center justify-center gap-2" type="button">Book a strategy call <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" /></button>
                <Link to="/try-it-free" className="group text-emerald-700 border border-emerald-600/30 bg-white/70 px-7 py-4 rounded-full font-medium text-lg transition hover:border-emerald-600/60 hover:bg-white flex items-center justify-center gap-2">See a sample sequence <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" /></Link>
              </div>
            </FadeInSection>
          </div>

          <FadeInSection delay={250} className="xl:col-span-6 w-full max-w-xl mx-auto xl:max-w-none min-w-0">
            <HeroDemo />
          </FadeInSection>
        </div>
      </section>

      <Section id="example" labelledBy="example-heading">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <FadeInSection className="lg:col-span-5">
            <div>
              <span className="t-eyebrow mb-4">What they actually get</span>
              <h2 id="example-heading" className="t-h2 mb-6">A follow-up that sounds like you, sent while you&apos;re still on the job.</h2>
              <p className="t-lede mb-8">First response on the inbound source we wire. Qualify. Offer a time. You take the meeting.</p>
              <Link to="/try-it-free" className="group inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 transition font-medium">
                See a sample written for your business <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
              </Link>
            </div>
          </FadeInSection>

          <FadeInSection delay={100} className="lg:col-span-7">
            <div>
              <div className="flex items-center gap-2 t-label mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" aria-hidden="true" />
                <span>Example follow-up &middot; 4 minutes after the form came in</span>
              </div>
              <EmailPreview
                from="Sarah at Summit Roofing"
                to="the homeowner who just requested a quote"
                subject="Quick question about your roof estimate"
                timestamp="Tue 8:34 PM"
                footnote="Example only. We write these in the client's voice after kickoff. This is not the live booking agent — that is what the strategy call scopes."
              >
                <p>Hi Mark &mdash;</p>
                <p>Sorry to hear about the roof leak on Oakley. I can have someone look at it Thursday morning or Friday after 2.</p>
                <p>If water is coming in right now, reply and we&apos;ll put you first.</p>
                <p>Sarah<br />Summit Roofing</p>
              </EmailPreview>
            </div>
          </FadeInSection>
        </div>
      </Section>

      <Section id="how-it-works" labelledBy="how-it-works-heading">
        <SectionHeader
          eyebrow="How Your AI Works"
          headingId="how-it-works-heading"
          title="Capture. Nurture. Close."
          lede="A three-phase system we build, run, and manage for you — so every lead gets handled the moment it arrives, and you get your evenings and weekends back."
        />
        <ol className="grid md:grid-cols-3 gap-x-12 gap-y-14">
          {[
            { icon: Zap, phase: 'Capture', title: 'Detect Every Lead, Day or Night', desc: 'Your agent watches the places your leads actually come from — website forms, ad leads, inbound email, missed calls — and replies within a few minutes, around the clock.' },
            { icon: MessageSquare, phase: 'Nurture', title: 'Build Trust on Autopilot', desc: 'Follow-ups go out by email, and by SMS on Pro and above, written in your voice, and keep going until they reply or opt out. Only people who already contacted you ever get one.' },
            { icon: Calendar, phase: 'Close', title: 'Book Ready-to-Buy Meetings', desc: 'Only leads that pass qualifying reach your calendar, and the whole conversation comes with them. Your team walks in already knowing the context.' },
          ].map((item, idx) => (
            <li key={idx}>
              <FadeInSection delay={idx * 120} className="h-full">
                <AccentRule>
                  <div className="flex items-center justify-between mb-10">
                    <span className="t-eyebrow">{item.phase}</span>
                    <span className="text-sm font-medium text-zinc-400 tabular-nums" aria-hidden="true">{String(idx + 1).padStart(2, '0')}</span>
                  </div>
                  <item.icon className="w-6 h-6 text-emerald-600 mb-5" strokeWidth={1.75} aria-hidden="true" />
                  <h3 className="t-h3 mb-3">{item.title}</h3>
                  <p className="text-zinc-600 leading-relaxed">{item.desc}</p>
                </AccentRule>
              </FadeInSection>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="testimonials" labelledBy="testimonials-heading">
        <SectionHeader
          eyebrow="Proven Results"
          headingId="testimonials-heading"
          title="Built for Chicago service businesses"
          lede="We start with firms that live on inbound quotes and appointments — commercial insurance, counseling and group practices, property management, and trades."
        />

        <FadeInSection delay={100}>
          {/* Logos and numbers share one ruled band: a single frame for the proof,
              rather than a row of logos and three separate stat cards. */}
          <div className="border-y border-zinc-200 divide-y divide-zinc-200">
            <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8 py-10 md:py-12">
              {[
                { src: '/logos/luigi-trucking.svg', alt: 'Luigi Trucking Insurance Agency' },
                { src: '/logos/crown-counseling.svg', alt: 'Crown Counseling' },
                { src: '/logos/prg-management.svg', alt: 'PRG Management' },
              ].map((logo, idx) => (
                <img key={idx} src={logo.src} alt={logo.alt} className="h-9 md:h-11 w-auto object-contain invert opacity-50 hover:opacity-80 transition-opacity duration-300" />
              ))}
            </div>
            <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-200">
              {[
                { stat: '35%', label: 'increase in closed deals', detail: 'Luigi Trucking Insurance' },
                { stat: '~5 min', label: 'first response to every lead', detail: 'How every agent we build is configured' },
                { stat: '2–4 wks', label: 'from kickoff to fully live', detail: 'Typical implementation' },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center text-center py-10 md:py-14 px-6">
                  <div className="t-stat text-emerald-600 mb-4">{item.stat}</div>
                  <div className="font-medium text-zinc-900 mb-1">{item.label}</div>
                  <div className="text-zinc-500 text-sm">{item.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </FadeInSection>

        <FadeInSection delay={200}>
          <figure className="max-w-4xl mx-auto mt-20 md:mt-28">
            <div className="flex gap-1 mb-8" role="img" aria-label="5 star rating">{[...Array(5)].map((_, i) => (<Star key={i} className="w-5 h-5 fill-emerald-500 text-emerald-500" aria-hidden="true" />))}</div>
            <blockquote className="text-2xl md:text-[2rem] font-medium tracking-[-0.025em] leading-[1.35] text-zinc-900">&ldquo;{testimonial.quote}&rdquo;</blockquote>
            <figcaption className="flex items-center gap-4 mt-10">
              <div className="w-12 h-12 bg-emerald-50 border border-emerald-600/20 rounded-full flex items-center justify-center font-semibold text-lg text-emerald-700" aria-hidden="true">{testimonial.author.charAt(0)}</div>
              <div>
                <div className="font-semibold">{testimonial.author}</div>
                <div className="text-zinc-500 text-sm">{testimonial.title}</div>
              </div>
            </figcaption>
          </figure>
        </FadeInSection>
      </Section>

      <Section id="about" labelledBy="about-heading">
        <FadeInSection>
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
            {/* No photo of Matt exists in the repo, so a monogram rather than a stock face. */}
            <div className="lg:col-span-4 flex lg:flex-col items-center lg:items-start gap-5">
              <div className="w-20 h-20 lg:w-28 lg:h-28 rounded-2xl bg-emerald-50 border border-emerald-600/20 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                <span className="text-2xl lg:text-3xl font-semibold tracking-[-0.02em] text-emerald-700">MS</span>
              </div>
              <div>
                <div className="font-semibold text-lg">Matt Swanson</div>
                <div className="text-zinc-500">Chicago, IL</div>
              </div>
            </div>

            <div className="lg:col-span-8">
              <span className="t-eyebrow mb-4">About</span>
              <h2 id="about-heading" className="t-h2 mb-8">You&apos;re talking to a person in Chicago, not a platform.</h2>
              <div className="space-y-5 t-lede text-zinc-700 max-w-2xl">
                <p>Chicago AI Group is run by Matt Swanson. I work with owner-led service businesses — insurance, practices, property, trades — that already get inbound leads and lose them overnight. I build the agent, train it on how you actually talk to customers, and keep it running. You take the meetings.</p>
                <p>This started because generic AI tools dump another dashboard on a busy owner. The useful version is the one someone sets up and watches.</p>
              </div>
              <p className="text-emerald-700 font-semibold mt-8">The strategy call is with me.</p>
              <div className="mt-8 flex flex-col sm:flex-row gap-5 sm:items-center">
                <a href={EXTERNAL_URLS.appointments} {...SECURE_LINK_PROPS} className="bg-zinc-900 text-white px-8 py-4 rounded-full font-medium hover:bg-zinc-700 transition inline-flex items-center justify-center gap-2">Book a strategy call <ArrowRight className="w-4 h-4" aria-hidden="true" /></a>
                <Link to="/contact" className="text-zinc-600 hover:text-zinc-900 transition text-sm underline underline-offset-4 text-center sm:text-left">Or send a note</Link>
              </div>
            </div>
          </div>
        </FadeInSection>
      </Section>

      <Section id="scope" labelledBy="scope-heading">
        <SectionHeader
          eyebrow="Scope"
          headingId="scope-heading"
          title={<>What &ldquo;live&rdquo; means &mdash; and what we need from you</>}
          lede="The setup fee is the build. The monthly fee is us running it."
        />

        <div className="grid md:grid-cols-2 gap-x-16 gap-y-16">
          <FadeInSection>
            <AccentRule>
              <h3 className="t-h3 mb-1">Live on day one</h3>
              <p className="text-sm text-zinc-500 mb-8">The default build, on Starter.</p>
              <ol className="space-y-6">
                {[
                  { t: 'Lead intake', d: 'One inbound source you already have: a website form, an ad lead inbox, or a shared email address. We wire it so a new inquiry is seen the moment it lands.' },
                  { t: 'First response', d: 'The agent replies typically within 5 minutes, in your voice, to that source.' },
                  { t: 'Qualify', d: 'A short rule set we write with you — service type, area, timing, fit. Bad-fit leads get a polite close, not your calendar.' },
                  { t: 'Book', d: 'Qualified leads get a link to the calendar you already use, or a hold you confirm.' },
                ].map((item, i) => (
                  <li key={i} className="flex gap-5">
                    <span className="text-sm font-semibold text-emerald-700 tabular-nums w-6 flex-shrink-0 pt-0.5" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <div className="font-semibold mb-1">{item.t}</div>
                      <p className="text-zinc-600 leading-relaxed">{item.d}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </AccentRule>
          </FadeInSection>

          <FadeInSection delay={100}>
            <AccentRule>
              <h3 className="t-h3 mb-1">What we need from you</h3>
              <p className="text-sm text-zinc-500 mb-8">Miss these and the build slips.</p>
              <ul className="space-y-5">
                {[
                  'A kickoff call, and one example of a good lead next to one you do not want.',
                  'Access to the lead source and the calendar we agree to use.',
                  'How you actually sound — a few sent emails, call notes, or twenty minutes on the phone. We do not guess your voice.',
                  'Someone who will take the meetings the agent books.',
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-zinc-700 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-zinc-500 leading-relaxed mt-8 pt-6 border-t border-zinc-200">If a source is not connected, it is not covered by the 5-minute guarantee.</p>
            </AccentRule>
          </FadeInSection>
        </div>

        <FadeInSection delay={150}>
          <div className="mt-20 md:mt-28 grid lg:grid-cols-12 gap-x-16 gap-y-6">
            <h3 className="t-h3 lg:col-span-4">Not included unless we scope it</h3>
            <ul className="lg:col-span-8 border-t border-zinc-200 divide-y divide-zinc-200">
              {[
                'Extra lead sources beyond the first — more forms, missed-call and voicemail follow-up, SMS as a second channel',
                'CRM write-back and lead scoring (Pro)',
                'A second brand, location, or agent voice, and copy tests (Enterprise)',
                'Generating new leads, running ads, or rebuilding your website',
                'The agent taking payment or closing the job',
              ].map((item, i) => (
                <li key={i} className="flex gap-4 py-4 text-zinc-600 leading-relaxed">
                  <span className="text-zinc-400 flex-shrink-0" aria-hidden="true">&minus;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </FadeInSection>

        <FadeInSection delay={200}>
          <div className="mt-16 md:mt-20 grid lg:grid-cols-12 gap-x-16 gap-y-6">
            <div className="lg:col-span-4">
              <h3 className="t-h3 mb-1">How the plans differ</h3>
              <p className="text-sm text-zinc-500">Same build. More surface area.</p>
            </div>
            <dl className="lg:col-span-8 border-t border-zinc-200 divide-y divide-zinc-200">
              {[
                { tier: 'Starter', d: 'One inbound source. First response, qualify, book, email follow-up. We monitor it.' },
                { tier: 'Pro', d: 'Starter plus longer sequences, SMS if you want it and have permission, lead scoring, and CRM sync to the system you already use.' },
                { tier: 'Enterprise', d: 'Pro plus additional sources or locations, copy tests, and priority check-ins.' },
              ].map((row, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:gap-8 py-5">
                  <dt className="font-semibold text-emerald-700 sm:w-32 flex-shrink-0 mb-1 sm:mb-0">{row.tier}</dt>
                  <dd className="text-zinc-700 leading-relaxed">{row.d}</dd>
                </div>
              ))}
            </dl>
          </div>
        </FadeInSection>
      </Section>

      {/* Pricing and the guarantee are the two framed blocks on the page, on purpose:
          everything else is open layout, so these are what the eye lands on. */}
      <Section id="services" labelledBy="services-heading" bottom="pb-10 md:pb-14">
        <SectionHeader
          eyebrow="Our AI Sales Agent"
          headingId="services-heading"
          title="Your 24/7 Sales Machine"
          lede="We build it, train it on your voice, and manage it for you. Here's exactly what's included — and what it costs."
        />
        <FadeInSection delay={150}>
          <div className="rounded-3xl border border-zinc-200 bg-white shadow-[0_1px_2px_rgba(24,24,27,0.04),0_32px_64px_-32px_rgba(24,24,27,0.18)] overflow-hidden">
            <div className="p-6 sm:p-8 md:p-12">
              <div className="flex flex-col md:flex-row md:items-center gap-6 mb-10">
                <div className="w-14 h-14 bg-gradient-to-br from-zinc-900 to-zinc-700 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Users className="w-7 h-7 text-white" aria-hidden="true" />
                </div>
                <div><h3 className="text-3xl font-semibold tracking-[-0.03em] mb-1">{salesAgent.name}</h3><p className="text-zinc-600 text-lg">{salesAgent.tagline}</p></div>
              </div>
              <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
                <div>
                  {/* Named region rather than a bare list: the heading carries the plan
                      name, so the region's accessible name changes with the selection and
                      the radios below point at it via aria-controls. */}
                  <h4 id="plan-includes-heading" className="t-label mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4" aria-hidden="true" /> What {selectedPlan.tier} Includes</h4>
                  <div id="plan-includes" role="region" aria-labelledby="plan-includes-heading">
                    <p className="text-sm text-zinc-600 leading-relaxed mb-5">
                      <span className="text-zinc-500">Best for: </span>{selectedPlan.forWho}
                    </p>
                    <ul className="border-t border-zinc-200 divide-y divide-zinc-200">
                      {selectedPlan.includes.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-4 py-4">
                          <div className="w-7 h-7 bg-emerald-50 border border-emerald-600/15 rounded-full flex items-center justify-center flex-shrink-0"><Check className="w-3.5 h-3.5 text-emerald-700" strokeWidth={2.5} aria-hidden="true" /></div>
                          <span className="text-zinc-800">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div>
                  <h4 className="t-label mb-4">Choose Your Plan</h4>
                  <div className="space-y-3" role="radiogroup" aria-label="Pricing plans">
                    {salesAgent.pricing.map((plan, idx) => {
                      const isSelected = selectedTier === idx;
                      return (
                        <button
                          key={idx}
                          ref={el => { planRefs.current[idx] = el; }}
                          onClick={() => setSelectedTier(idx)}
                          onKeyDown={e => onPlanKeyDown(e, salesAgent.pricing.length)}
                          className={`w-full rounded-2xl p-5 flex items-center justify-between border transition-all duration-300 cursor-pointer ${isSelected ? 'bg-zinc-900 border-zinc-900 text-white shadow-lg shadow-zinc-900/10' : 'bg-white border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'}`}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          aria-controls="plan-includes"
                          tabIndex={isSelected ? 0 : -1}
                        >
                          <div className="text-left">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-lg tracking-[-0.01em]">{plan.tier}</span>
                              {plan.popular && <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isSelected ? 'bg-white text-zinc-900' : 'bg-emerald-50 text-emerald-700 border border-emerald-600/20'}`}>Popular</span>}
                            </div>
                            <div className={`text-sm ${isSelected ? 'text-zinc-400' : 'text-zinc-600'}`}>{plan.details}</div>
                          </div>
                          <div className="text-right flex-shrink-0 pl-4">
                            <div className="text-2xl font-semibold tracking-[-0.03em] tabular-nums">{plan.monthly}<span className={`text-sm font-normal ${isSelected ? 'text-zinc-400' : 'text-zinc-600'}`}>/mo</span></div>
                            <div className={`text-sm font-medium tabular-nums ${isSelected ? 'text-zinc-300' : 'text-zinc-700'}`}>+ {plan.setup} setup</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-5 text-sm text-zinc-500 text-center leading-relaxed">Setup is a one-time fee that covers the build, your integrations, and training the AI on your voice. Monthly billing starts the day you go live.</p>
                  <button onClick={() => scrollTo('guarantee')} className="mt-3 w-full flex items-center justify-center gap-2 text-sm text-emerald-700 hover:text-emerald-800 transition py-2" type="button">
                    <Shield className="w-4 h-4 flex-shrink-0" aria-hidden="true" /> Both refundable under our 60-day Results Guarantee — response time and follow-up on scoped inbound leads
                  </button>
                </div>
              </div>
              <div className="mt-10 pt-8 border-t border-zinc-200 flex flex-col sm:flex-row gap-4 items-center">
                <button onClick={() => scrollTo('cta')} className="w-full sm:w-auto bg-zinc-900 text-white px-8 py-4 rounded-full font-medium hover:bg-zinc-700 transition flex items-center justify-center gap-2" type="button">Book a call about {selectedPlan.tier} <ChevronRight className="w-4 h-4" aria-hidden="true" /></button>
                <Link to="/try-it-free" className="w-full sm:w-auto text-emerald-700 px-8 py-4 rounded-full font-medium transition flex items-center justify-center gap-2 border border-emerald-600/30 hover:border-emerald-600/60 hover:bg-emerald-500/5">See a sample sequence <ArrowRight className="w-4 h-4" aria-hidden="true" /></Link>
                <span className="text-zinc-500 text-sm text-center sm:text-left">{selectedPlan.monthly}/mo + {selectedPlan.setup} one-time setup • Cancel anytime<br />Plans start after a strategy call — the sample sequence is free either way.</span>
              </div>
            </div>
          </div>
        </FadeInSection>
      </Section>

      <Section id="guarantee" labelledBy="guarantee-heading" rule={false}>
        <FadeInSection>
          <div className="rounded-3xl border border-emerald-600/15 bg-gradient-to-b from-emerald-50 to-emerald-50/30 px-6 py-12 sm:p-10 md:p-16">
            <div className="text-center max-w-3xl mx-auto">
              <div className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-6 bg-white border border-emerald-600/20 shadow-sm">
                <Shield className="w-6 h-6 text-emerald-600" aria-hidden="true" />
              </div>
              <h2 id="guarantee-heading" className="t-h2 mb-6">Results Guarantee</h2>
              <p className="text-xl md:text-2xl text-zinc-900 font-medium tracking-[-0.015em] leading-[1.45]">We guarantee the part we operate: inbound leads wired into your agent get a first response typically within 5 minutes, and leads that meet your qualify rules get followed up and offered a meeting.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-10 md:gap-0 md:divide-x divide-emerald-600/15 text-left mt-14 pt-12 border-t border-emerald-600/15">
              {[
                { title: 'What you get', items: [
                  'New inbound leads wired into the agent get a first response typically within 5 minutes.',
                  'Leads that meet the qualify rules we set together get followed up and offered a time on your calendar.',
                  'We build it, train it on your voice, and monitor it. You take the meetings.',
                ] },
                { title: 'The 60 days', items: [
                  'The clock starts when the agent goes live on your real lead flow — not at the kickoff call.',
                  'If after 60 days live we are not hitting that response time, or scoped inbound leads are not being followed up and offered a meeting, you get back the one-time setup fee and every monthly fee you have paid.',
                  'Ask through the Contact page. We do not make you chase it.',
                ] },
                { title: 'What we need from you', items: [
                  'The agent stays on and connected to the lead sources we agreed — forms, ads, inbox.',
                  'You still have inbound leads coming in. This is not a lead-generation guarantee.',
                  'You keep the qualify rules and calendar we set up together, and you show up to booked meetings.',
                  'Outreach goes only to people who already contacted you, or where you have permission.',
                ] },
              ].map((block, i) => (
                <div key={i} className="md:px-8 first:md:pl-0 last:md:pr-0">
                  <h3 className="t-eyebrow mb-5">{block.title}</h3>
                  <ul className="space-y-3">
                    {block.items.map((item, j) => (
                      <li key={j} className="flex gap-3 text-sm text-zinc-700 leading-relaxed">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <p className="text-base md:text-lg text-emerald-800 font-medium leading-relaxed mt-12 max-w-2xl mx-auto text-center">If we miss our side of that, we refund you. If there were no leads to work, that is not a system failure.</p>
          </div>
        </FadeInSection>
      </Section>

      <Section id="process" labelledBy="process-heading">
        <SectionHeader
          eyebrow="Getting Started"
          headingId="process-heading"
          title="Live in Weeks, Not Months"
          lede="We handle the build, the integrations we agree on, and the testing. From you we need a kickoff call, an example of a good and a bad lead, calendar access, and any follow-up copy you already use. Here's what a typical rollout looks like."
        />
        {/* A timeline rather than four boxes: one rule runs through the steps —
            horizontally on desktop, down the left edge on phones. */}
        <ol className="relative grid md:grid-cols-4 gap-x-10 gap-y-12">
          <span className="hidden md:block absolute top-[5px] left-0 right-0 h-px bg-zinc-200" aria-hidden="true" />
          <span className="md:hidden absolute top-2 bottom-2 left-[5px] w-px bg-zinc-200" aria-hidden="true" />
          {process.map((step, idx) => (
            <li key={idx} className="relative pl-10 md:pl-0">
              {/* The dot sits outside FadeInSection on purpose: that wrapper animates
                  transform, which would make it the dot's containing block and pull the
                  dot off the phone timeline rule. */}
              <span className="absolute left-0 top-1 md:static md:block w-[11px] h-[11px] rounded-full bg-white border-2 border-emerald-600 md:mb-10" aria-hidden="true" />
              <FadeInSection delay={idx * 120}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm font-medium text-zinc-400 tabular-nums">Step {idx + 1}</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-300" aria-hidden="true" />
                  <span className="t-eyebrow">{step.when}</span>
                </div>
                <h3 className="t-h3 mb-2">{step.title}</h3>
                <p className="text-zinc-600 leading-relaxed">{step.desc}</p>
              </FadeInSection>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="faq" labelledBy="faq-heading">
        <div className="grid lg:grid-cols-12 gap-x-16 gap-y-10">
          <FadeInSection className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <span className="t-eyebrow mb-4">FAQ</span>
              <h2 id="faq-heading" className="t-h2 mb-5">Got Questions?</h2>
              <p className="text-zinc-600 leading-relaxed">Not covered here? <Link to="/contact" className="text-emerald-700 hover:text-emerald-800 underline underline-offset-4">Send us a note</Link> and we&apos;ll answer it directly.</p>
            </div>
          </FadeInSection>
          <div className="lg:col-span-8 border-y border-zinc-200 divide-y divide-zinc-200">
            {faqs.map((faq, idx) => (
              <FadeInSection key={idx} delay={idx * 60}>
                <div>
                  <button onClick={() => setActiveFaq(activeFaq === idx ? null : idx)} className="group w-full py-6 flex items-start justify-between gap-6 text-left" type="button" aria-expanded={activeFaq === idx}>
                    <span className="font-medium text-lg tracking-[-0.01em] text-zinc-900 group-hover:text-emerald-700 transition-colors">{faq.q}</span>
                    <span className={`mt-0.5 w-7 h-7 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-300 ${activeFaq === idx ? 'bg-zinc-900 border-zinc-900 text-white rotate-45' : 'border-zinc-300 text-zinc-600 group-hover:border-zinc-400'}`} aria-hidden="true">
                      <Plus className="w-4 h-4" />
                    </span>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${activeFaq === idx ? 'max-h-[32rem] pb-7' : 'max-h-0'}`} aria-hidden={activeFaq !== idx}><p className="pr-12 text-zinc-600 leading-relaxed">{faq.a}</p></div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </Section>

      <section id="cta" className="relative overflow-hidden border-t border-zinc-200 scroll-mt-16" aria-labelledby="cta-heading">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-emerald-50/50 to-emerald-50" aria-hidden="true" />
        <div className="relative max-w-4xl mx-auto px-6 py-24 md:py-36 text-center">
          <FadeInSection>
            <h2 id="cta-heading" className="t-h1 mb-6">Let&apos;s See If We&apos;re a Fit</h2>
            <p className="t-lede md:text-xl max-w-2xl mx-auto mb-10">One 30-minute call: we look at how leads reach you now, where they go cold, and whether a managed AI agent is worth building for your business. If it is, you&apos;re live in about <span className="whitespace-nowrap">2–4 weeks</span>.</p>
            <a href={EXTERNAL_URLS.appointments} {...SECURE_LINK_PROPS} className="group bg-zinc-900 text-white px-10 py-5 rounded-full font-medium text-lg hover:bg-zinc-700 transition inline-flex items-center gap-3">Book a strategy call <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" /></a>
            <p className="text-zinc-500 text-sm mt-6">Free • 30 minutes • Zero obligation</p>
            <div className="mt-16 pt-10 border-t border-emerald-600/15 max-w-xl mx-auto">
              <p className="text-zinc-700 leading-relaxed mb-6">Not ready to talk? Read a sample first &mdash; we&apos;ll write three follow-up emails for your business so you can judge the copy. It&apos;s a preview, not the live system; setup still starts with a call.</p>
              <Link to="/try-it-free" className="group text-emerald-700 border border-emerald-600/30 bg-white/70 px-8 py-4 rounded-full font-medium transition hover:border-emerald-600/60 hover:bg-white inline-flex items-center gap-2">See a sample sequence <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" /></Link>
              <p className="text-zinc-500 text-sm mt-4">We&apos;ll write a 3-email follow-up for your business. No credit card.</p>
            </div>
          </FadeInSection>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

// Every unmatched path is rewritten to index.html so client-side routes survive a
// refresh, which means an unknown URL reaches the router rather than the host's 404.
// Without this it would render nothing at all.
function NotFound() {
  usePageMeta(PAGE_META.notFound);

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col overflow-x-hidden">
      <SiteNav solid />
      <div className="flex-1 flex items-center justify-center px-6 pt-36 pb-24">
        <div className="text-center max-w-md">
          <div className="t-eyebrow mb-4">404</div>
          <h1 className="t-h1 mb-5">We couldn't find that page</h1>
          <p className="text-zinc-600 leading-relaxed mb-10">The link may be out of date, or the address may have a typo.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="bg-zinc-900 text-white px-8 py-4 rounded-full font-medium hover:bg-zinc-700 transition inline-flex items-center justify-center gap-2">Back to Home</Link>
            <Link to="/contact" className="text-emerald-700 border border-emerald-600/30 bg-emerald-500/5 px-8 py-4 rounded-full font-medium transition hover:border-emerald-600/60 hover:bg-emerald-500/10 inline-flex items-center justify-center gap-2">Contact Us <ArrowRight className="w-4 h-4" aria-hidden="true" /></Link>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainSite />} />
      <Route path="/try-it-free" element={<TryItFree />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
