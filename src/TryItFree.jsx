import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const PREVIEW_TEMPLATE = (biz, industry) => {
  const safeBiz      = biz      ? escapeHtml(biz)                      : 'your business';
  const safeIndustry = industry ? escapeHtml(industry.toLowerCase())    : 'local';
  return `Hi there,\n\nI noticed you recently reached out about ${safeBiz} — I wanted to follow up and see if you had any questions I could help answer.\n\nWe've helped a number of ${safeIndustry} businesses streamline their follow-up process, and I'd love to show you what that looks like in practice.\n\nWould you be open to a quick 15-minute call this week?\n\nBest,\n[Your Name]`;
};

const PLACEHOLDER_BODY = '<span style="color:#4a6080;font-style:italic;">Start typing your business description to see a preview...</span>';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function useCounter(end, duration = 1500) {
  const [count, setCount] = useState(0);
  const [active, setActive] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true); },
      { threshold: 0.3 }
    );
    if (el) obs.observe(el);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!active) return;
    let v = 0;
    const step = end / (duration / 16);
    const t = setInterval(() => {
      v += step;
      if (v >= end) { setCount(end); clearInterval(t); }
      else setCount(Math.floor(v));
    }, 16);
    return () => clearInterval(t);
  }, [active, end, duration]);
  return [count, ref];
}

function StatNum({ num, suffix, prefix = '' }) {
  const [count, ref] = useCounter(num);
  return (
    <span className="tif-stat-num" ref={ref}>
      {prefix}{count}<span>{suffix}</span>
    </span>
  );
}

export default function TryItFree() {
  const [step, setStep] = useState(1);

  // Step 1
  const [email, setEmail]           = useState('');
  const [emailError, setEmailError] = useState(false);

  // Step 2
  const [bizName, setBizName]     = useState('');
  const [bizType, setBizType]     = useState('');
  const [bizDesc, setBizDesc]     = useState('');
  const [descError, setDescError] = useState(false);
  const [firstName, setFirstName] = useState('');

  // Security
  const [honeypot, setHoneypot]       = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Preview
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewSubject, setPreviewSubject] = useState('Quick question about your inquiry');
  const [previewFrom,    setPreviewFrom]    = useState('Your Name, Chicago AI Group');
  const [previewBodyHtml, setPreviewBodyHtml] = useState(PLACEHOLDER_BODY);

  // Typing animation refs
  const typeTimeoutRef    = useRef(null);
  const previewTimeoutRef = useRef(null);

  const typeText = useCallback((text, onUpdate) => {
    clearTimeout(typeTimeoutRef.current);
    let index = 0;
    function tick() {
      index++;
      const chunk = text.substring(0, index).replace(/\n/g, '<br>');
      onUpdate(index < text.length ? chunk + '<span class="cursor"></span>' : chunk);
      if (index < text.length) typeTimeoutRef.current = setTimeout(tick, 12);
    }
    tick();
  }, []);

  // Page title
  useEffect(() => {
    const prev = document.title;
    document.title = 'Try It Free — Chicago AI Group';
    return () => { document.title = prev; };
  }, []);

  // Restore session if already submitted this browser session
  useEffect(() => {
    if (sessionStorage.getItem('tif_submitted')) {
      setEmail(sessionStorage.getItem('tif_email') || '');
      setStep(3);
    }
  }, []);

  // Update preview when description / biz name / industry change
  useEffect(() => {
    if (bizDesc.trim().length < 10) {
      setPreviewVisible(false);
      setPreviewBodyHtml(PLACEHOLDER_BODY);
      return;
    }
    setPreviewVisible(true);

    // Subject line
    if (bizType) {
      setPreviewSubject(`Quick question about your ${bizType.toLowerCase()} business`);
    } else if (bizName) {
      setPreviewSubject(`Quick question — ${bizName}`);
    }

    clearTimeout(previewTimeoutRef.current);
    previewTimeoutRef.current = setTimeout(() => {
      const text = PREVIEW_TEMPLATE(bizName, bizType);
      typeText(text, setPreviewBodyHtml);
    }, 600);

    return () => clearTimeout(previewTimeoutRef.current);
  }, [bizDesc, bizName, bizType, typeText]);

  // From field updates with first name
  useEffect(() => {
    setPreviewFrom(firstName.trim() ? `${firstName.trim()}, Chicago AI Group` : 'Your Name, Chicago AI Group');
  }, [firstName]);

  // Clean up on unmount
  useEffect(() => () => {
    clearTimeout(typeTimeoutRef.current);
    clearTimeout(previewTimeoutRef.current);
  }, []);

  function goStep1() {
    const trimmed = email.trim();
    if (!isValidEmail(trimmed)) { setEmailError(true); return; }
    setEmail(trimmed);
    setEmailError(false);
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goStep3() {
    if (bizDesc.trim().length < 20) { setDescError(true); return; }
    setDescError(false);
    setPreviewVisible(false);
    setIsSubmitting(true);
    // Only persist + trigger send for real users — bots fill the honeypot
    if (!honeypot) {
      sessionStorage.setItem('tif_submitted', '1');
      sessionStorage.setItem('tif_email', email);
    }
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const charLen = bizDesc.length;
  const name    = firstName.trim() || 'there';

  // Step indicator helpers
  function stepClass(n) {
    if (n < step) return 'done';
    if (n === step) return 'active';
    return '';
  }
  function lineClass(n) { return n < step ? 'done' : ''; }

  return (
    <>
      <style>{`
        /* ── TOKENS ── */
        .tif-root {
          --bg:         #06090f;
          --bg-2:       #0a0f1a;
          --bg-card:    #0d1422;
          --bg-input:   #0a111d;
          --border:     #1a2638;
          --border-hi:  #243550;
          --blue:       #3b82f6;
          --blue-hi:    #60a5fa;
          --blue-glow:  rgba(59,130,246,0.18);
          --blue-soft:  rgba(59,130,246,0.08);
          --text:       #e8eef8;
          --text-2:     #8fa3bf;
          --text-3:     #4a6080;
          --green:      #22d3a0;
          --green-glow: rgba(34,211,160,0.12);
          --r:          12px;
        }
        .tif-root * { box-sizing: border-box; }
        .tif-root {
          font-family: 'Inter', sans-serif;
          background: var(--bg);
          color: var(--text);
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* ── BG ATMOSPHERE ── */
        .tif-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
        .tif-orb { position: absolute; border-radius: 50%; filter: blur(120px); opacity: 0.35; }
        .tif-orb-1 { width:600px;height:600px;top:-200px;right:-100px;background:radial-gradient(circle,#1d4ed8 0%,transparent 70%);animation:tifDrift1 18s ease-in-out infinite alternate; }
        .tif-orb-2 { width:400px;height:400px;bottom:0;left:-100px;background:radial-gradient(circle,#1e3a5f 0%,transparent 70%);animation:tifDrift2 22s ease-in-out infinite alternate; }
        .tif-orb-3 { width:300px;height:300px;top:50%;left:50%;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(59,130,246,.15) 0%,transparent 70%);animation:tifPulse 8s ease-in-out infinite; }
        @keyframes tifDrift1 { from{transform:translate(0,0) scale(1)} to{transform:translate(-60px,80px) scale(1.1)} }
        @keyframes tifDrift2 { from{transform:translate(0,0) scale(1)} to{transform:translate(60px,-40px) scale(0.9)} }
        @keyframes tifPulse  { 0%,100%{opacity:.15} 50%{opacity:.3} }

        .tif-grid {
          position: fixed; inset: 0;
          background-image: linear-gradient(rgba(59,130,246,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,.025) 1px,transparent 1px);
          background-size: 60px 60px;
          pointer-events: none; z-index: 0;
        }

        /* ── NAV ── */
        .tif-nav {
          display:flex;align-items:center;justify-content:space-between;
          padding:20px 48px;
          border-bottom:1px solid var(--border);
          background:rgba(6,9,15,0.8);
          backdrop-filter:blur(20px);
          position:sticky;top:0;z-index:100;
        }
        .tif-nav-link { font-size:.8rem;color:var(--text-2);text-decoration:none;letter-spacing:.04em;transition:color .2s; }
        .tif-nav-link:hover { color:var(--blue-hi); }

        /* ── LAYOUT ── */
        .tif-page { position:relative;z-index:1; }
        .tif-hero {
          padding:80px 48px 60px;
          max-width:1200px;margin:0 auto;
          display:grid;grid-template-columns:1fr 1fr;gap:80px;
          align-items:start;min-height:calc(100vh - 77px);
        }
        .tif-hero-left { padding-top:20px; }

        /* ── HERO COPY ── */
        .tif-label {
          display:inline-flex;align-items:center;gap:8px;
          background:var(--blue-soft);border:1px solid rgba(59,130,246,.2);
          border-radius:100px;padding:6px 16px;
          font-size:.72rem;font-weight:500;letter-spacing:.1em;
          color:var(--blue-hi);text-transform:uppercase;
          margin-bottom:32px;animation:tifFadeUp .6s ease both;
        }
        .tif-label-dot {
          width:6px;height:6px;border-radius:50%;
          background:var(--blue-hi);box-shadow:0 0 8px var(--blue-hi);
          animation:tifBlink 2s ease-in-out infinite;
        }
        @keyframes tifBlink { 0%,100%{opacity:1} 50%{opacity:.3} }
        .tif-h1 {
          font-size:3.6rem;font-weight:700;
          line-height:1.25;letter-spacing:-.025em;color:#fff;
          margin-bottom:24px;animation:tifFadeUp .6s .1s ease both;
        }
        .tif-h1 em {
          font-style:normal;
          background:linear-gradient(135deg,#60a5fa 0%,#3b82f6 50%,#818cf8 100%);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        }
        .tif-sub { font-size:1.05rem;line-height:1.7;color:var(--text-2);max-width:420px;margin-bottom:40px;font-weight:300;animation:tifFadeUp .6s .2s ease both; }
        .tif-proof { display:flex;flex-direction:column;gap:12px;animation:tifFadeUp .6s .3s ease both; }
        .tif-proof-item { display:flex;align-items:center;gap:10px;font-size:.85rem;color:var(--text-2); }
        .tif-proof-icon { width:20px;height:20px;border-radius:50%;background:var(--green-glow);border:1px solid rgba(34,211,160,.3);display:flex;align-items:center;justify-content:center;font-size:.65rem;color:var(--green);flex-shrink:0; }

        @keyframes tifFadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

        /* ── FORM CARD ── */
        .tif-card {
          background:var(--bg-card);border:1px solid var(--border);border-radius:20px;
          padding:40px;position:relative;overflow:hidden;
          animation:tifFadeUp .6s .15s ease both;
          box-shadow:0 40px 80px rgba(0,0,0,.4),0 0 0 1px rgba(59,130,246,.05);
        }
        .tif-card::before {
          content:'';position:absolute;top:0;left:0;right:0;height:1px;
          background:linear-gradient(90deg,transparent,rgba(59,130,246,.5),transparent);
        }

        /* Steps */
        .tif-steps { display:flex;align-items:center;margin-bottom:36px; }
        .tif-step { display:flex;align-items:center;gap:8px;font-size:.72rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--text-3);transition:color .3s; }
        .tif-step.active { color:var(--blue-hi); }
        .tif-step.done   { color:var(--green); }
        .tif-step-num {
          width:24px;height:24px;border-radius:50%;
          border:1px solid var(--border-hi);
          display:flex;align-items:center;justify-content:center;
          font-size:.7rem;font-weight:700;
          transition:all .3s;background:transparent;
        }
        .tif-step.active .tif-step-num { background:var(--blue);border-color:var(--blue);color:white;box-shadow:0 0 12px rgba(59,130,246,.5); }
        .tif-step.done   .tif-step-num { background:var(--green);border-color:var(--green);color:white; }
        .tif-step-line { flex:1;height:1px;background:var(--border);margin:0 12px;transition:background .3s; }
        .tif-step-line.done { background:var(--green);opacity:.4; }

        /* Panels */
        .tif-panel { display:none; }
        .tif-panel.active { display:block;animation:tifPanelIn .4s ease; }
        @keyframes tifPanelIn { from{opacity:0;transform:translateX(16px)} to{opacity:1;transform:translateX(0)} }

        .tif-form-title { font-size:1.4rem;font-weight:700;color:#fff;margin-bottom:6px; }
        .tif-form-sub   { font-size:.85rem;color:var(--text-2);margin-bottom:28px;line-height:1.5; }

        /* Fields */
        .tif-field { margin-bottom:20px; }
        .tif-label-text { display:block;font-size:.76rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--text-2);margin-bottom:8px; }
        .tif-label-opt  { color:var(--text-3);font-weight:400; }
        .tif-input, .tif-select, .tif-textarea {
          width:100%;background:var(--bg-input);border:1px solid var(--border);
          border-radius:10px;padding:13px 16px;
          font-size:.9rem;font-family:'Inter',sans-serif;color:var(--text);
          outline:none;transition:border-color .2s,box-shadow .2s;
          -webkit-appearance:none;
        }
        .tif-input::placeholder,.tif-textarea::placeholder { color:var(--text-3); }
        .tif-input:focus,.tif-select:focus,.tif-textarea:focus { border-color:var(--blue);box-shadow:0 0 0 3px var(--blue-soft); }
        .tif-input.invalid,.tif-textarea.invalid { border-color:#f87171; }
        .tif-textarea { resize:none;line-height:1.6; }
        .tif-select {
          cursor:pointer;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238fa3bf' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 38px;
        }
        .tif-select option { background:#0d1422; }
        .tif-field-row { display:grid;grid-template-columns:1fr 1fr;gap:14px; }
        .tif-char-counter { display:flex;justify-content:flex-end;font-size:.72rem;color:var(--text-3);margin-top:6px;font-family:'DM Mono',monospace;transition:color .2s; }
        .tif-char-counter.near { color:var(--blue-hi); }
        .tif-field-error { font-size:.75rem;color:#f87171;margin-top:6px;display:none; }
        .tif-field-error.show { display:block; }

        /* Buttons */
        .tif-btn {
          width:100%;padding:15px 24px;
          background:linear-gradient(135deg,#3b82f6,#2563eb);
          border:none;border-radius:100px;color:white;
          font-size:.95rem;font-weight:700;letter-spacing:.02em;
          cursor:pointer;transition:all .2s;
          position:relative;overflow:hidden;margin-top:8px;
        }
        .tif-btn::before { content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.1),transparent);opacity:0;transition:opacity .2s; }
        .tif-btn:hover { transform:translateY(-1px);box-shadow:0 8px 24px rgba(59,130,246,.35); }
        .tif-btn:hover::before { opacity:1; }
        .tif-btn:active { transform:translateY(0); }
        .tif-btn:disabled { opacity:0.6;cursor:not-allowed;transform:none;box-shadow:none; }
        .tif-btn-back {
          background:none;border:none;color:var(--text-3);font-size:.82rem;cursor:pointer;
          padding:8px 0;display:flex;align-items:center;gap:6px;margin-bottom:20px;
          transition:color .2s;font-family:'Inter',sans-serif;
        }
        .tif-btn-back:hover { color:var(--text-2); }

        /* Legal */
        .tif-legal { font-size:.72rem;color:var(--text-3);text-align:center;margin-top:16px;line-height:1.5; }
        .tif-legal a { color:var(--text-3);text-decoration:underline; }

        /* ── SUCCESS ── */
        .tif-success { text-align:center;padding:20px 0; }
        .tif-success-icon {
          width:72px;height:72px;border-radius:50%;
          background:var(--green-glow);border:1px solid rgba(34,211,160,.3);
          display:flex;align-items:center;justify-content:center;
          margin:0 auto 24px;font-size:1.8rem;
          animation:tifPopIn .5s cubic-bezier(.175,.885,.32,1.275) both;
        }
        @keyframes tifPopIn { from{transform:scale(0);opacity:0} to{transform:scale(1);opacity:1} }
        .tif-success-title { font-size:1.5rem;font-weight:700;color:#fff;margin-bottom:12px; }
        .tif-success-sub   { font-size:.88rem;color:var(--text-2);line-height:1.7;max-width:320px;margin:0 auto 28px; }

        .tif-timeline { display:flex;flex-direction:column;gap:0;text-align:left;margin-bottom:24px; }
        .tif-et { display:flex;gap:14px;align-items:flex-start;padding:14px 0;border-bottom:1px solid var(--border);animation:tifFadeUp .4s ease both; }
        .tif-et:last-child { border-bottom:none; }
        .tif-et:nth-child(1){animation-delay:.2s}
        .tif-et:nth-child(2){animation-delay:.35s}
        .tif-et:nth-child(3){animation-delay:.5s}
        .tif-et-badge { background:var(--blue-soft);border:1px solid rgba(59,130,246,.2);color:var(--blue-hi);font-family:'DM Mono',monospace;font-size:.68rem;padding:3px 10px;border-radius:100px;white-space:nowrap;flex-shrink:0;margin-top:2px; }
        .tif-et-strong { display:block;font-size:.84rem;color:var(--text);margin-bottom:2px; }
        .tif-et-span   { font-size:.78rem;color:var(--text-3); }

        /* ── PREVIEW ── */
        .tif-preview { margin-top:20px;background:var(--bg-2);border:1px solid var(--border);border-radius:14px;padding:20px;display:none;animation:tifFadeUp .4s ease both; }
        .tif-preview.visible { display:block; }
        .tif-preview-label { font-size:.68rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--text-3);margin-bottom:14px;display:flex;align-items:center;gap:8px; }
        .tif-preview-dot { width:5px;height:5px;border-radius:50%;background:var(--green);box-shadow:0 0 6px var(--green);animation:tifBlink 1.5s ease-in-out infinite; }

        .tif-email-mock { background:#0a1020;border:1px solid var(--border);border-radius:10px;overflow:hidden; }
        .tif-email-header { padding:12px 16px;border-bottom:1px solid var(--border);display:flex;flex-direction:column;gap:4px; }
        .tif-email-row  { display:flex;gap:8px;font-size:.74rem; }
        .tif-email-lbl  { color:var(--text-3);font-family:'DM Mono',monospace;min-width:36px; }
        .tif-email-val  { color:var(--text-2); }
        .tif-email-body { padding:16px;font-size:.82rem;line-height:1.8;color:var(--text-2);min-height:120px;font-family:'Inter',sans-serif; }

        .cursor { display:inline-block;width:2px;height:14px;background:var(--blue-hi);margin-left:2px;vertical-align:middle;animation:tifCursor .8s ease-in-out infinite; }
        @keyframes tifCursor { 0%,100%{opacity:1} 50%{opacity:0} }

        /* ── STATS BAR ── */
        .tif-stats { border-top:1px solid var(--border);padding:32px 48px;display:flex;justify-content:center;gap:80px;max-width:1200px;margin:0 auto; }
        .tif-stat  { text-align:center; }
        .tif-stat-num { font-size:3rem;font-weight:700;color:#fff;display:block;line-height:1;margin-bottom:4px; }
        .tif-stat-num span { color:var(--blue-hi); }
        .tif-stat-label { font-size:.78rem;color:var(--text-3);letter-spacing:.04em; }

        /* ── RESPONSIVE ── */
        @media (max-width:900px) {
          .tif-hero { grid-template-columns:1fr;gap:40px;padding:48px 24px 48px;min-height:auto; }
          .tif-h1 { font-size:2.6rem; }
          .tif-sub { max-width:100%; }
          .tif-nav { padding:16px 24px; }
          .tif-stats { padding:32px 24px;gap:40px;flex-wrap:wrap; }
        }
        @media (max-width:520px) {
          .tif-h1 { font-size:2rem; }
          .tif-card { padding:28px 20px; }
          .tif-field-row { grid-template-columns:1fr; }
          .tif-stats { gap:24px; }
        }
      `}</style>

      <div className="tif-root">
        {/* Background */}
        <div className="tif-bg">
          <div className="tif-orb tif-orb-1" />
          <div className="tif-orb tif-orb-2" />
          <div className="tif-orb tif-orb-3" />
        </div>
        <div className="tif-grid" />

        <div className="tif-page">
          {/* NAV */}
          <nav className="tif-nav">
            <Link to="/" style={{textDecoration:'none'}}>
              <Logo />
            </Link>
            <Link to="/" className="tif-nav-link">← Back to site</Link>
          </nav>

          {/* HERO */}
          <section className="tif-hero">
            {/* Left: copy */}
            <div className="tif-hero-left">
              <div className="tif-label">
                <span className="tif-label-dot" />
                Live Demo — No Credit Card
              </div>
              <h1 className="tif-h1">See AI<br/>follow-up<br/><em>in action.</em></h1>
              <p className="tif-sub">
                Enter your business details and we'll send you a real AI-written email sequence — personalized to your product, hitting your inbox within seconds.
              </p>
              <div className="tif-proof">
                {[
                  'First email arrives in under 60 seconds',
                  'Personalized to your specific business — not a template',
                  '3-touch sequence over 5 days — unsubscribe anytime',
                  'This is exactly what your customers would receive',
                ].map((item, i) => (
                  <div className="tif-proof-item" key={i}>
                    <div className="tif-proof-icon">✓</div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: form */}
            <div>
              <div className="tif-card">
                {/* Steps indicator */}
                <div className="tif-steps">
                  <div className={`tif-step ${stepClass(1)}`}>
                    <div className="tif-step-num">{step > 1 ? '✓' : '1'}</div>
                    <span>Your Email</span>
                  </div>
                  <div className={`tif-step-line ${lineClass(1)}`} />
                  <div className={`tif-step ${stepClass(2)}`}>
                    <div className="tif-step-num">{step > 2 ? '✓' : '2'}</div>
                    <span>Your Business</span>
                  </div>
                  <div className={`tif-step-line ${lineClass(2)}`} />
                  <div className={`tif-step ${stepClass(3)}`}>
                    <div className="tif-step-num">3</div>
                    <span>Confirmed</span>
                  </div>
                </div>

                {/* Panel 1 — Email */}
                <div className={`tif-panel ${step === 1 ? 'active' : ''}`}>
                  <div className="tif-form-title">Where should we send it?</div>
                  <div className="tif-form-sub">Enter the email address where you'd like to receive the demo sequence.</div>
                  <div className="tif-field">
                    <label className="tif-label-text" htmlFor="tif-email">Business Email Address</label>
                    <input
                      id="tif-email"
                      type="email"
                      className={`tif-input${emailError ? ' invalid' : ''}`}
                      placeholder="you@yourbusiness.com"
                      autoComplete="email"
                      autoFocus
                      value={email}
                      onChange={e => { setEmail(e.target.value); setEmailError(false); }}
                      onKeyDown={e => e.key === 'Enter' && goStep1()}
                    />
                    <div className={`tif-field-error${emailError ? ' show' : ''}`}>Please enter a valid email address.</div>
                  </div>
                  <button type="button" className="tif-btn" onClick={goStep1}>Continue &nbsp;→</button>
                  <div className="tif-legal">
                    No spam. Unsubscribe in one click. By continuing you agree to receive<br/>a 3-email demo sequence from Chicago AI Group.
                  </div>
                </div>

                {/* Panel 2 — Business Details */}
                <div className={`tif-panel ${step === 2 ? 'active' : ''}`}>
                  <button type="button" className="tif-btn-back" onClick={() => setStep(1)}>← Back</button>
                  <div className="tif-form-title">Tell us about your business</div>
                  <div className="tif-form-sub">The more detail you give, the more personalized your demo emails will be.</div>

                  <div className="tif-field-row">
                    <div className="tif-field">
                      <label className="tif-label-text" htmlFor="tif-biz-name">Business Name</label>
                      <input id="tif-biz-name" type="text" className="tif-input" placeholder="e.g. Apex Roofing" maxLength={80} value={bizName} onChange={e => setBizName(e.target.value)} />
                    </div>
                    <div className="tif-field">
                      <label className="tif-label-text" htmlFor="tif-biz-type">Industry</label>
                      <select id="tif-biz-type" className="tif-select" value={bizType} onChange={e => setBizType(e.target.value)}>
                        <option value="" disabled>Select one</option>
                        {['Home Services','Real Estate','Insurance','Mortgage / Finance','Marketing Agency','Retail / E-commerce','Restaurants / Food','Health & Wellness','Consulting','Technology','Legal / Accounting','Other'].map(opt => (
                          <option key={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="tif-field">
                    <label className="tif-label-text" htmlFor="tif-biz-desc">
                      What do you sell or offer? <span className="tif-label-opt">(be specific)</span>
                    </label>
                    <textarea
                      id="tif-biz-desc"
                      className={`tif-textarea${descError ? ' invalid' : ''}`}
                      rows={4}
                      maxLength={300}
                      placeholder="e.g. We install and replace residential roofs in the Chicago suburbs. Most of our leads come from homeowners who requested a quote after a storm. Our average job is $12,000."
                      value={bizDesc}
                      onChange={e => { setBizDesc(e.target.value); setDescError(false); }}
                    />
                    <div className={`tif-char-counter${charLen > 240 ? ' near' : ''}`}>{charLen} / 300</div>
                    <div className={`tif-field-error${descError ? ' show' : ''}`}>Please describe your business (at least 20 characters).</div>
                  </div>

                  <div className="tif-field">
                    <label className="tif-label-text" htmlFor="tif-first-name">
                      Your First Name <span className="tif-label-opt">(optional)</span>
                    </label>
                    <input id="tif-first-name" type="text" className="tif-input" placeholder="e.g. Sarah" maxLength={50} value={firstName} onChange={e => setFirstName(e.target.value)} />
                  </div>

                  {/* Honeypot — invisible to real users, bots fill it automatically */}
                  <div style={{position:'absolute',left:'-9999px',width:'1px',height:'1px',overflow:'hidden'}} aria-hidden="true">
                    <input type="text" name="website" value={honeypot} onChange={e => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
                  </div>

                  <button type="button" className="tif-btn" onClick={goStep3} disabled={isSubmitting}>
                    {isSubmitting ? 'Sending…' : 'Send My Demo Emails \u00a0→'}
                  </button>
                  <div className="tif-legal">Your information is never sold or shared. Used only to personalize your demo.</div>
                </div>

                {/* Panel 3 — Success */}
                <div className={`tif-panel ${step === 3 ? 'active' : ''}`}>
                  <div className="tif-success">
                    <div className="tif-success-icon">🚀</div>
                    <div className="tif-success-title">You're all set!</div>
                    <div className="tif-success-sub">
                      We're generating your personalized sequence now, {name}. Check {email} — Email 1 is on its way.
                    </div>
                    <div className="tif-timeline">
                      {[
                        { badge: 'Now',   title: 'Email 1 — Personalized Intro',   desc: 'A warm, specific follow-up written by AI based on your business description' },
                        { badge: 'Day 3', title: 'Email 2 — Different Angle',      desc: 'A second touch with a different approach — still sounds like a real person' },
                        { badge: 'Day 5', title: 'Email 3 — Soft Close',           desc: 'A brief, honest final check-in that leaves the door open with zero pressure' },
                      ].map((item, i) => (
                        <div className="tif-et" key={i}>
                          <span className="tif-et-badge">{item.badge}</span>
                          <div>
                            <strong className="tif-et-strong">{item.title}</strong>
                            <span className="tif-et-span">{item.desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <a className="tif-btn" href="https://calendly.com/matt-chicagoaigroup/30min" target="_blank" rel="noopener noreferrer" style={{display:'block',textDecoration:'none',textAlign:'center'}}>
                      Book a Call to Learn More
                    </a>
                  </div>
                </div>
              </div>

              {/* Live Preview */}
              <div className={`tif-preview${previewVisible ? ' visible' : ''}`}>
                <div className="tif-preview-label">
                  <div className="tif-preview-dot" />
                  Live Preview — Email 1
                </div>
                <div className="tif-email-mock">
                  <div className="tif-email-header">
                    <div className="tif-email-row">
                      <span className="tif-email-lbl">From:</span>
                      <span className="tif-email-val">{previewFrom}</span>
                    </div>
                    <div className="tif-email-row">
                      <span className="tif-email-lbl">Sub:</span>
                      <span className="tif-email-val">{previewSubject}</span>
                    </div>
                  </div>
                  <div
                    className="tif-email-body"
                    dangerouslySetInnerHTML={{ __html: previewBodyHtml }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* STATS BAR */}
          <div className="tif-stats">
            {[
              { num: 80, suffix: '%', prefix: '',  label: 'of sales need 5+ follow-ups' },
              { num: 44, suffix: '%', prefix: '',  label: 'of reps give up after 1 attempt' },
              { num: 60, suffix: 's', prefix: '<', label: 'average response time' },
              { num: 3,  suffix: 'x', prefix: '',  label: 'more replies vs manual follow-up' },
            ].map((s, i) => (
              <div className="tif-stat" key={i}>
                <StatNum num={s.num} suffix={s.suffix} prefix={s.prefix} />
                <span className="tif-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
