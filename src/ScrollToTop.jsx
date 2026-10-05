import { useLayoutEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

// Client-side navigation keeps the window where it was, so following a link from far
// down the homepage (the "See a sample sequence" buttons, the footer) used to open
// the next page part-way down, past its form. This puts every new page at the top.
//
// Left alone:
// - Back/Forward (POP): the browser restores the position you left, as it should.
// - Links with a hash ("/#pricing"): MainSite scrolls to that section itself.
//
// useLayoutEffect, not useEffect, so the jump lands before the first paint and the
// old position never flashes. "instant" overrides the homepage's smooth scrolling.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  useLayoutEffect(() => {
    if (navigationType === 'POP' || hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash, navigationType]);

  return null;
}
