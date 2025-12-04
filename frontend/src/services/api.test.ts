import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';

// Mock axios
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    })),
  },
}));

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('searchItems', () => {
    it('construye la URL correctamente', async () => {
      const mockGet = vi.fn().mockResolvedValue({
        data: {
          items: [],
          categories: [],
          paging: { total: 0, offset: 0, limit: 50 },
        },
      });

      const mockAxios = {
        get: mockGet,
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      };

      (axios.create as any).mockReturnValue(mockAxios);

      // Re-importar para usar el mock actualizado
      vi.resetModules();
      const { searchItems } = await import('./api');

      await searchItems('iphone', 0);

      expect(mockGet).toHaveBeenCalledWith('/items', {
        params: { q: 'iphone', offset: 0 },
      });
    });

    it('maneja offset correctamente', async () => {
      const mockGet = vi.fn().mockResolvedValue({
        data: {
          items: [],
          categories: [],
          paging: { total: 100, offset: 50, limit: 50 },
        },
      });

      const mockAxios = {
        get: mockGet,
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      };

      (axios.create as any).mockReturnValue(mockAxios);

      vi.resetModules();
      const { searchItems } = await import('./api');

      await searchItems('samsung', 50);

      expect(mockGet).toHaveBeenCalledWith('/items', {
        params: { q: 'samsung', offset: 50 },
      });
    });
  });

  describe('getItemDetail', () => {
    it('construye la URL con el ID correctamente', async () => {
      const mockGet = vi.fn().mockResolvedValue({
        data: {
          item: {
            id: 'MLA123',
            title: 'Test Product',
          },
        },
      });

      const mockAxios = {
        get: mockGet,
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      };

      (axios.create as any).mockReturnValue(mockAxios);

      vi.resetModules();
      const { getItemDetail } = await import('./api');

      await getItemDetail('MLA123');

      expect(mockGet).toHaveBeenCalledWith('/items/MLA123');
    });
  });

  describe('Control de duplicados', () => {
    it('no hace llamadas duplicadas para la misma búsqueda', async () => {
      const mockGet = vi.fn().mockImplementation(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({
            data: { items: [], categories: [], paging: { total: 0 } }
          }), 100)
        )
      );

      const mockAxios = {
        get: mockGet,
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      };

      (axios.create as any).mockReturnValue(mockAxios);

      vi.resetModules();
      const { searchItems } = await import('./api');

      // Hacer dos llamadas simultáneas con los mismos parámetros
      const promise1 = searchItems('iphone', 0);
      const promise2 = searchItems('iphone', 0);

      await Promise.all([promise1, promise2]);

      // Solo debería haber una llamada real
      expect(mockGet).toHaveBeenCalledTimes(1);
    });
  });
});

