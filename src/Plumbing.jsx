import VerticalLanding from './VerticalLanding.jsx';
import { PAGE_META } from './seo.js';
import { HALSTED_PLUMBING } from './demoScenarios.js';

// /plumbing: the one URL sales and ads use for residential plumbing companies.
// Layout, prices and the guarantee live in VerticalLanding; this is only the
// plumbing-specific copy. Same pitch as /roofing and /hvac, in plumbing terms:
// service and estimate requests, plumbers under a sink all day, booking the visit.
const PLUMBING = {
  slug: 'plumbing',
  meta: PAGE_META.plumbing,
  trade: 'plumbing',
  audience: 'For residential plumbing companies',
  headline: {
    lead: 'No hot water. It’s 8:30pm.',
    punch: 'Someone else booked the visit.',
  },
  subhead: <>We reply to your inbound plumbing leads in about five minutes, in your voice, and book the ones worth a visit. Your team shows up. Live in <span className="whitespace-nowrap">2–4 weeks</span>.</>,
  example: {
    title: 'Tuesday night form. Reply four minutes later. Plumber there Wednesday.',
    body: "A homeowner's water heater starts leaking on a Tuesday night, and they fill in your form at 8:30 while your plumbers are off the clock. Four minutes later they have a reply that sounds like your office, with two arrival windows for the morning and what to do about the leak in the meantime. They pick 8 to 10, and it is on your calendar before anyone at your company has seen the lead.",
    scenario: HALSTED_PLUMBING,
  },
  steps: {
    title: 'Catch it. Qualify it. Book the visit.',
    lede: 'We build it and run it. Your team takes the visit. The writing is handled by an agent trained on how your office actually emails customers, so it reads like you sent it.',
    items: [
      {
        title: 'Catch the lead',
        desc: 'We wire the one inbound source you already have — your website form, Google, Local Services Ads, Angi, or a seasonal campaign. A new service or estimate request gets a reply in about five minutes, day or night, even while your plumbers are on a job.',
      },
      {
        title: 'Qualify it',
        desc: 'A short set of rules we write with you: type of job, repair or replacement, address, and how urgent it is. Homeowners who go quiet get followed up until they reply or opt out. The ones that are not a fit get a polite close, not a slot on your calendar.',
      },
      {
        title: 'Book the visit',
        desc: 'Qualified homeowners are offered a time on the calendar you already use. The visit lands there with the whole conversation attached, so the plumber who shows up knows the problem before they knock.',
      },
    ],
  },
  fit: {
    title: 'For plumbers who already get the requests.',
    good: [
      'Residential plumbing companies already getting inbound service and estimate requests — from a website form, Google, Local Services Ads, Angi, or seasonal campaigns.',
      'Owners losing jobs when requests sit unanswered — after hours, while everyone is on a job, or in the rush after a deep freeze or a heavy rain.',
      'Someone at your company who will show up to the visits it books.',
    ],
    notFit: [
      'Companies that need ads run for them.',
      'Companies that need a new website.',
      'Companies that need leads created from scratch. If service requests are not coming in yet, this has nothing to answer.',
    ],
  },
  pricing: {
    bookItem: 'Book the visit',
    payback: 'One sewer line replacement or repipe can cover a year of Starter.',
  },
  close: {
    requests: 'service and estimate requests',
    company: 'plumbing company',
  },
};

export default function Plumbing() {
  return <VerticalLanding content={PLUMBING} />;
}
