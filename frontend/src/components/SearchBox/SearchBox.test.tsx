import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SearchBox } from './SearchBox';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('SearchBox', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders search input', () => {
    render(
      <BrowserRouter>
        <SearchBox />
      </BrowserRouter>
    );

    expect(
      screen.getByPlaceholderText('Buscar productos, marcas y más...')
    ).toBeInTheDocument();
  });

  it('renders search button', () => {
    render(
      <BrowserRouter>
        <SearchBox />
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /buscar/i })).toBeInTheDocument();
  });

  it('updates input value on change', () => {
    render(
      <BrowserRouter>
        <SearchBox />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText('Buscar productos, marcas y más...');
    fireEvent.change(input, { target: { value: 'iphone' } });

    expect(input).toHaveValue('iphone');
  });

  it('navigates on form submit with query', () => {
    render(
      <BrowserRouter>
        <SearchBox />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText('Buscar productos, marcas y más...');
    fireEvent.change(input, { target: { value: 'iphone' } });

    const form = screen.getByRole('search');
    fireEvent.submit(form);

    expect(mockNavigate).toHaveBeenCalledWith('/items?search=iphone');
  });

  it('does not navigate with empty query', () => {
    render(
      <BrowserRouter>
        <SearchBox />
      </BrowserRouter>
    );

    const form = screen.getByRole('search');
    fireEvent.submit(form);

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

