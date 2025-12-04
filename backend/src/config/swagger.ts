import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mercado Libre API - Prueba Técnica',
      version: '1.0.0',
      description: `
API Backend para la prueba técnica de Frontend de Mercado Libre.

## Endpoints disponibles

- **Búsqueda de productos**: Permite buscar productos por término de búsqueda con paginación.
- **Detalle de producto**: Obtiene información detallada de un producto específico.

## Nota importante

⚠️ La API de Mercado Libre puede estar bloqueada. En ese caso, se utilizan datos mock automáticamente.
      `,
      contact: {
        name: 'David Stiven Paez Bolivar',
        email: 'davidpaez502@gmail.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Servidor de desarrollo',
      },
    ],
    tags: [
      {
        name: 'Items',
        description: 'Operaciones relacionadas con productos',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);

