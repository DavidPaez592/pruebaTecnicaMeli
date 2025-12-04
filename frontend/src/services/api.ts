import axios from 'axios';
import type { SearchResponse, ItemDetailResponse } from '../types';
import { useToastStore } from '../store/toastStore';

const API_BASE_URL = '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Control para evitar llamadas duplicadas
const pendingRequests = new Map<string, Promise<any>>();

// Control para mostrar solo una vez el warning de mock data por sesión
let mockWarningShown = false;

// Función para generar key única de request
const getRequestKey = (url: string, params?: Record<string, any>) => {
  return `${url}?${JSON.stringify(params || {})}`;
};

// Interceptor para logging de requests
apiClient.interceptors.request.use(
  (config) => {
    const url = config.url || '';
    const params = config.params ? JSON.stringify(config.params) : '';
    console.log(`📤 [API Request] ${config.method?.toUpperCase()} ${url} ${params}`);
    return config;
  },
  (error) => {
    console.error('❌ [API Request Error]', error);
    return Promise.reject(error);
  }
);

// Interceptor para logging de responses
apiClient.interceptors.response.use(
  (response) => {
    const url = response.config.url || '';
    const itemsCount = response.data?.items?.length || 0;
    const hasItem = response.data?.item ? 1 : 0;
    
    // Detectar si son datos mock
    const isMockData = response.data?.items?.[0]?.id?.startsWith('MLA100000') || 
                       response.data?.item?.id?.startsWith('MLA100000');
    
    if (isMockData) {
      console.warn(
        '%c⚠️ ADVERTENCIA: API de Mercado Libre no disponible',
        'background: #ff9800; color: #000; padding: 4px 8px; border-radius: 4px; font-weight: bold;'
      );
      console.warn(
        '%cSe están usando datos mock locales. La API de búsqueda de ML está bloqueada geográficamente.',
        'color: #ff9800;'
      );
      console.warn(
        '%cPara más información, consulta el archivo INFORME-API-MERCADOLIBRE.md',
        'color: #666; font-style: italic;'
      );
      
      // Mostrar toast warning solo una vez por sesión
      if (!mockWarningShown) {
        const { warning } = useToastStore.getState();
        warning('Usando datos de demostración (API de ML no disponible)', 5000);
        mockWarningShown = true;
      }
    }
    
    if (itemsCount > 0) {
      console.log(`📥 [API Response] ${url} - ${itemsCount} productos encontrados`);
    } else if (hasItem) {
      console.log(`📥 [API Response] ${url} - Detalle de producto: ${response.data.item.title}`);
    }
    
    return response;
  },
  (error) => {
    const { error: showError } = useToastStore.getState();
    
    console.error('❌ [API Response Error]', error.message);
    
    if (error.response?.status === 403) {
      console.warn(
        '%c⚠️ API de Mercado Libre bloqueada (403)',
        'background: #f44336; color: #fff; padding: 4px 8px; border-radius: 4px;'
      );
      showError('API de Mercado Libre no disponible');
    } else if (error.code === 'ECONNABORTED') {
      showError('La solicitud tardó demasiado. Intenta de nuevo.');
    } else if (!error.response) {
      showError('Error de conexión. Verifica tu internet.');
    } else {
      showError(`Error del servidor (${error.response.status})`);
    }
    
    return Promise.reject(error);
  }
);

// Buscar productos (con control de duplicados)
export async function searchItems(
  query: string,
  offset: number = 0
): Promise<SearchResponse> {
  const requestKey = getRequestKey('/items', { q: query, offset });
  
  // Si ya hay una petición pendiente para esta búsqueda, reutilizarla
  if (pendingRequests.has(requestKey)) {
    console.log(`⏳ [Reutilizando petición pendiente] "${query}" (offset: ${offset})`);
    return pendingRequests.get(requestKey)!;
  }
  
  console.log(`\n🔍 Buscando: "${query}" (offset: ${offset})`);
  
  const promise = apiClient.get<SearchResponse>('/items', {
    params: { q: query, offset },
  }).then(response => {
    pendingRequests.delete(requestKey);
    return response.data;
  }).catch(error => {
    pendingRequests.delete(requestKey);
    throw error;
  });
  
  pendingRequests.set(requestKey, promise);
  return promise;
}

// Obtener detalle de producto (con control de duplicados)
export async function getItemDetail(id: string): Promise<ItemDetailResponse> {
  const requestKey = getRequestKey(`/items/${id}`, {});
  
  // Si ya hay una petición pendiente para este producto, reutilizarla
  if (pendingRequests.has(requestKey)) {
    console.log(`⏳ [Reutilizando petición pendiente] Producto: ${id}`);
    return pendingRequests.get(requestKey)!;
  }
  
  console.log(`\n📦 Obteniendo detalle del producto: ${id}`);
  
  const promise = apiClient.get<ItemDetailResponse>(`/items/${id}`)
    .then(response => {
      pendingRequests.delete(requestKey);
      return response.data;
    }).catch(error => {
      pendingRequests.delete(requestKey);
      throw error;
    });
  
  pendingRequests.set(requestKey, promise);
  return promise;
}

