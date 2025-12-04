import { Link } from 'react-router-dom';
import { SearchBox } from '../SearchBox';
import './Header.scss';

export function Header() {
  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo" aria-label="Ir al inicio">
          <img
            src="/Assets/logo_large_25years@2x.png"
            alt="Mercado Libre - 25 años"
            className="header__logo-img"
          />
        </Link>
        <SearchBox />
      </div>
    </header>
  );
}

