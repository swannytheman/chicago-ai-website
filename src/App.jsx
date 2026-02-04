import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Bot, Users, Calendar, PenTool, ChevronRight, Check, Star, Menu, X, ArrowRight, Zap, Clock, TrendingUp, ChevronDown, MessageSquare, BarChart3, Shield, Sparkles, Award, Phone, Mail } from 'lucide-react';

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

const PrivacyPolicy = ({ onBack }) => (
  <div className="min-h-screen bg-black text-white pt-32 pb-24">
    <div className="max-w-3xl mx-auto px-6">
      <button onClick={onBack} className="text-blue-400 hover:text-blue-300 transition mb-8 flex items-center gap-2" type="button">
        <ArrowRight className="w-4 h-4 rotate-180" aria-hidden="true" /> Back to Home
      </button>
      <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-gray-400 mb-12">Effective Date: February 4, 2026</p>

      <div className="prose prose-invert max-w-none space-y-8 text-gray-300 leading-relaxed">
        <p>The Chicago AI Group ("we," "us," or "our") operates the website chicagoaigroup.com (the "Website") and provides AI-powered services for small businesses, including AI agents for customer service, sales, administration, and marketing (collectively, the "Services"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our Website, interact with us, or use our Services.</p>
        <p>By accessing or using our Website or Services, you agree to the terms of this Privacy Policy. If you do not agree, please do not use our Website or Services.</p>

        <h2 className="text-2xl font-bold text-white pt-4">1. Information We Collect</h2>
        <p>We collect information from you in various ways, including:</p>
        <h3 className="text-xl font-semibold text-white">a. Information You Provide Directly</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong className="text-white">Contact and Booking Information:</strong> When you book a call (e.g., via Calendly), request a demo, or contact us, you may provide personal details such as your name, email address, phone number, company name, and any other information you choose to share.</li>
          <li><strong className="text-white">Service-Related Information:</strong> If you sign up for our Pro or Enterprise plans, we may collect billing information (e.g., payment details processed through secure third-party providers), business details, and integration data (e.g., CRM credentials for syncing).</li>
          <li><strong className="text-white">Communications:</strong> Any information included in emails, forms, or other communications you send to us.</li>
        </ul>
        <h3 className="text-xl font-semibold text-white">b. Automatically Collected Information</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong className="text-white">Usage Data:</strong> We collect data about your interactions with our Website and Services, such as IP address, browser type, device information, pages visited, time spent on pages, and referral sources.</li>
          <li><strong className="text-white">Cookies and Tracking Technologies:</strong> We use cookies, web beacons, and similar technologies to enhance your experience, analyze usage, and deliver personalized content. This may include session cookies (temporary) and persistent cookies (longer-term). You can manage cookie preferences through your browser settings.</li>
          <li><strong className="text-white">Analytics:</strong> We use tools like Google Analytics to track Website traffic and user behavior.</li>
        </ul>
        <h3 className="text-xl font-semibold text-white">c. Information from Third Parties</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong className="text-white">Integrations:</strong> When our AI agents integrate with your CRM or other tools, we may receive data such as customer leads, interaction logs, or business metrics.</li>
          <li><strong className="text-white">Service Providers:</strong> We may receive information from partners like Calendly (for scheduling) or payment processors.</li>
        </ul>
        <p>We do not knowingly collect personal information from children under 13 years of age. If we learn that we have collected such information, we will delete it promptly.</p>

        <h2 className="text-2xl font-bold text-white pt-4">2. How We Use Your Information</h2>
        <p>We use the collected information for the following purposes:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>To provide, maintain, and improve our Website and Services, including customizing AI agents and ensuring seamless integrations.</li>
          <li>To process bookings, payments, and subscriptions (e.g., Pro plan at $299/month or Enterprise options).</li>
          <li>To communicate with you, such as responding to inquiries, sending updates about our Services, or providing support.</li>
          <li>To analyze usage patterns and optimize our offerings (e.g., identifying common business challenges to enhance AI capabilities).</li>
          <li>For marketing and promotional purposes, including sending newsletters or offers (you can opt out at any time).</li>
          <li>To comply with legal obligations, prevent fraud, and ensure the security of our systems.</li>
          <li>To generate aggregated, anonymized data for internal research or reporting.</li>
        </ul>

        <h2 className="text-2xl font-bold text-white pt-4">3. Sharing Your Information</h2>
        <p>We do not sell your personal information. We may share it in the following circumstances:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong className="text-white">Service Providers:</strong> With third-party vendors who assist us in operations, such as hosting, scheduling (e.g., Calendly), payment processing, CRM integrations, or analytics. These providers are contractually obligated to protect your data and use it only for the services they provide to us.</li>
          <li><strong className="text-white">Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new entity.</li>
          <li><strong className="text-white">Legal Requirements:</strong> If required by law, court order, or government authority, or to protect our rights, property, or safety.</li>
          <li><strong className="text-white">With Your Consent:</strong> For any other purpose with your explicit permission.</li>
        </ul>

        <h2 className="text-2xl font-bold text-white pt-4">4. Data Security</h2>
        <p>We implement reasonable administrative, technical, and physical safeguards to protect your information from unauthorized access, loss, misuse, or alteration. For example:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Encryption for data in transit (e.g., HTTPS on our Website).</li>
          <li>Access controls and regular security audits.</li>
          <li>Secure storage for sensitive data like payment information (handled by compliant third-party processors).</li>
        </ul>
        <p>However, no system is completely secure, and we cannot guarantee absolute security. You are responsible for maintaining the confidentiality of any account credentials.</p>

        <h2 className="text-2xl font-bold text-white pt-4">5. Your Rights and Choices</h2>
        <p>Depending on your location, you may have certain rights regarding your personal information:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong className="text-white">Access and Correction:</strong> Request access to or updates of your data.</li>
          <li><strong className="text-white">Deletion:</strong> Request deletion of your data, subject to legal retention requirements.</li>
          <li><strong className="text-white">Opt-Out:</strong> Unsubscribe from marketing communications via the link in emails or by contacting us.</li>
          <li><strong className="text-white">Cookies:</strong> Disable cookies through your browser, though this may limit Website functionality.</li>
          <li><strong className="text-white">Do Not Track:</strong> We do not currently respond to "Do Not Track" signals, as there is no uniform standard.</li>
        </ul>
        <p>Residents of California (under CCPA/CPRA) or other jurisdictions with similar laws may have additional rights, such as opting out of data sales (which we do not engage in) or requesting information about disclosures.</p>
        <p>To exercise these rights, contact us at <a href="mailto:privacy@chicagoaigroup.com" className="text-blue-400 hover:text-blue-300 underline">privacy@chicagoaigroup.com</a>.</p>

        <h2 className="text-2xl font-bold text-white pt-4">6. International Data Transfers</h2>
        <p>Our operations are based in the United States. If you are located outside the US, your information may be transferred to and processed in the US, where data protection laws may differ from those in your jurisdiction. By using our Services, you consent to this transfer.</p>

        <h2 className="text-2xl font-bold text-white pt-4">7. Retention of Information</h2>
        <p>We retain your information for as long as necessary to fulfill the purposes outlined in this Policy, comply with legal obligations, resolve disputes, or enforce agreements. For example, account data may be kept while your subscription is active and for a reasonable period thereafter.</p>

        <h2 className="text-2xl font-bold text-white pt-4">8. Third-Party Links</h2>
        <p>Our Website may contain links to third-party sites (e.g., Calendly). We are not responsible for their privacy practices. Review their policies separately.</p>

        <h2 className="text-2xl font-bold text-white pt-4">9. Changes to This Privacy Policy</h2>
        <p>We may update this Policy from time to time. Changes will be posted on this page with an updated effective date. Continued use of our Website or Services after changes constitutes acceptance.</p>

        <h2 className="text-2xl font-bold text-white pt-4">10. Contact Us</h2>
        <p>If you have questions about this Privacy Policy or our practices, please contact us at:</p>
        <div className="glass rounded-2xl p-6">
          <p className="font-semibold text-white mb-2">The Chicago AI Group</p>
          <p>Email: <a href="mailto:privacy@chicagoaigroup.com" className="text-blue-400 hover:text-blue-300 underline">privacy@chicagoaigroup.com</a></p>
          <p>Website: chicagoaigroup.com</p>
          <p className="mt-2">For scheduling inquiries, visit our <a href="https://calendly.com/matt-chicagoaigroup/30min" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">contact page</a> to book a call.</p>
        </div>
      </div>
    </div>
  </div>
);

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [selectedTiers, setSelectedTiers] = useState({0: 1, 1: 1, 2: 1, 3: 1});
  const [showPrivacy, setShowPrivacy] = useState(false);

  const selectTier = useCallback((productIdx, tierIdx) => {
    setSelectedTiers(prev => ({...prev, [productIdx]: tierIdx}));
  }, []);

  const scrollTo = useCallback((id) => {
    setMobileMenuOpen(false);
    if (id === 'home') {
      setShowPrivacy(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (showPrivacy) {
      setShowPrivacy(false);
      setTimeout(() => {
        const sanitizedId = id.toLowerCase().replace(/[^a-z0-9-]/g, '');
        const el = document.getElementById(sanitizedId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      return;
    }
    const sanitizedId = id.toLowerCase().replace(/[^a-z0-9-]/g, '');
    const el = document.getElementById(sanitizedId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, [showPrivacy]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTestimonial(prev => (prev + 1) % 5), 5000);
    return () => clearInterval(interval);
  }, []);

  const products = useMemo(() => [
    { icon: Bot, name: "Customer Service AI", tagline: "Answer every question instantly—even at 3am", capabilities: ["Responds in natural conversation, not robotic scripts", "Captures leads and qualifies them automatically", "Works on your website, email, and SMS", "Syncs with your CRM so nothing slips through"], pricing: [{ tier: "Starter", monthly: "$129", setup: "$1,800", details: "1,000 conversations/mo" }, { tier: "Pro", monthly: "$299", setup: "$2,900", details: "Unlimited + integrations", popular: true }, { tier: "Enterprise", monthly: "$499", setup: "$4,500", details: "Custom features + priority support" }] },
    { icon: Users, name: "Sales AI", tagline: "Turn website visitors into booked meetings", capabilities: ["Qualifies leads in real-time so you talk to buyers only", "Sends personalized follow-ups that don't feel automated", "Recovers abandoned carts and dead leads", "Plugs into your CRM and email tools"], pricing: [{ tier: "Starter", monthly: "$179", setup: "$2,200", details: "Core lead qualification" }, { tier: "Pro", monthly: "$399", setup: "$3,500", details: "Full sequences + lead scoring", popular: true }, { tier: "Enterprise", monthly: "$649", setup: "$5,900", details: "Multi-channel + A/B testing" }] },
    { icon: Calendar, name: "Admin AI", tagline: "Automate the busywork you dread every day", capabilities: ["Sorts your email and drafts replies", "Handles scheduling and sends reminders", "Chases unpaid invoices (politely)", "Connects to Google, QuickBooks, and more"], pricing: [{ tier: "Starter", monthly: "$199", setup: "$2,400", details: "Email + calendar automation" }, { tier: "Pro", monthly: "$399", setup: "$3,900", details: "Full suite + weekly reports", popular: true }, { tier: "Enterprise", monthly: "$699", setup: "$6,200", details: "Custom workflows + integrations" }] },
    { icon: PenTool, name: "Marketing AI", tagline: "Create a month of content in minutes", capabilities: ["Writes blogs, social posts, and emails that sound like you", "Learns your brand voice and keeps it consistent", "Schedules posts across all platforms", "Shows you what's working and what's not"], pricing: [{ tier: "Starter", monthly: "$149", setup: "$1,500", details: "20 posts/month" }, { tier: "Pro", monthly: "$299", setup: "$2,800", details: "Unlimited + analytics", popular: true }] }
  ], []);

  const testimonials = useMemo(() => [
    { quote: "We were drowning in lead follow-ups—losing deals just because we couldn't respond fast enough. Now our AI handles first contact instantly, and our sales team closes 35% more deals. They paid for themselves in the first month.", author: "Erik Sandoval", title: "President, Luigi Trucking Insurance", industry: "Insurance", metric: "35% more closed deals" },
    { quote: "I'll be honest—I thought AI would make us sound like a call center. I was wrong. Customers actually compliment our 'fast, friendly responses' now. They have no idea it's AI. That's when I knew we made the right call.", author: "Sarah Chen", title: "CEO, Midwest Consulting Group", industry: "Consulting", metric: "Response time: 4 hrs → 30 sec" },
    { quote: "I used to spend my Sundays writing proposals. Now the AI drafts them in minutes and I just review. I got 20 hours of my week back—and my weekends. My only regret is not doing this sooner.", author: "Michael Torres", title: "Operations Director, BuildRight Construction", industry: "Construction", metric: "20 hours saved per week" },
    { quote: "We run three locations and couldn't keep up with online inquiries. Leads were falling through the cracks every single day. Now our AI qualifies and routes every lead instantly—our bookings are up 50% and we finally have weekends off.", author: "Angela Rivera", title: "Owner, Lux Beauty Collective", industry: "Retail / Beauty", metric: "50% more bookings" },
    { quote: "Our HVAC business is seasonal—when it's busy, we'd miss half our calls. Chicago AI set us up with an AI that books appointments, sends reminders, and even follows up on estimates. Revenue jumped 28% in the first quarter.", author: "David Kowalski", title: "Founder, Windy City Comfort HVAC", industry: "Local Services", metric: "28% revenue increase" }
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

  const navItems = [
    { label: 'Home', target: 'home' },
    { label: 'Services', target: 'services' },
    { label: 'Pricing', target: 'services' },
    { label: 'Testimonials', target: 'testimonials' },
    { label: 'Contact', target: 'cta' },
    { label: 'About', target: 'about' },
  ];

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
          <button onClick={() => scrollTo('home')} className="cursor-pointer" type="button" aria-label="Go to homepage"><Logo size="default" /></button>
          <div className="hidden lg:flex items-center gap-6">
            {navItems.map(item => (
              <button key={item.label} onClick={() => scrollTo(item.target)} className="text-gray-400 hover:text-white transition relative group text-sm" type="button" aria-label={`Navigate to ${item.label}`}>
                {item.label}<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-full" aria-hidden="true" />
              </button>
            ))}
            <button onClick={() => scrollTo('cta')} className="btn-shine bg-white text-black px-6 py-2.5 rounded-full font-medium hover:bg-gray-100 transition transform hover:scale-105" type="button">Book a Call</button>
          </div>
          <button className="lg:hidden p-2 glass rounded-lg" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} type="button" aria-expanded={mobileMenuOpen} aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}>{mobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button>
        </div>
        {mobileMenuOpen && (
          <div className="lg:hidden glass mx-4 mt-2 rounded-2xl p-6 space-y-4" role="menu">
            {navItems.map(item => (<button key={item.label} onClick={() => scrollTo(item.target)} className="block w-full text-left text-gray-300 hover:text-white py-2" type="button" role="menuitem">{item.label}</button>))}
            <button onClick={() => scrollTo('cta')} className="w-full bg-white text-black px-5 py-3 rounded-full font-medium" type="button" role="menuitem">Book a Call</button>
          </div>
        )}
      </nav>

      {showPrivacy ? (
        <PrivacyPolicy onBack={() => { setShowPrivacy(false); window.scrollTo({ top: 0 }); }} />
      ) : (
      <>
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
              <Zap className="w-4 h-4 text-blue-400" aria-hidden="true" /><span>AI That Actually Works for Small Business</span><span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" aria-hidden="true" />
            </div>
          </FadeInSection>
          <FadeInSection delay={100}><h1 id="hero-heading" className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight tracking-tight">Reclaim Your Time<br /><span className="text-gradient">Scale Your Business with AI</span></h1></FadeInSection>
          <FadeInSection delay={200}><p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">AI agents that handle customer service, sales, admin, and marketing—so you can stop drowning in busywork and focus on growth. Zero tech skills required.</p></FadeInSection>
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
              <span className="text-sm uppercase tracking-widest text-gray-500 mb-4 block">Tired of Being Buried in Admin?</span>
              <h2 id="about-heading" className="text-4xl md:text-5xl font-bold mb-4">Let AI Handle the Grind So You Can Focus on Growth</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">Answering emails. Chasing leads. Scheduling. Posting content. You didn't start a business to drown in busywork.</p>
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
              <p className="text-gray-400 max-w-2xl mx-auto">Join Chicago's smartest small businesses using AI to outpace competitors—starting at just $129/month.</p>
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
                    {(() => { const Icon = products[activeProduct].icon; return <Icon className="w-8 h-8 text-black" aria-hidden="true" />; })()}
                  </div>
                  <div><h3 className="text-3xl font-bold mb-2">{products[activeProduct].name}</h3><p className="text-gray-400 text-lg">{products[activeProduct].tagline}</p></div>
                </div>
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-6 flex items-center gap-2"><Sparkles className="w-4 h-4" aria-hidden="true" /> What It Does For You</h4>
                    <ul className="space-y-4">
                      {products[activeProduct].capabilities.map((cap, idx) => (
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
                      {products[activeProduct].pricing.map((plan, idx) => {
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
                              <div className={`text-sm ${isSelected ? 'text-gray-500' : 'text-gray-500'}`}>Setup: {plan.setup}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-4 items-center">
                  <button onClick={() => scrollTo('cta')} className="btn-shine bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition transform hover:scale-105 flex items-center justify-center gap-2" type="button">Get the {products[activeProduct].pricing[selectedTiers[activeProduct]].tier} Plan <ChevronRight className="w-4 h-4" aria-hidden="true" /></button>
                  <button onClick={() => scrollTo('cta')} className="glass glass-hover px-8 py-4 rounded-full font-semibold transition" type="button">Talk to Us First</button>
                  <span className="text-gray-500 text-sm">{products[activeProduct].pricing[selectedTiers[activeProduct]].monthly}/mo • Cancel anytime</span>
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center font-bold text-lg" aria-hidden="true">{testimonials[currentTestimonial].author.charAt(0)}</div>
                    <div><div className="font-semibold text-lg">{testimonials[currentTestimonial].author}</div><div className="text-gray-400">{testimonials[currentTestimonial].title}</div></div>
                  </div>
                  <span className="hidden sm:inline-block text-xs uppercase tracking-wider text-gray-500 glass px-3 py-1.5 rounded-full">{testimonials[currentTestimonial].industry}</span>
                </div>
              </div>
              <div className="flex justify-center gap-3 mt-8" role="tablist" aria-label="Testimonial navigation">{testimonials.map((_, idx) => (<button key={idx} onClick={() => setCurrentTestimonial(idx)} className={`w-3 h-3 rounded-full transition-all duration-300 ${currentTestimonial === idx ? 'bg-blue-400 w-8' : 'bg-white/30 hover:bg-white/50'}`} type="button" role="tab" aria-selected={currentTestimonial === idx} aria-label={`View testimonial ${idx + 1}`} />))}</div>
            </div>
          </FadeInSection>
        </div>
      </section>

      <section className="py-24" aria-label="Trust signals and integrations">
        <div className="max-w-7xl mx-auto px-6">
          <FadeInSection>
            <div className="text-center mb-12">
              <span className="text-sm uppercase tracking-widest text-gray-500 mb-4 block">Trusted by Chicago Businesses</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Backed by 100+ Hours of Custom AI Development</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">We integrate with the tools you already use—no rip-and-replace required.</p>
            </div>
          </FadeInSection>

          <FadeInSection delay={100}>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-16">
              {[
                { name: 'Gmail', icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
                { name: 'HubSpot', icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><circle cx="12" cy="4" r="1.5" /><circle cx="12" cy="20" r="1.5" /><circle cx="4" cy="12" r="1.5" /><circle cx="20" cy="12" r="1.5" /><line x1="12" y1="5.5" x2="12" y2="9" /><line x1="12" y1="15" x2="12" y2="18.5" /><line x1="5.5" y1="12" x2="9" y2="12" /><line x1="15" y1="12" x2="18.5" y2="12" /></svg> },
                { name: 'Outlook', icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 8l10 6 10-6" /></svg> },
                { name: 'QuickBooks', icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M8 15V9h2a2 2 0 110 4H8" /><path d="M14 9v6h-2a2 2 0 110-4h2" /></svg> },
                { name: 'Slack', icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="13" y="2" width="3" height="8" rx="1.5" /><rect x="8" y="14" width="3" height="8" rx="1.5" /><rect x="2" y="8" width="8" height="3" rx="1.5" /><rect x="14" y="13" width="8" height="3" rx="1.5" /></svg> },
                { name: 'Google Calendar', icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="3" y1="10" x2="21" y2="10" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /></svg> },
                { name: 'Salesforce', icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3C7 3 3 7.5 3 12.5S7 21 12 21s9-3.5 9-8.5S17 3 12 3z" /><path d="M8 13l3-3 2 2 3-3" /></svg> },
                { name: 'Zapier', icon: <Zap className="w-6 h-6" /> }
              ].map((tool, idx) => (
                <div key={idx} className="glass glass-hover rounded-xl px-6 py-4 flex items-center gap-3 transition transform hover:scale-105 cursor-default">
                  <span className="text-gray-300" aria-hidden="true">{tool.icon}</span>
                  <span className="text-sm font-medium text-gray-300">{tool.name}</span>
                </div>
              ))}
            </div>
          </FadeInSection>

          <FadeInSection delay={200}>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="glass glow rounded-2xl p-8 text-center hover:bg-white/10 transition transform hover:scale-105">
                <Award className="w-10 h-10 text-blue-400 mx-auto mb-4" aria-hidden="true" />
                <h3 className="font-bold text-lg mb-2">Upwork Top Rated</h3>
                <p className="text-gray-400 text-sm">Certified AI experts with a proven track record of delivering results on Upwork's global platform.</p>
              </div>
              <div className="glass glow rounded-2xl p-8 text-center hover:bg-white/10 transition transform hover:scale-105">
                <Shield className="w-10 h-10 text-blue-400 mx-auto mb-4" aria-hidden="true" />
                <h3 className="font-bold text-lg mb-2">AI Platform Certified</h3>
                <p className="text-gray-400 text-sm">Certified across leading AI platforms—we know the tech inside and out so you don't have to.</p>
              </div>
              <div className="glass glow rounded-2xl p-8 text-center hover:bg-white/10 transition transform hover:scale-105">
                <Sparkles className="w-10 h-10 text-blue-400 mx-auto mb-4" aria-hidden="true" />
                <h3 className="font-bold text-lg mb-2">Chicago-Based & Hands-On</h3>
                <p className="text-gray-400 text-sm">We're local, we're accessible, and we treat your business like our own. No offshore support desks.</p>
              </div>
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
                <a href={EXTERNAL_URLS.appointments} {...SECURE_LINK_PROPS} className="btn-shine bg-white text-black px-10 py-5 rounded-full font-semibold text-lg hover:bg-gray-100 transition transform hover:scale-105 inline-flex items-center gap-3 shadow-lg shadow-blue-500/30">Book Your Free Call <ArrowRight className="w-5 h-5" aria-hidden="true" /></a>
                <p className="text-gray-500 text-sm mt-6">Free • 30 minutes • Zero obligation</p>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>
      </>
      )}

      <footer className="py-16 border-t border-white/10" role="contentinfo">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <button onClick={() => scrollTo('home')} className="cursor-pointer mb-4" type="button" aria-label="Go to homepage"><Logo size="small" /></button>
              <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500 to-blue-400 mb-4 rounded-full" aria-hidden="true" />
              <p className="text-gray-400 text-sm leading-relaxed">AI-powered solutions for Chicago's small businesses. We handle the tech so you can focus on growth.</p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Navigate</h4>
              <nav className="flex flex-col gap-3 text-gray-400 text-sm" aria-label="Footer navigation">
                <button onClick={() => scrollTo('home')} className="hover:text-white transition text-left" type="button">Home</button>
                <button onClick={() => scrollTo('services')} className="hover:text-white transition text-left" type="button">Services</button>
                <button onClick={() => scrollTo('services')} className="hover:text-white transition text-left" type="button">Pricing</button>
                <button onClick={() => scrollTo('testimonials')} className="hover:text-white transition text-left" type="button">Testimonials</button>
                <button onClick={() => scrollTo('about')} className="hover:text-white transition text-left" type="button">About</button>
              </nav>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <nav className="flex flex-col gap-3 text-gray-400 text-sm" aria-label="Legal links">
                <button onClick={() => { setShowPrivacy(true); window.scrollTo({ top: 0 }); }} className="hover:text-white transition text-left" type="button">Privacy Policy</button>
                <a href={EXTERNAL_URLS.contact} {...SECURE_LINK_PROPS} className="hover:text-white transition">Contact Us</a>
              </nav>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Get In Touch</h4>
              <div className="flex flex-col gap-3 text-gray-400 text-sm">
                <a href="mailto:sales@chicagoaigroup.com" className="hover:text-white transition flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-400" aria-hidden="true" /> sales@chicagoaigroup.com
                </a>
                <a href="tel:+13124348413" className="hover:text-white transition flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-400" aria-hidden="true" /> 312.434.8413
                </a>
                <a href={EXTERNAL_URLS.appointments} {...SECURE_LINK_PROPS} className="hover:text-white transition flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-400" aria-hidden="true" /> Book a Free Call
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-500 text-sm">&copy; 2025 The Chicago AI Group. All rights reserved.</div>
            <div className="flex gap-6 text-gray-500 text-sm">
              <button onClick={() => { setShowPrivacy(true); window.scrollTo({ top: 0 }); }} className="hover:text-white transition" type="button">Privacy Policy</button>
              <a href={EXTERNAL_URLS.contact} {...SECURE_LINK_PROPS} className="hover:text-white transition">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}