import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock del store
const mockSetHasSeenWelcome = vi.fn();
vi.mock('../../store/welcomeStore', () => ({
  useWelcomeStore: () => ({
    hasSeenWelcome: false,
    setHasSeenWelcome: mockSetHasSeenWelcome,
  }),
}));

// Importar después del mock
import { WelcomeModal } from './WelcomeModal';

describe('WelcomeModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza correctamente', () => {
    render(<WelcomeModal />);
    
    expect(screen.getByText('Hola')).toBeInTheDocument();
  });

  it('muestra el mensaje de bienvenida', () => {
    render(<WelcomeModal />);
    
    expect(screen.getByText(/Para realizar búsquedas/)).toBeInTheDocument();
  });

  it('tiene un botón para cerrar', () => {
    render(<WelcomeModal />);
    
    const closeButton = screen.getByLabelText('Cerrar mensaje de bienvenida');
    expect(closeButton).toBeInTheDocument();
  });

  it('llama a setHasSeenWelcome al cerrar', () => {
    render(<WelcomeModal />);
    
    const closeButton = screen.getByLabelText('Cerrar mensaje de bienvenida');
    fireEvent.click(closeButton);
    
    expect(mockSetHasSeenWelcome).toHaveBeenCalledWith(true);
  });

  it('tiene estructura semántica de diálogo', () => {
    render(<WelcomeModal />);
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
  });

  it('tiene aria-modal para accesibilidad', () => {
    render(<WelcomeModal />);
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('tiene título con id para aria-labelledby', () => {
    render(<WelcomeModal />);
    
    const title = screen.getByText('Hola');
    expect(title).toHaveAttribute('id', 'welcome-title');
  });

  it('tiene la clase CSS correcta', () => {
    render(<WelcomeModal />);
    
    // El dialog tiene la clase welcome-modal directamente
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveClass('welcome-modal');
  });
});
