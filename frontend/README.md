# 🎨 Frontend - Mercado Libre Clone

Aplicación React para búsqueda y visualización de productos, desarrollada con las mejores prácticas de desarrollo frontend.

---

## 📦 Instalación

```bash
cd frontend
npm install
```

## 🚀 Ejecución

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview
```

| Servicio | URL |
|----------|-----|
| **Aplicación** | http://localhost:3000 |

> ⚠️ El backend debe estar corriendo en `localhost:3001` para que la app funcione.

---

## 🛠️ Tecnologías

| Tecnología | Versión | Uso |
|------------|---------|-----|
| React | 19 | Librería de UI |
| TypeScript | 5.7 | Tipado estático |
| Vite | 6.0 | Build tool y dev server |
| React Router DOM | 7 | Enrutamiento SPA |
| Zustand | 5 | State management |
| SCSS (Sass) | 1.83 | Estilos con preprocesador |
| Axios | 1.7 | Cliente HTTP |
| Vitest | 2.1 | Framework de testing |
| Testing Library | 16.1 | Testing de componentes |

---

## 📁 Estructura

```
frontend/
├── public/
│   └── Assets/                 # Imágenes, logos, iconos
├── src/
│   ├── components/
│   │   ├── Breadcrumb/         # Navegación de categorías
│   │   ├── Header/             # Header con logo y buscador
│   │   ├── Pagination/         # Paginador de resultados
│   │   ├── ProductCard/        # Tarjeta de producto
│   │   ├── ProductGallery/     # Galería de imágenes
│   │   ├── SearchBox/          # Caja de búsqueda
│   │   ├── Toast/              # Sistema de notificaciones
│   │   └── WelcomeModal/       # Modal de bienvenida
│   ├── hooks/
│   │   └── useSEO.ts           # Hook para meta tags dinámicos
│   ├── pages/
│   │   ├── Home/               # Página principal "/"
│   │   ├── SearchResults/      # Resultados "/items?search="
│   │   └── ProductDetail/      # Detalle "/items/:id"
│   ├── services/
│   │   └── api.ts              # Cliente API con interceptores
│   ├── store/
│   │   ├── searchStore.ts      # Estado de búsqueda y cache
│   │   ├── welcomeStore.ts     # Estado del modal de bienvenida
│   │   └── toastStore.ts       # Estado de notificaciones
│   ├── styles/
│   │   ├── _variables.scss     # Variables CSS (colores, fonts)
│   │   ├── _mixins.scss        # Mixins reutilizables
│   │   └── global.scss         # Estilos globales
│   ├── types/
│   │   └── index.ts            # Tipos TypeScript
│   ├── utils/
│   │   └── formatters.ts       # Funciones de formateo
│   ├── App.tsx                 # Componente raíz
│   └── main.tsx                # Entry point
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

---

## 🗺️ Rutas

| Ruta | Componente | Descripción |
|------|------------|-------------|
| `/` | `Home` | Página principal con buscador |
| `/items?search=:query` | `SearchResults` | Resultados de búsqueda paginados |
| `/items/:id` | `ProductDetail` | Detalle completo del producto |

---

## 🧩 Componentes

### Header
- Logo de Mercado Libre (enlace a home)
- Barra de búsqueda integrada
- Responsive (se adapta a móvil)

### SearchBox
- Input de búsqueda con placeholder
- Botón de búsqueda con icono
- Limpia el input después de buscar
- Modal de bienvenida (solo primera visita)

### ProductCard
- Imagen del producto con lazy loading
- Título, precio, precio tachado, descuento
- Información de cuotas
- Badge de envío gratis
- Estado (Nuevo/Reacondicionado)
- Vendedor
- **Mobile:** Layout horizontal (imagen izquierda, texto derecha)

### ProductGallery
- Miniaturas navegables
- Imagen principal grande
- Hover para cambiar imagen
- Fallback si imagen no carga

### Pagination
- Números de página clicables
- Página activa destacada
- Navegación con flechas
- Footer con fondo gris

### Breadcrumb
- Categorías del producto
- ID de publicación
- Enlace "Volver al listado"

### Toast (Sistema de Notificaciones)
- Tipos: success, error, warning, info, loading
- Auto-dismiss configurable
- Animaciones de entrada/salida
- Accesible (role="alert")

### WelcomeModal
- Se muestra solo la primera visita
- Persiste en localStorage
- Flecha apuntando al buscador
- Mensaje de bienvenida

---

## 🗃️ Estado (Zustand)

### searchStore
```typescript
// Estado de búsqueda con cache
{
  query: string,
  items: SearchItem[],
  categories: string[],
  currentPage: number,
  totalItems: number,
  loading: boolean,
  error: string | null,
  cache: Map<string, CachedSearch>
}
```

**Funcionalidades:**
- Cache de búsquedas (evita llamadas API repetidas)
- Paginación de 10 en 10 items
- Almacena grupos de 50 items del API
- Orden consistente al navegar atrás

### welcomeStore
```typescript
// Estado del modal de bienvenida
{
  hasSeenWelcome: boolean,
  setHasSeenWelcome: (value: boolean) => void
}
```

**Funcionalidades:**
- Persistencia en localStorage
- Solo muestra una vez por navegador

### toastStore
```typescript
// Estado de notificaciones
{
  toasts: Toast[],
  addToast: (toast) => string,
  removeToast: (id) => void,
  success: (message) => string,
  error: (message) => string,
  warning: (message) => string,
  info: (message) => string,
  loading: (message) => string
}
```

---

## 🎨 Estilos

### Metodología BEM
```scss
.product-card {              // Block
  &__image { }               // Element
  &__title { }
  &__price { }
  &--featured { }            // Modifier
}
```

### Variables principales
```scss
// Colores
$color-primary: #3483FA;     // Azul ML
$color-secondary: #FFE600;   // Amarillo ML
$color-success: #00A650;     // Verde
$color-text-primary: rgba(0, 0, 0, 0.9);
$color-text-secondary: rgba(0, 0, 0, 0.55);

// Tipografía
$font-family: 'Nunito Sans', sans-serif;

// Breakpoints
$breakpoint-mobile: 768px;
$breakpoint-tablet: 1024px;
```

### Responsive
- Mobile-first approach
- Breakpoints: 768px (tablet), 1024px (desktop)
- Cards horizontales en móvil
- Imágenes adaptativas

---

## 🔍 SEO

### Hook useSEO
```typescript
useSEO({
  title: 'iPhone 14 - Mercado Libre',
  description: 'Encuentra iPhone 14 al mejor precio...',
  image: 'https://...',
  type: 'product',
  price: 1500000,
  currency: 'ARS'
});
```

### Meta tags generados
- `<title>` dinámico
- `<meta name="description">`
- Open Graph (Facebook)
- Twitter Cards
- Canonical URL
- Robots

### Performance SEO
- Lazy loading de imágenes
- `loading="lazy"` + `decoding="async"`
- `fetchPriority="high"` para imagen principal
- Preconnect a dominios externos
- DNS prefetch

---

## 🧪 Tests

```bash
# Ejecutar todos los tests
npm test

# Modo watch
npm run test:watch

# Con cobertura
npm run test:coverage

# UI de tests
npm run test:ui
```

### Tests Implementados (121 tests)

| Archivo | Tests | Descripción |
|---------|-------|-------------|
| **Header.test.tsx** | 6 | Logo, navegación, estructura semántica |
| **SearchBox.test.tsx** | 5 | Input, submit, limpieza, navegación |
| **ProductCard.test.tsx** | 7 | Renderizado, precios, descuento, envío |
| **ProductGallery.test.tsx** | 9 | Miniaturas, selección, lazy loading |
| **Pagination.test.tsx** | 7 | Páginas, navegación, límites |
| **Breadcrumb.test.tsx** | 4 | Categorías, publicación, enlaces |
| **WelcomeModal.test.tsx** | 8 | Visibilidad, cierre, accesibilidad |
| **Toast.test.tsx** | 12 | Tipos, auto-dismiss, iconos, cierre |
| **Home.test.tsx** | 3 | Renderizado, SEO |
| **SearchResults.test.tsx** | 5 | Búsqueda, loading, errores, sin resultados |
| **ProductDetail.test.tsx** | 15 | Detalle, precio, descripción, galería |
| **searchStore.test.ts** | 12 | Cache, paginación, estado |
| **welcomeStore.test.ts** | 5 | Persistencia localStorage |
| **toastStore.test.ts** | 10 | Add, remove, helpers, auto-dismiss |
| **useSEO.test.ts** | 10 | Meta tags, Open Graph |
| **api.test.ts** | 4 | Llamadas, errores, interceptores |
| **formatters.test.ts** | 9 | Precios, descuentos, moneda |

---

## ⚡ Performance

### Optimizaciones implementadas

| Técnica | Implementación |
|---------|----------------|
| **Lazy Loading** | Imágenes con `loading="lazy"` |
| **Async Decoding** | `decoding="async"` en imágenes |
| **Preconnect** | CDN de imágenes de ML |
| **DNS Prefetch** | Dominios externos |
| **Font Display** | `font-display: swap` |
| **Cache de búsquedas** | Zustand store con Map |
| **Deduplicación API** | Control de peticiones duplicadas |
| **Code Splitting** | React.lazy (preparado) |

### Lighthouse Score (estimado)
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

---

## ♿ Accesibilidad

| Característica | Implementación |
|----------------|----------------|
| **ARIA Labels** | Botones, imágenes, regiones |
| **Roles semánticos** | `main`, `article`, `navigation` |
| **Navegación teclado** | Focus visible, tab order |
| **Alt en imágenes** | Descriptivo para cada imagen |
| **Contraste** | Colores WCAG AA |
| **Screen readers** | Textos descriptivos ocultos |

---

## 🔧 Configuración

### vite.config.ts
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
});
```

### tsconfig.json
- Strict mode habilitado
- Path aliases configurados
- ES2020 target

---

## 📝 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # ESLint
npm test             # Ejecutar tests
npm run test:watch   # Tests en modo watch
npm run test:coverage # Tests con cobertura
npm run test:ui      # UI de Vitest
```

---

## 🐛 Debugging

### Console logs
El servicio API incluye logs detallados:
```
📤 [API Request] GET /items {"q":"iphone","offset":0}
📥 [API Response] /items - 50 productos encontrados
⚠️ ADVERTENCIA: API de Mercado Libre no disponible
```

### React DevTools
- Componentes React visibles
- Estado de Zustand inspeccionable
- Props y hooks rastreables

---

## 👨‍💻 Autor

**David Stiven Paez Bolivar**

📅 Diciembre 2025

