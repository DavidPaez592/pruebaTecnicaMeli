import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { SearchResults } from './SearchResults';

// Mock del hook useSEO
vi.mock('../../hooks/useSEO', () => ({
  useSEO: vi.fn(),
}));

// Mock del servicio API
vi.mock('../../services/api', () => ({
  searchItems: vi.fn().mockResolvedValue({
    items: [
      {
        id: 'MLA123',
        title: 'Apple iPhone 14',
        price: { currency: 'ARS', amount: 1000000, decimals: 0, regular_amount: null },
        picture: 'https://example.com/image.jpg',
        condition: 'Nuevo',
        free_shipping: true,
        installments: '12 cuotas de $83.333',
        seller_nickname: 'APPLE STORE',
      },
    ],
    categories: ['Celulares'],
    paging: { total: 1, offset: 0, limit: 50 },
  }),
}));

// Mock del store
const mockSetSearchResults = vi.fn();
const mockSetLoading = vi.fn();
const mockSetQuery = vi.fn();
const mockSetCurrentPage = vi.fn();
const mockSetError = vi.fn();
const mockGetCachedItems = vi.fn().mockReturnValue(null);

vi.mock('../../store/searchStore', () => ({
  useSearchStore: () => ({
    items: [],
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    loading: false,
    error: null,
    setQuery: mockSetQuery,
    setCurrentPage: mockSetCurrentPage,
    setSearchResults: mockSetSearchResults,
    setLoading: mockSetLoading,
    setError: mockSetError,
    getCachedItems: mockGetCachedItems,
  }),
}));

const renderSearchResults = (search: string = 'iphone') => {
  return render(
    <MemoryRouter initialEntries={[`/items?search=${search}`]}>
      <Routes>
        <Route path="/items" element={<SearchResults />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('SearchResults', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza correctamente', () => {
    renderSearchResults();
    
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });

  it('tiene la clase CSS correcta', () => {
    renderSearchResults();
    
    const main = screen.getByRole('main');
    expect(main).toHaveClass('search-results');
  });

  it('muestra mensaje cuando no hay query', () => {
    render(
      <MemoryRouter initialEntries={['/items']}>
        <Routes>
          <Route path="/items" element={<SearchResults />} />
        </Routes>
      </MemoryRouter>
    );
    
    expect(screen.getByText(/Ingresa un término de búsqueda/)).toBeInTheDocument();
  });

  it('llama a setLoading al iniciar búsqueda', async () => {
    renderSearchResults('iphone');
    
    await waitFor(() => {
      expect(mockSetLoading).toHaveBeenCalledWith(true);
    });
  });

  it('llama a setQuery con el término de búsqueda', async () => {
    renderSearchResults('iphone');
    
    await waitFor(() => {
      expect(mockSetQuery).toHaveBeenCalledWith('iphone');
    });
  });
});

