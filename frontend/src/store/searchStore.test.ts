import { describe, it, expect, beforeEach } from 'vitest';
import { useSearchStore } from './searchStore';

describe('searchStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useSearchStore.setState({
      query: '',
      currentPage: 1,
      itemsPerPage: 10,
      cache: new Map(),
      items: [],
      categories: [],
      totalItems: 0,
      loading: false,
      error: null,
    });
  });

  describe('setQuery', () => {
    it('actualiza la query correctamente', () => {
      const { setQuery } = useSearchStore.getState();
      setQuery('iphone');
      
      expect(useSearchStore.getState().query).toBe('iphone');
    });
  });

  describe('setCurrentPage', () => {
    it('actualiza la página actual', () => {
      const { setCurrentPage } = useSearchStore.getState();
      setCurrentPage(5);
      
      expect(useSearchStore.getState().currentPage).toBe(5);
    });
  });

  describe('setSearchResults', () => {
    it('guarda los resultados de búsqueda', () => {
      const { setSearchResults } = useSearchStore.getState();
      const mockItems = [
        { id: '1', title: 'iPhone 14', price: { currency: 'ARS', amount: 1000000, decimals: 0, regular_amount: null }, picture: '', condition: 'Nuevo', free_shipping: true, installments: '', seller_nickname: '' },
      ];
      
      setSearchResults('iphone', mockItems, ['Celulares'], 100);
      
      const state = useSearchStore.getState();
      expect(state.items).toEqual(mockItems);
      expect(state.categories).toEqual(['Celulares']);
      expect(state.totalItems).toBe(100);
      expect(state.loading).toBe(false);
    });

    it('guarda en cache', () => {
      const { setSearchResults, getCachedItems } = useSearchStore.getState();
      const mockItems = [
        { id: '1', title: 'iPhone 14', price: { currency: 'ARS', amount: 1000000, decimals: 0, regular_amount: null }, picture: '', condition: 'Nuevo', free_shipping: true, installments: '', seller_nickname: '' },
      ];
      
      setSearchResults('iphone', mockItems, [], 100);
      
      const cached = getCachedItems('iphone', 0);
      expect(cached).toEqual(mockItems);
    });

    it('el cache es case-insensitive', () => {
      const { setSearchResults, getCachedItems } = useSearchStore.getState();
      const mockItems = [{ id: '1', title: 'Test', price: { currency: 'ARS', amount: 100, decimals: 0, regular_amount: null }, picture: '', condition: '', free_shipping: false, installments: '', seller_nickname: '' }];
      
      setSearchResults('IPHONE', mockItems, [], 100);
      
      const cached = getCachedItems('iphone', 0);
      expect(cached).toEqual(mockItems);
    });
  });

  describe('setLoading', () => {
    it('actualiza el estado de carga', () => {
      const { setLoading } = useSearchStore.getState();
      
      setLoading(true);
      expect(useSearchStore.getState().loading).toBe(true);
      
      setLoading(false);
      expect(useSearchStore.getState().loading).toBe(false);
    });
  });

  describe('setError', () => {
    it('guarda el mensaje de error', () => {
      const { setError } = useSearchStore.getState();
      setError('Error de conexión');
      
      const state = useSearchStore.getState();
      expect(state.error).toBe('Error de conexión');
      expect(state.loading).toBe(false);
    });

    it('puede limpiar el error', () => {
      const { setError } = useSearchStore.getState();
      setError('Error');
      setError(null);
      
      expect(useSearchStore.getState().error).toBeNull();
    });
  });

  describe('clearSearch', () => {
    it('limpia el estado de búsqueda', () => {
      const { setSearchResults, clearSearch } = useSearchStore.getState();
      const mockItems = [{ id: '1', title: 'Test', price: { currency: 'ARS', amount: 100, decimals: 0, regular_amount: null }, picture: '', condition: '', free_shipping: false, installments: '', seller_nickname: '' }];
      
      setSearchResults('test', mockItems, ['Cat'], 50);
      clearSearch();
      
      const state = useSearchStore.getState();
      expect(state.query).toBe('');
      expect(state.items).toEqual([]);
      expect(state.currentPage).toBe(1);
    });
  });

  describe('itemsPerPage', () => {
    it('tiene valor por defecto de 10', () => {
      expect(useSearchStore.getState().itemsPerPage).toBe(10);
    });
  });

  describe('getCachedItems', () => {
    it('devuelve null si no hay cache', () => {
      const { getCachedItems } = useSearchStore.getState();
      
      const result = getCachedItems('nonexistent', 0);
      expect(result).toBeNull();
    });

    it('devuelve null si el offset supera los items cacheados', () => {
      const { setSearchResults, getCachedItems } = useSearchStore.getState();
      const mockItems = [{ id: '1', title: 'Test', price: { currency: 'ARS', amount: 100, decimals: 0, regular_amount: null }, picture: '', condition: '', free_shipping: false, installments: '', seller_nickname: '' }];
      
      setSearchResults('test', mockItems, [], 100);
      
      const result = getCachedItems('test', 50);
      expect(result).toBeNull();
    });
  });
});

