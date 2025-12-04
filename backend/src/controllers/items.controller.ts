import type { Request, Response } from 'express';
import { searchItems, getItemDetail } from '../services/mercadolibre.service';

// GET /api/items?q=:query&offset=:offset
export async function searchItemsController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const query = req.query.q as string;
    const offset = parseInt(req.query.offset as string) || 0;

    if (!query) {
      res.status(400).json({ error: 'El parámetro "q" es requerido' });
      return;
    }

    console.log(`\n📥 Búsqueda recibida: q="${query}", offset=${offset}`);
    const result = await searchItems(query, offset);

    res.json(result);
  } catch (error) {
    console.error('❌ Error en búsqueda:', error);
    res.status(500).json({ error: 'Error al buscar productos' });
  }
}

// GET /api/items/:id
export async function getItemByIdController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: 'El ID del producto es requerido' });
      return;
    }

    console.log(`\n📥 Detalle solicitado: id="${id}"`);
    const result = await getItemDetail(id);

    res.json(result);
  } catch (error) {
    console.error('❌ Error obteniendo detalle:', error);
    res.status(500).json({ error: 'Error al obtener el detalle del producto' });
  }
}

