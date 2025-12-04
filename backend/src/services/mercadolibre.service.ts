import axios from 'axios';
import type {
  MLSearchResponse,
  MLItemDetail,
  MLItemDescription,
  MLCategory,
  SearchResponse,
  ItemDetailResponse,
  SearchItem,
} from '../types';
import { filterMockItems, getMockItemDetail } from '../data/mockData';

const ML_API_BASE_URL = 'https://api.mercadolibre.com';

// Cliente HTTP para la API de ML
const mlApiClient = axios.create({
  baseURL: ML_API_BASE_URL,
  timeout: 10000,
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'es-AR,es;q=0.9,en-US;q=0.8,en;q=0.7',
    Accept: 'application/json',
  },
});

// Formatear installments
function formatInstallments(
  quantity?: number,
  amount?: number,
  currencyId?: string
): string {
  if (!quantity || !amount) return '';
  const formattedAmount = amount.toLocaleString('es-AR');
  return `Mismo precio en ${quantity} cuotas de $ ${formattedAmount}`;
}

// Formatear condición
function formatCondition(condition: string): string {
  const conditions: Record<string, string> = {
    new: 'Nuevo',
    used: 'Usado',
    refurbished: 'Reacondicionado',
  };
  return conditions[condition] || condition;
}

// Transformar resultado de búsqueda de ML a nuestro formato
function transformSearchResult(mlResult: MLSearchResponse): SearchResponse {
  // Extraer categorías de los filtros
  const categories: string[] = [];
  const categoryFilter = mlResult.filters?.find((f) => f.id === 'category');
  if (categoryFilter?.values?.[0]?.path_from_root) {
    categoryFilter.values[0].path_from_root.forEach((cat) => {
      categories.push(cat.name);
    });
  }

  // Transformar items
  const items: SearchItem[] = mlResult.results.map((item) => ({
    id: item.id,
    title: item.title,
    price: {
      currency: item.currency_id,
      amount: item.price,
      decimals: 0,
      regular_amount: item.original_price || null,
    },
    picture: item.thumbnail?.replace('http://', 'https://') || '',
    condition: formatCondition(item.condition),
    free_shipping: item.shipping?.free_shipping || false,
    installments: formatInstallments(
      item.installments?.quantity,
      item.installments?.amount,
      item.installments?.currency_id
    ),
    seller_nickname: item.seller?.nickname,
  }));

  return {
    categories,
    items,
    paging: mlResult.paging,
  };
}

// Transformar detalle de item de ML a nuestro formato
function transformItemDetail(
  mlItem: MLItemDetail,
  description: string,
  categoryPath: string[]
): ItemDetailResponse {
  return {
    item: {
      id: mlItem.id,
      title: mlItem.title,
      price: {
        currency: mlItem.currency_id,
        amount: mlItem.price,
        decimals: 0,
        regular_amount: mlItem.original_price || null,
      },
      pictures: mlItem.pictures.map((p) => p.secure_url || p.url),
      condition: formatCondition(mlItem.condition),
      free_shipping: mlItem.shipping?.free_shipping || false,
      sold_quantity: mlItem.sold_quantity || 0,
      installments: formatInstallments(
        mlItem.installments?.quantity,
        mlItem.installments?.amount,
        mlItem.installments?.currency_id
      ),
      description,
      attributes: mlItem.attributes
        .filter((attr) =>
          ['MAIN_COLOR', 'BRAND', 'MODEL', 'INTERNAL_MEMORY'].includes(attr.id)
        )
        .map((attr) => ({
          id: attr.id,
          name: attr.name,
          value_name: attr.value_name || '',
        })),
      category_path_from_root: categoryPath,
      seller_nickname: mlItem.seller?.nickname,
    },
  };
}

// Buscar items
export async function searchItems(
  query: string,
  offset: number = 0,
  limit: number = 50
): Promise<SearchResponse> {
  try {
    console.log(`🔍 Buscando "${query}" en API de Mercado Libre...`);

    const response = await mlApiClient.get<MLSearchResponse>(
      '/sites/MLA/search',
      {
        params: { q: query, offset, limit },
      }
    );

    console.log('✅ Búsqueda exitosa en API de ML');
    return transformSearchResult(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.warn(
        `⚠️ API de ML no disponible (${error.response?.status || error.code}), usando datos mock`
      );
    } else {
      console.warn('⚠️ Error en API de ML, usando datos mock');
    }

    // Fallback a datos mock
    return filterMockItems(query, offset);
  }
}

// Obtener detalle de item
export async function getItemDetail(itemId: string): Promise<ItemDetailResponse> {
  try {
    console.log(`📦 Obteniendo detalle de ${itemId} en API de Mercado Libre...`);

    // Hacer las 3 llamadas en paralelo
    const [itemResponse, descriptionResponse] = await Promise.all([
      mlApiClient.get<MLItemDetail>(`/items/${itemId}`),
      mlApiClient.get<MLItemDescription>(`/items/${itemId}/description`),
    ]);

    // Obtener categoría
    let categoryPath: string[] = [];
    if (itemResponse.data.category_id) {
      try {
        const categoryResponse = await mlApiClient.get<MLCategory>(
          `/categories/${itemResponse.data.category_id}`
        );
        categoryPath = categoryResponse.data.path_from_root.map((c) => c.name);
      } catch {
        categoryPath = ['Celulares y Teléfonos', 'Celulares y Smartphones'];
      }
    }

    console.log('✅ Detalle obtenido exitosamente de API de ML');
    return transformItemDetail(
      itemResponse.data,
      descriptionResponse.data.plain_text,
      categoryPath
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.warn(
        `⚠️ API de ML no disponible (${error.response?.status || error.code}), usando datos mock`
      );
    } else {
      console.warn('⚠️ Error en API de ML, usando datos mock');
    }

    // Fallback a datos mock
    return getMockItemDetail(itemId);
  }
}

