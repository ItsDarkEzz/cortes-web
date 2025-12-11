import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
}

export function useSEO({ title, description, canonical, ogImage }: SEOProps) {
  useEffect(() => {
    const baseUrl = "https://thecortes.ru";
    const fullTitle = `${title} | Cortes`;
    const image = ogImage || `${baseUrl}/opengraph.jpg`;
    const url = canonical ? `${baseUrl}${canonical}` : baseUrl;

    document.title = fullTitle;

    const updateMeta = (selector: string, content: string) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute("content", content);
    };

    updateMeta('meta[name="description"]', description);
    updateMeta('link[rel="canonical"]', url);
    updateMeta('meta[property="og:title"]', fullTitle);
    updateMeta('meta[property="og:description"]', description);
    updateMeta('meta[property="og:url"]', url);
    updateMeta('meta[property="og:image"]', image);
    updateMeta('meta[name="twitter:title"]', fullTitle);
    updateMeta('meta[name="twitter:description"]', description);
    updateMeta('meta[name="twitter:image"]', image);

    // Update canonical link
    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (canonicalEl) {
      canonicalEl.setAttribute("href", url);
    }
  }, [title, description, canonical, ogImage]);
}
