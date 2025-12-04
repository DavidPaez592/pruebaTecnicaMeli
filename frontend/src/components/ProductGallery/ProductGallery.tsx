import { useState } from 'react';
import './ProductGallery.scss';

interface ProductGalleryProps {
  pictures: string[];
  title: string;
}

export function ProductGallery({ pictures, title }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!pictures.length) {
    return (
      <div className="product-gallery">
        <div className="product-gallery__main product-gallery__main--empty">
          <span>Sin imagen disponible</span>
        </div>
      </div>
    );
  }

  return (
    <div className="product-gallery">
      <div className="product-gallery__thumbnails">
        {pictures.map((pic, index) => (
          <button
            key={index}
            className={`product-gallery__thumbnail ${
              index === selectedIndex ? 'product-gallery__thumbnail--active' : ''
            }`}
            onClick={() => setSelectedIndex(index)}
            onMouseEnter={() => setSelectedIndex(index)}
            aria-label={`Ver imagen ${index + 1} de ${pictures.length}`}
            aria-current={index === selectedIndex ? 'true' : undefined}
          >
            <img
              src={pic}
              alt=""
              loading="lazy"
              decoding="async"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23f5f5f5" width="100" height="100"/></svg>';
              }}
            />
          </button>
        ))}
      </div>

      <div className="product-gallery__main">
        <img
          src={pictures[selectedIndex]}
          alt={title}
          className="product-gallery__image"
          decoding="async"
          fetchPriority="high"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect fill="%23f5f5f5" width="400" height="400"/><text x="200" y="210" text-anchor="middle" fill="%23999" font-size="24">Sin imagen</text></svg>';
          }}
        />
      </div>
    </div>
  );
}

