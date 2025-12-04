import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Home } from './Home';

// Mock del hook useSEO
vi.mock('../../hooks/useSEO', () => ({
  useSEO: vi.fn(),
}));

describe('Home', () => {
  it('renderiza correctamente', () => {
    render(<Home />);
    
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });

  it('tiene la clase CSS correcta', () => {
    render(<Home />);
    
    const main = screen.getByRole('main');
    expect(main).toHaveClass('home');
  });

  it('usa el elemento main para semántica', () => {
    render(<Home />);
    
    const main = document.querySelector('main.home');
    expect(main).toBeInTheDocument();
  });
});

