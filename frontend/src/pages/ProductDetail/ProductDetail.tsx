import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import type { ItemDetail } from '../../types';
import { getItemDetail } from '../../services/api';
import { useToastStore } from '../../store/toastStore';
import { Breadcrumb } from '../../components/Breadcrumb';
import { ProductGallery } from '../../components/ProductGallery';
import { formatFullPrice, calculateDiscount } from '../../utils/formatters';
import { useSEO } from '../../hooks/useSEO';
import './ProductDetail.scss';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const loadingToastId = useRef<string | null>(null);

  const [item, setItem] = useState<ItemDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { loading: showLoadingToast, removeToast } = useToastStore();

  // SEO dinámico para el producto
  useSEO({
    title: item?.title,
    description: item?.description?.substring(0, 160),
    image: item?.pictures?.[0],
    type: 'product',
    price: item?.price.amount,
    currency: item?.price.currency,
  });

  useEffect(() => {
    if (!id) return;

    const loadItem = async () => {
      setLoading(true);
      setError(null);
      
      // Mostrar toast de carga
      loadingToastId.current = showLoadingToast('Cargando producto...');

      try {
        const response = await getItemDetail(id);
        setItem(response.item);
        
        // Remover toast de carga
        if (loadingToastId.current) {
          removeToast(loadingToastId.current);
          loadingToastId.current = null;
        }
      } catch (err) {
        // Remover toast de carga en caso de error
        if (loadingToastId.current) {
          removeToast(loadingToastId.current);
          loadingToastId.current = null;
        }
        
        console.error('Error loading item detail:', err);
        setError('Error al cargar el producto. Intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    loadItem();
    
    // Cleanup
    return () => {
      if (loadingToastId.current) {
        removeToast(loadingToastId.current);
      }
    };
  }, [id, showLoadingToast, removeToast]);

  if (loading) {
    return (
      <main className="product-detail">
        <div className="product-detail__container">
          <div className="product-detail__loading">
            <div className="skeleton" style={{ height: 500 }} />
          </div>
        </div>
      </main>
    );
  }

  if (error || !item) {
    return (
      <main className="product-detail">
        <div className="product-detail__container">
          <p className="product-detail__error">
            {error || 'Producto no encontrado'}
          </p>
        </div>
      </main>
    );
  }

  const discount = calculateDiscount(item.price.regular_amount, item.price.amount);
  const colorAttribute = item.attributes.find((attr) => attr.id === 'MAIN_COLOR');
  const backUrl = searchQuery ? `/items?search=${encodeURIComponent(searchQuery)}` : '/';

  return (
    <>
      <Breadcrumb
        categories={item.category_path_from_root}
        showBackLink
        backLinkText="Volver al listado"
        backLinkUrl={backUrl}
        publicationId={item.id}
      />

      <main className="product-detail">
        <div className="product-detail__container">
          <article className="product-detail__card">
            <div className="product-detail__content">
              <div className="product-detail__gallery">
                <ProductGallery pictures={item.pictures} title={item.title} />
              </div>

              <div className="product-detail__info">
                <div className="product-detail__meta">
                  <span className="product-detail__condition">{item.condition}</span>
                  {item.sold_quantity > 0 && (
                    <>
                      <span className="product-detail__separator">|</span>
                      <span className="product-detail__sold">
                        +{item.sold_quantity} vendidos
                      </span>
                    </>
                  )}
                </div>

                <h1 className="product-detail__title">{item.title}</h1>

                {item.seller_nickname && (
                  <span className="product-detail__seller">
                    Por {item.seller_nickname}
                  </span>
                )}

                <div className="product-detail__price-container">
                  {item.price.regular_amount && (
                    <span className="product-detail__regular-price">
                      {formatFullPrice(item.price.currency, item.price.regular_amount)}
                    </span>
                  )}

                  <div className="product-detail__price-row">
                    <span className="product-detail__price">
                      {formatFullPrice(item.price.currency, item.price.amount)}
                    </span>
                    {discount && (
                      <span className="product-detail__discount">{discount}% OFF</span>
                    )}
                  </div>
                </div>

                {item.installments && (
                  <span className="product-detail__installments">
                    {item.installments}
                  </span>
                )}

                {item.free_shipping && (
                  <span className="product-detail__shipping">Envío gratis</span>
                )}

                {colorAttribute && (
                  <p className="product-detail__color">
                    <strong>Color:</strong> {colorAttribute.value_name}
                  </p>
                )}
              </div>
            </div>

            <section className="product-detail__description">
              <h2 className="product-detail__description-title">Descripción</h2>
              <p className="product-detail__description-text">{item.description}</p>
            </section>
          </article>
        </div>
      </main>
    </>
  );
}

