// Vercel Web Analytics: cookieless page-view counts, served from this site's own
// domain (/_vercel/insights/script.js), so the existing Content-Security-Policy
// needs no change. Client-side route changes are counted as page views by the
// script itself. The Privacy Policy describes this under "Visit statistics".

// Before a view is sent, keep only the utm_ campaign tags on its URL. Everything
// else in a query string -- Google and Meta click IDs, or anything a link might
// carry -- is dropped, so the analytics never hold more than page and campaign.
export function keepOnlyCampaignTags(event) {
  try {
    const url = new URL(event.url);
    for (const key of [...url.searchParams.keys()]) {
      if (!key.toLowerCase().startsWith('utm_')) url.searchParams.delete(key);
    }
    url.hash = '';
    return { ...event, url: url.toString() };
  } catch {
    return event;
  }
}
