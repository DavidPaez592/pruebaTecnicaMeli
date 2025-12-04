import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSEO } from './useSEO';

describe('useSEO', () => {
  beforeEach(() => {
    // Reset document title
    document.title = '';
    // Clear meta tags
    document.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"]').forEach(el => el.remove());
  });

  describe('title', () => {
    it('usa título por defecto cuando no se proporciona', () => {
      renderHook(() => useSEO({}));
      
      expect(document.title).toBe('Mercado Libre - Envíos Gratis en el día');
    });

    it('agrega sufijo al título personalizado', () => {
      renderHook(() => useSEO({ title: 'iPhone 14' }));
      
      expect(document.title).toBe('iPhone 14 | Mercado Libre');
    });
  });

  describe('meta description', () => {
    it('actualiza la meta description', () => {
      // Crear meta tag si no existe
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }

      renderHook(() => useSEO({ description: 'Descripción personalizada' }));
      
      const metaDescription = document.querySelector('meta[name="description"]');
      expect(metaDescription?.getAttribute('content')).toBe('Descripción personalizada');
    });
  });

  describe('Open Graph tags', () => {
    it('crea og:title', () => {
      renderHook(() => useSEO({ title: 'Test Title' }));
      
      const ogTitle = document.querySelector('meta[property="og:title"]');
      expect(ogTitle?.getAttribute('content')).toBe('Test Title | Mercado Libre');
    });

    it('crea og:type para productos', () => {
      renderHook(() => useSEO({ type: 'product' }));
      
      const ogType = document.querySelector('meta[property="og:type"]');
      expect(ogType?.getAttribute('content')).toBe('product');
    });

    it('crea og:image', () => {
      renderHook(() => useSEO({ image: 'https://example.com/image.jpg' }));
      
      const ogImage = document.querySelector('meta[property="og:image"]');
      expect(ogImage?.getAttribute('content')).toBe('https://example.com/image.jpg');
    });
  });

  describe('Twitter Cards', () => {
    it('crea twitter:card', () => {
      renderHook(() => useSEO({}));
      
      const twitterCard = document.querySelector('meta[name="twitter:card"]');
      expect(twitterCard?.getAttribute('content')).toBe('summary_large_image');
    });

    it('crea twitter:title', () => {
      renderHook(() => useSEO({ title: 'Test' }));
      
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      expect(twitterTitle?.getAttribute('content')).toBe('Test | Mercado Libre');
    });
  });

  describe('canonical URL', () => {
    it('crea link canonical', () => {
      renderHook(() => useSEO({ url: 'https://example.com/page' }));
      
      const canonical = document.querySelector('link[rel="canonical"]');
      expect(canonical?.getAttribute('href')).toBe('https://example.com/page');
    });
  });

  describe('product meta tags', () => {
    it('agrega precio del producto', () => {
      renderHook(() => useSEO({ 
        type: 'product', 
        price: 1000000, 
        currency: 'ARS' 
      }));
      
      const priceAmount = document.querySelector('meta[property="product:price:amount"]');
      const priceCurrency = document.querySelector('meta[property="product:price:currency"]');
      
      expect(priceAmount?.getAttribute('content')).toBe('1000000');
      expect(priceCurrency?.getAttribute('content')).toBe('ARS');
    });
  });
});

