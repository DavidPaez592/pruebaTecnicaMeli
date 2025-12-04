import { useSEO } from '../../hooks/useSEO';
import './Home.scss';

export function Home() {
  // SEO para la página principal
  useSEO({
    title: undefined, // Usa el título por defecto
    description: 'La comunidad de compra y venta online más grande de América Latina. Encuentra las mejores ofertas en tecnología, moda, hogar y más.',
  });

  return (
    <main className="home">
      {/* El mensaje de bienvenida ahora está en el SearchBox del Header */}
    </main>
  );
}

