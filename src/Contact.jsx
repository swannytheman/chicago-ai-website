import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Clock, Shield } from 'lucide-react';
import { SiteNav, SiteFooter } from './SiteChrome.jsx';
import { EXTERNAL_URLS, SECURE_LINK_PROPS, CONTACT_EMAIL } from './siteConfig.js';
import { getAttribution } from './attribution.js';
import { HeadshotAvatar } from './Headshot.jsx';
import { usePageMeta } from './usePageMeta.js';
import { PAGE_META } from './seo.js';

// TODO: paste the Make.com webhook for contact enquiries here.
//
// Deliberately empty until one exists. Do NOT reuse the Try It Free hook
// (see WEBHOOK_URL in TryItFree.jsx): that scenario replies with a three-email demo
// sequence, so a contact enquiry sent there would get marketing emails nobody asked
// for. Create a second webhook, or route on the form_type field this posts.
//
// While this is empty the form does not pretend to send. It validates, then hands the
// visitor their message pre-filled as an email so the enquiry still reaches us.
//
// A hook on a host other than hook.us2.make.com also needs adding to connect-src in
// vercel.json, or the browser will refuse the request.
const CONTACT_WEBHOOK_URL = '';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

const FIELD_CLASS = 'w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-emerald-500/50 focus:bg-white';
const LABEL_CLASS = 'block t-label mb-2';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [website, setWebsite] = useState('');
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // 'sent' | 'failed' | 'unconfigured'

  usePageMeta(PAGE_META.contact);

  // Everything the visitor typed, as an email we can pre-fill for them.
  function mailtoFallback() {
    const body = [
      `Name: ${name.trim()}`,
      `Email: ${email.trim()}`,
      company.trim() && `Company: ${company.trim()}`,
      website.trim() && `Website: ${normalizeUrl(website)}`,
      '',
      message.trim() || '(no message)',
    ].filter(Boolean).join('\n');
    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Website enquiry')}&body=${encodeURIComponent(body)}`;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = {};
    if (!name.trim()) nextErrors.name = 'Please enter your name.';
    if (!isValidEmail(email.trim())) nextErrors.email = 'Please enter a valid work email.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    if (!CONTACT_WEBHOOK_URL) {
      setStatus('unconfigured');
      return;
    }

    setStatus(null);
    setIsSubmitting(true);
    try {
      const res = await fetch(CONTACT_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({
          form_type: 'contact',
          name: name.trim(),
          email: email.trim(),
          company: company.trim(),
          website: normalizeUrl(website),
          message: message.trim(),
          submitted_at: new Date().toISOString(),
          page_url: window.location.href,
          ...getAttribution(),
        }),
      });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
      setStatus('sent');
    } catch {
      setStatus('failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900 overflow-x-hidden">
      <SiteNav solid />

      <section className="pt-28 pb-14 md:pt-36 md:pb-20" aria-labelledby="contact-heading">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16">
            <span className="t-eyebrow mb-4">Contact</span>
            <h1 id="contact-heading" className="t-h1 mb-6">Talk to the Chicago team</h1>
            <p className="t-lede">
              We implement and run AI sales agents that qualify your leads and book meetings, so your team only talks to serious buyers.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 items-start">
            {/* Primary path: book a call */}
            <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.04] p-6 sm:p-8 md:p-10">
              {/* The person on the call, rather than a calendar icon. */}
              <div className="flex items-center gap-4 mb-6">
                <HeadshotAvatar size={56} className="border-2 border-white shadow-sm" />
                <div>
                  <div className="font-semibold">Matt Swanson</div>
                  <div className="text-sm text-zinc-500">Chicago AI Group</div>
                </div>
              </div>
              <h2 className="text-2xl font-semibold tracking-[-0.025em] mb-3">Book a strategy call</h2>
              <p className="text-zinc-700 leading-relaxed mb-8">
                The fastest way to get answers. We&apos;ll look at how leads reach you today and where an AI agent would actually help.
              </p>
              <a href={EXTERNAL_URLS.appointments} {...SECURE_LINK_PROPS} className="w-full sm:w-auto bg-zinc-900 text-white px-8 py-4 rounded-full font-medium hover:bg-zinc-700 transition inline-flex items-center justify-center gap-2">
                Book a 30-minute strategy call <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </a>
              <ul className="mt-8 space-y-3 text-sm text-zinc-600">
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-emerald-600 flex-shrink-0" aria-hidden="true" /> Free, 30 minutes, no obligation</li>
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-emerald-600 flex-shrink-0" aria-hidden="true" /> A working session, not a pitch</li>
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-emerald-600 flex-shrink-0" aria-hidden="true" /> Talk to the people who build it</li>
              </ul>
            </div>

            {/* Secondary path: send a message */}
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 sm:p-8 md:p-10">
              <h2 className="text-2xl font-semibold tracking-[-0.025em] mb-3">Or send us a message</h2>
              <p className="text-zinc-600 leading-relaxed mb-8">
                Prefer to write first? Tell us what you&apos;re trying to fix and we&apos;ll come back to you.
              </p>

              {status === 'sent' ? (
                <div className="rounded-xl border border-emerald-600/30 bg-emerald-500/[0.06] p-6" role="status">
                  <div className="font-semibold text-emerald-700 mb-2">Thanks &mdash; that&apos;s with us.</div>
                  <p className="text-sm text-zinc-700 leading-relaxed">
                    We&apos;ll reply within one business day. If it&apos;s urgent, book a call using the panel on the left.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className={LABEL_CLASS} htmlFor="contact-name">Name</label>
                      <input id="contact-name" type="text" className={FIELD_CLASS} placeholder="Sarah Miller" autoComplete="name" maxLength={80}
                        value={name} onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: null })); }} />
                      {errors.name && <p className="text-xs text-red-600 mt-2">{errors.name}</p>}
                    </div>
                    <div>
                      <label className={LABEL_CLASS} htmlFor="contact-email">Work Email</label>
                      <input id="contact-email" type="email" className={FIELD_CLASS} placeholder="you@yourbusiness.com" autoComplete="email" maxLength={120}
                        value={email} onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: null })); }} />
                      {errors.email && <p className="text-xs text-red-600 mt-2">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className={LABEL_CLASS} htmlFor="contact-company">Company</label>
                      <input id="contact-company" type="text" className={FIELD_CLASS} placeholder="Apex Roofing" autoComplete="organization" maxLength={80}
                        value={company} onChange={e => setCompany(e.target.value)} />
                    </div>
                    <div>
                      <label className={LABEL_CLASS} htmlFor="contact-website">Website <span className="normal-case tracking-normal text-zinc-400">(optional)</span></label>
                      <input id="contact-website" type="text" inputMode="url" className={FIELD_CLASS} placeholder="yourbusiness.com" autoComplete="url" maxLength={120}
                        value={website} onChange={e => setWebsite(e.target.value)} />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className={LABEL_CLASS} htmlFor="contact-message">Message <span className="normal-case tracking-normal text-zinc-400">(optional)</span></label>
                    <textarea id="contact-message" rows={4} className={`${FIELD_CLASS} resize-none leading-relaxed`} maxLength={1000}
                      placeholder="What&apos;s slowing your team down right now?"
                      value={message} onChange={e => setMessage(e.target.value)} />
                  </div>

                  {status === 'failed' && (
                    <div className="rounded-xl border border-red-400/35 bg-red-400/[0.08] p-4 mb-5 text-sm leading-relaxed text-red-700" role="alert">
                      <strong className="block text-red-800 mb-1">That didn&apos;t go through.</strong>
                      Your answers are still here &mdash; try again in a moment, or{' '}
                      <a className="underline" href={mailtoFallback()}>email us directly</a>.
                    </div>
                  )}

                  {status === 'unconfigured' && (
                    <div className="rounded-xl border border-amber-400/35 bg-amber-400/[0.08] p-4 mb-5 text-sm leading-relaxed text-amber-800" role="alert">
                      <strong className="block text-amber-900 mb-1">This form isn&apos;t connected yet.</strong>
                      Rather than lose your message, we&apos;ve put it into an email for you &mdash;{' '}
                      <a className="underline" href={mailtoFallback()}>send it to {CONTACT_EMAIL}</a>, or book a call using the panel on the left.
                    </div>
                  )}

                  <button type="submit" disabled={isSubmitting}
                    className="w-full bg-zinc-900 text-white px-8 py-4 rounded-full font-medium hover:bg-zinc-700 transition disabled:opacity-60 inline-flex items-center justify-center gap-2">
                    {isSubmitting ? 'Sending…' : <>Send Message <ArrowRight className="w-4 h-4" aria-hidden="true" /></>}
                  </button>
                  <p className="mt-4 text-xs text-zinc-500 text-center leading-relaxed">
                    We use your details only to reply to you.{' '}
                    <Link to="/privacy" className="underline hover:text-zinc-700">Privacy Policy</Link>
                    {' · '}
                    <Link to="/terms" className="underline hover:text-zinc-700">Terms of Use</Link>
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* Small print */}
          <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-zinc-500">
            <span className="inline-flex items-center gap-2"><Clock className="w-4 h-4 text-emerald-600/70" aria-hidden="true" /> We reply within 1 business day</span>
            <span className="inline-flex items-center gap-2"><Shield className="w-4 h-4 text-emerald-600/70" aria-hidden="true" /> The call is free and there&apos;s no pitch theater</span>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
