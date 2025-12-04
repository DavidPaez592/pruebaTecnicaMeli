import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from './Header';

// Mock del SearchBox
vi.mock('../SearchBox', () => ({
  SearchBox: () => <div data-testid="search-box">SearchBox Mock</div>,
}));

const renderHeader = () => {
  return render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );
};

describe('Header', () => {
  it('renderiza correctamente', () => {
    renderHeader();
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('contiene el logo de Mercado Libre', () => {
    renderHeader();
    // El alt text actual incluye "25 años"
    const logo = screen.getByAltText(/Mercado Libre/);
    expect(logo).toBeInTheDocument();
  });

  it('el logo es un enlace a la página principal', () => {
    renderHeader();
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/');
  });

  it('contiene el SearchBox', () => {
    renderHeader();
    expect(screen.getByTestId('search-box')).toBeInTheDocument();
  });

  it('tiene la clase CSS correcta', () => {
    renderHeader();
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('header');
  });

  it('tiene estructura semántica correcta con contenedor', () => {
    renderHeader();
    const header = screen.getByRole('banner');
    const container = header.querySelector('.header__container');
    expect(container).toBeInTheDocument();
  });
});
