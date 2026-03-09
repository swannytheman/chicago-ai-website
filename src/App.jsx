import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Check, Star, Menu, X, ArrowRight, Zap, Clock, TrendingUp, ChevronDown, MessageSquare, BarChart3, Shield, Users } from 'lucide-react';

const EXTERNAL_URLS = {
  appointments: 'https://www.chicagoaigroup.com/appointments',
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
        <circle cx="50" cy="50" r="10" fill="#3b82f6" filter="url(#blueGlow)" />
        <circle cx="50" cy="50" r="6" fill="#60a5fa" />
        <polygon points="82,38 84,42 88,42 85,45 86,49 82,46 78,49 79,45 76,42 80,42" fill="#60a5fa" />
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

const AnimatedCounter = ({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const currentRef = ref.current;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true); }, { threshold: 0.1 });
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); observer.disconnect(); };
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
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
    <div ref={ref} className={`transition-all duration-700 ${className}`} style={{ transitionDelay: `${delay}ms`, opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(30px)' }}>
      {children}
    </div>
  );
};

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

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

  useEffect(() => {
    const interval = setInterval(() => setCurrentTestimonial(prev => (prev + 1) % 3), 5000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = useMemo(() => [
    { quote: "We were drowning in lead follow-ups—losing deals because we couldn't respond fast enough. Now our AI handles first contact instantly, and our sales team closes 35% more deals. They paid for themselves in the first month.", author: "Erik Sandoval", title: "President, Luigi Trucking Insurance", metric: "35% more closed deals" },
    { quote: "I'll be honest—I thought AI would make us sound like a call center. I was wrong. Customers actually compliment our 'fast, friendly responses' now. They have no idea it's AI. That's when I knew we made the right call.", author: "Sarah Chen", title: "CEO, Midwest Consulting Group", metric: "Response time: 4 hrs to 30 sec" },
    { quote: "I used to spend my Sundays writing proposals. Now the AI drafts them in minutes and I review. I got 20 hours of my week back—and my weekends. My only regret is not doing this sooner.", author: "Michael Torres", title: "Operations Director, BuildRight Construction", metric: "20 hours saved per week" }
  ], []);

  const faqs = useMemo(() => [
    { q: "I'm not technical. Will this work for me?", a: "Absolutely. We built this for busy business owners, not engineers. We handle all the technical setup — you tell us about your business and show up for a few calls. Most clients are surprised how painless it is." },
    { q: "How fast can I get started?", a: "Discovery takes about a week. The Pilot runs for two weeks after that. Most clients have a fully automated system running within 4-6 weeks of our first conversation." },
    { q: "Will the AI sound like a robot?", a: "No. We train each system on your business, your tone, and the way you talk to customers. People regularly can't tell the follow-up emails are automated — that's the whole point." },
    { q: "What if it doesn't work for my business?", a: "That's what the Pilot phase is for. You see real results with real leads before committing to the full build. And Discovery gives you a complete toolkit you can use manually even if you never automate." },
    { q: "What does the Lead Flow Blueprint include?", a: "A full audit of your lead journey, the math on what slow follow-up is costing you, three ready-to-use email templates written in your voice, a lead tracking spreadsheet, and a 90-day action plan. It's a complete toolkit — yours to keep whether you move forward or not." }
  ], []);

  const process = useMemo(() => [
    { icon: MessageSquare, title: "Discovery", desc: "We audit your lead flow and find the leaks" },
    { icon: Zap, title: "Pilot", desc: "One sequence, two weeks — prove it works" },
    { icon: BarChart3, title: "Full Build", desc: "Complete system across all lead sources" },
    { icon: Shield, title: "Ongoing", desc: "We optimize while you focus on your business" }
  ], []);

  const phases = useMemo(() => [
    {
      number: 1,
      headline: "Lead Flow Blueprint",
      subheadline: "See exactly where you're losing money.",
      price: "$350–$500",
      priceLabel: "one-time",
      description: "A deep dive into your lead flow, follow-up process, and where revenue is leaking. You walk away with a complete toolkit — whether you move forward with us or not.",
      includes: [
        "60-90 minute strategy session",
        "Full audit of your current lead flow",
        "Revenue leak calculation with your actual numbers",
        "3 ready-to-use follow-up email templates written in your voice",
        "Lead tracking spreadsheet built for your business",
        "90-day follow-up action plan"
      ],
      cta: "Start with Discovery",
      highlight: true,
      accent: "blue-400"
    },
    {
      number: 2,
      headline: "Prove It Works",
      subheadline: "One lead source. Two weeks. Real results.",
      price: "$500–$750",
      priceLabel: "one-time",
      description: "We set up one automated follow-up sequence for your highest-volume lead source and run it live. You see exactly how many leads get followed up with, how fast, and what the responses look like.",
      includes: [
        "One automated follow-up sequence built and deployed",
        "AI-generated emails tailored to your voice and customers",
        "Full lead tracking for the pilot period",
        "Performance report showing leads recovered",
        "Everything we build is yours to keep"
      ],
      cta: null,
      highlight: false,
      accent: "blue-500"
    },
    {
      number: 3,
      headline: "The Complete System",
      subheadline: "Every lead source. Every follow-up. Fully automated.",
      price: "$1,500–$3,000",
      priceLabel: "one-time",
      description: "We build the entire system across all your lead sources — instant response, multi-touch follow-up sequences, full lead tracking, and smart scheduling. Tested, deployed, and running alongside your team within two weeks.",
      includes: [
        "Automated follow-up across all lead sources",
        "Personalized email sequences for each service type",
        "Complete lead tracking and management dashboard",
        "Smart scheduling — right message, right time",
        "Two weeks of hands-on launch support",
        "Full documentation for your team"
      ],
      cta: null,
      highlight: false,
      accent: "blue-600"
    },
    {
      number: 4,
      headline: "Never Think About It Again",
      subheadline: "We keep the system running and improving.",
      price: "$297–$497",
      priceLabel: "/month",
      description: "We monitor, optimize, and evolve your system as your business grows. Prompts get refined based on real response data. New sequences get added as you expand.",
      includes: [
        "Continuous system monitoring and maintenance",
        "Prompt optimization based on actual performance data",
        "New sequences as your business needs evolve",
        "Priority support — issues resolved same business day",
        "Monthly performance report"
      ],
      cta: null,
      highlight: false,
      accent: "blue-500"
    }
  ], []);

  const navItems = ['Services', 'Process', 'Testimonials', 'FAQ'];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
        @keyframes pulse-glow { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.8; } }
        @keyframes blue-pulse { 0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); } 50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float 6s ease-in-out infinite; animation-delay: -3s; }
        .animate-pulse-glow { animation: pulse-glow 4s ease-in-out infinite; }
        .animate-blue-pulse { animation: blue-pulse 3s ease-in-out infinite; }
        .glass { background: rgba(255,255,255,0.05); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); }
        .glass-hover:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); }
        .glow { box-shadow: 0 0 40px rgba(255,255,255,0.1); }
        .glow-hover:hover { box-shadow: 0 0 60px rgba(255,255,255,0.15); }
        .text-gradient { background: linear-gradient(135deg, #fff 0%, #94a3b8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .btn-shine { position: relative; overflow: hidden; }
        .btn-shine::after { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent); transform: rotate(45deg); transition: 0.5s; }
        .btn-shine:hover::after { left: 100%; }
        html { scroll-behavior: smooth; }
      `}</style>

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass py-3' : 'bg-transparent py-5'}`} role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Logo size="default" />
          <div className="hidden md:flex items-center gap-8">
            {navItems.map(item => (
              <button key={item} onClick={() => scrollTo(item.toLowerCase())} className="text-gray-400 hover:text-white transition relative group" type="button" aria-label={`Navigate to ${item} section`}>
                {item}<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-full" aria-hidden="true" />
              </button>
            ))}
            <button onClick={() => scrollTo('cta')} className="btn-shine bg-white text-black px-6 py-2.5 rounded-full font-medium hover:bg-gray-100 transition transform hover:scale-105" type="button">Book a Call</button>
          </div>
          <button className="md:hidden p-2 glass rounded-lg" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} type="button" aria-expanded={mobileMenuOpen} aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}>{mobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden glass mx-4 mt-2 rounded-2xl p-6 space-y-4" role="menu">
            {navItems.map(item => (<button key={item} onClick={() => scrollTo(item.toLowerCase())} className="block w-full text-left text-gray-300 hover:text-white py-2" type="button" role="menuitem">{item}</button>))}
            <button onClick={() => scrollTo('cta')} className="w-full bg-white text-black px-5 py-3 rounded-full font-medium" type="button" role="menuitem">Book a Call</button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative pt-20" aria-labelledby="hero-heading">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-black" aria-hidden="true" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse-glow" aria-hidden="true" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '-2s' }} aria-hidden="true" />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-blue-400/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '-1s' }} aria-hidden="true" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-30" aria-hidden="true">
          <div className="absolute inset-0 border border-blue-500/20 rounded-full animate-float" />
          <div className="absolute inset-12 border border-white/10 rounded-full animate-float-delayed" />
          <div className="absolute inset-24 border border-blue-500/10 rounded-full animate-float" style={{ animationDelay: '-1.5s' }} />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <FadeInSection>
            <div className="inline-flex items-center gap-2 glass px-5 py-2.5 rounded-full text-sm mb-8 hover:bg-white/10 transition cursor-default">
              <Zap className="w-4 h-4 text-blue-400" aria-hidden="true" /><span>AI-Powered Lead Follow-Up for Small Business</span><span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" aria-hidden="true" />
            </div>
          </FadeInSection>
          <FadeInSection delay={100}><h1 id="hero-heading" className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight tracking-tight">Stop Losing Leads<br /><span className="text-gradient">to Slow Follow-Up</span></h1></FadeInSection>
          <FadeInSection delay={200}><p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">Every lead gets a personalized response in under 60 seconds — even at 9pm, even on weekends, even during your busiest week.</p></FadeInSection>
          <FadeInSection delay={300}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => scrollTo('cta')} className="btn-shine group bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition transform hover:scale-105 flex items-center justify-center gap-2" type="button">Book a Free Call <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" /></button>
              <button onClick={() => scrollTo('services')} className="glass glass-hover px-8 py-4 rounded-full font-semibold text-lg transition transform hover:scale-105" type="button">See How It Works</button>
            </div>
          </FadeInSection>
          <FadeInSection delay={400}>
            <div className="mt-16 flex flex-wrap justify-center gap-6 md:gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-400" aria-hidden="true" /> Zero tech skills needed</div>
              <div className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-400" aria-hidden="true" /> Live in 2-4 weeks</div>
              <div className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-400" aria-hidden="true" /> You keep everything we build</div>
            </div>
          </FadeInSection>
        </div>
        <button onClick={() => scrollTo('about')} className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer hover:text-blue-400 transition" type="button" aria-label="Scroll to learn more"><ChevronDown className="w-6 h-6 text-gray-500 hover:text-blue-400" aria-hidden="true" /></button>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative" aria-label="Statistics">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" aria-hidden="true" />
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[{ value: 60, suffix: ' sec', label: 'average response time' }, { value: 15, suffix: '+', label: 'hours saved per week' }, { value: 10, suffix: 'x', label: 'faster than manual follow-up' }].map((stat, idx) => (
            <FadeInSection key={idx} delay={idx * 100}>
              <div className="glass glow rounded-2xl p-8 text-center hover:bg-white/10 transition transform hover:scale-105 cursor-default">
                <div className="text-5xl font-bold mb-2"><AnimatedCounter end={stat.value} suffix={stat.suffix} /></div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* Problem Section */}
      <section id="about" className="py-24" aria-labelledby="about-heading">
        <div className="max-w-7xl mx-auto px-6">
          <FadeInSection>
            <div className="text-center mb-16">
              <span className="text-sm uppercase tracking-widest text-gray-500 mb-4 block">The Problem We Solve</span>
              <h2 id="about-heading" className="text-4xl md:text-5xl font-bold mb-4">Your Leads Are Going to Competitors</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">A lead that calls at 7pm on Friday and doesn't hear back until Monday has already booked someone else.</p>
            </div>
          </FadeInSection>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: TrendingUp, title: "Revenue Is Leaking", desc: "Every lead that gets a slow response or no response is a job going to whoever answers faster. Most businesses lose $3,000-10,000 per month in missed follow-up alone.", color: "from-blue-500/20" },
              { icon: Clock, title: "You Can't Be Everywhere", desc: "After-hours calls, weekend inquiries, peak-season overflow — the leads that slip through are the ones that come in when you're already busy. That's exactly when you need coverage most.", color: "from-blue-400/20" },
              { icon: Users, title: "No System, No Visibility", desc: "If follow-up depends on memory and bandwidth, leads fall through the cracks invisibly. You don't even know what you're losing because there's nothing tracking it.", color: "from-blue-600/20" }
            ].map((item, idx) => (
              <FadeInSection key={idx} delay={idx * 100}>
                <div className={`glass glow-hover rounded-3xl p-8 h-full transition transform hover:scale-105 hover:-translate-y-2 bg-gradient-to-b ${item.color} to-transparent`}>
                  <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center mb-6"><item.icon className="w-7 h-7" aria-hidden="true" /></div>
                  <h3 className="text-2xl font-semibold mb-4">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-24 bg-gradient-to-b from-transparent via-white/5 to-transparent" aria-labelledby="process-heading">
        <div className="max-w-7xl mx-auto px-6">
          <FadeInSection>
            <div className="text-center mb-16">
              <span className="text-sm uppercase tracking-widest text-gray-500 mb-4 block">How It Works</span>
              <h2 id="process-heading" className="text-4xl md:text-5xl font-bold mb-4">From First Call to Fully Automated</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">A proven process — not a one-size-fits-all package.</p>
            </div>
          </FadeInSection>
          <div className="grid md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent -translate-y-1/2" aria-hidden="true" />
            {process.map((step, idx) => (
              <FadeInSection key={idx} delay={idx * 150}>
                <div className="relative text-center group">
                  <div className="w-20 h-20 glass glow mx-auto rounded-2xl flex items-center justify-center mb-6 transition transform group-hover:scale-110 group-hover:bg-white/20"><step.icon className="w-8 h-8" aria-hidden="true" /></div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-500/30" aria-label={`Step ${idx + 1}`}>{idx + 1}</div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.desc}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Services / Pricing Section — Phased Engagement */}
      <section id="services" className="py-24" aria-labelledby="services-heading">
        <div className="max-w-7xl mx-auto px-6">
          <FadeInSection>
            <div className="text-center mb-16">
              <span className="text-sm uppercase tracking-widest text-gray-500 mb-4 block">Our Approach</span>
              <h2 id="services-heading" className="text-4xl md:text-5xl font-bold mb-4">A Process That Proves Itself at Every Step</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">You never pay for the next phase until the previous one has earned your trust.</p>
            </div>
          </FadeInSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connector line on desktop */}
            <div className="hidden lg:block absolute top-24 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-400/30 via-blue-500/30 to-blue-600/30" aria-hidden="true" />

            {phases.map((phase, idx) => (
              <FadeInSection key={idx} delay={idx * 150}>
                <div
                  className={`glass rounded-3xl p-6 h-full transition transform hover:scale-105 hover:-translate-y-2 flex flex-col ${
                    phase.highlight
                      ? 'border-blue-400/40 animate-blue-pulse'
                      : 'glow-hover'
                  }`}
                  role="article"
                  aria-label={`Phase ${phase.number}: ${phase.headline}`}
                >
                  {/* Phase number badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 bg-${phase.accent}/20 border border-${phase.accent}/30 rounded-full flex items-center justify-center font-bold text-sm text-${phase.accent}`} style={{ backgroundColor: `rgba(59, 130, 246, ${0.1 + idx * 0.05})`, borderColor: `rgba(59, 130, 246, ${0.2 + idx * 0.05})`, color: '#60a5fa' }}>
                      {phase.number}
                    </div>
                    {phase.highlight && (
                      <span className="text-xs px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 font-semibold">Start Here</span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-3xl font-bold">{phase.price}</span>
                    <span className="text-gray-400 text-sm ml-1">{phase.priceLabel}</span>
                  </div>

                  {/* Headlines */}
                  <h3 className="text-xl font-semibold mb-1">{phase.headline}</h3>
                  <p className="text-gray-400 text-sm mb-4">{phase.subheadline}</p>

                  {/* Description */}
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">{phase.description}</p>

                  {/* What's Included */}
                  <div className="mt-auto">
                    <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-3">What's Included</h4>
                    <ul className="space-y-2">
                      {phase.includes.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                          <span className="text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA for Phase 1 */}
                  {phase.cta && (
                    <a
                      href={EXTERNAL_URLS.appointments}
                      {...SECURE_LINK_PROPS}
                      className="btn-shine mt-6 bg-white text-black px-6 py-3 rounded-full font-semibold text-center hover:bg-gray-100 transition transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      {phase.cta} <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </FadeInSection>
            ))}
          </div>

          {/* Bottom CTA bar */}
          <FadeInSection delay={600}>
            <div className="mt-12 glass glow rounded-2xl p-8 text-center">
              <p className="text-lg text-gray-300 mb-6">Every engagement starts with Discovery. Book a free call to see if we're a fit.</p>
              <a
                href={EXTERNAL_URLS.appointments}
                {...SECURE_LINK_PROPS}
                className="btn-shine bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition transform hover:scale-105 inline-flex items-center gap-2"
              >
                Book a Free Call <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </a>
              <p className="text-gray-500 text-sm mt-4">Free - 30 minutes - Zero obligation</p>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-gradient-to-b from-transparent via-white/5 to-transparent" aria-labelledby="testimonials-heading">
        <div className="max-w-4xl mx-auto px-6">
          <FadeInSection>
            <div className="text-center mb-16">
              <span className="text-sm uppercase tracking-widest text-gray-500 mb-4 block">Real Results</span>
              <h2 id="testimonials-heading" className="text-4xl md:text-5xl font-bold">They Were Skeptical Too</h2>
            </div>
          </FadeInSection>
          <FadeInSection delay={100}>
            <div className="relative">
              <div className="glass glow rounded-3xl p-8 md:p-12 transition-all duration-500">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-1" role="img" aria-label="5 star rating">{[...Array(5)].map((_, i) => (<Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" aria-hidden="true" />))}</div>
                  <div className="bg-blue-500/20 border border-blue-500/30 px-4 py-2 rounded-full text-sm font-semibold text-blue-400">{testimonials[currentTestimonial].metric}</div>
                </div>
                <blockquote className="text-xl md:text-2xl mb-8 leading-relaxed min-h-[140px]">"{testimonials[currentTestimonial].quote}"</blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center font-bold text-lg" aria-hidden="true">{testimonials[currentTestimonial].author.charAt(0)}</div>
                  <div><div className="font-semibold text-lg">{testimonials[currentTestimonial].author}</div><div className="text-gray-400">{testimonials[currentTestimonial].title}</div></div>
                </div>
              </div>
              <div className="flex justify-center gap-3 mt-8" role="tablist" aria-label="Testimonial navigation">{testimonials.map((_, idx) => (<button key={idx} onClick={() => setCurrentTestimonial(idx)} className={`w-3 h-3 rounded-full transition-all duration-300 ${currentTestimonial === idx ? 'bg-blue-400 w-8' : 'bg-white/30 hover:bg-white/50'}`} type="button" role="tab" aria-selected={currentTestimonial === idx} aria-label={`View testimonial ${idx + 1}`} />))}</div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24" aria-labelledby="faq-heading">
        <div className="max-w-3xl mx-auto px-6">
          <FadeInSection>
            <div className="text-center mb-16">
              <span className="text-sm uppercase tracking-widest text-gray-500 mb-4 block">FAQ</span>
              <h2 id="faq-heading" className="text-4xl md:text-5xl font-bold mb-4">Got Questions?</h2>
            </div>
          </FadeInSection>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <FadeInSection key={idx} delay={idx * 100}>
                <div className="glass rounded-2xl overflow-hidden transition hover:bg-white/10">
                  <button onClick={() => setActiveFaq(activeFaq === idx ? null : idx)} className="w-full p-6 flex items-center justify-between text-left" type="button" aria-expanded={activeFaq === idx}>
                    <span className="font-semibold text-lg pr-4">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${activeFaq === idx ? 'rotate-180' : ''}`} aria-hidden="true" />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${activeFaq === idx ? 'max-h-48 pb-6' : 'max-h-0'}`} aria-hidden={activeFaq !== idx}><p className="px-6 text-gray-400 leading-relaxed">{faq.a}</p></div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-24" aria-labelledby="cta-heading">
        <div className="max-w-5xl mx-auto px-6">
          <FadeInSection>
            <div className="glass glow rounded-3xl p-12 md:p-16 text-center relative overflow-hidden border border-blue-500/20">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 via-transparent to-transparent" aria-hidden="true" />
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl" aria-hidden="true" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" aria-hidden="true" />
              <div className="relative z-10">
                <h2 id="cta-heading" className="text-4xl md:text-5xl font-bold mb-6">Let's See If We're a Fit</h2>
                <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">Book a free 30-minute call. We'll walk through your lead flow, show you where the gaps are, and tell you straight up if what we do would actually help. No pressure, no jargon.</p>
                <a href={EXTERNAL_URLS.appointments} {...SECURE_LINK_PROPS} className="btn-shine bg-white text-black px-10 py-5 rounded-full font-semibold text-lg hover:bg-gray-100 transition transform hover:scale-105 inline-flex items-center gap-3 shadow-lg shadow-blue-500/30">Book Your Free Call <ArrowRight className="w-5 h-5" aria-hidden="true" /></a>
                <p className="text-gray-500 text-sm mt-6">Free - 30 minutes - Zero obligation</p>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      <footer className="py-12 border-t border-white/10" role="contentinfo">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start">
              <Logo size="small" />
              <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500 to-blue-400 mt-2 rounded-full" aria-hidden="true" />
            </div>
            <nav className="flex gap-8 text-gray-400" aria-label="Footer navigation">
              <button onClick={() => scrollTo('services')} className="hover:text-white transition" type="button">Services</button>
              <button onClick={() => scrollTo('process')} className="hover:text-white transition" type="button">About</button>
              <a href={EXTERNAL_URLS.contact} {...SECURE_LINK_PROPS} className="hover:text-white transition">Contact</a>
            </nav>
            <div className="text-gray-500 text-sm">&copy; 2025 The Chicago AI Group. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
