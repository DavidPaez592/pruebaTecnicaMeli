import { Link } from 'react-router-dom';
import type { SearchItem } from '../../types';
import { formatFullPrice, calculateDiscount } from '../../utils/formatters';
import './ProductCard.scss';

interface ProductCardProps {
  item: SearchItem;
  searchQuery?: string;
}

export function ProductCard({ item, searchQuery }: ProductCardProps) {
  const discount = calculateDiscount(item.price.regular_amount, item.price.amount);
  
  // Construir URL con el search query para poder volver al listado
  const detailUrl = searchQuery 
    ? `/items/${item.id}?search=${encodeURIComponent(searchQuery)}`
    : `/items/${item.id}`;

  return (
    <article className="product-card">
      <Link to={detailUrl} className="product-card__link">
        <div className="product-card__image-container">
          <img
            src={item.picture}
            alt={item.title}
            className="product-card__image"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23f0f0f0" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="%23999" font-size="14">Sin imagen</text></svg>';
            }}
          />
        </div>

        <div className="product-card__content">
          <h2 className="product-card__title">{item.title}</h2>

          {item.seller_nickname && (
            <span className="product-card__seller">
              Por {item.seller_nickname}
            </span>
          )}

          <div className="product-card__price-container">
            {item.price.regular_amount && (
              <span className="product-card__regular-price">
                {formatFullPrice(item.price.currency, item.price.regular_amount)}
              </span>
            )}

            <div className="product-card__price-row">
              <span className="product-card__price">
                {formatFullPrice(item.price.currency, item.price.amount)}
              </span>
              {discount && (
                <span className="product-card__discount">{discount}% OFF</span>
              )}
            </div>
          </div>

          {item.installments && (
            <span className="product-card__installments">
              {item.installments}
            </span>
          )}

          {item.free_shipping && (
            <span className="product-card__shipping">Envío gratis</span>
          )}

          {item.condition === 'Reacondicionado' && (
            <span className="product-card__condition">{item.condition}</span>
          )}
        </div>
      </Link>
    </article>
  );
}

