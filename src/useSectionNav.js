import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { sectionId } from './siteConfig.js';

// Section links point at ids that only exist on the home page. On "/" they scroll
// directly; anywhere else they route home with the id as a hash, and MainSite scrolls
// to it once it mounts. Without this, nav links on a subpage silently do nothing.
export function useSectionNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const onHome = pathname === '/';

  return useCallback((id) => {
    const target = sectionId(id);
    if (onHome) {
      document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/#${target}`);
    }
  }, [onHome, navigate]);
}
