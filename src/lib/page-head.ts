import { useEffect } from 'react';

interface UsePageHeadOptions {
  title: string;
  description?: string;
  path?: string;
  siteUrl?: string;
}

const MANAGED_ATTR = 'data-page-head';

function setOrCreateMeta(selector: string, attrName: string, attrValue: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    el.setAttribute(MANAGED_ATTR, 'true');
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setOrCreateLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    el.setAttribute(MANAGED_ATTR, 'true');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function usePageHead(options: UsePageHeadOptions): void {
  const { title, description, path, siteUrl = 'https://dpo2u.com' } = options;
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = title;
    setOrCreateMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setOrCreateMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    if (description) {
      setOrCreateMeta('meta[name="description"]', 'name', 'description', description);
      setOrCreateMeta('meta[property="og:description"]', 'property', 'og:description', description);
      setOrCreateMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    }
    if (path) {
      const fullUrl = `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
      setOrCreateLink('canonical', fullUrl);
      setOrCreateMeta('meta[property="og:url"]', 'property', 'og:url', fullUrl);
    }
  }, [title, description, path, siteUrl]);
}
