// Per-route document head.
//
// This is a client-rendered SPA, so these tags are applied by JavaScript. Google
// renders JS and will see them. Social crawlers (Slack, LinkedIn, Facebook, iMessage)
// do NOT run JS -- they read the static index.html, which carries the homepage set as
// a sane default for any pasted URL. Genuinely per-route social previews would need
// prerendering; these tags cover search and the browser tab.

export const SITE_URL = 'https://www.chicagoaigroup.com';
export const SITE_NAME = 'Chicago AI Group';
// ?v= is a cache-bust: scrapers hold the old artwork indefinitely otherwise.
// Bump it whenever public/og-image.png is re-rendered from scripts/og-card.html.
export const OG_IMAGE = `${SITE_URL}/og-image.png?v=2`;
export const OG_IMAGE_ALT = 'Chicago AI Group — AI that books meetings. Book a strategy call.';

export const PAGE_META = {
  home: {
    path: '/',
    title: 'AI sales agents that book meetings | Chicago AI Group',
    description: 'Managed AI follow-up for Chicago service businesses. We qualify leads and book meetings. Live in 2–4 weeks.',
  },
  sample: {
    path: '/try-it-free',
    title: 'Sample follow-up sequence | Chicago AI Group',
    description: 'See a 3-email follow-up written for your business. Preview only — not a live agent trial.',
  },
  contact: {
    path: '/contact',
    title: 'Contact | Chicago AI Group',
    description: 'Book a 30-minute strategy call with Matt Swanson or send a note.',
  },
  privacy: {
    path: '/privacy',
    title: 'Privacy Policy | Chicago AI Group',
    description: 'What this site collects, why we collect it, and how to have it removed. No cookies and no tracking pixels.',
  },
  terms: {
    path: '/terms',
    title: 'Terms of Use | Chicago AI Group',
    description: 'The terms covering your use of this website. Paid work is governed by a separate written agreement.',
  },
  // No canonical and no og:url: an unknown path should not claim to be a real page.
  notFound: {
    path: null,
    noindex: true,
    title: 'Page not found | Chicago AI Group',
    description: 'That page does not exist. Head back to the homepage or get in touch.',
  },
};
