import VerticalLanding from './VerticalLanding.jsx';
import { PAGE_META } from './seo.js';
import { SUMMIT_ROOFING } from './demoScenarios.js';

// /roofing: the one URL sales and ads use for residential roofers. Layout, prices and
// the guarantee live in VerticalLanding; this is only the roofing-specific copy.
const ROOFING = {
  slug: 'roofing',
  meta: PAGE_META.roofing,
  trade: 'roofing',
  audience: 'For residential roofing companies',
  headline: {
    lead: 'The quote request came in at 8:30pm.',
    punch: 'Someone else booked the inspection.',
  },
  subhead: <>We reply to your inbound roofing leads in about five minutes, in your voice, and book the ones worth a visit. You take the meeting. Live in <span className="whitespace-nowrap">2–4 weeks</span>.</>,
  example: {
    title: 'Tuesday night form. Reply four minutes later. Inspection on Thursday.',
    body: 'A homeowner fills in your quote form at 8:30 on a Tuesday night, while your crew is packing up. Four minutes later they have a reply that sounds like your office, with two inspection times. They pick Thursday morning, and it is on your calendar before anyone at your company has seen the lead.',
    scenario: SUMMIT_ROOFING,
  },
  steps: {
    title: 'Catch it. Qualify it. Book the inspection.',
    lede: 'We build it and run it. You take the meeting. The writing is handled by an agent trained on how your office actually emails customers, so it reads like you sent it.',
    items: [
      {
        title: 'Catch the lead',
        desc: 'We wire the one inbound source you already have — your website form, Google, Local Services Ads, Angi, or a storm campaign. A new quote request gets a reply in about five minutes, day or night, even while your crew is on a roof.',
      },
      {
        title: 'Qualify it',
        desc: 'A short set of rules we write with you: type of job, address, timing, and fit. Homeowners who go quiet get followed up until they reply or opt out. The ones that are not a fit get a polite close, not a slot on your calendar.',
      },
      {
        title: 'Book the inspection',
        desc: 'Qualified homeowners are offered a time on the calendar you already use. The inspection lands there with the whole conversation attached, so whoever shows up knows the job.',
      },
    ],
  },
  fit: {
    title: 'For roofers who already get the quote requests.',
    good: [
      'Residential roofing companies already getting inbound quote requests — from a website form, Google, Local Services Ads, Angi, or storm campaigns.',
      'Owners losing jobs because nobody answers while the crew is on a roof.',
      'Someone at your company who will show up to the inspections it books.',
    ],
    notFit: [
      'Companies that need ads run for them.',
      'Companies that need a new website.',
      'Companies that need leads created from scratch. If quote requests are not coming in yet, this has nothing to answer.',
    ],
  },
  pricing: {
    bookItem: 'Book the inspection',
    payback: 'One closed replacement can cover a year of Starter.',
    paybackNote: 'Roof replacements commonly run $8,000 to $15,000.',
  },
  close: {
    requests: 'quote requests',
    company: 'roofing company',
  },
};

export default function Roofing() {
  return <VerticalLanding content={ROOFING} />;
}
