import { useEffect, useRef } from 'react';
import { useWelcomeStore } from '../../store/welcomeStore';
import './WelcomeModal.scss';

export function WelcomeModal() {
  const { hasSeenWelcome, setHasSeenWelcome } = useWelcomeStore();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasSeenWelcome && modalRef.current) {
      modalRef.current.focus();
    }
  }, [hasSeenWelcome]);

  if (hasSeenWelcome) {
    return null;
  }

  const handleClose = () => {
    setHasSeenWelcome(true);
  };

  return (
    <div className="welcome-modal" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
      <div className="welcome-modal__tooltip" ref={modalRef} tabIndex={-1}>
        <button
          className="welcome-modal__close"
          onClick={handleClose}
          aria-label="Cerrar mensaje de bienvenida"
        >
          ×
        </button>
        <h2 id="welcome-title" className="welcome-modal__title">Hola</h2>
        <p className="welcome-modal__message">
          Para realizar búsquedas, solo debes ingresar el nombre de lo que necesites. 
          Pueden ser productos, marcas y más...
        </p>
        <div className="welcome-modal__arrow" aria-hidden="true" />
      </div>
    </div>
  );
}

