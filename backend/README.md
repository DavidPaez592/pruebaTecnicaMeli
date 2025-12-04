# 🖥️ Backend - Mercado Libre API

Servidor Node.js/Express que sirve como intermediario entre el frontend y la API de Mercado Libre.

---

## 📦 Instalación

```bash
cd backend
npm install
```

## 🚀 Ejecución

```bash
# Desarrollo (con hot reload)
npm run dev

# Producción
npm run build
npm start
```

| Servicio | URL |
|----------|-----|
| **API Base** | http://localhost:3001/api |
| **Swagger Docs** | http://localhost:3001/api-docs |
| **Health Check** | http://localhost:3001/health |

---

## 🛠️ Tecnologías

| Tecnología | Versión | Uso |
|------------|---------|-----|
| Node.js | 20+ | Runtime de JavaScript |
| Express | 4.21 | Framework web |
| TypeScript | 5.7 | Tipado estático |
| Axios | 1.7 | Cliente HTTP para APIs externas |
| Swagger/OpenAPI | 6.2 | Documentación interactiva |
| Vitest | 2.1 | Framework de testing |
| Nodemon | 3.1 | Hot reload en desarrollo |
| ts-node | 10.9 | Ejecución directa de TypeScript |

---

## 📁 Estructura

```
backend/
├── src/
│   ├── config/
│   │   └── swagger.ts          # Configuración Swagger/OpenAPI
│   ├── controllers/
│   │   └── items.controller.ts # Controladores de endpoints
│   ├── data/
│   │   ├── mockData.ts         # Datos mock (100 productos)
│   │   └── mockData.test.ts    # Tests de datos mock
│   ├── routes/
│   │   └── items.routes.ts     # Definición de rutas + JSDoc Swagger
│   ├── services/
│   │   └── mercadolibre.service.ts # Servicio de conexión a ML API
│   ├── types/
│   │   └── index.ts            # Tipos TypeScript
│   ├── utils/
│   │   └── formatters.ts       # Funciones de formateo
│   └── index.ts                # Entry point
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

---

## 🔌 API Endpoints

### `GET /api/items`

Busca productos por término de búsqueda.

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `q` | string | ✅ | Término de búsqueda |
| `offset` | number | ❌ | Offset para paginación (default: 0) |

**Ejemplo:**
```bash
curl "http://localhost:3001/api/items?q=iphone&offset=0"
```

**Respuesta:**
```json
{
  "categories": ["Celulares y Teléfonos", "Celulares y Smartphones", "Apple iPhone"],
  "items": [
    {
      "id": "MLA1000000000",
      "title": "Apple iPhone 17 Pro Max (256 GB) - Naranja cósmico",
      "price": {
        "currency": "ARS",
        "amount": 2500000,
        "decimals": 0,
        "regular_amount": null
      },
      "picture": "http://http2.mlstatic.com/...",
      "condition": "Nuevo",
      "free_shipping": true,
      "installments": "Mismo precio en 12 cuotas de $ 208.333",
      "seller_nickname": "APPLE STORE OFICIAL",
      "color": "Naranja cósmico"
    }
  ],
  "paging": {
    "total": 100,
    "offset": 0,
    "limit": 50
  }
}
```

### `GET /api/items/:id`

Obtiene el detalle completo de un producto.

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `id` | string | ✅ | ID del producto (ej: MLA1000000000) |

**Ejemplo:**
```bash
curl "http://localhost:3001/api/items/MLA1000000000"
```

**Respuesta:**
```json
{
  "item": {
    "id": "MLA1000000000",
    "title": "Apple iPhone 17 Pro Max (256 GB) - Naranja cósmico",
    "price": {
      "currency": "ARS",
      "amount": 2500000,
      "decimals": 0,
      "regular_amount": null
    },
    "pictures": ["url1", "url2", "url3", "url4"],
    "condition": "Nuevo",
    "free_shipping": true,
    "sold_quantity": 150,
    "installments": "Mismo precio en 12 cuotas de $ 208.333",
    "description": "El iPhone 17 Pro Max representa...",
    "attributes": [
      { "id": "MAIN_COLOR", "name": "Color", "value_name": "Naranja cósmico" },
      { "id": "BRAND", "name": "Marca", "value_name": "Apple" }
    ],
    "category_path_from_root": ["Celulares y Teléfonos", "Celulares y Smartphones", "Apple iPhone"],
    "seller_nickname": "APPLE STORE OFICIAL"
  }
}
```

### `GET /health`

Health check del servidor.

```bash
curl "http://localhost:3001/health"
# { "status": "ok", "timestamp": "2025-12-04T..." }
```

---

## 🧪 Tests

```bash
# Ejecutar todos los tests
npm test

# Modo watch
npm run test:watch

# Con cobertura
npm run test:coverage
```

### Tests Implementados (35 tests)

| Categoría | Tests | Descripción |
|-----------|-------|-------------|
| **mockSearchResults** | 8 | Validación de 100 productos, IDs únicos, precios, imágenes |
| **getProductDescription** | 6 | Descripciones únicas por modelo de iPhone |
| **getProductSpecs** | 3 | Especificaciones técnicas por modelo |
| **filterMockItems** | 9 | Filtrado, paginación, orden determinístico, búsquedas vacías |
| **getMockItemDetail** | 6 | Detalle de producto, atributos, pictures |
| **consistencia de datos** | 3 | Modelos válidos, rangos de precio, cuotas |

---

## ⚠️ Problema con la API de Mercado Libre

### El Problema

La API pública de Mercado Libre **bloquea todas las peticiones** a los endpoints de búsqueda y detalle de productos con error `403 Forbidden`.

```bash
# Esto falla con 403:
curl "https://api.mercadolibre.com/sites/MLA/search?q=iphone"
# {"message":"forbidden","error":"forbidden","status":403,"cause":[]}

curl "https://api.mercadolibre.com/items/MLA1234567890"
# {"message":"forbidden","error":"forbidden","status":403,"cause":[]}
```

### Intentos de Solución

| Intento | Resultado |
|---------|-----------|
| ❌ Petición directa sin auth | 403 Forbidden |
| ❌ Headers User-Agent/Accept | 403 Forbidden |
| ❌ OAuth 2.0 Client Credentials | 403 Forbidden |
| ❌ VPN a Argentina | 403 Forbidden |
| ❌ Diferentes endpoints | 403 Forbidden |

### Causa Identificada

El sistema **PolicyAgent** de Mercado Libre bloquea el acceso a estos endpoints públicos. Según la documentación oficial:

> "Los recursos de búsqueda están disponibles solo para Argentina, México, Brasil, Colombia, Chile, Uruguay, Perú y Ecuador, para los canales de Marketplace y MShops."

Sin embargo, incluso desde Argentina (vía VPN) el bloqueo persiste, indicando que es una restricción a nivel de política de acceso, no geográfica.

### Solución Implementada ✅

```typescript
// mercadolibre.service.ts
export async function searchItems(query: string, offset: number = 0) {
  try {
    // Intentar con la API real de ML
    const response = await axios.get(`${ML_API_BASE}/sites/MLA/search`, {
      params: { q: query, offset, limit: 50 }
    });
    return formatSearchResponse(response.data);
  } catch (error) {
    // Si falla (403), usar datos mock
    if (error.response?.status === 403) {
      console.warn('⚠️ API de ML bloqueada, usando datos mock');
      return filterMockItems(query, offset);
    }
    throw error;
  }
}
```

### Características del Fallback

| Característica | Implementación |
|----------------|----------------|
| **100 productos mock** | Diferentes modelos de iPhone con datos realistas |
| **Búsqueda funcional** | Filtra por título, ID, palabras clave válidas |
| **Paginación real** | Offset y límite funcionan correctamente |
| **Orden determinístico** | Mismo orden para misma búsqueda (seed-based shuffle) |
| **Descripciones únicas** | Cada modelo tiene specs técnicas diferentes |
| **Imágenes reales** | URLs de mlstatic.com con productos Apple |

### OAuth 2.0 Implementado

Aunque no resuelve el bloqueo, OAuth 2.0 está completamente implementado y listo para cuando ML habilite el acceso:

```typescript
// Obtener token
const tokenResponse = await axios.post('https://api.mercadolibre.com/oauth/token', {
  grant_type: 'client_credentials',
  client_id: process.env.MELI_APP_ID,
  client_secret: process.env.MELI_SECRET_KEY
});

// El token funciona para /users/me pero NO para /search
```

---

## 📚 Swagger UI

Documentación interactiva disponible en: **http://localhost:3001/api-docs**

![Swagger UI](../screenshots/swagger.png)

Características:
- Prueba de endpoints en vivo
- Esquemas de request/response
- Ejemplos de uso
- Códigos de error documentados

---

## 🔧 Variables de Entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | 3001 |
| `MELI_APP_ID` | App ID de Mercado Libre | - |
| `MELI_SECRET_KEY` | Secret Key de ML | - |
| `USE_MOCK_ON_FAILURE` | Usar mock si API falla | true |

---

## 📝 Scripts Disponibles

```bash
npm run dev          # Desarrollo con hot reload
npm run build        # Compilar TypeScript
npm start            # Ejecutar build
npm test             # Ejecutar tests
npm run test:watch   # Tests en modo watch
npm run test:coverage # Tests con cobertura
```

---

## 👨‍💻 Autor

**David Stiven Paez Bolivar**

📅 Diciembre 2025

