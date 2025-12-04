import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product';
  price?: number;
  currency?: string;
}

const DEFAULT_TITLE = 'Mercado Libre - Envíos Gratis en el día';
const DEFAULT_DESCRIPTION = 'La comunidad de compra y venta online más grande de América Latina';
const DEFAULT_IMAGE = '/Assets/Logo_ML@2x.png.png';

export function useSEO({
  title,
  description,
  image,
  url,
  type = 'website',
  price,
  currency,
}: SEOProps = {}) {
  useEffect(() => {
    // Title
    const fullTitle = title 
      ? `${title} | Mercado Libre`
      : DEFAULT_TITLE;
    document.title = fullTitle;

    // Meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description || DEFAULT_DESCRIPTION);
    }

    // Open Graph tags
    updateMetaTag('og:title', fullTitle);
    updateMetaTag('og:description', description || DEFAULT_DESCRIPTION);
    updateMetaTag('og:image', image || DEFAULT_IMAGE);
    updateMetaTag('og:url', url || window.location.href);
    updateMetaTag('og:type', type === 'product' ? 'product' : 'website');
    updateMetaTag('og:site_name', 'Mercado Libre');

    // Twitter Cards
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', fullTitle);
    updateMetaTag('twitter:description', description || DEFAULT_DESCRIPTION);
    updateMetaTag('twitter:image', image || DEFAULT_IMAGE);

    // Product specific (para productos)
    if (type === 'product' && price && currency) {
      updateMetaTag('product:price:amount', price.toString());
      updateMetaTag('product:price:currency', currency);
    }

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url || window.location.href;

  }, [title, description, image, url, type, price, currency]);
}

function updateMetaTag(property: string, content: string) {
  let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
  
  if (!meta) {
    meta = document.querySelector(`meta[name="${property}"]`) as HTMLMetaElement;
  }
  
  if (!meta) {
    meta = document.createElement('meta');
    if (property.startsWith('og:') || property.startsWith('product:')) {
      meta.setAttribute('property', property);
    } else {
      meta.setAttribute('name', property);
    }
    document.head.appendChild(meta);
  }
  
  meta.setAttribute('content', content);
}

