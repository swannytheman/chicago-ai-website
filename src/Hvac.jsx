import VerticalLanding from './VerticalLanding.jsx';
import { PAGE_META } from './seo.js';
import { LAKESIDE_HVAC } from './demoScenarios.js';

// /hvac: the one URL sales and ads use for residential heating and cooling companies.
// Layout, prices and the guarantee live in VerticalLanding; this is only the
// HVAC-specific copy. Same pitch as /roofing, in HVAC terms: service and replacement
// requests, techs out on calls, heat waves and cold snaps, booking the visit.
const HVAC = {
  slug: 'hvac',
  meta: PAGE_META.hvac,
  trade: 'HVAC',
  audience: 'For residential heating and cooling companies',
  headline: {
    lead: 'The AC quit at 8:30pm.',
    punch: 'Someone else booked the visit.',
  },
  subhead: <>We reply to your inbound heating and cooling leads in about five minutes, in your voice, and book the ones worth a visit. Your team shows up. Live in <span className="whitespace-nowrap">2–4 weeks</span>.</>,
  example: {
    title: 'Tuesday night form. Reply four minutes later. Technician there Wednesday.',
    body: "A homeowner's AC quits on a hot Tuesday night, and they fill in your form at 8:30 while your techs are off the clock. Four minutes later they have a reply that sounds like your office, with two arrival windows for the morning. They pick 8 to 10, and it is on your calendar before anyone at your company has seen the lead.",
    scenario: LAKESIDE_HVAC,
  },
  steps: {
    title: 'Catch it. Qualify it. Book the visit.',
    lede: 'We build it and run it. Your team takes the visit. The writing is handled by an agent trained on how your office actually emails customers, so it reads like you sent it.',
    items: [
      {
        title: 'Catch the lead',
        desc: 'We wire the one inbound source you already have — your website form, Google, Local Services Ads, Angi, or a seasonal tune-up campaign. A new service or estimate request gets a reply in about five minutes, day or night, even while your techs are out on calls.',
      },
      {
        title: 'Qualify it',
        desc: 'A short set of rules we write with you: heating or cooling, repair or replacement, system age, address, and timing. Homeowners who go quiet get followed up until they reply or opt out. The ones that are not a fit get a polite close, not a slot on your calendar.',
      },
      {
        title: 'Book the visit',
        desc: 'Qualified homeowners are offered a time on the calendar you already use. The visit lands there with the whole conversation attached, so the tech who shows up knows the system and the problem.',
      },
    ],
  },
  fit: {
    title: 'For HVAC companies that already get the requests.',
    good: [
      'Residential HVAC companies already getting inbound service and replacement requests — from a website form, Google, Local Services Ads, Angi, or seasonal campaigns.',
      'Owners losing jobs when requests sit unanswered — after hours, while techs are on calls, or in the rush of a heat wave or cold snap.',
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
    payback: 'One closed system replacement can cover a year of Starter.',
  },
  close: {
    requests: 'service and estimate requests',
    company: 'HVAC company',
  },
};

export default function Hvac() {
  return <VerticalLanding content={HVAC} />;
}
