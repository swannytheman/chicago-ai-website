import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Users, ChevronRight, Check, Star, Menu, X, ArrowRight, Zap, Clock, TrendingUp, ChevronDown, MessageSquare, BarChart3, Shield, Sparkles, Send, Calendar } from 'lucide-react';
import TryItFree from './TryItFree.jsx';

const EXTERNAL_URLS = {
  appointments: 'https://calendly.com/matt-chicagoaigroup/30min',
  contact: 'https://www.chicagoaigroup.com/contact',
};

const SECURE_LINK_PROPS = {
  target: '_blank',
  rel: 'noopener noreferrer',
};

const Logo = ({ size = 'default', showText = true }) => {
  const dimensions = size === 'small' ? 32 : size === 'large' ? 64 : 40;
  return (
    <div className="flex items-center gap-3">
      <svg width={dimensions} height={dimensions} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Chicago AI Group Logo">
        <title>Chicago AI Group Logo</title>
        <path d="M70 15 A42 42 0 1 0 70 85" stroke="url(#logoGradient)" strokeWidth="6" strokeLinecap="round" fill="none" />
        <line x1="30" y1="35" x2="50" y2="50" stroke="#64748b" strokeWidth="2" />
        <line x1="30" y1="65" x2="50" y2="50" stroke="#64748b" strokeWidth="2" />
        <line x1="30" y1="35" x2="30" y2="65" stroke="#64748b" strokeWidth="2" />
        <line x1="50" y1="50" x2="68" y2="50" stroke="#64748b" strokeWidth="2" />
        <circle cx="30" cy="35" r="5" fill="#e2e8f0" />
        <circle cx="30" cy="65" r="5" fill="#e2e8f0" />
        <circle cx="68" cy="50" r="4" fill="#e2e8f0" />
        <circle cx="50" cy="50" r="10" fill="#10b981" filter="url(#blueGlow)" />
        <circle cx="50" cy="50" r="6" fill="#34d399" />
        <polygon points="82,38 84,42 88,42 85,45 86,49 82,46 78,49 79,45 76,42 80,42" fill="#34d399" />
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
          <filter id="blueGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
      </svg>
      {showText && (
        <div className="flex flex-col leading-none">
          <span style={{ fontWeight: 600, letterSpacing: '3px', fontSize: size === 'small' ? '12px' : '14px' }}>CHICAGO AI</span>
          <span style={{ fontWeight: 500, letterSpacing: '5px', fontSize: size === 'small' ? '10px' : '11px', color: '#64748b' }}>GROUP</span>
        </div>
      )}
    </div>
  );
};

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

function MainSite() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [selectedTier, setSelectedTier] = useState(1);

  const scrollTo = useCallback((id) => {
    const sanitizedId = id.toLowerCase().replace(/[^a-z0-9-]/g, '');
    const el = document.getElementById(sanitizedId);
    if (el) { el.scrollIntoView({ behavior: 'smooth' }); setMobileMenuOpen(false); }
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const salesAgent = useMemo(() => ({
    icon: Users,
    name: "Sales AI Agent",
    tagline: "Turn website visitors into booked meetings—on autopilot",
    capabilities: [
      "Qualifies leads in real-time so you only talk to serious buyers",
      "Sends personalized follow-ups that don't feel automated",
      "Recovers abandoned carts and re-engages dead leads",
      "Plugs into your CRM, email, and calendar tools seamlessly",
      "Works 24/7 so you never miss a hot lead again",
      "Provides real-time lead scoring and pipeline insights"
    ],
    pricing: [
      { tier: "Starter", monthly: "$179", setup: "$2,200", details: "Core lead qualification & follow-ups" },
      { tier: "Pro", monthly: "$399", setup: "$3,500", details: "Full sequences + lead scoring + CRM sync", popular: true },
      { tier: "Enterprise", monthly: "$649", setup: "$5,900", details: "Multi-channel outreach + A/B testing + priority support" }
    ]
  }), []);

  const testimonial = useMemo(() => ({
    quote: "We were drowning in lead follow-ups—losing deals just because we couldn't respond fast enough. Now our AI handles first contact instantly, and our sales team closes 35% more deals. They paid for themselves in the first month.",
    author: "Erik Sandoval",
    title: "President, Luigi Trucking Insurance",
    metric: "35% more closed deals"
  }), []);

  const faqs = useMemo(() => [
    { q: "I'm not technical. Will this work for me?", a: "Absolutely. We built this for busy business owners, not engineers. We handle all the technical stuff—you just tell us what you need and show up for a few calls. Most clients are surprised how painless it is." },
    { q: "How fast can I get started?", a: "Most clients are live within 2-4 weeks. We move fast because we know your time is money. After a quick discovery call, we get to work immediately." },
    { q: "Will the AI sound like a robot?", a: "No. We train each AI on your business, your tone, and your way of talking to customers. People often can't tell they're chatting with AI—that's the whole point." },
    { q: "What if something goes wrong?", a: "We've got your back. All plans include support, and Pro/Enterprise clients get priority access plus regular check-ins to make sure everything runs smoothly." }
  ], []);

  const process = useMemo(() => [
    { icon: MessageSquare, title: "Quick Call", desc: "Tell us what's slowing you down" },
    { icon: BarChart3, title: "Custom Plan", desc: "We design your AI solution" },
    { icon: Zap, title: "We Build It", desc: "Setup, integration, testing—handled" },
    { icon: Shield, title: "You Win", desc: "Go live with ongoing support" }
  ], []);

  const navItems = ['Services', 'Process', 'Testimonials', 'FAQ'];

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-x-hidden">
      <style>{`
        .card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); }
        .card-hover:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.12); }
        .text-gradient { background: linear-gradient(135deg, #fff 0%, #94a3b8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        html { scroll-behavior: smooth; }
      `}</style>

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-zinc-950/80 backdrop-blur-md border-b border-white/5 py-3' : 'bg-transparent py-5'}`} role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Logo size="default" />
          <div className="hidden md:flex items-center gap-8">
            {navItems.map(item => (
              <button key={item} onClick={() => scrollTo(item.toLowerCase())} className="text-zinc-400 hover:text-white transition relative group" type="button" aria-label={`Navigate to ${item} section`}>
                {item}<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-400 transition-all group-hover:w-full" aria-hidden="true" />
              </button>
            ))}
            <Link to="/try-it-free" className="text-emerald-300 px-5 py-2 rounded-full text-sm font-medium transition hover:text-emerald-200 border border-emerald-500/30 hover:border-emerald-400/50">Try It Free</Link>
            <button onClick={() => scrollTo('cta')} className="bg-white text-black px-6 py-2.5 rounded-full font-medium hover:bg-zinc-100 transition" type="button">Book a Strategy Call</button>
          </div>
          <button className="md:hidden p-2 rounded-lg border border-white/10" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} type="button" aria-expanded={mobileMenuOpen} aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}>{mobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-zinc-900 border border-white/10 mx-4 mt-2 rounded-2xl p-6 space-y-4" role="menu">
            {navItems.map(item => (<button key={item} onClick={() => scrollTo(item.toLowerCase())} className="block w-full text-left text-zinc-300 hover:text-white py-2" type="button" role="menuitem">{item}</button>))}
            <Link to="/try-it-free" className="block w-full text-center text-emerald-300 px-5 py-3 rounded-full text-sm font-medium border border-emerald-500/30" role="menuitem" onClick={() => setMobileMenuOpen(false)}>Try It Free</Link>
            <button onClick={() => scrollTo('cta')} className="w-full bg-white text-black px-5 py-3 rounded-full font-medium" type="button" role="menuitem">Book a Strategy Call</button>
          </div>
        )}
      </nav>

      <section className="min-h-screen flex items-center justify-center relative pt-20" aria-labelledby="hero-heading">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-950" aria-hidden="true" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <FadeInSection>
            <div className="inline-flex items-center gap-2 border border-emerald-500/20 bg-emerald-500/5 px-5 py-2.5 rounded-full text-sm mb-8 cursor-default">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" aria-hidden="true" /><span className="text-emerald-300">Expert AI &amp; Automation Team</span><span className="text-zinc-500 mx-1">•</span><span className="text-zinc-400">Chicago, IL</span>
            </div>
          </FadeInSection>
          <FadeInSection delay={100}><h1 id="hero-heading" className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight tracking-tight">Your AI Sales Team<br /><span className="text-gradient">Built &amp; Managed For You</span></h1></FadeInSection>
          <FadeInSection delay={200}><p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto mb-10 leading-relaxed">We design, build, and manage custom AI sales agents that qualify your leads, follow up instantly, and book meetings — so you never miss another opportunity.</p></FadeInSection>
          <FadeInSection delay={300}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => scrollTo('cta')} className="group bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-zinc-100 transition flex items-center justify-center gap-2" type="button">Book a Strategy Call <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" /></button>
              <button onClick={() => scrollTo('how-it-works')} className="border border-white/15 bg-white/5 px-8 py-4 rounded-full font-semibold text-lg transition hover:bg-white/10" type="button">See How It Works</button>
            </div>
          </FadeInSection>
          <FadeInSection delay={400}>
            <div className="mt-16 flex flex-wrap justify-center gap-6 md:gap-8 text-sm text-zinc-400">
              <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" aria-hidden="true" /> Chicago-based team</div>
              <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" aria-hidden="true" /> 35% more closed deals for Luigi Trucking</div>
              <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" aria-hidden="true" /> Go live in 2–4 weeks</div>
            </div>
          </FadeInSection>
        </div>
        <button onClick={() => scrollTo('how-it-works')} className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer hover:text-emerald-400 transition" type="button" aria-label="Scroll to learn more"><ChevronDown className="w-6 h-6 text-zinc-500 hover:text-emerald-400" aria-hidden="true" /></button>
      </section>

      <section id="how-it-works" className="py-28 relative" aria-labelledby="how-it-works-heading">
        <div className="max-w-7xl mx-auto px-6">
          <FadeInSection>
            <div className="text-center mb-16">
              <span className="text-sm uppercase tracking-widest text-emerald-400 mb-4 block">Our Methodology</span>
              <h2 id="how-it-works-heading" className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Capture. Nurture. Close.</h2>
              <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">A three-phase system we build, run, and refine for every client — engineered to turn inbound leads into booked meetings.</p>
            </div>
          </FadeInSection>
          <div className="grid md:grid-cols-3 gap-8 mb-16 relative">
            <div className="hidden md:block absolute top-16 left-[16.666%] right-[16.666%] h-px bg-gradient-to-r from-emerald-500/20 via-emerald-400/40 to-emerald-500/20" aria-hidden="true" />
            {[
              { icon: Zap, phase: 'CAPTURE', title: 'Detect Every Lead, Instantly', desc: 'Your AI agent monitors every channel — forms, ads, messages, missed calls — and engages within seconds. No lead goes unnoticed, day or night.' },
              { icon: MessageSquare, phase: 'NURTURE', title: 'Build Trust on Autopilot', desc: 'Personalized, human-sounding follow-ups deploy across email and SMS. Intelligent multi-touch sequences adapt to each prospect until they are ready to talk.' },
              { icon: Calendar, phase: 'CLOSE', title: 'Book Ready-to-Buy Meetings', desc: 'Only qualified, high-intent leads reach your calendar. You walk into every meeting with context, confidence, and a prospect who is ready to move forward.' },
            ].map((item, idx) => (
              <FadeInSection key={idx} delay={idx * 150}>
                <div className="card card-hover rounded-2xl p-8 text-center relative transition h-full">
                  <div className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-5 bg-emerald-500/10 border border-emerald-500/20 relative z-10">
                    <item.icon className="w-6 h-6 text-emerald-400" aria-hidden="true" />
                  </div>
                  <div className="text-xs font-semibold text-emerald-400/80 tracking-[0.2em] mb-3">{item.phase}</div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
          <FadeInSection delay={500}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Clock, text: 'Responds in under 60 seconds' },
                { icon: Shield, text: 'Every lead gets a response' },
                { icon: Zap, text: 'Integrates with your CRM & tools' },
                { icon: Users, text: 'Managed by our Chicago team' },
              ].map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-3 card rounded-xl p-4 transition hover:bg-white/5">
                  <div className="w-8 h-8 bg-emerald-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                  </div>
                  <span className="text-sm font-medium">{benefit.text}</span>
                </div>
              ))}
            </div>
          </FadeInSection>
        </div>
      </section>

      <section id="testimonials" className="py-28 border-t border-white/5" aria-labelledby="testimonials-heading">
        <div className="max-w-7xl mx-auto px-6">
          <FadeInSection>
            <div className="text-center mb-14">
              <span className="text-sm uppercase tracking-widest text-emerald-400 mb-4 block">Proven Results</span>
              <h2 id="testimonials-heading" className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Trusted by Chicago Businesses</h2>
              <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">From commercial insurance to counseling to property management — we build AI sales agents that produce measurable results.</p>
            </div>
          </FadeInSection>

          <FadeInSection delay={100}>
            <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16 mb-16 py-8 border-y border-white/5">
              {[
                { src: '/logos/luigi-trucking.svg', alt: 'Luigi Trucking Insurance Agency' },
                { src: '/logos/crown-counseling.svg', alt: 'Crown Counseling' },
                { src: '/logos/prg-management.svg', alt: 'PRG Management' },
              ].map((logo, idx) => (
                <img key={idx} src={logo.src} alt={logo.alt} className="h-10 md:h-12 w-auto object-contain opacity-40 hover:opacity-70 transition-opacity duration-300" />
              ))}
            </div>
          </FadeInSection>

          <FadeInSection delay={200}>
            <div className="grid md:grid-cols-3 gap-5 mb-16">
              {[
                { stat: '35%', label: 'increase in closed deals', detail: 'Luigi Trucking Insurance' },
                { stat: '<60 sec', label: 'first response to every lead', detail: 'Automated, around the clock' },
                { stat: '2–4 wks', label: 'from kickoff to fully live', detail: 'Typical implementation' },
              ].map((item, idx) => (
                <div key={idx} className="card rounded-2xl p-8 text-center cursor-default">
                  <div className="text-4xl font-bold text-emerald-400 mb-2">{item.stat}</div>
                  <div className="text-white font-semibold mb-1">{item.label}</div>
                  <div className="text-zinc-500 text-sm">{item.detail}</div>
                </div>
              ))}
            </div>
          </FadeInSection>

          <FadeInSection delay={300}>
            <figure className="max-w-4xl mx-auto card rounded-2xl p-8 md:p-12">
              <div className="flex items-center justify-between mb-8">
                <div className="flex gap-1" role="img" aria-label="5 star rating">{[...Array(5)].map((_, i) => (<Star key={i} className="w-5 h-5 fill-emerald-400 text-emerald-400" aria-hidden="true" />))}</div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full text-sm font-semibold text-emerald-400">{testimonial.metric}</div>
              </div>
              <blockquote className="text-xl md:text-2xl mb-8 leading-relaxed text-zinc-200">"{testimonial.quote}"</blockquote>
              <figcaption className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center font-bold text-lg text-emerald-400" aria-hidden="true">{testimonial.author.charAt(0)}</div>
                <div>
                  <div className="font-semibold text-lg">{testimonial.author}</div>
                  <div className="text-zinc-400 text-sm">{testimonial.title}</div>
                </div>
              </figcaption>
            </figure>
          </FadeInSection>
        </div>
      </section>

      <section id="about" className="py-28" aria-labelledby="about-heading">
        <div className="max-w-7xl mx-auto px-6">
          <FadeInSection>
            <div className="text-center mb-16">
              <span className="text-sm uppercase tracking-widest text-emerald-400 mb-4 block">The Problem We Solve</span>
              <h2 id="about-heading" className="text-4xl md:text-5xl font-bold tracking-tight mb-4">You're Doing Too Much</h2>
              <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">Answering emails. Chasing leads. Scheduling. Posting content. There's a better way.</p>
            </div>
          </FadeInSection>
          <div className="grid md:grid-cols-3 gap-6">
            {[{ icon: TrendingUp, title: "Close More Deals", desc: "Speed wins deals. When every lead gets a thoughtful reply in under a minute, you win the ones you used to lose to whoever answered first." }, { icon: Users, title: "Never Miss a Lead", desc: "Instant responses at 3am. Personalized follow-ups on autopilot. Your AI works every hour you don't." }, { icon: Clock, title: "Get Your Life Back", desc: "Stop drowning in busywork. Hand off the chasing, the scheduling, and the follow-up—and get your evenings and weekends back." }].map((item, idx) => (
              <FadeInSection key={idx} delay={idx * 100}>
                <div className="card card-hover rounded-2xl p-8 h-full transition">
                  <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6"><item.icon className="w-7 h-7 text-emerald-400" aria-hidden="true" /></div>
                  <h3 className="text-2xl font-semibold mb-4">{item.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{item.desc}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="py-28 border-t border-white/5" aria-labelledby="process-heading">
        <div className="max-w-7xl mx-auto px-6">
          <FadeInSection>
            <div className="text-center mb-16">
              <span className="text-sm uppercase tracking-widest text-emerald-400 mb-4 block">Our Process</span>
              <h2 id="process-heading" className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Live in Weeks, Not Months</h2>
              <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">We handle everything. You just show up for a few calls.</p>
            </div>
          </FadeInSection>
          <div className="grid md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent -translate-y-1/2" aria-hidden="true" />
            {process.map((step, idx) => (
              <FadeInSection key={idx} delay={idx * 150}>
                <div className="relative text-center">
                  <div className="w-20 h-20 card mx-auto rounded-2xl flex items-center justify-center mb-6"><step.icon className="w-8 h-8 text-zinc-300" aria-hidden="true" /></div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm" aria-label={`Step ${idx + 1}`}>{idx + 1}</div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-zinc-400 text-sm">{step.desc}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="py-28" aria-labelledby="services-heading">
        <div className="max-w-7xl mx-auto px-6">
          <FadeInSection>
            <div className="text-center mb-16">
              <span className="text-sm uppercase tracking-widest text-emerald-400 mb-4 block">Our AI Sales Agent</span>
              <h2 id="services-heading" className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Your 24/7 Sales Machine</h2>
              <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">An AI agent that qualifies leads, follows up instantly, and books meetings—so your team only talks to serious buyers.</p>
            </div>
          </FadeInSection>
          <FadeInSection delay={200}>
            <div className="card rounded-2xl overflow-hidden">
              <div className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row md:items-start gap-6 mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-white to-zinc-300 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-8 h-8 text-black" aria-hidden="true" />
                  </div>
                  <div><h3 className="text-3xl font-bold mb-2">{salesAgent.name}</h3><p className="text-zinc-400 text-lg">{salesAgent.tagline}</p></div>
                </div>
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2"><Sparkles className="w-4 h-4" aria-hidden="true" /> What It Does For You</h4>
                    <ul className="space-y-3">
                      {salesAgent.capabilities.map((cap, idx) => (
                        <li key={idx} className="flex items-center gap-4 border border-white/5 bg-white/[0.02] rounded-xl p-4 transition hover:bg-white/5">
                          <div className="w-8 h-8 bg-emerald-500/15 rounded-lg flex items-center justify-center flex-shrink-0"><Check className="w-4 h-4 text-emerald-400" aria-hidden="true" /></div>
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-zinc-500 mb-6">Choose Your Plan</h4>
                    <div className="space-y-4" role="radiogroup" aria-label="Pricing plans">
                      {salesAgent.pricing.map((plan, idx) => {
                        const isSelected = selectedTier === idx;
                        return (
                          <button key={idx} onClick={() => setSelectedTier(idx)} className={`w-full rounded-2xl p-5 flex items-center justify-between transition-all duration-300 cursor-pointer ${isSelected ? 'bg-white text-black shadow-lg shadow-white/10' : 'card hover:bg-white/5'}`} type="button" role="radio" aria-checked={isSelected}>
                            <div className="text-left">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-lg">{plan.tier}</span>
                                {plan.popular && <span className={`text-xs px-2 py-0.5 rounded-full ${isSelected ? 'bg-black text-white' : 'bg-white/15 text-white'}`}>Popular</span>}
                              </div>
                              <div className={`text-sm ${isSelected ? 'text-zinc-600' : 'text-zinc-400'}`}>{plan.details}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold">{plan.monthly}<span className={`text-sm font-normal ${isSelected ? 'text-zinc-600' : 'text-zinc-400'}`}>/mo</span></div>
                              <div className={`text-sm ${isSelected ? 'text-zinc-500' : 'text-zinc-500'}`}>Setup: {plan.setup}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-4 items-center">
                  <button onClick={() => scrollTo('cta')} className="bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-zinc-100 transition flex items-center justify-center gap-2" type="button">Get the {salesAgent.pricing[selectedTier].tier} Plan <ChevronRight className="w-4 h-4" aria-hidden="true" /></button>
                  <Link to="/try-it-free" className="text-emerald-300 px-8 py-4 rounded-full font-semibold transition flex items-center justify-center gap-2 border border-emerald-500/30 hover:border-emerald-400/50 hover:bg-emerald-500/5">Try It Free <ArrowRight className="w-4 h-4" aria-hidden="true" /></Link>
                  <span className="text-zinc-500 text-sm">{salesAgent.pricing[selectedTier].monthly}/mo • Cancel anytime</span>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      <section id="faq" className="py-28 border-t border-white/5" aria-labelledby="faq-heading">
        <div className="max-w-3xl mx-auto px-6">
          <FadeInSection>
            <div className="text-center mb-16">
              <span className="text-sm uppercase tracking-widest text-emerald-400 mb-4 block">FAQ</span>
              <h2 id="faq-heading" className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Got Questions?</h2>
            </div>
          </FadeInSection>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <FadeInSection key={idx} delay={idx * 100}>
                <div className="card rounded-2xl overflow-hidden transition hover:bg-white/5">
                  <button onClick={() => setActiveFaq(activeFaq === idx ? null : idx)} className="w-full p-6 flex items-center justify-between text-left" type="button" aria-expanded={activeFaq === idx}>
                    <span className="font-semibold text-lg pr-4">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${activeFaq === idx ? 'rotate-180' : ''}`} aria-hidden="true" />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${activeFaq === idx ? 'max-h-48 pb-6' : 'max-h-0'}`} aria-hidden={activeFaq !== idx}><p className="px-6 text-zinc-400 leading-relaxed">{faq.a}</p></div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      <section id="cta" className="py-28" aria-labelledby="cta-heading">
        <div className="max-w-5xl mx-auto px-6">
          <FadeInSection>
            <div className="card rounded-2xl p-12 md:p-16 text-center border-emerald-500/15">
              <h2 id="cta-heading" className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Let's See If We're a Fit</h2>
              <p className="text-xl text-zinc-300 mb-10 max-w-2xl mx-auto leading-relaxed">Book a free 30-minute strategy call. We'll audit your current lead flow and show you exactly where AI can make an impact — no pressure, no jargon.</p>
              <a href={EXTERNAL_URLS.appointments} {...SECURE_LINK_PROPS} className="bg-white text-black px-10 py-5 rounded-full font-semibold text-lg hover:bg-zinc-100 transition inline-flex items-center gap-3">Book Your Free Strategy Call <ArrowRight className="w-5 h-5" aria-hidden="true" /></a>
              <p className="text-zinc-500 text-sm mt-6">Free • 30 minutes • Zero obligation</p>
            </div>
          </FadeInSection>
        </div>
      </section>

      <footer className="py-12 border-t border-white/5" role="contentinfo">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <Logo size="small" />
            <nav className="flex gap-8 text-zinc-400" aria-label="Footer navigation">
              <button onClick={() => scrollTo('services')} className="hover:text-white transition" type="button">Services</button>
              <button onClick={() => scrollTo('process')} className="hover:text-white transition" type="button">About</button>
              <Link to="/try-it-free" className="hover:text-white transition">Try It Free</Link>
              <a href={EXTERNAL_URLS.contact} {...SECURE_LINK_PROPS} className="hover:text-white transition">Contact</a>
            </nav>
            <div className="text-zinc-500 text-sm">© 2025 The Chicago AI Group. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainSite />} />
      <Route path="/try-it-free" element={<TryItFree />} />
    </Routes>
  );
}
