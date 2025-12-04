import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useToastStore } from './toastStore';

describe('toastStore', () => {
  beforeEach(() => {
    // Limpiar toasts antes de cada test
    useToastStore.setState({ toasts: [] });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('addToast', () => {
    it('agrega un toast con id único', () => {
      const { addToast } = useToastStore.getState();
      const id = addToast({ type: 'success', message: 'Test' });
      
      expect(id).toMatch(/^toast-/);
      expect(useToastStore.getState().toasts).toHaveLength(1);
    });

    it('auto-dismiss después de la duración', () => {
      const { addToast } = useToastStore.getState();
      addToast({ type: 'success', message: 'Test', duration: 1000 });
      
      expect(useToastStore.getState().toasts).toHaveLength(1);
      
      vi.advanceTimersByTime(1000);
      
      expect(useToastStore.getState().toasts).toHaveLength(0);
    });

    it('no auto-dismiss sin duración', () => {
      const { addToast } = useToastStore.getState();
      addToast({ type: 'loading', message: 'Cargando...' });
      
      vi.advanceTimersByTime(10000);
      
      expect(useToastStore.getState().toasts).toHaveLength(1);
    });
  });

  describe('removeToast', () => {
    it('remueve toast por id', () => {
      const { addToast, removeToast } = useToastStore.getState();
      const id = addToast({ type: 'info', message: 'Test' });
      
      removeToast(id);
      
      expect(useToastStore.getState().toasts).toHaveLength(0);
    });

    it('no falla si el id no existe', () => {
      const { removeToast } = useToastStore.getState();
      
      expect(() => removeToast('non-existent')).not.toThrow();
    });
  });

  describe('clearToasts', () => {
    it('limpia todos los toasts', () => {
      const { addToast, clearToasts } = useToastStore.getState();
      addToast({ type: 'success', message: 'Test 1' });
      addToast({ type: 'error', message: 'Test 2' });
      addToast({ type: 'info', message: 'Test 3' });
      
      clearToasts();
      
      expect(useToastStore.getState().toasts).toHaveLength(0);
    });
  });

  describe('helpers', () => {
    it('success() crea toast con tipo success', () => {
      const { success } = useToastStore.getState();
      success('Operación exitosa');
      
      const toast = useToastStore.getState().toasts[0];
      expect(toast.type).toBe('success');
      expect(toast.message).toBe('Operación exitosa');
    });

    it('error() crea toast con tipo error', () => {
      const { error } = useToastStore.getState();
      error('Algo salió mal');
      
      const toast = useToastStore.getState().toasts[0];
      expect(toast.type).toBe('error');
    });

    it('warning() crea toast con tipo warning', () => {
      const { warning } = useToastStore.getState();
      warning('Advertencia');
      
      const toast = useToastStore.getState().toasts[0];
      expect(toast.type).toBe('warning');
    });

    it('info() crea toast con tipo info', () => {
      const { info } = useToastStore.getState();
      info('Información');
      
      const toast = useToastStore.getState().toasts[0];
      expect(toast.type).toBe('info');
    });

    it('loading() crea toast sin auto-dismiss', () => {
      const { loading } = useToastStore.getState();
      loading('Cargando...');
      
      const toast = useToastStore.getState().toasts[0];
      expect(toast.type).toBe('loading');
      expect(toast.duration).toBeUndefined();
    });

    it('los helpers retornan el id del toast', () => {
      const { success, error, warning, info, loading } = useToastStore.getState();
      
      const ids = [
        success('Test'),
        error('Test'),
        warning('Test'),
        info('Test'),
        loading('Test'),
      ];
      
      ids.forEach((id) => {
        expect(id).toMatch(/^toast-/);
      });
    });
  });

  describe('múltiples toasts', () => {
    it('mantiene el orden de los toasts', () => {
      const { success, error, info } = useToastStore.getState();
      success('Primero');
      error('Segundo');
      info('Tercero');
      
      const messages = useToastStore.getState().toasts.map((t) => t.message);
      expect(messages).toEqual(['Primero', 'Segundo', 'Tercero']);
    });

    it('cada toast tiene id único', () => {
      const { addToast } = useToastStore.getState();
      addToast({ type: 'info', message: 'Test' });
      addToast({ type: 'info', message: 'Test' });
      addToast({ type: 'info', message: 'Test' });
      
      const ids = useToastStore.getState().toasts.map((t) => t.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(3);
    });
  });
});

