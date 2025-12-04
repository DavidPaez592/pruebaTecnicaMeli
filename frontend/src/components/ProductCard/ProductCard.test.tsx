import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProductCard } from './ProductCard';
import type { SearchItem } from '../../types';

const mockItem: SearchItem = {
  id: 'MLA123',
  title: 'Apple iPhone 13 (128 GB) - Blanco',
  price: {
    currency: 'ARS',
    amount: 1000000,
    decimals: 0,
    regular_amount: null,
  },
  picture: 'https://example.com/image.jpg',
  condition: 'Nuevo',
  free_shipping: true,
  installments: 'Mismo precio en 9 cuotas de $ 111.111',
  seller_nickname: 'SELLER',
};

describe('ProductCard', () => {
  it('renders product title', () => {
    render(
      <BrowserRouter>
        <ProductCard item={mockItem} />
      </BrowserRouter>
    );

    expect(screen.getByText(mockItem.title)).toBeInTheDocument();
  });

  it('renders product price', () => {
    render(
      <BrowserRouter>
        <ProductCard item={mockItem} />
      </BrowserRouter>
    );

    expect(screen.getByText('$ 1.000.000')).toBeInTheDocument();
  });

  it('renders free shipping badge when applicable', () => {
    render(
      <BrowserRouter>
        <ProductCard item={mockItem} />
      </BrowserRouter>
    );

    expect(screen.getByText('Envío gratis')).toBeInTheDocument();
  });

  it('renders installments information', () => {
    render(
      <BrowserRouter>
        <ProductCard item={mockItem} />
      </BrowserRouter>
    );

    expect(screen.getByText(mockItem.installments)).toBeInTheDocument();
  });

  it('renders seller nickname', () => {
    render(
      <BrowserRouter>
        <ProductCard item={mockItem} />
      </BrowserRouter>
    );

    expect(screen.getByText(/Por SELLER/)).toBeInTheDocument();
  });

  it('renders discount when regular_amount exists', () => {
    const itemWithDiscount: SearchItem = {
      ...mockItem,
      price: {
        ...mockItem.price,
        regular_amount: 1200000,
      },
    };

    render(
      <BrowserRouter>
        <ProductCard item={itemWithDiscount} />
      </BrowserRouter>
    );

    expect(screen.getByText(/17% OFF/)).toBeInTheDocument();
  });

  it('links to product detail page', () => {
    render(
      <BrowserRouter>
        <ProductCard item={mockItem} />
      </BrowserRouter>
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/items/${mockItem.id}`);
  });
});

