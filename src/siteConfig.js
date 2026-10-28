// Shared across the marketing pages so the nav, footer and individual pages cannot
// drift apart.

export const EXTERNAL_URLS = {
  appointments: 'https://calendly.com/matt-chicagoaigroup/30min',
};

// Where we can be reached by email. This address is also offered as a fallback on the
// Try It Free form when its webhook fails.
export const CONTACT_EMAIL = 'matt@chicagoaigroup.com';

export const SECURE_LINK_PROPS = {
  target: '_blank',
  rel: 'noopener noreferrer',
};

// Section links live on the home page. From any other route the nav routes back to
// "/" with the id as a hash and the home page scrolls to it on arrival.
export const NAV_ITEMS = [
  { label: 'How It Works', id: 'how-it-works' },
  { label: 'Results', id: 'testimonials' },
  { label: 'About', id: 'about' },
  { label: 'Pricing', id: 'services' },
  { label: 'FAQ', id: 'faq' },
];

// The trade landing pages, in the order the "Industries" menu and the footer list them.
// To add one: build the page (copy Plumbing.jsx), add its <Route> in App.jsx and its
// PAGE_META entry in seo.js, then add a line here; the nav dropdown, the mobile menu
// and the footer all read from this list.
export const USE_CASES = [
  { path: '/roofing', label: 'Roofing', blurb: 'Quote requests, booked as inspections' },
  { path: '/hvac', label: 'HVAC', blurb: 'Heating and cooling calls, booked as visits' },
  { path: '/plumbing', label: 'Plumbing', blurb: 'Repairs and estimates, booked as visits' },
  { path: '/medspa', label: 'Med Spa', blurb: 'Treatment inquiries, booked as consults' },
];

export function sectionId(id) {
  return id.toLowerCase().replace(/[^a-z0-9-]/g, '');
}

// Founding client pricing: 25% off the one-time setup fee on the managed plans for our
// first 3 clients. Flip to false once 3 founding clients have signed; every page then
// drops the banner and the struck-through prices and shows the regular setup fee.
export const FOUNDING_ACTIVE = true;

// The public plan prices. The homepage plan picker and every industry page's pricing
// cards read from here, so no two pages can quote different numbers. foundingSetup is
// exactly 75% of setup; monthly prices never change with the founding offer.
export const PLANS = {
  Starter: { monthly: '$499', setup: '$2,500', foundingSetup: '$1,875' },
  Pro: { monthly: '$999', setup: '$3,500', foundingSetup: '$2,625' },
  Enterprise: { monthly: '$1,800', setup: '$5,900', foundingSetup: '$4,425' },
};

// Setup Only: we build it and hand it over. One-time fee, no monthly, no ongoing
// management, a 14-day workmanship guarantee instead of the 60-day Results Guarantee,
// and never founding pricing.
export const SETUP_ONLY = { setup: '$1,250', monthly: null };
