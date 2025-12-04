import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number; // ms, undefined = no auto-dismiss
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  // Helpers
  success: (message: string, duration?: number) => string;
  error: (message: string, duration?: number) => string;
  warning: (message: string, duration?: number) => string;
  info: (message: string, duration?: number) => string;
  loading: (message: string) => string;
}

const generateId = () => `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  addToast: (toast) => {
    const id = generateId();
    const newToast: Toast = { ...toast, id };
    
    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto-dismiss si tiene duración
    if (toast.duration) {
      setTimeout(() => {
        get().removeToast(id);
      }, toast.duration);
    }

    return id;
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  clearToasts: () => {
    set({ toasts: [] });
  },

  // Helpers con duraciones por defecto
  success: (message, duration = 3000) => {
    return get().addToast({ type: 'success', message, duration });
  },

  error: (message, duration = 5000) => {
    return get().addToast({ type: 'error', message, duration });
  },

  warning: (message, duration = 4000) => {
    return get().addToast({ type: 'warning', message, duration });
  },

  info: (message, duration = 3000) => {
    return get().addToast({ type: 'info', message, duration });
  },

  loading: (message) => {
    // Loading no tiene auto-dismiss, se debe remover manualmente
    return get().addToast({ type: 'loading', message });
  },
}));

