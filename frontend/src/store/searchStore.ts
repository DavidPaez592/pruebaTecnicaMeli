import { create } from 'zustand';
import type { SearchItem } from '../types';

interface CachedSearch {
  items: SearchItem[];
  total: number;
  timestamp: number;
}

interface SearchState {
  // Estado de búsqueda
  query: string;
  currentPage: number;
  itemsPerPage: number;
  
  // Cache de resultados (grupos de 50)
  cache: Map<string, CachedSearch>;
  
  // Items actuales
  items: SearchItem[];
  categories: string[];
  totalItems: number;
  
  // Estados de carga
  loading: boolean;
  error: string | null;
  
  // Acciones
  setQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  setSearchResults: (
    query: string,
    items: SearchItem[],
    categories: string[],
    total: number
  ) => void;
  getCachedItems: (query: string, offset: number) => SearchItem[] | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearSearch: () => void;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export const useSearchStore = create<SearchState>((set, get) => ({
  query: '',
  currentPage: 1,
  itemsPerPage: 10,
  cache: new Map(),
  items: [],
  categories: [],
  totalItems: 0,
  loading: false,
  error: null,

  setQuery: (query) => set({ query }),

  setCurrentPage: (page) => set({ currentPage: page }),

  setSearchResults: (query, items, categories, total) => {
    const state = get();
    const cacheKey = query.toLowerCase();
    
    // Actualizar cache
    const newCache = new Map(state.cache);
    newCache.set(cacheKey, {
      items,
      total,
      timestamp: Date.now(),
    });

    set({
      items,
      categories,
      totalItems: total,
      cache: newCache,
      loading: false,
      error: null,
    });
  },

  getCachedItems: (query, offset) => {
    const state = get();
    const cacheKey = query.toLowerCase();
    const cached = state.cache.get(cacheKey);

    if (!cached) return null;

    // Verificar si el cache expiró
    if (Date.now() - cached.timestamp > CACHE_DURATION) {
      const newCache = new Map(state.cache);
      newCache.delete(cacheKey);
      set({ cache: newCache });
      return null;
    }

    // Verificar si tenemos los items para el offset solicitado
    if (offset < cached.items.length) {
      return cached.items;
    }

    return null;
  },

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error, loading: false }),

  clearSearch: () =>
    set({
      query: '',
      currentPage: 1,
      items: [],
      categories: [],
      totalItems: 0,
      error: null,
    }),
}));

