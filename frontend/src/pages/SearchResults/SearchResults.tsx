import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearchStore } from '../../store/searchStore';
import { useToastStore } from '../../store/toastStore';
import { searchItems } from '../../services/api';
import { ProductCard } from '../../components/ProductCard';
import { Pagination } from '../../components/Pagination';
import { useSEO } from '../../hooks/useSEO';
import './SearchResults.scss';

export function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('search') || '';
  const loadingToastId = useRef<string | null>(null);

  // SEO dinámico para búsqueda
  useSEO({
    title: query ? `${query} - Búsqueda` : 'Buscar productos',
    description: query 
      ? `Encuentra ${query} en Mercado Libre. Descubre la mejor forma de comprar online.`
      : 'Busca productos, marcas y más en Mercado Libre.',
  });

  const {
    items,
    currentPage,
    itemsPerPage,
    totalItems,
    loading,
    error,
    setQuery,
    setCurrentPage,
    setSearchResults,
    setLoading,
    setError,
    getCachedItems,
  } = useSearchStore();

  const { loading: showLoadingToast, removeToast, success, info } = useToastStore();

  // Calcular items de la página actual
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return items.slice(start, end);
  }, [items, currentPage, itemsPerPage]);

  // Calcular total de páginas
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Cargar resultados
  useEffect(() => {
    if (!query) return;

    const loadResults = async () => {
      setLoading(true);
      setQuery(query);
      setCurrentPage(1);
      
      // Mostrar toast de carga
      loadingToastId.current = showLoadingToast(`Buscando "${query}"...`);

      try {
        const response = await searchItems(query, 0);
        
        // Remover toast de carga
        if (loadingToastId.current) {
          removeToast(loadingToastId.current);
          loadingToastId.current = null;
        }
        
        // Guardar todos los items y el total real de la API
        setSearchResults(
          query,
          response.items,
          response.categories,
          response.paging.total
        );
        
        // Toast de éxito
        if (response.items.length > 0) {
          success(`${response.paging.total} resultados encontrados`);
        } else {
          info('No se encontraron resultados');
        }
      } catch (err) {
        // Remover toast de carga en caso de error
        if (loadingToastId.current) {
          removeToast(loadingToastId.current);
          loadingToastId.current = null;
        }
        
        console.error('Error loading search results:', err);
        setError('Error al cargar los resultados. Intenta nuevamente.');
      }
    };

    loadResults();
    
    // Cleanup
    return () => {
      if (loadingToastId.current) {
        removeToast(loadingToastId.current);
      }
    };
  }, [query, setSearchResults, setLoading, setQuery, setCurrentPage, setError, showLoadingToast, removeToast, success, info]);

  // Manejar cambio de página
  const handlePageChange = async (page: number) => {
    setCurrentPage(page);

    // Si necesitamos más items del servidor
    const neededOffset = (page - 1) * itemsPerPage;
    if (neededOffset >= items.length && neededOffset < totalItems) {
      const newOffset = Math.floor(neededOffset / 50) * 50;
      
      setLoading(true);
      const pageLoadingId = showLoadingToast('Cargando más productos...');
      
      try {
        const response = await searchItems(query, newOffset);
        removeToast(pageLoadingId);
        
        // Agregar nuevos items al cache
        const allItems = [...items, ...response.items];
        setSearchResults(query, allItems, [], response.paging.total);
        
        success(`Página ${page} cargada`);
      } catch (err) {
        removeToast(pageLoadingId);
        console.error('Error loading more results:', err);
        setError('Error al cargar más resultados.');
      }
    }

    // Scroll al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!query) {
    return (
      <main className="search-results">
        <div className="search-results__container">
          <p className="search-results__message">
            Ingresa un término de búsqueda para ver resultados
          </p>
        </div>
      </main>
    );
  }

  if (loading && items.length === 0) {
    return (
      <main className="search-results">
        <div className="search-results__container">
          <div className="search-results__loading">
            <div className="skeleton" style={{ height: 200 }} />
            <div className="skeleton" style={{ height: 200 }} />
            <div className="skeleton" style={{ height: 200 }} />
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="search-results">
        <div className="search-results__container">
          <p className="search-results__error">{error}</p>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="search-results">
        <div className="search-results__container">
          <div className="search-results__no-results">
            <div className="search-results__no-results-icon">🔍</div>
            <h2 className="search-results__no-results-title">
              No hay publicaciones que coincidan con tu búsqueda
            </h2>
            <p className="search-results__no-results-query">
              "{query}"
            </p>
            <ul className="search-results__no-results-tips">
              <li>Revisá la ortografía de la palabra.</li>
              <li>Utilizá palabras más genéricas o menos palabras.</li>
              <li>Probá con: <strong>iphone</strong>, <strong>apple</strong>, <strong>celular</strong></li>
            </ul>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="search-results">
      <div className="search-results__container">
        <section className="search-results__list" aria-label="Resultados de búsqueda">
          {paginatedItems.map((item) => (
            <ProductCard key={item.id} item={item} searchQuery={query} />
          ))}
        </section>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </main>
  );
}

