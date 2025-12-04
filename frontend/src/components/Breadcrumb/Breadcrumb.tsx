import { Link } from 'react-router-dom';
import './Breadcrumb.scss';

interface BreadcrumbProps {
  categories: string[];
  showBackLink?: boolean;
  backLinkText?: string;
  backLinkUrl?: string;
  publicationId?: string;
}

export function Breadcrumb({
  categories,
  showBackLink = false,
  backLinkText = 'Volver al listado',
  backLinkUrl = '/',
  publicationId,
}: BreadcrumbProps) {
  return (
    <nav className="breadcrumb" aria-label="Navegación de categorías">
      <div className="breadcrumb__container">
        <div className="breadcrumb__left">
          {showBackLink && (
            <>
              <Link to={backLinkUrl} className="breadcrumb__back-link">
                {backLinkText}
              </Link>
              <span className="breadcrumb__separator" aria-hidden="true">|</span>
            </>
          )}
          
          <ol className="breadcrumb__list">
            {categories.map((category, index) => (
              <li key={index} className="breadcrumb__item">
                {index > 0 && (
                  <span className="breadcrumb__chevron" aria-hidden="true">{'>'}</span>
                )}
                <span className="breadcrumb__text">{category}</span>
              </li>
            ))}
          </ol>
        </div>

        {publicationId && (
          <span className="breadcrumb__publication">
            <span className="breadcrumb__publication-label">Publicación:</span>
            <span className="breadcrumb__publication-id">#{publicationId}</span>
          </span>
        )}
      </div>
    </nav>
  );
}

