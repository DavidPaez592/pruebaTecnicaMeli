import { useState, FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useWelcomeStore } from '../../store/welcomeStore';
import './SearchBox.scss';

export function SearchBox() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('search') || '';
  const [query, setQuery] = useState(initialQuery);
  const { hasSeenWelcome, setHasSeenWelcome } = useWelcomeStore();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      // Cerrar el modal de bienvenida si está abierto
      if (!hasSeenWelcome) {
        setHasSeenWelcome(true);
      }
      navigate(`/items?search=${encodeURIComponent(trimmedQuery)}`);
      // Limpiar el buscador después de buscar
      setQuery('');
    }
  };

  const handleCloseWelcome = () => {
    setHasSeenWelcome(true);
  };

  return (
    <form className="search-box" onSubmit={handleSubmit} role="search">
      <label htmlFor="search-input" className="visually-hidden">
        Buscar productos, marcas y más
      </label>
      <input
        id="search-input"
        type="text"
        className="search-box__input"
        placeholder="Buscar productos, marcas y más..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoComplete="off"
      />
      <div className="search-box__button-wrapper">
        <button
          type="submit"
          className="search-box__button"
          aria-label="Buscar"
        >
          <img
            src="/Assets/ic_Search@2x.png.png"
            alt=""
            className="search-box__icon"
            aria-hidden="true"
          />
        </button>

        {/* Tooltip de bienvenida - posicionado debajo del botón */}
        {!hasSeenWelcome && (
          <div 
            className="search-box__welcome" 
            role="dialog" 
            aria-modal="true" 
            aria-labelledby="welcome-title"
          >
            <div className="search-box__welcome-arrow" aria-hidden="true" />
            <button
              className="search-box__welcome-close"
              onClick={handleCloseWelcome}
              aria-label="Cerrar mensaje de bienvenida"
              type="button"
            >
              ×
            </button>
            <h2 id="welcome-title" className="search-box__welcome-title">Hola</h2>
            <p className="search-box__welcome-message">
              Para realizar búsquedas, solo debes ingresar el nombre de lo que necesites. 
              Pueden ser productos, marcas y más...
            </p>
          </div>
        )}
      </div>
    </form>
  );
}

