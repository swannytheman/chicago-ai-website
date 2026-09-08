import { useEffect } from 'react';
import { SITE_URL, SITE_NAME, OG_IMAGE } from './seo.js';

// Tags this hook owns, so it can update or remove them without disturbing anything
// hand-written in index.html that happens to share a name.
const OWNED = 'data-page-meta';

function setTag(tag, keyAttr, keyValue, content) {
  const selector = `${tag}[${keyAttr}="${keyValue}"]`;
  let el = document.head.querySelector(selector);
  if (content == null) {
    // Remove whether or not we created it. index.html ships homepage defaults for the
    // same tags, and on a route with no identity -- the 404 -- leaving the static
    // og:url behind would have the error page claiming to be the homepage.
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement(tag);
    el.setAttribute(keyAttr, keyValue);
    el.setAttribute(OWNED, '');
    document.head.appendChild(el);
  }
  el.setAttribute(tag === 'link' ? 'href' : 'content', content);
}

const meta = (name, content) => setTag('meta', 'name', name, content);
const og = (property, content) => setTag('meta', 'property', property, content);

export function usePageMeta({ title, description, path, noindex = false }) {
  useEffect(() => {
    const url = path ? `${SITE_URL}${path}` : null;

    document.title = title;
    meta('description', description);
    setTag('link', 'rel', 'canonical', url);
    meta('robots', noindex ? 'noindex, follow' : null);

    og('og:type', 'website');
    og('og:site_name', SITE_NAME);
    og('og:title', title);
    og('og:description', description);
    og('og:url', url);
    og('og:image', OG_IMAGE);
    og('og:image:width', '1200');
    og('og:image:height', '630');

    meta('twitter:card', 'summary_large_image');
    meta('twitter:title', title);
    meta('twitter:description', description);
    meta('twitter:image', OG_IMAGE);
    // Every route sets the full set on mount, so there is nothing to restore here.
  }, [title, description, path, noindex]);
}
