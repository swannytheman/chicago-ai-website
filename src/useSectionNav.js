import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { sectionId } from './siteConfig.js';

// Section links point at homepage section ids. On "/", or on a page that has its own
// section with the same id (the /roofing landing page), they scroll directly; anywhere
// else they route home with the id as a hash, and MainSite scrolls to it once it
// mounts. Without this, nav links on a subpage silently do nothing.
export function useSectionNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const onHome = pathname === '/';

  return useCallback((id) => {
    const target = sectionId(id);
    // A landing page that carries its own section with that id (/roofing has its own
    // pricing and booking close) keeps the visitor there rather than routing them to
    // the homepage's general version.
    const here = document.getElementById(target);
    if (onHome || here) {
      here?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/#${target}`);
    }
  }, [onHome, navigate]);
}
