// Marketing attribution for form submissions.
//
// UTM tags live on the URL the visitor first arrives at. They are gone by the time
// someone clicks through to /try-it-free, so we snapshot them on first load and
// hold them for the session. First touch wins: a visitor who arrives from an ad,
// browses, and converts later is still credited to that ad.

const KEY = 'cag_attribution';

// Always emit every key, empty string when absent, so the webhook payload keeps a
// stable shape. Make.com locks in a data structure from the first calls it sees and
// a field that only sometimes appears is awkward to map.
const FIELDS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'];

export function captureAttribution() {
  try {
    if (sessionStorage.getItem(KEY)) return; // first touch already recorded
    const params = new URLSearchParams(window.location.search);
    const data = {
      landing_page: window.location.href,
      referrer: document.referrer || '',
    };
    for (const f of FIELDS) data[f] = params.get(f) || '';
    sessionStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // Private browsing can throw on sessionStorage. Attribution is best effort and
    // must never block a submission.
  }
}

export function getAttribution() {
  const empty = { landing_page: '', referrer: '' };
  for (const f of FIELDS) empty[f] = '';
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? { ...empty, ...JSON.parse(raw) } : empty;
  } catch {
    return empty;
  }
}
