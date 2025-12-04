import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Breadcrumb } from './Breadcrumb';

describe('Breadcrumb', () => {
  const categories = ['Celulares', 'Smartphones', 'iPhone'];

  it('renders all categories', () => {
    render(
      <BrowserRouter>
        <Breadcrumb categories={categories} />
      </BrowserRouter>
    );

    categories.forEach((cat) => {
      expect(screen.getByText(cat)).toBeInTheDocument();
    });
  });

  it('renders back link when showBackLink is true', () => {
    render(
      <BrowserRouter>
        <Breadcrumb categories={categories} showBackLink backLinkUrl="/" />
      </BrowserRouter>
    );

    expect(screen.getByText('Volver al listado')).toBeInTheDocument();
  });

  it('renders publication ID when provided', () => {
    render(
      <BrowserRouter>
        <Breadcrumb categories={categories} publicationId="MLA123456" />
      </BrowserRouter>
    );

    // El texto está dividido en múltiples elementos, buscamos por separado
    expect(screen.getByText('Publicación:')).toBeInTheDocument();
    expect(screen.getByText(/MLA123456/)).toBeInTheDocument();
  });

  it('renders custom back link text', () => {
    render(
      <BrowserRouter>
        <Breadcrumb
          categories={categories}
          showBackLink
          backLinkText="Volver"
        />
      </BrowserRouter>
    );

    expect(screen.getByText('Volver')).toBeInTheDocument();
  });
});
