import { describe, it, expect } from 'vitest';
import {
  mockSearchResults,
  mockItemDetail,
  filterMockItems,
  getMockItemDetail,
  getProductDescription,
  getProductSpecs,
} from './mockData';

describe('mockData', () => {
  describe('mockSearchResults', () => {
    it('contiene 100 productos', () => {
      expect(mockSearchResults.items).toHaveLength(100);
    });

    it('tiene categorías definidas', () => {
      expect(mockSearchResults.categories).toHaveLength(3);
      expect(mockSearchResults.categories).toContain('Apple iPhone');
    });

    it('cada producto tiene ID único', () => {
      const ids = mockSearchResults.items.map((item) => item.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(100);
    });

    it('cada producto tiene título con modelo', () => {
      mockSearchResults.items.forEach((item) => {
        expect(item.title).toContain('Apple');
        expect(item.title).toContain('iPhone');
      });
    });

    it('cada producto tiene precio válido', () => {
      mockSearchResults.items.forEach((item) => {
        expect(item.price.currency).toBe('ARS');
        expect(item.price.amount).toBeGreaterThan(0);
      });
    });

    it('cada producto tiene imagen principal', () => {
      mockSearchResults.items.forEach((item) => {
        expect(item.picture).toContain('mlstatic.com');
      });
    });

    it('cada producto tiene seller_nickname', () => {
      mockSearchResults.items.forEach((item) => {
        expect(item.seller_nickname).toBeDefined();
        expect(item.seller_nickname.length).toBeGreaterThan(0);
      });
    });

    it('todos tienen envío gratis', () => {
      mockSearchResults.items.forEach((item) => {
        expect(item.free_shipping).toBe(true);
      });
    });

    it('cada producto tiene información de cuotas', () => {
      mockSearchResults.items.forEach((item) => {
        expect(item.installments).toContain('cuotas');
      });
    });
  });

  describe('getProductDescription', () => {
    it('devuelve descripción para iPhone 17 Pro Max', () => {
      const description = getProductDescription('iPhone 17 Pro Max');
      expect(description).toContain('iPhone 17 Pro Max');
      expect(description).toContain('A19 Pro');
      expect(description.length).toBeGreaterThan(200);
    });

    it('devuelve descripción para iPhone 16', () => {
      const description = getProductDescription('iPhone 16');
      expect(description).toContain('A18');
    });

    it('devuelve descripción para iPhone 14 Pro Max', () => {
      const description = getProductDescription('iPhone 14 Pro Max');
      expect(description).toContain('Dynamic Island');
    });

    it('devuelve descripción para iPhone 13 Pro', () => {
      const description = getProductDescription('iPhone 13 Pro');
      expect(description).toContain('A15 Bionic');
    });

    it('devuelve descripción genérica para modelo desconocido', () => {
      const description = getProductDescription('iPhone Unknown');
      expect(description).toContain('smartphone de Apple');
    });

    it('cada descripción es única por modelo', () => {
      const desc17 = getProductDescription('iPhone 17 Pro Max');
      const desc16 = getProductDescription('iPhone 16');
      const desc14 = getProductDescription('iPhone 14 Pro Max');
      
      expect(desc17).not.toBe(desc16);
      expect(desc16).not.toBe(desc14);
      expect(desc17).not.toBe(desc14);
    });
  });

  describe('getProductSpecs', () => {
    it('devuelve specs para iPhone 17 Pro Max', () => {
      const specs = getProductSpecs('iPhone 17 Pro Max');
      expect(specs.chip).toBe('A19 Pro');
      expect(specs.features).toContain('Titanio');
    });

    it('devuelve specs para iPhone 16', () => {
      const specs = getProductSpecs('iPhone 16');
      expect(specs.chip).toBe('A18');
    });

    it('devuelve specs genéricas para modelo desconocido', () => {
      const specs = getProductSpecs('iPhone Unknown');
      expect(specs.chip).toBe('Apple Silicon');
    });
  });

  describe('filterMockItems', () => {
    it('filtra por término de búsqueda', () => {
      const result = filterMockItems('iphone');
      expect(result.items.length).toBeGreaterThan(0);
      expect(result.items.length).toBeLessThanOrEqual(50);
    });

    it('respeta el offset', () => {
      const result1 = filterMockItems('iphone', 0);
      const result2 = filterMockItems('iphone', 10);
      
      expect(result1.items[0].id).not.toBe(result2.items[0].id);
    });

    it('devuelve paging correcto', () => {
      const result = filterMockItems('iphone', 0);
      expect(result.paging).toBeDefined();
      expect(result.paging.offset).toBe(0);
      expect(result.paging.limit).toBe(50);
    });

    it('resultados determinísticos para misma query', () => {
      const result1 = filterMockItems('iphone', 0);
      const result2 = filterMockItems('iphone', 0);
      
      expect(result1.items.map(i => i.id)).toEqual(result2.items.map(i => i.id));
    });

    it('orden diferente para queries diferentes', () => {
      const result1 = filterMockItems('iphone', 0);
      const result2 = filterMockItems('apple', 0);
      
      const order1 = result1.items.map(i => i.id).join(',');
      const order2 = result2.items.map(i => i.id).join(',');
      expect(order1).not.toBe(order2);
    });

    it('búsqueda case-insensitive', () => {
      const result1 = filterMockItems('IPHONE', 0);
      const result2 = filterMockItems('iphone', 0);
      
      expect(result1.items.length).toBe(result2.items.length);
    });

    it('devuelve vacío para búsqueda sin coincidencias', () => {
      const result = filterMockItems('carro', 0);
      
      expect(result.items).toHaveLength(0);
      expect(result.paging.total).toBe(0);
    });

    it('devuelve vacío para búsquedas no relacionadas', () => {
      const queries = ['laptop', 'televisor', 'zapatos', 'samsung', 'motorola'];
      
      queries.forEach(query => {
        const result = filterMockItems(query, 0);
        expect(result.items).toHaveLength(0);
      });
    });

    it('devuelve resultados para palabras clave válidas', () => {
      const validQueries = ['iphone', 'apple', 'celular', 'pro', 'max', '256', 'blanco'];
      
      validQueries.forEach(query => {
        const result = filterMockItems(query, 0);
        expect(result.items.length).toBeGreaterThan(0);
      });
    });
  });

  describe('getMockItemDetail', () => {
    it('devuelve detalle para item existente', () => {
      const detail = getMockItemDetail('MLA1000000000');
      
      expect(detail.item).toBeDefined();
      expect(detail.item.id).toBe('MLA1000000000');
    });

    it('incluye descripción específica del modelo', () => {
      const detail = getMockItemDetail('MLA1000000000');
      
      expect(detail.item.description).toContain('iPhone');
      expect(detail.item.description.length).toBeGreaterThan(200);
    });

    it('incluye atributos correctos', () => {
      const detail = getMockItemDetail('MLA1000000000');
      
      const attrIds = detail.item.attributes.map(a => a.id);
      expect(attrIds).toContain('MAIN_COLOR');
      expect(attrIds).toContain('BRAND');
      expect(attrIds).toContain('MODEL');
      expect(attrIds).toContain('PROCESSOR');
    });

    it('tiene sold_quantity determinístico', () => {
      const detail1 = getMockItemDetail('MLA1000000000');
      const detail2 = getMockItemDetail('MLA1000000000');
      
      expect(detail1.item.sold_quantity).toBe(detail2.item.sold_quantity);
    });

    it('devuelve item por defecto si no existe', () => {
      const detail = getMockItemDetail('MLA9999999999');
      
      expect(detail.item).toBeDefined();
      expect(detail.item.id).toBe(mockItemDetail.item.id);
    });

    it('incluye array de pictures', () => {
      const detail = getMockItemDetail('MLA1000000000');
      
      expect(Array.isArray(detail.item.pictures)).toBe(true);
      expect(detail.item.pictures.length).toBeGreaterThan(0);
    });

    it('diferentes items tienen descripciones según su modelo', () => {
      const detail1 = getMockItemDetail('MLA1000000000');
      const detail2 = getMockItemDetail('MLA1000000001');
      
      expect(detail1.item.description).not.toBe(detail2.item.description);
    });
  });

  describe('consistencia de datos', () => {
    it('los productos tienen modelos válidos', () => {
      const validModels = ['iPhone 17', 'iPhone 16', 'iPhone 14', 'iPhone 13'];
      
      mockSearchResults.items.forEach(item => {
        const hasModel = validModels.some(m => item.title.includes(m));
        expect(hasModel).toBe(true);
      });
    });

    it('los precios están en rango razonable', () => {
      mockSearchResults.items.forEach(item => {
        expect(item.price.amount).toBeGreaterThan(1000000);
        expect(item.price.amount).toBeLessThan(5000000);
      });
    });

    it('las cuotas son 6, 9 o 12', () => {
      mockSearchResults.items.forEach(item => {
        const match = item.installments.match(/(\d+) cuotas/);
        expect(match).not.toBeNull();
        const cuotas = parseInt(match![1]);
        expect([6, 9, 12]).toContain(cuotas);
      });
    });
  });
});

