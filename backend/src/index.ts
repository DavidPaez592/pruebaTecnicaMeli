import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import itemsRoutes from './routes/items.routes';
import { swaggerSpec } from './config/swagger';

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Mercado Libre API - Documentación',
}));

// Rutas
app.use('/api/items', itemsRoutes);

// Ruta de salud
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
🚀 Servidor corriendo en http://localhost:${PORT}

📦 Endpoints disponibles:
   GET /api/items?q=:query&offset=:offset  - Buscar productos
   GET /api/items/:id                       - Detalle de producto
   GET /health                              - Estado del servidor

📚 Documentación Swagger:
   http://localhost:${PORT}/api-docs

⚠️  Nota: Si la API de Mercado Libre no está disponible,
    se usarán datos mock automáticamente.
  `);
});

export default app;
