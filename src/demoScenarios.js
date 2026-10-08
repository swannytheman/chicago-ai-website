// Illustrative leads for the HeroDemo card, one per scenario, start to finish.
// The homepage and /roofing use Summit Roofing; each vertical landing page can pass
// its own. All companies and people here are made up.
//
// leadReplyTime is when the lead answers and the visit lands on the calendar; the
// request is always 8:30 PM and the reply 8:34 PM.
export const SUMMIT_ROOFING = {
  company: 'Summit Roofing',
  requestTitle: 'New quote request',
  leadName: 'Mark R.',
  request: 'Our roof is leaking near the back of the house on Oakley. Can someone take a look this week?',
  sender: 'Sarah at Summit Roofing',
  subject: 'Quick question about your roof estimate',
  reply: "Hi Mark — sorry to hear about the roof leak on Oakley. I can have someone look at it Thursday morning or Friday after 2. If water is coming in right now, reply and we'll put you first.",
  leadReply: 'Thursday morning works. Thanks for the quick reply.',
  leadReplyTime: '8:52 PM',
  bookedTitle: 'Meeting booked',
  booked: 'Thu 9:00 AM · Roof inspection with Mark R.',
};

// /hvac: a furnace that quits on a freezing evening (the winter version; swap back to
// an AC call for summer). The system is old enough that the visit
// doubles as a replacement estimate, which is where the job value is.
export const LAKESIDE_HVAC = {
  company: 'Lakeside Heating & Cooling',
  requestTitle: 'New service request',
  leadName: 'Dana K.',
  request: "Our heat just went out and it's already down to 61° inside. The furnace is about 15 years old, so we might be ready to replace it. Can someone come out?",
  sender: 'Chris at Lakeside Heating & Cooling',
  subject: 'Getting someone out to look at your heat',
  reply: "Hi Dana — sorry the heat went out on you tonight. I can have a technician out tomorrow between 8 and 10 or after 1 to diagnose it and walk you through repair or replacement. If the house is getting too cold, reply and we'll put you first.",
  leadReply: '8 to 10 tomorrow works. Thank you!',
  leadReplyTime: '8:41 PM',
  bookedTitle: 'Visit booked',
  booked: 'Wed 8–10 AM · Furnace diagnostic and replacement estimate, Dana K.',
};
