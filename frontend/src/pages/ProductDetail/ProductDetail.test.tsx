import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProductDetail } from './ProductDetail';

// Mock del hook useSEO
vi.mock('../../hooks/useSEO', () => ({
  useSEO: vi.fn(),
}));

// Mock del servicio API
const mockGetItemDetail = vi.fn();
vi.mock('../../services/api', () => ({
  getItemDetail: () => mockGetItemDetail(),
}));

// Mock de componentes
vi.mock('../../components/Breadcrumb', () => ({
  Breadcrumb: ({ categories }: { categories: string[] }) => (
    <div data-testid="breadcrumb">{categories.join(' > ')}</div>
  ),
}));

vi.mock('../../components/ProductGallery', () => ({
  ProductGallery: () => (
    <div data-testid="product-gallery">Gallery Mock</div>
  ),
}));

const mockItem = {
  id: 'MLA123',
  title: 'Apple iPhone 14 - Blanco estelar',
  price: { currency: 'ARS', amount: 1000000, decimals: 0, regular_amount: null },
  pictures: ['https://example.com/image.jpg'],
  condition: 'Nuevo',
  free_shipping: true,
  sold_quantity: 100,
  installments: '12 cuotas de $83.333',
  description: 'Descripción del producto',
  attributes: [{ id: 'MAIN_COLOR', name: 'Color', value_name: 'Blanco estelar' }],
  category_path_from_root: ['Celulares', 'Smartphones'],
  seller_nickname: 'APPLE STORE',
};

const renderProductDetail = (id: string = 'MLA123') => {
  return render(
    <MemoryRouter initialEntries={[`/items/${id}`]}>
      <Routes>
        <Route path="/items/:id" element={<ProductDetail />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('ProductDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetItemDetail.mockResolvedValue({ item: mockItem });
  });

  it('renderiza correctamente después de cargar', async () => {
    renderProductDetail();
    
    await waitFor(() => {
      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });

  it('muestra el título del producto en h1', async () => {
    renderProductDetail();
    
    await waitFor(() => {
      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveTextContent(mockItem.title);
    });
  });

  it('muestra el breadcrumb', async () => {
    renderProductDetail();
    
    await waitFor(() => {
      expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
    });
  });

  it('muestra la galería de imágenes', async () => {
    renderProductDetail();
    
    await waitFor(() => {
      expect(screen.getByTestId('product-gallery')).toBeInTheDocument();
    });
  });

  it('muestra el precio del producto', async () => {
    renderProductDetail();
    
    await waitFor(() => {
      expect(screen.getByText(/1\.000\.000/)).toBeInTheDocument();
    });
  });

  it('muestra envío gratis cuando aplica', async () => {
    renderProductDetail();
    
    await waitFor(() => {
      expect(screen.getByText('Envío gratis')).toBeInTheDocument();
    });
  });

  it('muestra las cuotas', async () => {
    renderProductDetail();
    
    await waitFor(() => {
      expect(screen.getByText(mockItem.installments)).toBeInTheDocument();
    });
  });

  it('muestra la descripción', async () => {
    renderProductDetail();
    
    await waitFor(() => {
      expect(screen.getByText(mockItem.description)).toBeInTheDocument();
    });
  });

  it('muestra el atributo de color', async () => {
    renderProductDetail();
    
    await waitFor(() => {
      // Buscar específicamente en el elemento de color
      const colorElement = screen.getByText((content, element) => {
        return element?.classList.contains('product-detail__color') === true;
      });
      expect(colorElement).toBeInTheDocument();
    });
  });

  it('muestra la condición del producto', async () => {
    renderProductDetail();
    
    await waitFor(() => {
      expect(screen.getByText('Nuevo')).toBeInTheDocument();
    });
  });

  it('muestra el vendedor', async () => {
    renderProductDetail();
    
    await waitFor(() => {
      expect(screen.getByText(/APPLE STORE/)).toBeInTheDocument();
    });
  });

  it('muestra mensaje de error cuando falla la carga', async () => {
    mockGetItemDetail.mockRejectedValue(new Error('Error de red'));
    
    renderProductDetail();
    
    await waitFor(() => {
      expect(screen.getByText(/Error al cargar el producto/)).toBeInTheDocument();
    });
  });

  it('usa estructura semántica article', async () => {
    renderProductDetail();
    
    await waitFor(() => {
      expect(screen.getByRole('article')).toBeInTheDocument();
    });
  });

  it('usa h1 para el título del producto', async () => {
    renderProductDetail();
    
    await waitFor(() => {
      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveTextContent(mockItem.title);
    });
  });

  it('usa h2 para el título de descripción', async () => {
    renderProductDetail();
    
    await waitFor(() => {
      const descTitle = screen.getByRole('heading', { level: 2 });
      expect(descTitle).toHaveTextContent('Descripción');
    });
  });
});
