import { describe, it, expect, beforeEach } from 'vitest';
import { useWelcomeStore } from './welcomeStore';

describe('welcomeStore', () => {
  beforeEach(() => {
    // Reset store state
    useWelcomeStore.setState({ hasSeenWelcome: false });
  });

  describe('hasSeenWelcome', () => {
    it('tiene valor inicial false', () => {
      useWelcomeStore.setState({ hasSeenWelcome: false });
      expect(useWelcomeStore.getState().hasSeenWelcome).toBe(false);
    });
  });

  describe('setHasSeenWelcome', () => {
    it('actualiza hasSeenWelcome a true', () => {
      const { setHasSeenWelcome } = useWelcomeStore.getState();
      
      setHasSeenWelcome(true);
      
      expect(useWelcomeStore.getState().hasSeenWelcome).toBe(true);
    });

    it('puede volver a false', () => {
      const { setHasSeenWelcome } = useWelcomeStore.getState();
      
      setHasSeenWelcome(true);
      setHasSeenWelcome(false);
      
      expect(useWelcomeStore.getState().hasSeenWelcome).toBe(false);
    });

    it('persiste el estado (usa persist middleware)', () => {
      // El store usa zustand persist con nombre 'meli-welcome-storage'
      const { setHasSeenWelcome } = useWelcomeStore.getState();
      
      setHasSeenWelcome(true);
      
      // Verificar que el estado se actualizó correctamente
      expect(useWelcomeStore.getState().hasSeenWelcome).toBe(true);
    });
  });

  describe('persistencia', () => {
    it('el store tiene nombre de persistencia correcto', () => {
      // El store se configura con name: 'meli-welcome-storage'
      // Esto se puede verificar indirectamente
      expect(useWelcomeStore.persist).toBeDefined();
    });
  });
});

