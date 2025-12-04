import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ToastContainer } from './Toast';
import { useToastStore } from '../../store/toastStore';

describe('Toast', () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] });
  });

  describe('ToastContainer', () => {
    it('no renderiza nada si no hay toasts', () => {
      const { container } = render(<ToastContainer />);
      expect(container.firstChild).toBeNull();
    });

    it('renderiza toasts cuando existen', () => {
      useToastStore.getState().success('Mensaje de éxito');
      
      render(<ToastContainer />);
      
      expect(screen.getByText('Mensaje de éxito')).toBeInTheDocument();
    });

    it('renderiza múltiples toasts', () => {
      const { success, error } = useToastStore.getState();
      success('Éxito');
      error('Error');
      
      render(<ToastContainer />);
      
      expect(screen.getByText('Éxito')).toBeInTheDocument();
      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    it('toast success tiene clase correcta', () => {
      useToastStore.getState().success('Test');
      
      render(<ToastContainer />);
      
      const toast = screen.getByRole('alert');
      expect(toast).toHaveClass('toast--success');
    });

    it('toast error tiene clase correcta', () => {
      useToastStore.getState().error('Test');
      
      render(<ToastContainer />);
      
      const toast = screen.getByRole('alert');
      expect(toast).toHaveClass('toast--error');
    });

    it('toast warning tiene clase correcta', () => {
      useToastStore.getState().warning('Test');
      
      render(<ToastContainer />);
      
      const toast = screen.getByRole('alert');
      expect(toast).toHaveClass('toast--warning');
    });

    it('toast loading tiene clase correcta', () => {
      useToastStore.getState().loading('Test');
      
      render(<ToastContainer />);
      
      const toast = screen.getByRole('alert');
      expect(toast).toHaveClass('toast--loading');
    });

    it('toast loading no tiene botón de cerrar', () => {
      useToastStore.getState().loading('Cargando...');
      
      render(<ToastContainer />);
      
      expect(screen.queryByLabelText('Cerrar notificación')).not.toBeInTheDocument();
    });

    it('otros toasts tienen botón de cerrar', () => {
      useToastStore.getState().success('Éxito');
      
      render(<ToastContainer />);
      
      expect(screen.getByLabelText('Cerrar notificación')).toBeInTheDocument();
    });

    it('cerrar toast lo remueve', async () => {
      useToastStore.getState().success('Test');
      
      render(<ToastContainer />);
      
      const closeButton = screen.getByLabelText('Cerrar notificación');
      fireEvent.click(closeButton);
      
      // Esperar a que termine la animación de salida
      await waitFor(() => {
        expect(screen.queryByText('Test')).not.toBeInTheDocument();
      }, { timeout: 500 });
    });

    it('tiene aria-label para accesibilidad', () => {
      useToastStore.getState().info('Test');
      
      render(<ToastContainer />);
      
      expect(screen.getByLabelText('Notificaciones')).toBeInTheDocument();
    });

    it('cada toast tiene role="alert"', () => {
      useToastStore.getState().success('Test 1');
      useToastStore.getState().error('Test 2');
      
      render(<ToastContainer />);
      
      const alerts = screen.getAllByRole('alert');
      expect(alerts).toHaveLength(2);
    });
  });

  describe('iconos', () => {
    it('success tiene icono de check', () => {
      useToastStore.getState().success('Test');
      render(<ToastContainer />);
      
      expect(screen.getByText('✓')).toBeInTheDocument();
    });

    it('error tiene icono de X', () => {
      useToastStore.getState().error('Test');
      render(<ToastContainer />);
      
      const icons = screen.getAllByText('✕');
      expect(icons.length).toBeGreaterThan(0); // Icono + botón cerrar
    });

    it('warning tiene icono de advertencia', () => {
      useToastStore.getState().warning('Test');
      render(<ToastContainer />);
      
      expect(screen.getByText('⚠')).toBeInTheDocument();
    });

    it('info tiene icono de información', () => {
      useToastStore.getState().info('Test');
      render(<ToastContainer />);
      
      expect(screen.getByText('ℹ')).toBeInTheDocument();
    });

    it('loading tiene icono de spinner', () => {
      useToastStore.getState().loading('Test');
      render(<ToastContainer />);
      
      expect(screen.getByText('◌')).toBeInTheDocument();
    });
  });
});

