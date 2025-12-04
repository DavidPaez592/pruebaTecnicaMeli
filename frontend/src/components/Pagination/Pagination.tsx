import './Pagination.scss';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Calcular páginas a mostrar
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 10;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Siempre mostrar primera página
      pages.push(1);

      if (currentPage > 4) {
        pages.push('...');
      }

      // Páginas alrededor de la actual
      const start = Math.max(2, currentPage - 2);
      const end = Math.min(totalPages - 1, currentPage + 2);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 3) {
        pages.push('...');
      }

      // Siempre mostrar última página
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav className="pagination" aria-label="Paginación de resultados">
      <ul className="pagination__list">
        {visiblePages.map((page, index) => (
          <li key={index} className="pagination__item">
            {page === '...' ? (
              <span className="pagination__ellipsis">...</span>
            ) : (
              <button
                className={`pagination__button ${
                  page === currentPage ? 'pagination__button--active' : ''
                }`}
                onClick={() => onPageChange(page as number)}
                aria-current={page === currentPage ? 'page' : undefined}
                aria-label={`Ir a página ${page}`}
              >
                {page}
              </button>
            )}
          </li>
        ))}

        {currentPage < totalPages && (
          <li className="pagination__item">
            <button
              className="pagination__button pagination__button--next"
              onClick={() => onPageChange(currentPage + 1)}
              aria-label="Ir a la siguiente página"
            >
              Siguiente {'>'}
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

