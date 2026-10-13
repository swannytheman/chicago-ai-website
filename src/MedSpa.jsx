import VerticalLanding from './VerticalLanding.jsx';
import { PAGE_META } from './seo.js';
import { WELLS_STREET_AESTHETICS } from './demoScenarios.js';

// /medspa: the one URL sales and ads use for med spas and aesthetic practices. Same
// pitch as the trade pages, in med spa terms: treatment inquiries from forms and
// social lead ads, a front desk busy with clients in the room, booking the consult.
// The agent never gives medical advice; that line is in the copy on purpose, because
// it is the first thing a med spa owner will want to know.
const MEDSPA = {
  slug: 'medspa',
  meta: PAGE_META.medspa,
  trade: 'med spas',
  audience: 'For med spas and aesthetic practices',
  business: 'practice',
  headline: {
    lead: 'The Botox inquiry came in at 8:30pm.',
    punch: 'Someone else booked the consult.',
  },
  subhead: <>We reply to your treatment inquiries in about five minutes, in your voice, and book the consult. Your providers take it from there. Live in <span className="whitespace-nowrap">2–4 weeks</span>.</>,
  example: {
    title: 'Tuesday night inquiry. Reply four minutes later. Consult on Saturday.',
    body: 'Someone curious about Botox fills in your consult form at 8:30 on a Tuesday night, after your front desk has gone home, and probably messages two other spas too. Four minutes later they have a reply that sounds like your team, with two consult times. They pick Saturday at 11, and it is on your schedule before anyone at your practice has seen the lead.',
    scenario: WELLS_STREET_AESTHETICS,
  },
  steps: {
    title: 'Catch it. Qualify it. Book the consult.',
    lede: 'We build it and run it. Your providers take the consult. The writing is handled by an agent trained on how your team actually talks to clients, so it reads like you sent it.',
    items: [
      {
        title: 'Catch the inquiry',
        desc: 'We wire the one inbound source you already have — your website consult form, Instagram or Facebook lead ads, Google, or a promotion. A new inquiry gets a reply in about five minutes, day or night, even while your front desk is checking someone in.',
      },
      {
        title: 'Qualify it',
        desc: 'A short set of rules we write with you: which treatment, new or returning client, timing, and location. It never gives medical advice. Questions about candidacy, results or side effects go to your providers. People who go quiet get followed up until they reply or opt out.',
      },
      {
        title: 'Book the consult',
        desc: 'Qualified inquiries are offered a time on the schedule you already use. The consult lands there with the whole conversation attached, so your provider knows what the client came in for.',
      },
    ],
  },
  fit: {
    title: 'For practices that already get the inquiries.',
    good: [
      'Med spas and aesthetic practices already getting treatment inquiries — from a website form, Instagram or Facebook lead ads, Google, or promotions.',
      'Owners paying for lead ads and watching inquiries sit overnight, or wait while the front desk is busy with clients in the room.',
      'Providers or a front desk who will take the consults it books.',
    ],
    notFit: [
      'Practices that need ads run for them.',
      'Practices that need a new website.',
      'Practices that need leads created from scratch. If inquiries are not coming in yet, this has nothing to answer.',
    ],
  },
  pricing: {
    bookItem: 'Book the consult',
    payback: 'A few new regular clients can cover a year of Starter.',
  },
  guarantee: {
    notCovered: 'It does not guarantee booked treatments or a volume of new leads.',
    notDone: 'We do not run ads, rebuild your website, or give medical advice.',
  },
  close: {
    requests: 'treatment inquiries',
    company: 'practice',
  },
};

export default function MedSpa() {
  return <VerticalLanding content={MEDSPA} />;
}
