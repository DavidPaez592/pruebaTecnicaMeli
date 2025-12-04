import { Router } from 'express';
import {
  searchItemsController,
  getItemByIdController,
} from '../controllers/items.controller';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Price:
 *       type: object
 *       properties:
 *         currency:
 *           type: string
 *           example: "ARS"
 *         amount:
 *           type: number
 *           example: 1500000
 *         decimals:
 *           type: number
 *           example: 0
 *         regular_amount:
 *           type: number
 *           nullable: true
 *           example: 1650000
 *     
 *     SearchItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "MLA1000000000"
 *         title:
 *           type: string
 *           example: "Apple iPhone 16 Pro Max (256 GB) - Negro"
 *         price:
 *           $ref: '#/components/schemas/Price'
 *         picture:
 *           type: string
 *           example: "https://http2.mlstatic.com/D_666103-MLA96419978510_102025-F.jpg"
 *         condition:
 *           type: string
 *           example: "Nuevo"
 *         free_shipping:
 *           type: boolean
 *           example: true
 *         installments:
 *           type: string
 *           example: "Mismo precio en 12 cuotas de $ 125.000"
 *         seller_nickname:
 *           type: string
 *           example: "APPLE STORE OFICIAL"
 *     
 *     SearchResponse:
 *       type: object
 *       properties:
 *         categories:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Celulares y Teléfonos", "Celulares y Smartphones", "Apple iPhone"]
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SearchItem'
 *         paging:
 *           type: object
 *           properties:
 *             total:
 *               type: number
 *               example: 100
 *             offset:
 *               type: number
 *               example: 0
 *             limit:
 *               type: number
 *               example: 50
 *     
 *     Attribute:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "MAIN_COLOR"
 *         name:
 *           type: string
 *           example: "Color"
 *         value_name:
 *           type: string
 *           example: "Negro"
 *     
 *     ItemDetail:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "MLA1000000000"
 *         title:
 *           type: string
 *           example: "Apple iPhone 16 Pro Max (256 GB) - Negro"
 *         price:
 *           $ref: '#/components/schemas/Price'
 *         pictures:
 *           type: array
 *           items:
 *             type: string
 *           example: ["https://http2.mlstatic.com/D_666103-F.jpg"]
 *         condition:
 *           type: string
 *           example: "Nuevo"
 *         free_shipping:
 *           type: boolean
 *           example: true
 *         sold_quantity:
 *           type: number
 *           example: 150
 *         installments:
 *           type: string
 *           example: "Mismo precio en 12 cuotas de $ 125.000"
 *         description:
 *           type: string
 *           example: "El iPhone 16 Pro Max es el smartphone más avanzado..."
 *         attributes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Attribute'
 *         category_path_from_root:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Celulares y Teléfonos", "Celulares y Smartphones", "Apple iPhone"]
 *         seller_nickname:
 *           type: string
 *           example: "APPLE STORE OFICIAL"
 *     
 *     ItemDetailResponse:
 *       type: object
 *       properties:
 *         item:
 *           $ref: '#/components/schemas/ItemDetail'
 *     
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Error al buscar productos"
 *         code:
 *           type: string
 *           example: "SEARCH_ERROR"
 */

/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: Buscar productos
 *     description: |
 *       Busca productos por término de búsqueda con soporte de paginación.
 *       
 *       ⚠️ Si la API de Mercado Libre no está disponible, se devuelven datos mock.
 *     tags: [Items]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Término de búsqueda
 *         example: "iphone"
 *       - in: query
 *         name: offset
 *         required: false
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Posición inicial para paginación
 *         example: 0
 *     responses:
 *       200:
 *         description: Lista de productos encontrados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchResponse'
 *       400:
 *         description: Parámetro de búsqueda requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', searchItemsController);

/**
 * @swagger
 * /api/items/{id}:
 *   get:
 *     summary: Obtener detalle de producto
 *     description: |
 *       Obtiene información detallada de un producto específico incluyendo:
 *       - Información básica (título, precio, condición)
 *       - Galería de imágenes
 *       - Descripción completa
 *       - Atributos (color, marca, etc.)
 *       - Categorías
 *       
 *       ⚠️ Si la API de Mercado Libre no está disponible, se devuelven datos mock.
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto (formato MLA + número)
 *         example: "MLA1000000000"
 *     responses:
 *       200:
 *         description: Detalle del producto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ItemDetailResponse'
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', getItemByIdController);

export default router;
