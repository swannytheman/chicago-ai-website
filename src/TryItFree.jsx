import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';
import { getAttribution } from './attribution.js';
import { EXTERNAL_URLS } from './siteConfig.js';
import { usePageMeta } from './usePageMeta.js';
import { PAGE_META } from './seo.js';
import EmailPreview from './EmailPreview.jsx';

// Make.com custom webhook that receives the demo signup. The host here must stay in
// sync with connect-src in vercel.json, or the browser will refuse the request.
const WEBHOOK_URL = 'https://hook.us2.make.com/l7i2trs8c1k9ooly4h072po7foh5cxt3';

// Normally one submission per browser tab: a refresh re-shows the confirmation
// rather than firing the sequence at the same person twice.
//
// TEMPORARILY OFF so the Make.com scenario can be exercised repeatedly. While this
// is false, every refresh returns an empty form and a visitor can submit as many
// times as they like. Set it back to true before real traffic.
const BLOCK_REPEAT_SUBMISSIONS = false;

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// -- SAMPLE EMAIL GENERATOR --------------------------------------------------
// House rules, and the whole point of this page. The sample is the PRODUCT: the
// agent writing AS the visitor's business, TO a made-up inbound customer.
//
//   FROM   the visitor's business (their name / trade)
//   TO     a fictional inbound lead, invented to fit the trade
//   ABOUT  a realistic inquiry someone in that trade would actually receive
//   VOICE  the visitor's, not ours
//
// Never: address the visitor as if they were the customer, lecture them about the
// bottleneck they just told us about, mention Chicago AI Group, pricing, strategy
// calls or "AI sales agent" inside a sample, or imply we mailed their real list.
//
// The bottleneck picks the SITUATION only -- after-hours form, needs qualifying,
// and so on. It never becomes a talking point aimed at the visitor.
//
// This template drives the on-page live preview. The three emails that actually
// land in the inbox are written by the Make.com scenario behind WEBHOOK_URL, which
// has to enforce the same rules -- see the note above the payload in submitLead().

// A fictional customer per trade, written in second person so the sample reads as
// a reply addressed to them.
const SCENARIOS = {
  'Home Services':       { lead: 'Mark R.',   ask: 'replacing the roof on your garage' },
  'Real Estate':         { lead: 'Dana P.',   ask: 'seeing the two-bedroom listing' },
  'Insurance':           { lead: 'Tom H.',    ask: 'covering your two work vans' },
  'Mortgage / Finance':  { lead: 'Alicia M.', ask: 'pre-approval numbers before you make an offer' },
  'Marketing Agency':    { lead: 'Priya S.',  ask: 'pricing to run your paid search' },
  'Retail / E-commerce': { lead: 'Chris L.',  ask: 'whether the bulk order ships before the 20th' },
  'Restaurants / Food':  { lead: 'Nina B.',   ask: 'catering for 40 people on Friday' },
  'Health & Wellness':   { lead: 'Sam K.',    ask: 'openings for a first appointment' },
  'Consulting':          { lead: 'Ravi N.',   ask: 'scope and rates for a short engagement' },
  'Technology':          { lead: 'Erin W.',   ask: 'whether it works with the setup you already run' },
  'Legal / Accounting':  { lead: 'Grace T.',  ask: 'closing out last year’s books' },
};
const DEFAULT_SCENARIO = { lead: 'Alex T.', ask: 'the work you described' };

function scenarioFor(industry) {
  return SCENARIOS[industry] || DEFAULT_SCENARIO;
}

// "Where do leads slip?" sets what is HAPPENING in the sample -- never what we say
// about it. The visitor's own answer is not quoted back at them.
const SITUATIONS = {
  'After-hours forms':        'Your note came in after we had closed for the day, so I am picking it up first thing.',
  'Slow first reply':         'Wanted to come back to you straight away rather than leave you waiting on this.',
  'Quotes take too long':     'I can get you a number quickly — no need to wait a week on a price.',
  'No-shows / they go quiet': 'I have put a reminder on this so it does not get lost at our end.',
  'Too many junk leads':      'Two quick things so I can price it properly — what timescale are you working to, and is there a budget you are trying to stay inside?',
};

// The typed-out on-page preview. It is a taste of email 1, not the real generator:
// the three emails that get sent are written by the model in the Make scenario, which
// uses typical_inbound to invent both the lead and what they asked for. Here that free
// text drives the subject line -- where a fragment reads naturally -- while the body
// uses the industry scenario, which is written in second person and stays grammatical
// whatever the visitor typed.
const PREVIEW_TEMPLATE = (biz, industry, bottleneck) => {
  const { lead, ask } = scenarioFor(industry);
  const safeBiz  = biz ? escapeHtml(biz) : 'us';
  const safeLead = escapeHtml(lead.split(' ')[0]);
  const sign     = biz ? escapeHtml(biz) : 'The team';
  const situation = SITUATIONS[bottleneck] ||
    'I have got everything I need at this end to put a number together for you.';

  return `Hi ${safeLead},\n\nThanks for getting in touch with ${safeBiz} about ${escapeHtml(ask)} — I have got your details.\n\n${escapeHtml(situation)}\n\nAre you free for a short call tomorrow? I can talk you through it and get you a firm number.\n\nBest,\n${sign}`;
};

const INDUSTRIES = ['Home Services', 'Real Estate', 'Insurance', 'Mortgage / Finance', 'Marketing Agency', 'Retail / E-commerce', 'Restaurants / Food', 'Health & Wellness', 'Consulting', 'Technology', 'Legal / Accounting', 'Other'];

const OTHER_INDUSTRY = 'Other';
const OTHER_BOTTLENECK = 'Something else';

const BOTTLENECKS = [
  'After-hours forms',
  'Slow first reply',
  'Quotes take too long',
  'No-shows / they go quiet',
  'Too many junk leads',
  OTHER_BOTTLENECK,
];

function normalizeUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

const PLACEHOLDER_BODY = '<span style="color:#4a6080;font-style:italic;">Tell us about the business and the first sample email appears here...</span>';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const COUNT_DURATION = 700;

// The count-up is decoration layered on top of a correct number, never the thing that
// produces it. State starts at the final value, so the real figure is in the DOM from
// first paint and survives every way the animation can fail to finish: the observer
// never reporting, the stats sitting below the fold, reduced motion, a crawler or a
// screenshot sampling the page early, or an unmount mid-tween.
function useCountUp(end, duration = COUNT_DURATION) {
  const [value, setValue] = useState(end);
  const ref = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    let started = false;
    let observerReported = false;

    const runTween = () => {
      if (started) return;
      started = true;
      const startedAt = performance.now();
      const step = (now) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        // Never render a zero. "0x more replies" was the worst thing this component
        // could put on screen, and a tween that counts from 0 puts it there on every
        // run for the 3x stat. Counting from 1 costs nothing visually.
        setValue(progress === 1 ? end : Math.max(1, Math.floor(eased * end)));
        if (progress < 1) frameRef.current = requestAnimationFrame(step);
      };
      setValue(1);
      frameRef.current = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(([entry]) => {
      observerReported = true;
      if (entry.isIntersecting) { observer.disconnect(); runTween(); }
    }, { threshold: 0.3 });
    observer.observe(el);

    // An IntersectionObserver reports its initial state shortly after observe(). If
    // nothing has come back within 200ms it is not working here, so stop waiting on it
    // and leave the final number showing rather than gambling on a callback.
    const watchdog = setTimeout(() => {
      if (!observerReported) observer.disconnect();
    }, 200);

    return () => {
      clearTimeout(watchdog);
      observer.disconnect();
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    };
  }, [end, duration]);

  return [value, ref];
}

function StatNum({ num, suffix, prefix = '' }) {
  const [count, ref] = useCountUp(num);
  return (
    // The surrounding .tif-stat carries an aria-label with the whole phrase, so the
    // digits are hidden from assistive tech instead of being read as they tick.
    <span className="tif-stat-num" ref={ref} aria-hidden="true">
      {prefix}{count}<span>{suffix}</span>
    </span>
  );
}

export default function TryItFree() {
  const [step, setStep] = useState(1);

  // Step 1 -- required
  const [firstName, setFirstName]           = useState('');
  const [firstNameError, setFirstNameError] = useState(false);
  const [email, setEmail]                   = useState('');
  const [emailError, setEmailError]         = useState(false);

  // Step 2 -- company, industry, headache and typical inbound are required: without
  // them the model has nothing to write AS, or anyone to write TO.
  const [bizName, setBizName]               = useState('');
  const [bizType, setBizType]               = useState('');
  const [bizTypeOther, setBizTypeOther]     = useState('');
  const [bottleneck, setBottleneck]         = useState('');
  const [bottleneckOther, setBottleneckOther] = useState('');
  const [typicalInbound, setTypicalInbound] = useState('');
  // Optional
  const [currentTools, setCurrentTools]     = useState('');
  const [website, setWebsite]               = useState('');
  const [notes, setNotes]                   = useState('');

  const [step2Errors, setStep2Errors]       = useState({});

  // Security
  const [honeypot, setHoneypot]         = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError]   = useState(false);

  // Preview
  const [previewVisible, setPreviewVisible] = useState(false);
  // From is the visitor's business, To is the invented lead. The sample is the agent
  // writing AS them, never us writing TO them.
  const [previewSubject, setPreviewSubject] = useState('Thanks for your inquiry');
  const [previewFrom,    setPreviewFrom]    = useState('Your business');
  const [previewBodyHtml, setPreviewBodyHtml] = useState(PLACEHOLDER_BODY);

  // Typing animation refs
  const typeTimeoutRef       = useRef(null);
  const previewTimeoutRef    = useRef(null);

  // Mobile scroll refs
  const cardRef              = useRef(null);
  const previewRef           = useRef(null);
  const hasScrolledToPreview = useRef(false);
  const previewScrollTimer   = useRef(null);

  // "Other" resolves to whatever the visitor typed, so downstream always gets a usable industry
  const industry = (bizType === OTHER_INDUSTRY ? bizTypeOther : bizType).trim();
  // Send what they actually meant. "Something else" on its own tells Make nothing, so
  // the free-text answer stands in as the label and also rides along in
  // bottleneck_notes for anyone reporting on the fixed options.
  const bottleneckLabel = (bottleneck === OTHER_BOTTLENECK ? bottleneckOther : bottleneck).trim();

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

  usePageMeta(PAGE_META.sample);

  // Restore the confirmation if this tab already submitted, so a refresh does not
  // silently re-send. "Send another demo" on the success panel clears this.
  useEffect(() => {
    if (!BLOCK_REPEAT_SUBMISSIONS) {
      // Clear anything a previous build left behind, so a tab that is already
      // flagged as submitted still gets a usable form.
      sessionStorage.removeItem('tif_submitted');
      sessionStorage.removeItem('tif_email');
      sessionStorage.removeItem('tif_first_name');
      return;
    }
    if (sessionStorage.getItem('tif_submitted')) {
      setEmail(sessionStorage.getItem('tif_email') || '');
      setFirstName(sessionStorage.getItem('tif_first_name') || '');
      setStep(3);
    }
  }, []);

  // Update preview as business details come in
  useEffect(() => {
    if (bizName.trim().length < 2 && industry.length < 2) {
      setPreviewVisible(false);
      setPreviewBodyHtml(PLACEHOLDER_BODY);
      hasScrolledToPreview.current = false;
      clearTimeout(previewScrollTimer.current);
      return;
    }

    const firstAppearance = !hasScrolledToPreview.current;
    setPreviewVisible(true);

    if (firstAppearance && window.innerWidth < 900) {
      hasScrolledToPreview.current = true;
      clearTimeout(previewScrollTimer.current);
      previewScrollTimer.current = setTimeout(() => {
        previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 1400);
    }

    // A reply subject on an inbound thread. Free text reads naturally as a fragment
    // here, which is why typical_inbound lands in the subject rather than the body.
    if (typicalInbound.trim()) {
      setPreviewSubject(`Re: ${typicalInbound.trim()}`);
    } else if (bizName.trim()) {
      setPreviewSubject(`Thanks for your inquiry — ${bizName.trim()}`);
    } else {
      setPreviewSubject('Thanks for your inquiry');
    }

    clearTimeout(previewTimeoutRef.current);
    previewTimeoutRef.current = setTimeout(() => {
      const text = PREVIEW_TEMPLATE(bizName, industry, bottleneck);
      typeText(text, setPreviewBodyHtml);
    }, 600);

    return () => clearTimeout(previewTimeoutRef.current);
  }, [bizName, industry, bottleneck, typicalInbound, typeText]);

  // From is the visitor sending as their own business -- "Sarah at Apex Roofing" --
  // because that is who the agent writes as. It was previously "<name>, Chicago AI
  // Group", which made the sample look like us pitching them.
  useEffect(() => {
    const who = firstName.trim();
    const biz = bizName.trim();
    if (who && biz)  setPreviewFrom(`${who} at ${biz}`);
    else if (biz)    setPreviewFrom(biz);
    else if (who)    setPreviewFrom(who);
    else             setPreviewFrom('Your business');
  }, [firstName, bizName]);

  // Clean up on unmount
  useEffect(() => () => {
    clearTimeout(typeTimeoutRef.current);
    clearTimeout(previewTimeoutRef.current);
    clearTimeout(previewScrollTimer.current);
  }, []);

  function goStep1() {
    const trimmedEmail = email.trim();
    const trimmedName  = firstName.trim();
    const badName  = trimmedName.length < 1;
    const badEmail = !isValidEmail(trimmedEmail);
    setFirstNameError(badName);
    setEmailError(badEmail);
    if (badName || badEmail) return;
    setFirstName(trimmedName);
    setEmail(trimmedEmail);
    setStep(2);
    setTimeout(() => cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }

  function markSubmitted() {
    if (BLOCK_REPEAT_SUBMISSIONS) {
      sessionStorage.setItem('tif_submitted', '1');
      sessionStorage.setItem('tif_email', email);
      sessionStorage.setItem('tif_first_name', firstName.trim());
    }
    setStep(3);
    setTimeout(() => cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }

  async function goStep3() {
    // Bot filled the hidden field: show the normal confirmation, send nothing.
    if (honeypot) { markSubmitted(); return; }

    // The four business inputs the sample cannot be written without.
    const errs = {};
    if (!bizName.trim())        errs.bizName = 'We sign the emails with this.';
    if (!bizType)               errs.bizType = 'Pick the closest one.';
    if (bizType === OTHER_INDUSTRY && !bizTypeOther.trim())
                                errs.bizTypeOther = 'Tell us in a few words.';
    if (!bottleneck)            errs.bottleneck = 'Pick the closest one.';
    if (bottleneck === OTHER_BOTTLENECK && !bottleneckOther.trim())
                                errs.bottleneckOther = 'Tell us in a few words.';
    if (!typicalInbound.trim()) errs.typicalInbound = 'We invent the sample customer from this.';
    setStep2Errors(errs);
    if (Object.keys(errs).length) {
      cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    setSubmitError(false);
    setPreviewVisible(false);
    setIsSubmitting(true);

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Survives the visitor closing the tab the instant they hit submit.
        keepalive: true,
        // RULES FOR THE MAKE SCENARIO THAT WRITES THE THREE EMAILS.
        // These cannot be enforced here -- the model prompt lives in Make, not in this
        // repo -- so the scenario has to carry them. Keep this list and the prompt in
        // step.
        //
        //   FROM     business_name. Sign off as that business, never as a person here.
        //   TO       a fictional inbound lead invented from typical_inbound + industry.
        //            Give them a first name. They are NOT the visitor.
        //   ABOUT    the inquiry described in typical_inbound.
        //   SITUATION flavoured by bottleneck (after-hours form, slow reply, quote
        //            delay, no-show, junk lead). Never say the bottleneck back to the
        //            visitor -- it picks the scene, it is not a talking point.
        //   VOICE    from notes and website when present.
        //   EMAIL 3  may offer times or ask a simple question. It may not sell us.
        //
        // Never, inside the three samples: address the visitor as if they were the
        // customer, use first_name as the recipient, mention Chicago AI Group, pricing,
        // strategy calls or "AI sales agent", or imply we mailed their real list.
        //
        // Keys below are what Make already maps -- do not rename them. typical_inbound
        // and lead_source_detail are additive.
        body: JSON.stringify({
          email:              email.trim(),
          first_name:         firstName.trim(),
          business_name:      bizName.trim(),
          industry,
          bottleneck:         bottleneckLabel,
          bottleneck_notes:   bottleneck === OTHER_BOTTLENECK ? bottleneckOther.trim() : '',
          typical_inbound:    typicalInbound.trim(),
          current_tools:      currentTools.trim(),
          website:            normalizeUrl(website),
          notes:              notes.trim(),
          lead_source_detail: 'Try It Free Form',
          submitted_at:       new Date().toISOString(),
          page_url:           window.location.href,
          ...getAttribution(),
        }),
      });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
      markSubmitted();
    } catch {
      // Never claim success we cannot verify -- the visitor keeps their answers and
      // can retry, instead of walking away believing the demo is on its way.
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Clear the submitted-this-tab guard and hand back an empty form.
  function startOver() {
    sessionStorage.removeItem('tif_submitted');
    sessionStorage.removeItem('tif_email');
    sessionStorage.removeItem('tif_first_name');
    setFirstName(''); setFirstNameError(false);
    setEmail('');     setEmailError(false);
    setBizName(''); setBizType(''); setBizTypeOther('');
    setBottleneck(''); setBottleneckOther(''); setTypicalInbound('');
    setCurrentTools(''); setWebsite(''); setNotes('');
    setStep2Errors({});
    setPreviewVisible(false);
    setPreviewBodyHtml(PLACEHOLDER_BODY);
    setPreviewSubject('Thanks for your inquiry');
    setPreviewFrom('Your business');
    hasScrolledToPreview.current = false;
    setIsSubmitting(false);
    setSubmitError(false);
    setStep(1);
    setTimeout(() => cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }

  const charLen = notes.length;
  const name    = firstName.trim() || 'there';

  function stepClass(n) {
    if (n < step) return 'done';
    if (n === step) return 'active';
    return '';
  }
  function lineClass(n) { return n < step ? 'done' : ''; }

  return (
    <>
      <style>{`
        /* -- TOKENS -- */
        .tif-root {
          --bg:         #06090f;
          --bg-2:       #0a0f1a;
          --bg-card:    #0d1422;
          --bg-input:   #0a111d;
          --border:     #1a2638;
          --border-hi:  #243550;
          --blue:       #10b981;
          --blue-hi:    #34d399;
          --blue-glow:  rgba(16,185,129,0.18);
          --blue-soft:  rgba(16,185,129,0.08);
          --text:       #e8eef8;
          --text-2:     #8fa3bf;
          --text-3:     #4a6080;
          --green:      #22d3a0;
          --green-glow: rgba(34,211,160,0.12);
          --r:          12px;
        }
        /* clip, not hidden. Per spec, setting one overflow axis to something other than
           visible computes the other axis from visible to auto -- so overflow-x:hidden
           quietly turned html, body and .tif-root into scroll containers on BOTH axes.
           position:sticky pins to its nearest scrolling ancestor, so the nav was
           sticking to .tif-root, which never scrolls (it just grows with its content)
           while the document scrolled on html two levels up. The nav therefore scrolled
           away and never came back, taking the only link back to the main site with it.
           overflow-x:clip clips without creating a scrollport; the hidden declaration
           before it is the fallback for browsers predating clip.

           overscroll-behavior-y is gone with it: there is no inner scroller here to
           chain from, and suppressing the rubber-band made touch scrolling feel stuck. */
        html, body { overflow-x: hidden; overflow-x: clip; }
        body { background: #06090f; }
        .tif-root * { box-sizing: border-box; }
        .tif-root {
          font-family: 'Inter', sans-serif;
          background: var(--bg);
          color: var(--text);
          min-height: 100vh;
          overflow-x: hidden;
          overflow-x: clip;
          width: 100%;
        }

        /* -- BG ATMOSPHERE -- */
        .tif-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; clip-path: inset(0); }
        .tif-orb { position: absolute; border-radius: 50%; filter: blur(120px); opacity: 0.35; }
        .tif-orb-1 { width:600px;height:600px;top:-200px;right:-100px;background:radial-gradient(circle,#059669 0%,transparent 70%);animation:tifDrift1 18s ease-in-out infinite alternate; }
        .tif-orb-2 { width:400px;height:400px;bottom:0;left:-100px;background:radial-gradient(circle,#064e3b 0%,transparent 70%);animation:tifDrift2 22s ease-in-out infinite alternate; }
        .tif-orb-3 { width:300px;height:300px;top:50%;left:50%;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(16,185,129,.15) 0%,transparent 70%);animation:tifPulse 8s ease-in-out infinite; }
        @keyframes tifDrift1 { from{transform:translate(0,0) scale(1)} to{transform:translate(-60px,80px) scale(1.1)} }
        @keyframes tifDrift2 { from{transform:translate(0,0) scale(1)} to{transform:translate(60px,-40px) scale(0.9)} }
        @keyframes tifPulse  { 0%,100%{opacity:.15} 50%{opacity:.3} }

        .tif-grid {
          position: fixed; inset: 0;
          background-image: linear-gradient(rgba(16,185,129,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,.025) 1px,transparent 1px);
          background-size: 60px 60px;
          pointer-events: none; z-index: 0;
        }

        /* -- NAV -- */
        .tif-nav {
          display:flex;align-items:center;justify-content:space-between;
          padding:20px 48px;
          border-bottom:1px solid var(--border);
          background:rgba(6,9,15,0.8);
          /* Hand-prefixed: this stylesheet is injected as a runtime <style> tag, so
             PostCSS and autoprefixer never see it. iOS Safari needed -webkit- here
             until 18, and without the blur this bar is only 80% opaque -- which did
             not show while the nav was wrongly scrolling away, but does now that
             content passes underneath it. */
          -webkit-backdrop-filter:blur(20px);
          backdrop-filter:blur(20px);
          position:sticky;top:0;z-index:100;
        }
        /* Reads as a control rather than faint label text -- this is the only way
           back to the main site from here, so it has to look clickable. Shaped like
           the pill buttons the main site uses for secondary actions. */
        .tif-nav-link {
          font-size:.875rem;color:var(--text);text-decoration:none;letter-spacing:.01em;
          display:inline-flex;align-items:center;gap:8px;white-space:nowrap;
          border:1px solid var(--border-hi);border-radius:999px;padding:9px 18px;
          transition:color .2s,border-color .2s,background .2s;
        }
        .tif-nav-link:hover { color:var(--blue-hi);border-color:var(--blue);background:var(--blue-soft); }
        .tif-nav-logo { display:inline-flex;text-decoration:none;transition:opacity .2s; }
        .tif-nav-logo:hover { opacity:.72; }

        /* -- LAYOUT -- */
        .tif-page { position:relative;z-index:1; }
        .tif-hero {
          padding:80px 48px 60px;
          max-width:1200px;margin:0 auto;
          display:grid;grid-template-columns:1fr 1fr;gap:80px;
          /* Capped, not a bare 100vh. The hero's content settles around 780px, so on
             anything taller than a laptop an uncapped viewport height just injected a
             void between the form and the stats bar -- 285px at 1080p, 645px at 1440p --
             and left the page with only ~210px of scroll however big the screen got.
             The cap keeps the full-height feel where the viewport is near the content
             height and stops the gap growing past it. */
          align-items:start;min-height:min(calc(100vh - 77px), 780px);
        }
        .tif-hero-left { padding-top:20px; }

        /* -- HERO COPY -- */
        .tif-label {
          display:inline-flex;align-items:center;gap:8px;
          background:var(--blue-soft);border:1px solid rgba(16,185,129,.2);
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
          background:linear-gradient(135deg,#34d399 0%,#10b981 50%,#059669 100%);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        }
        .tif-sub { font-size:1.05rem;line-height:1.7;color:var(--text-2);max-width:420px;margin-bottom:40px;font-weight:300;animation:tifFadeUp .6s .2s ease both; }
        /* The hero carries two paragraphs now -- the intro, then the "preview only"
           note. Same size and colour on purpose: the note is the reassurance people
           are looking for, so it should not read as dimmed small print. */
        .tif-sub-tight { margin-bottom:14px; }
        .tif-proof { display:flex;flex-direction:column;gap:12px;animation:tifFadeUp .6s .3s ease both; }
        .tif-proof-item { display:flex;align-items:center;gap:10px;font-size:.85rem;color:var(--text-2); }
        .tif-proof-icon { width:20px;height:20px;border-radius:50%;background:var(--green-glow);border:1px solid rgba(34,211,160,.3);display:flex;align-items:center;justify-content:center;font-size:.65rem;color:var(--green);flex-shrink:0; }

        @keyframes tifFadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

        /* -- FORM CARD -- */
        .tif-card {
          background:var(--bg-card);border:1px solid var(--border);border-radius:20px;
          padding:40px;position:relative;overflow:hidden;
          animation:tifFadeUp .6s .15s ease both;
          box-shadow:0 40px 80px rgba(0,0,0,.4),0 0 0 1px rgba(16,185,129,.05);
        }
        .tif-card::before {
          content:'';position:absolute;top:0;left:0;right:0;height:1px;
          background:linear-gradient(90deg,transparent,rgba(16,185,129,.5),transparent);
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
        .tif-step.active .tif-step-num { background:var(--blue);border-color:var(--blue);color:white;box-shadow:0 0 12px rgba(16,185,129,.5); }
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
        .tif-input.invalid,.tif-textarea.invalid,.tif-select.invalid { border-color:#f87171; }
        /* Helper text under a field. Sits above the error so the two never swap places
           when validation fires -- the field must not jump as you fill it in. */
        .tif-field-hint { font-size:.75rem;color:var(--text-3);margin-top:6px;line-height:1.5; }
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
        /* Keep paired inputs on a shared baseline even when one label wraps */
        .tif-field-row .tif-field { display:flex;flex-direction:column; }
        .tif-field-row .tif-input, .tif-field-row .tif-select { margin-top:auto; }
        .tif-char-counter { display:flex;justify-content:flex-end;font-size:.72rem;color:var(--text-3);margin-top:6px;font-family:var(--cag-mono);transition:color .2s; }
        .tif-char-counter.near { color:var(--blue-hi); }
        .tif-field-error { font-size:.75rem;color:#f87171;margin-top:6px;display:none; }
        .tif-field-error.show { display:block; }

        /* Buttons */
        .tif-btn {
          width:100%;padding:15px 24px;
          background:linear-gradient(135deg,#10b981,#059669);
          border:none;border-radius:100px;color:white;
          font-size:.95rem;font-weight:700;letter-spacing:.02em;
          cursor:pointer;transition:all .2s;
          position:relative;overflow:hidden;margin-top:8px;
        }
        .tif-btn::before { content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.1),transparent);opacity:0;transition:opacity .2s; }
        .tif-btn:hover { transform:translateY(-1px);box-shadow:0 8px 24px rgba(16,185,129,.35); }
        .tif-btn:hover::before { opacity:1; }
        .tif-btn:active { transform:translateY(0); }
        .tif-btn:disabled { opacity:0.6;cursor:not-allowed;transform:none;box-shadow:none; }

        /* -- MOBILE PREVIEW NUDGE -- */
        .tif-preview-nudge { display:none; }
        @media (max-width:900px) {
          /* iOS zooms the viewport when a focused input is under 16px. */
          .tif-input, .tif-select, .tif-textarea { font-size:16px; }
          .tif-btn { width:100%; }
          .tif-preview-nudge {
            display:flex;align-items:center;gap:10px;
            background:rgba(34,211,160,0.08);
            border:1px solid rgba(34,211,160,0.3);
            border-radius:10px;padding:13px 16px;
            font-size:.84rem;color:var(--green);
            cursor:pointer;margin-top:14px;
            animation:tifFadeUp .4s ease both,tifNudgePulse 2.4s ease-in-out 0.6s 3;
            transition:background .2s;
          }
          .tif-preview-nudge:active { background:rgba(34,211,160,0.16); }
          .tif-preview-nudge-icon { font-size:1rem;flex-shrink:0; }
        }
        @keyframes tifNudgePulse {
          0%,100% { box-shadow:0 0 0 0 rgba(34,211,160,0.4); }
          50%      { box-shadow:0 0 0 6px rgba(34,211,160,0); }
        }
        .tif-btn-back {
          background:none;border:none;color:var(--text-3);font-size:.82rem;cursor:pointer;
          padding:8px 0;display:flex;align-items:center;gap:6px;margin-bottom:20px;
          transition:color .2s;font-family:'Inter',sans-serif;
        }
        .tif-btn-back:hover { color:var(--text-2); }
        .tif-btn-restart {
          background:none;border:none;color:var(--text-2);font-size:.82rem;cursor:pointer;
          padding:10px 0;margin-top:14px;width:100%;text-align:center;
          transition:color .2s;font-family:'Inter',sans-serif;
        }
        .tif-btn-restart:hover { color:var(--blue-hi); }
        .tif-submit-error {
          background:rgba(248,113,113,0.08);border:1px solid rgba(248,113,113,0.35);
          border-radius:var(--r);padding:14px 16px;margin-bottom:16px;
          font-size:.82rem;line-height:1.6;color:#fca5a5;
        }
        .tif-submit-error strong { color:#fecaca;display:block;margin-bottom:2px; }
        .tif-submit-error a { color:#fca5a5;text-decoration:underline; }

        /* Legal */
        .tif-upsell { font-size:.84rem;color:var(--text-2);line-height:1.6;text-align:center;margin:0 0 14px; }
        .tif-legal { font-size:.72rem;color:var(--text-3);text-align:center;margin-top:16px;line-height:1.5; }
        .tif-legal a { color:var(--text-3);text-decoration:underline; }

        /* -- SUCCESS -- */
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
        .tif-et-badge { background:var(--blue-soft);border:1px solid rgba(16,185,129,.2);color:var(--blue-hi);font-family:var(--cag-mono);font-size:.68rem;padding:3px 10px;border-radius:100px;white-space:nowrap;flex-shrink:0;margin-top:2px; }
        .tif-et-strong { display:block;font-size:.84rem;color:var(--text);margin-bottom:2px; }
        .tif-et-span   { font-size:.78rem;color:var(--text-3); }

        /* -- PREVIEW -- */
        .tif-preview { margin-top:20px;background:var(--bg-2);border:1px solid var(--border);border-radius:14px;padding:20px;display:none;animation:tifFadeUp .4s ease both; }
        .tif-preview.visible { display:block; }
        .tif-preview-label { font-size:.68rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--text-3);margin-bottom:14px;display:flex;align-items:center;gap:8px; }
        .tif-preview-dot { width:5px;height:5px;border-radius:50%;background:var(--green);box-shadow:0 0 6px var(--green);animation:tifBlink 1.5s ease-in-out infinite; }


        .cursor { display:inline-block;width:2px;height:14px;background:var(--blue-hi);margin-left:2px;vertical-align:middle;animation:tifCursor .8s ease-in-out infinite; }
        @keyframes tifCursor { 0%,100%{opacity:1} 50%{opacity:0} }

        /* -- STATS BAR -- */
        .tif-stats { border-top:1px solid var(--border);padding:32px 48px;display:flex;justify-content:center;gap:80px;max-width:1200px;margin:0 auto;overflow:hidden; }
        /* Deliberately just the legal links: this is a conversion page and does not
           want the full site nav's worth of exits, but the policies have to be
           reachable from the page that collects the most data. */
        .tif-footer { border-top:1px solid var(--border);max-width:1200px;margin:0 auto;padding:22px 48px;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:6px 18px;font-size:.78rem;color:var(--text-3); }
        .tif-footer a { color:var(--text-2);text-decoration:none;transition:color .2s; }
        .tif-footer a:hover { color:var(--blue-hi); }
        .tif-footer i { color:var(--border-hi);font-style:normal; }
        .tif-stat  { text-align:center;min-width:0; }
        .tif-stat-num { font-size:3rem;font-weight:700;color:#fff;display:block;line-height:1;margin-bottom:4px; }
        .tif-stat-num span { color:var(--blue-hi); }
        .tif-stat-label { font-size:.78rem;color:var(--text-3);letter-spacing:.04em; }

        /* -- RESPONSIVE -- */
        @media (max-width:900px) {
          .tif-hero { grid-template-columns:1fr;gap:40px;padding:48px 20px 48px;min-height:auto; }
          .tif-h1 { font-size:2.6rem; }
          .tif-sub { max-width:100%; }
          .tif-nav { padding:16px 20px; }
          .tif-stats { padding:32px 20px;gap:40px;flex-wrap:wrap; }
          .tif-orb-1 { width:320px;height:320px;right:-60px;top:-100px; }
          .tif-orb-2 { width:240px;height:240px;left:-60px; }
        }
        @media (max-width:520px) {
          .tif-hero { padding:40px 16px; }
          .tif-h1 { font-size:2rem; }
          .tif-card { padding:24px 16px; }
          .tif-field-row { grid-template-columns:1fr; }
          .tif-nav { padding:14px 16px; }
          .tif-stats { gap:20px;padding:28px 16px; }
          .tif-footer { padding:20px 16px; }
          .tif-stat-num { font-size:2.2rem; }
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
            <Link to="/" className="tif-nav-logo" aria-label="Chicago AI Group home">
              <Logo />
            </Link>
            <Link to="/" className="tif-nav-link">&larr; Back to Home</Link>
          </nav>

          {/* HERO */}
          <section className="tif-hero">
            {/* Left: copy */}
            <div className="tif-hero-left">
              <div className="tif-label">
                <span className="tif-label-dot" />
                Sample emails — no credit card
              </div>
              <h1 className="tif-h1">See what an AI follow-up<br/>to your next lead<br/><em>would say.</em></h1>
              <p className="tif-sub tif-sub-tight">
                Tell us what you do. We&rsquo;ll write three short emails as if someone just asked you for a quote, and send them to you.
              </p>
              <p className="tif-sub">
                They&rsquo;re an example of the agent writing in your voice. Preview only &mdash; we don&rsquo;t email your customers.
              </p>
              <div className="tif-proof">
                {[
                  'Written by AI as your business, to a new lead',
                  'Based on what you tell us — not a generic template',
                  'Three emails to your inbox — unsubscribe anytime',
                  'Preview only. Nothing goes to your customers.',
                ].map((item, i) => (
                  <div className="tif-proof-item" key={i}>
                    <div className="tif-proof-icon">&#10003;</div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: form */}
            <div>
              <div className="tif-card" ref={cardRef}>
                {/* Steps indicator */}
                <div className="tif-steps">
                  <div className={`tif-step ${stepClass(1)}`}>
                    <div className="tif-step-num">{step > 1 ? '\u2713' : '1'}</div>
                    <span>Your Details</span>
                  </div>
                  <div className={`tif-step-line ${lineClass(1)}`} />
                  <div className={`tif-step ${stepClass(2)}`}>
                    <div className="tif-step-num">{step > 2 ? '\u2713' : '2'}</div>
                    <span>Your Business</span>
                  </div>
                  <div className={`tif-step-line ${lineClass(2)}`} />
                  <div className={`tif-step ${stepClass(3)}`}>
                    <div className="tif-step-num">3</div>
                    <span>Confirmed</span>
                  </div>
                </div>

                {/* Panel 1 -- Email */}
                <div className={`tif-panel ${step === 1 ? 'active' : ''}`}>
                  <div className="tif-form-title">Where should we send it?</div>
                  <div className="tif-form-sub">Two fields. Next you&rsquo;ll tell us about the business so the AI can write as you.</div>
                  <div className="tif-field">
                    <label className="tif-label-text" htmlFor="tif-first-name">First Name</label>
                    <input
                      id="tif-first-name"
                      type="text"
                      className={`tif-input${firstNameError ? ' invalid' : ''}`}
                      placeholder="e.g. Sarah"
                      autoComplete="given-name"
                      maxLength={50}
                      autoFocus
                      value={firstName}
                      onChange={e => { setFirstName(e.target.value); setFirstNameError(false); }}
                      onKeyDown={e => e.key === 'Enter' && goStep1()}
                    />
                    <div className={`tif-field-error${firstNameError ? ' show' : ''}`}>Please enter your first name.</div>
                  </div>
                  <div className="tif-field">
                    <label className="tif-label-text" htmlFor="tif-email">Business Email Address</label>
                    <input
                      id="tif-email"
                      type="email"
                      className={`tif-input${emailError ? ' invalid' : ''}`}
                      placeholder="you@yourbusiness.com"
                      autoComplete="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setEmailError(false); }}
                      onKeyDown={e => e.key === 'Enter' && goStep1()}
                    />
                    <div className={`tif-field-error${emailError ? ' show' : ''}`}>Please enter a valid email address.</div>
                  </div>
                  <button type="button" className="tif-btn" onClick={goStep1}>Continue &nbsp;&rarr;</button>
                  <div className="tif-legal">
                    {/* No hard break inside the sentence: it is a different length now,
                        and forcing one strands a single word on its own line at 390px. */}
                    No spam. Unsubscribe in one click. By continuing you agree to receive three sample emails from Chicago AI Group.<br/>
                    <Link to="/privacy">Privacy Policy</Link> &middot; <Link to="/terms">Terms of Use</Link>
                  </div>
                </div>

                {/* Panel 2 -- Business Details */}
                <div className={`tif-panel ${step === 2 ? 'active' : ''}`}>
                  <button type="button" className="tif-btn-back" onClick={() => setStep(1)}>&larr; Back</button>
                  <div className="tif-form-title">Tell us about your business</div>
                  <div className="tif-form-sub">We use this to write as you, to a customer who just inquired. Not a pitch to you.</div>

                  <div className="tif-field-row">
                    <div className="tif-field">
                      <label className="tif-label-text" htmlFor="tif-biz-name">Your company name</label>
                      <input id="tif-biz-name" type="text" className={`tif-input${step2Errors.bizName ? ' invalid' : ''}`} placeholder="e.g. Apex Roofing" autoComplete="organization" maxLength={80} value={bizName}
                        onChange={e => { setBizName(e.target.value); setStep2Errors(p => ({ ...p, bizName: null })); }} />
                      <div className={`tif-field-error${step2Errors.bizName ? ' show' : ''}`}>{step2Errors.bizName}</div>
                    </div>
                    <div className="tif-field">
                      <label className="tif-label-text" htmlFor="tif-biz-type">What kind of business?</label>
                      <select id="tif-biz-type" className={`tif-select${step2Errors.bizType ? ' invalid' : ''}`} value={bizType}
                        onChange={e => { setBizType(e.target.value); setStep2Errors(p => ({ ...p, bizType: null })); }}>
                        <option value="" disabled>Select one</option>
                        {INDUSTRIES.map(opt => (<option key={opt}>{opt}</option>))}
                      </select>
                      <div className={`tif-field-error${step2Errors.bizType ? ' show' : ''}`}>{step2Errors.bizType}</div>
                    </div>
                  </div>

                  {bizType === OTHER_INDUSTRY && (
                    <div className="tif-field">
                      <label className="tif-label-text" htmlFor="tif-biz-type-other">What industry are you in?</label>
                      <input id="tif-biz-type-other" type="text" className={`tif-input${step2Errors.bizTypeOther ? ' invalid' : ''}`} placeholder="e.g. Commercial landscaping" maxLength={60} autoFocus value={bizTypeOther}
                        onChange={e => { setBizTypeOther(e.target.value); setStep2Errors(p => ({ ...p, bizTypeOther: null })); }} />
                      <div className={`tif-field-error${step2Errors.bizTypeOther ? ' show' : ''}`}>{step2Errors.bizTypeOther}</div>
                    </div>
                  )}

                  <div className="tif-field">
                    <label className="tif-label-text" htmlFor="tif-bottleneck">Where do leads slip?</label>
                    <select id="tif-bottleneck" className={`tif-select${step2Errors.bottleneck ? ' invalid' : ''}`} value={bottleneck}
                      onChange={e => { setBottleneck(e.target.value); setStep2Errors(p => ({ ...p, bottleneck: null })); }}>
                      <option value="" disabled>Select one</option>
                      {BOTTLENECKS.map(opt => (<option key={opt}>{opt}</option>))}
                    </select>
                    <div className="tif-field-hint">This shapes the scenario (what the fake customer asked for). We still write to them, not to you.</div>
                    <div className={`tif-field-error${step2Errors.bottleneck ? ' show' : ''}`}>{step2Errors.bottleneck}</div>
                  </div>

                  {bottleneck === OTHER_BOTTLENECK && (
                    <div className="tif-field">
                      <label className="tif-label-text" htmlFor="tif-bottleneck-other">Where do they slip?</label>
                      <input id="tif-bottleneck-other" type="text" className={`tif-input${step2Errors.bottleneckOther ? ' invalid' : ''}`} placeholder="e.g. We quote fast but never chase" maxLength={80} autoFocus value={bottleneckOther}
                        onChange={e => { setBottleneckOther(e.target.value); setStep2Errors(p => ({ ...p, bottleneckOther: null })); }} />
                      <div className={`tif-field-error${step2Errors.bottleneckOther ? ' show' : ''}`}>{step2Errors.bottleneckOther}</div>
                    </div>
                  )}

                  <div className="tif-field">
                    <label className="tif-label-text" htmlFor="tif-typical-inbound">Who usually contacts you, and what do they want?</label>
                    <input id="tif-typical-inbound" type="text" className={`tif-input${step2Errors.typicalInbound ? ' invalid' : ''}`} placeholder="e.g. homeowner asking for a roofing quote" maxLength={160} value={typicalInbound}
                      onChange={e => { setTypicalInbound(e.target.value); setStep2Errors(p => ({ ...p, typicalInbound: null })); }} />
                    <div className="tif-field-hint">We invent the sample customer from this. We still email you, not them.</div>
                    <div className={`tif-field-error${step2Errors.typicalInbound ? ' show' : ''}`}>{step2Errors.typicalInbound}</div>
                  </div>

                  <div className="tif-field-row">
                    <div className="tif-field">
                      <label className="tif-label-text" htmlFor="tif-tools">
                        CRM or Tools <span className="tif-label-opt">(optional)</span>
                      </label>
                      <input id="tif-tools" type="text" className="tif-input" placeholder="e.g. HubSpot, or none yet" maxLength={80} value={currentTools} onChange={e => setCurrentTools(e.target.value)} />
                    </div>
                    <div className="tif-field">
                      <label className="tif-label-text" htmlFor="tif-website">
                        Website <span className="tif-label-opt">(optional)</span>
                      </label>
                      <input id="tif-website" type="text" inputMode="url" className="tif-input" placeholder="yourbusiness.com" autoComplete="url" maxLength={120} value={website} onChange={e => setWebsite(e.target.value)} />
                    </div>
                  </div>

                  <div className="tif-field">
                    <label className="tif-label-text" htmlFor="tif-notes">
                      How you sound <span className="tif-label-opt">(optional)</span>
                    </label>
                    <textarea
                      id="tif-notes"
                      className="tif-textarea"
                      rows={3}
                      maxLength={300}
                      placeholder="e.g. Plain and direct, no fluff. We always mention the 10-year workmanship warranty."
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                    />
                    <div className="tif-field-hint">Anything about how you sound. No need to repeat where leads slip.</div>
                    <div className={`tif-char-counter${charLen > 240 ? ' near' : ''}`}>{charLen} / 300</div>
                  </div>

                  {/* Honeypot -- invisible to real users, bots fill it automatically.
                      Deliberately NOT named "website": a real Website field now exists, and an
                      autofill collision here would silently discard a genuine submission. */}
                  <div style={{position:'absolute',left:'-9999px',width:'1px',height:'1px',overflow:'hidden'}} aria-hidden="true">
                    <input type="text" name="url_confirm" value={honeypot} onChange={e => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
                  </div>

                  {submitError && (
                    <div className="tif-submit-error" role="alert">
                      <strong>That didn't go through.</strong> Your answers are still here &mdash; try again in a moment.
                      If it keeps failing, email us at <a href="mailto:matt@chicagoaigroup.com">matt@chicagoaigroup.com</a> and we&rsquo;ll write them for you by hand.
                    </div>
                  )}
                  <button type="button" className="tif-btn" onClick={goStep3} disabled={isSubmitting}>
                    {isSubmitting ? 'Sending\u2026' : submitError ? 'Try Again \u00a0\u2192' : 'Send my sample emails \u00a0\u2192'}
                  </button>
                  <div className="tif-legal">
                    Your information is never sold or shared. We use it only to write your emails.<br/>
                    <Link to="/privacy">Privacy Policy</Link> &middot; <Link to="/terms">Terms of Use</Link>
                  </div>

                  {/* Mobile nudge */}
                  {previewVisible && (
                    <div className="tif-preview-nudge" role="button" aria-label="Scroll to email preview" onClick={() => previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })}>
                      <span className="tif-preview-nudge-icon">{'\u2709\uFE0F'}</span>
                      <span>Your personalized email is ready — tap to see it &darr;</span>
                    </div>
                  )}
                </div>

                {/* Panel 3 -- Success */}
                <div className={`tif-panel ${step === 3 ? 'active' : ''}`}>
                  <div className="tif-success">
                    <div className="tif-success-icon">{'\uD83D\uDE80'}</div>
                    <div className="tif-success-title">Your first sample is on the way</div>
                    <div className="tif-success-sub">
                      We&rsquo;re writing them now, {name}. Check {email} &mdash; the first one is on its way. They&rsquo;re examples of follow-ups to a lead, written as {bizName.trim() || 'your business'}. We have not emailed your customers.
                    </div>
                    <div className="tif-timeline">
                      {[
                        { badge: 'Now',   title: 'Email 1 — First reply',   desc: 'A short, specific reply written for what you do' },
                        { badge: 'Day 3', title: 'Email 2 — A nudge',      desc: 'A second try from a different angle, still sounding like a person' },
                        { badge: 'Day 5', title: 'Email 3 — Last check-in', desc: 'A brief final note that leaves the door open, no pressure' },
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
                    <p className="tif-upsell">Want this on real leads? Book a strategy call.</p>
                    <a className="tif-btn" href={EXTERNAL_URLS.appointments} target="_blank" rel="noopener noreferrer" style={{display:'block',textDecoration:'none',textAlign:'center'}}>
                      Book a strategy call
                    </a>
                    <button type="button" className="tif-btn-restart" onClick={startOver}>
                      Send another set &rarr;
                    </button>
                  </div>
                </div>
              </div>

              {/* Live Preview */}
              <div className={`tif-preview${previewVisible ? ' visible' : ''}`} ref={previewRef}>
                <div className="tif-preview-label">
                  <div className="tif-preview-dot" />
                  Live Preview — Email 1
                </div>
                {/* To: names the invented customer, so it is visible at a glance that
                    the sample is addressed to a lead and not to the visitor. */}
                <EmailPreview
                  from={previewFrom}
                  to={`${scenarioFor(industry).lead} (sample lead)`}
                  subject={previewSubject}
                  bodyHtml={previewBodyHtml}
                  footnote="Sample only — written as your business to a made-up customer. Nothing is sent to your real leads."
                />
              </div>
            </div>
          </section>

          {/* STATS BAR */}
          <div className="tif-stats">
            {/* `sr` spells the same figure out for screen readers, where "5+" and
                "<60s" read poorly. The visible label is unchanged. */}
            {[
              { num: 80, suffix: '%', prefix: '',  label: 'of sales need 5+ follow-ups',      sr: '80% of sales need 5 or more follow-ups' },
              { num: 44, suffix: '%', prefix: '',  label: 'of reps give up after 1 attempt',  sr: '44% of reps give up after 1 attempt' },
              { num: 60, suffix: 's', prefix: '<', label: 'average response time',            sr: 'Under 60 seconds average response time' },
              { num: 3,  suffix: 'x', prefix: '',  label: 'more replies vs manual follow-up', sr: '3x more replies versus manual follow-up' },
            ].map((s, i) => (
              <div className="tif-stat" key={i} role="group" aria-label={s.sr}>
                <StatNum num={s.num} suffix={s.suffix} prefix={s.prefix} />
                <span className="tif-stat-label" aria-hidden="true">{s.label}</span>
              </div>
            ))}
          </div>

          <footer className="tif-footer">
            <span>© {new Date().getFullYear()} The Chicago AI Group</span>
            <i aria-hidden="true">·</i>
            <Link to="/privacy">Privacy</Link>
            <i aria-hidden="true">·</i>
            <Link to="/terms">Terms</Link>
            <i aria-hidden="true">·</i>
            <Link to="/contact">Contact</Link>
          </footer>
        </div>
      </div>
    </>
  );
}
