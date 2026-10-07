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

export function sectionId(id) {
  return id.toLowerCase().replace(/[^a-z0-9-]/g, '');
}

// The public plan prices. The homepage plan picker and the /roofing pricing cards both
// read from here, so the two pages cannot quote different numbers.
export const PLAN_PRICES = {
  Starter: { monthly: '$499', setup: '$2,500' },
  Pro: { monthly: '$999', setup: '$3,500' },
  Enterprise: { monthly: '$1,800', setup: '$5,900' },
};
