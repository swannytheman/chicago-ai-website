import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Bot, Users, Calendar, PenTool, ChevronRight, Check, Star, Menu, X, ArrowRight, Zap, Clock, TrendingUp, ChevronDown, MessageSquare, BarChart3, Shield, Sparkles } from 'lucide-react';
import TryItFree from './TryItFree.jsx';
import Logo from './Logo.jsx';

const EXTERNAL_URLS = {
  appointments: 'https://calendly.com/matt-chicagoaigroup/30min',
  contact: 'https://www.chicagoaigroup.com/contact',
};

const SECURE_LINK_PROPS = {
  target: '_blank',
  rel: 'noopener noreferrer',
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

function MainSite() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [selectedTiers, setSelectedTiers] = useState({0: 1, 1: 1, 2: 1, 3: 1});

  const selectTier = useCallback((productIdx, tierIdx) => {
    setSelectedTiers(prev => ({...prev, [productIdx]: tierIdx}));
  }, []);

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

  const products = useMemo(() => [
    { icon: Bot, name: "Customer Service AI", tagline: "Answer every question instantly—even at 3am", capabilities: ["Responds in natural conversation, not robotic scripts", "Captures leads and qualifies them automatically", "Works on your website, email, and SMS", "Syncs with your CRM so nothing slips through"], pricing: [{ tier: "Starter", monthly: "$129", setup: "$1,800", details: "1,000 conversations/mo" }, { tier: "Pro", monthly: "$299", setup: "$2,900", details: "Unlimited + integrations", popular: true }, { tier: "Enterprise", monthly: "$499", setup: "$4,500", details: "Custom features + priority support" }] },
    { icon: Users, name: "Sales AI", tagline: "Turn website visitors into booked meetings", hasTryItFree: true, capabilities: ["Qualifies leads in real-time so you talk to buyers only", "Sends personalized follow-ups that don't feel automated", "Recovers abandoned carts and dead leads", "Plugs into your CRM and email tools"], pricing: [{ tier: "Starter", monthly: "$179", setup: "$2,200", details: "Core lead qualification" }, { tier: "Pro", monthly: "$399", setup: "$3,500", details: "Full sequences + lead scoring", popular: true }, { tier: "Enterprise", monthly: "$649", setup: "$5,900", details: "Multi-channel + A/B testing" }] },
    { icon: Calendar, name: "Admin AI", tagline: "Automate the busywork you dread every day", capabilities: ["Sorts your email and drafts replies", "Handles scheduling and sends reminders", "Chases unpaid invoices (politely)", "Connects to Google, QuickBooks, and more"], pricing: [{ tier: "Starter", monthly: "$199", setup: "$2,400", details: "Email + calendar automation" }, { tier: "Pro", monthly: "$399", setup: "$3,900", details: "Full suite + weekly reports", popular: true }, { tier: "Enterprise", monthly: "$699", setup: "$6,200", details: "Custom workflows + integrations" }] },
    { icon: PenTool, name: "Marketing AI", tagline: "Create a month of content in minutes", capabilities: ["Writes blogs, social posts, and emails that sound like you", "Learns your brand voice and keeps it consistent", "Schedules posts across all platforms", "Shows you what's working and what's not"], pricing: [{ tier: "Starter", monthly: "$149", setup: "$1,500", details: "20 posts/month" }, { tier: "Pro", monthly: "$299", setup: "$2,800", details: "Unlimited + analytics", popular: true }] }
  ], []);

  const testimonials = useMemo(() => [
    { quote: "We were drowning in lead follow-ups—losing deals just because we couldn't respond fast enough. Now our AI handles first contact instantly, and our sales team closes 35% more deals. They paid for themselves in the first month.", author: "Erik Sandoval", title: "President, Luigi Trucking Insurance", metric: "35% more closed deals" },
    { quote: "I'll be honest—I thought AI would make us sound like a call center. I was wrong. Customers actually compliment our 'fast, friendly responses' now. They have no idea it's AI. That's when I knew we made the right call.", author: "Sarah Chen", title: "CEO, Midwest Consulting Group", metric: "Response time: 4 hrs → 30 sec" },
    { quote: "I used to spend my Sundays writing proposals. Now the AI drafts them in minutes and I just review. I got 20 hours of my week back—and my weekends. My only regret is not doing this sooner.", author: "Michael Torres", title: "Operations Director, BuildRight Construction", metric: "20 hours saved per week" }
  ], []);

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
  const currentProduct = products[activeProduct];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <style>{`
        @keyframes blue-pulse { 0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); } 50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); } }
        .animate-blue-pulse { animation: blue-pulse 3s ease-in-out infinite; }
        @keyframes net-ring       { 0%, 100% { opacity: 0.06; } 50% { opacity: 0.22; } }
        @keyframes net-ring-outer { 0%, 100% { opacity: 0.03; } 50% { opacity: 0.11; } }
        .glass { background: rgba(255,255,255,0.05); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); }
        .glass-hover:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); }
        .glow { box-shadow: 0 0 40px rgba(255,255,255,0.1); }
        .glow-hover:hover { box-shadow: 0 0 60px rgba(255,255,255,0.15); }
        .text-gradient { background: linear-gradient(135deg, #fff 0%, #94a3b8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .btn-shine { position: relative; overflow: hidden; }
        .btn-shine::after { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent); transform: rotate(45deg); transition: 0.5s; }
        .btn-shine:hover::after { left: 100%; }
        html { scroll-behavior: smooth; }
        .try-it-pill { background: linear-gradient(135deg, rgba(59,130,246,0.15), rgba(129,140,248,0.15)); border: 1px solid rgba(59,130,246,0.35); }
        .try-it-pill:hover { background: linear-gradient(135deg, rgba(59,130,246,0.25), rgba(129,140,248,0.25)); border-color: rgba(96,165,250,0.6); }
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
            <Link to="/try-it-free" className="try-it-pill text-blue-300 px-5 py-2 rounded-full text-sm font-medium transition">
              Try It Free ✦
            </Link>
            <button onClick={() => scrollTo('cta')} className="btn-shine bg-white text-black px-6 py-2.5 rounded-full font-medium hover:bg-gray-100 transition transform hover:scale-105" type="button">Book a Call</button>
          </div>
          <button className="md:hidden p-2 glass rounded-lg" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} type="button" aria-expanded={mobileMenuOpen} aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}>{mobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden glass mx-4 mt-2 rounded-2xl p-6 space-y-4" role="menu">
            {navItems.map(item => (<button key={item} onClick={() => scrollTo(item.toLowerCase())} className="block w-full text-left text-gray-300 hover:text-white py-2" type="button" role="menuitem">{item}</button>))}
            <Link to="/try-it-free" className="block w-full text-center try-it-pill text-blue-300 px-5 py-3 rounded-full text-sm font-medium" role="menuitem" onClick={() => setMobileMenuOpen(false)}>
              Try It Free ✦
            </Link>
            <button onClick={() => scrollTo('cta')} className="w-full bg-white text-black px-5 py-3 rounded-full font-medium" type="button" role="menuitem">Book a Call</button>
          </div>
        )}
      </nav>

      <section className="min-h-screen flex items-center justify-center relative pt-20" aria-labelledby="hero-heading">
        {/* Deep navy-black base — fades to pure black at the section fold */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080b12] to-black" aria-hidden="true" />
        {/* Single asymmetric bloom — upper-right only, not scattered */}
        <div className="absolute -top-32 -right-32 w-[640px] h-[640px]" style={{ background: 'radial-gradient(circle, rgba(29,78,216,0.14) 0%, transparent 62%)' }} aria-hidden="true" />
        {/* Network graph — echoes the logo's neural-network motif at hero scale */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <filter id="hglow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {/* Edges — perimeter top */}
          <line x1="88"  y1="88"  x2="440"  y2="40"  stroke="#94a3b8" strokeWidth="0.7" strokeOpacity="0.07" />
          <line x1="440" y1="40"  x2="780"  y2="110" stroke="#94a3b8" strokeWidth="0.7" strokeOpacity="0.07" />
          <line x1="780" y1="110" x2="1120" y2="50"  stroke="#94a3b8" strokeWidth="0.7" strokeOpacity="0.07" />
          {/* Edges — approaching hot node E (blue-tinted) */}
          <line x1="1120" y1="50"  x2="1340" y2="195" stroke="#3b82f6" strokeWidth="0.8" strokeOpacity="0.14" />
          {/* Edges — radiating from hot node E */}
          <line x1="1340" y1="195" x2="1410" y2="490" stroke="#3b82f6" strokeWidth="0.8" strokeOpacity="0.13" />
          <line x1="1340" y1="195" x2="1120" y2="420" stroke="#3b82f6" strokeWidth="0.7" strokeOpacity="0.10" />
          {/* Edges — perimeter right and bottom */}
          <line x1="1410" y1="490" x2="1270" y2="760" stroke="#94a3b8" strokeWidth="0.7" strokeOpacity="0.07" />
          <line x1="1270" y1="760" x2="700"  y2="860" stroke="#94a3b8" strokeWidth="0.7" strokeOpacity="0.06" />
          <line x1="700"  y1="860" x2="220"  y2="820" stroke="#94a3b8" strokeWidth="0.7" strokeOpacity="0.06" />
          {/* Edges — perimeter left */}
          <line x1="220"  y1="820" x2="40"   y2="530" stroke="#94a3b8" strokeWidth="0.7" strokeOpacity="0.07" />
          <line x1="40"   y1="530" x2="120"  y2="310" stroke="#94a3b8" strokeWidth="0.7" strokeOpacity="0.07" />
          <line x1="120"  y1="310" x2="88"   y2="88"  stroke="#94a3b8" strokeWidth="0.7" strokeOpacity="0.06" />
          {/* Edges — interior diagonals for depth */}
          <line x1="440"  y1="40"  x2="120"  y2="310" stroke="#94a3b8" strokeWidth="0.6" strokeOpacity="0.05" />
          <line x1="780"  y1="110" x2="1120" y2="420" stroke="#94a3b8" strokeWidth="0.6" strokeOpacity="0.04" />
          <line x1="1120" y1="420" x2="1410" y2="490" stroke="#60a5fa" strokeWidth="0.6" strokeOpacity="0.08" />
          {/* Edge — long-range cross, barely visible, creates depth */}
          <line x1="440"  y1="40"  x2="1270" y2="760" stroke="#94a3b8" strokeWidth="0.5" strokeOpacity="0.025" />
          {/* Nodes — perimeter */}
          <circle cx="88"   cy="88"  r="2"   fill="#e2e8f0" fillOpacity="0.30" />
          <circle cx="440"  cy="40"  r="1.5" fill="#e2e8f0" fillOpacity="0.25" />
          <circle cx="780"  cy="110" r="2.5" fill="#e2e8f0" fillOpacity="0.30" />
          <circle cx="1120" cy="50"  r="1.5" fill="#e2e8f0" fillOpacity="0.25" />
          <circle cx="1410" cy="490" r="2.5" fill="#e2e8f0" fillOpacity="0.28" />
          <circle cx="1270" cy="760" r="2"   fill="#e2e8f0" fillOpacity="0.25" />
          <circle cx="700"  cy="860" r="2"   fill="#e2e8f0" fillOpacity="0.22" />
          <circle cx="220"  cy="820" r="1.5" fill="#e2e8f0" fillOpacity="0.20" />
          <circle cx="40"   cy="530" r="2.5" fill="#e2e8f0" fillOpacity="0.28" />
          <circle cx="120"  cy="310" r="2"   fill="#e2e8f0" fillOpacity="0.25" />
          {/* Node M — warm secondary, mid-right */}
          <circle cx="1120" cy="420" r="7"   fill="none"    stroke="#60a5fa" strokeWidth="0.8" style={{ animation: 'net-ring-outer 5s ease-in-out 0.8s infinite' }} />
          <circle cx="1120" cy="420" r="3"   fill="#60a5fa" fillOpacity="0.35" />
          {/* Node E — hot focal point, upper-right — two rings pulse out slowly */}
          <circle cx="1340" cy="195" r="22"  fill="none"    stroke="#3b82f6" strokeWidth="1"   style={{ animation: 'net-ring-outer 4s ease-in-out 1s infinite' }} />
          <circle cx="1340" cy="195" r="13"  fill="none"    stroke="#3b82f6" strokeWidth="1.2" style={{ animation: 'net-ring 4s ease-in-out infinite' }} />
          <circle cx="1340" cy="195" r="5"   fill="#3b82f6" fillOpacity="0.75" filter="url(#hglow)" />
          <circle cx="1340" cy="195" r="3"   fill="#93c5fd" fillOpacity="0.90" />
        </svg>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <FadeInSection>
            <div className="inline-flex items-center gap-2 glass px-5 py-2.5 rounded-full text-sm mb-8 hover:bg-white/10 transition cursor-default">
              <Zap className="w-4 h-4 text-blue-400" aria-hidden="true" /><span>AI That Actually Works for Small Business</span><span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" aria-hidden="true" />
            </div>
          </FadeInSection>
          <FadeInSection delay={100}><h1 id="hero-heading" className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight tracking-tight">Grow Your Business<br /><span className="text-gradient">Without Growing Your Team</span></h1></FadeInSection>
          <FadeInSection delay={200}><p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">AI agents that handle customer service, sales, admin, and marketing—so you can focus on what you do best.</p></FadeInSection>
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
              <div className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-400" aria-hidden="true" /> White-glove setup</div>
            </div>
          </FadeInSection>
        </div>
        <button onClick={() => scrollTo('about')} className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer hover:text-blue-400 transition" type="button" aria-label="Scroll to learn more"><ChevronDown className="w-6 h-6 text-gray-500 hover:text-blue-400" aria-hidden="true" /></button>
      </section>

      <section className="py-20 relative" aria-label="Statistics">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" aria-hidden="true" />
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[{ value: 40, suffix: '%', label: 'average revenue increase' }, { value: 15, suffix: '+', label: 'hours saved per week' }, { value: 24, suffix: '/7', label: 'always-on AI support' }].map((stat, idx) => (
            <FadeInSection key={idx} delay={idx * 100}>
              <div className="glass glow rounded-2xl p-8 text-center hover:bg-white/10 transition transform hover:scale-105 cursor-default">
                <div className="text-5xl font-bold mb-2"><AnimatedCounter end={stat.value} suffix={stat.suffix} /></div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </section>

      <section id="about" className="py-24" aria-labelledby="about-heading">
        <div className="max-w-7xl mx-auto px-6">
          <FadeInSection>
            <div className="text-center mb-16">
              <span className="text-sm uppercase tracking-widest text-gray-500 mb-4 block">The Problem We Solve</span>
              <h2 id="about-heading" className="text-4xl md:text-5xl font-bold mb-4">You're Doing Too Much</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">Answering emails. Chasing leads. Scheduling. Posting content. There's a better way.</p>
            </div>
          </FadeInSection>
          <div className="grid md:grid-cols-3 gap-6">
            {[{ icon: TrendingUp, title: "Make More Money", desc: "AI finds opportunities you're missing—smarter pricing, faster follow-ups, upsells that actually convert. Most clients see 20-40% more revenue.", color: "from-blue-500/20" }, { icon: Users, title: "Never Miss a Lead", desc: "Instant responses at 3am. Personalized follow-ups on autopilot. Your AI works every hour you don't.", color: "from-blue-400/20" }, { icon: Clock, title: "Get Your Life Back", desc: "Stop drowning in busywork. Our clients reclaim 15+ hours every week for strategy, family, or actually taking a vacation.", color: "from-blue-600/20" }].map((item, idx) => (
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

      <section id="process" className="py-24 bg-gradient-to-b from-transparent via-white/5 to-transparent" aria-labelledby="process-heading">
        <div className="max-w-7xl mx-auto px-6">
          <FadeInSection>
            <div className="text-center mb-16">
              <span className="text-sm uppercase tracking-widest text-gray-500 mb-4 block">How It Works</span>
              <h2 id="process-heading" className="text-4xl md:text-5xl font-bold mb-4">Live in Weeks, Not Months</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">We handle everything. You just show up for a few calls.</p>
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

      <section id="services" className="py-24" aria-labelledby="services-heading">
        <div className="max-w-7xl mx-auto px-6">
          <FadeInSection>
            <div className="text-center mb-16">
              <span className="text-sm uppercase tracking-widest text-gray-500 mb-4 block">AI Agents</span>
              <h2 id="services-heading" className="text-4xl md:text-5xl font-bold mb-4">Pick Your Superpower</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">Four AI agents. Each one replaces hours of work you hate doing.</p>
            </div>
          </FadeInSection>
          <FadeInSection delay={100}>
            <div className="flex flex-wrap justify-center gap-3 mb-12" role="tablist" aria-label="Product categories">
              {products.map((product, idx) => (
                <button key={idx} onClick={() => setActiveProduct(idx)} className={`flex items-center gap-2 px-6 py-3 rounded-full transition transform hover:scale-105 ${activeProduct === idx ? 'bg-white text-black shadow-lg shadow-blue-500/20' : 'glass glass-hover'}`} type="button" role="tab" aria-selected={activeProduct === idx}>
                  <product.icon className="w-4 h-4" aria-hidden="true" /><span className="hidden sm:inline">{product.name.split(' ').slice(0, 2).join(' ')}</span>
                </button>
              ))}
            </div>
          </FadeInSection>
          <FadeInSection delay={200}>
            <div className="glass glow rounded-3xl overflow-hidden" role="tabpanel">
              <div className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row md:items-start gap-6 mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-white to-gray-300 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20 animate-blue-pulse">
                    {(() => { const Icon = currentProduct.icon; return <Icon className="w-8 h-8 text-black" aria-hidden="true" />; })()}
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold mb-2">{currentProduct.name}</h3>
                    <p className="text-gray-400 text-lg">{currentProduct.tagline}</p>
                  </div>
                </div>
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-6 flex items-center gap-2"><Sparkles className="w-4 h-4" aria-hidden="true" /> What It Does For You</h4>
                    <ul className="space-y-4">
                      {currentProduct.capabilities.map((cap, idx) => (
                        <li key={idx} className="flex items-center gap-4 glass rounded-xl p-4 hover:bg-white/10 transition">
                          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0"><Check className="w-4 h-4 text-blue-400" aria-hidden="true" /></div>
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-6">Choose Your Plan</h4>
                    <div className="space-y-4" role="radiogroup" aria-label="Pricing plans">
                      {currentProduct.pricing.map((plan, idx) => {
                        const isSelected = selectedTiers[activeProduct] === idx;
                        return (
                          <button key={idx} onClick={() => selectTier(activeProduct, idx)} className={`w-full rounded-2xl p-5 flex items-center justify-between transition-all duration-300 transform hover:scale-102 cursor-pointer ${isSelected ? 'bg-white text-black shadow-lg shadow-white/20 scale-102' : 'glass hover:bg-white/15 hover:border-white/30'}`} type="button" role="radio" aria-checked={isSelected}>
                            <div className="text-left">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-lg">{plan.tier}</span>
                                {plan.popular && <span className={`text-xs px-2 py-0.5 rounded-full ${isSelected ? 'bg-black text-white' : 'bg-white/20 text-white'}`}>Popular</span>}
                              </div>
                              <div className={`text-sm ${isSelected ? 'text-gray-600' : 'text-gray-400'}`}>{plan.details}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold">{plan.monthly}<span className={`text-sm font-normal ${isSelected ? 'text-gray-600' : 'text-gray-400'}`}>/mo</span></div>
                              <div className="text-sm text-gray-500">Setup: {plan.setup}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-4 items-center flex-wrap">
                  <button onClick={() => scrollTo('cta')} className="btn-shine bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition transform hover:scale-105 flex items-center justify-center gap-2" type="button">Get the {currentProduct.pricing[selectedTiers[activeProduct]].tier} Plan <ChevronRight className="w-4 h-4" aria-hidden="true" /></button>
                  {currentProduct.hasTryItFree && (
                    <Link to="/try-it-free" className="btn-shine try-it-pill text-blue-300 px-8 py-4 rounded-full font-semibold transition transform hover:scale-105 flex items-center justify-center gap-2">
                      Try It Free — See It Work <Zap className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  )}
                  <button onClick={() => scrollTo('cta')} className="glass glass-hover px-8 py-4 rounded-full font-semibold transition" type="button">Talk to Us First</button>
                  <span className="text-gray-500 text-sm">{currentProduct.pricing[selectedTiers[activeProduct]].monthly}/mo • Cancel anytime</span>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

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

      <section id="cta" className="py-24" aria-labelledby="cta-heading">
        <div className="max-w-5xl mx-auto px-6">
          <FadeInSection>
            <div className="glass glow rounded-3xl p-12 md:p-16 text-center relative overflow-hidden border border-blue-500/20">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 via-transparent to-transparent" aria-hidden="true" />
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl" aria-hidden="true" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" aria-hidden="true" />
              <div className="relative z-10">
                <h2 id="cta-heading" className="text-4xl md:text-5xl font-bold mb-6">Let's See If We're a Fit</h2>
                <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">Book a free 30-minute call. We'll show you exactly how AI can work for your business—no pressure, no jargon.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <a href={EXTERNAL_URLS.appointments} {...SECURE_LINK_PROPS} className="btn-shine bg-white text-black px-10 py-5 rounded-full font-semibold text-lg hover:bg-gray-100 transition transform hover:scale-105 inline-flex items-center gap-3 shadow-lg shadow-blue-500/30">Book Your Free Call <ArrowRight className="w-5 h-5" aria-hidden="true" /></a>
                  <Link to="/try-it-free" className="try-it-pill text-blue-300 px-8 py-5 rounded-full font-semibold text-lg transition transform hover:scale-105 inline-flex items-center gap-2">
                    Or Try It Free First <Zap className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>
                <p className="text-gray-500 text-sm mt-6">Free • 30 minutes • Zero obligation</p>
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
              <Link to="/try-it-free" className="hover:text-white transition">Try It Free</Link>
              <a href={EXTERNAL_URLS.contact} {...SECURE_LINK_PROPS} className="hover:text-white transition">Contact</a>
            </nav>
            <div className="text-gray-500 text-sm">© 2026 The Chicago AI Group. All rights reserved.</div>
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
