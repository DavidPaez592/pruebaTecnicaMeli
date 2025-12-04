// Tipos para la respuesta de la API

export interface Price {
  currency: string;
  amount: number;
  decimals: number;
  regular_amount: number | null;
}

export interface ItemAttribute {
  id: string;
  name: string;
  value_name: string;
}

export interface SearchItem {
  id: string;
  title: string;
  price: Price;
  picture: string;
  condition: string;
  free_shipping: boolean;
  installments: string;
  seller_nickname?: string;
}

export interface SearchResponse {
  categories: string[];
  items: SearchItem[];
  paging: {
    total: number;
    offset: number;
    limit: number;
  };
}

export interface ItemDetail {
  id: string;
  title: string;
  price: Price;
  pictures: string[];
  condition: string;
  free_shipping: boolean;
  sold_quantity: number;
  installments: string;
  description: string;
  attributes: ItemAttribute[];
  category_path_from_root: string[];
  seller_nickname?: string;
}

export interface ItemDetailResponse {
  item: ItemDetail;
}

// Tipos de la API de Mercado Libre
export interface MLSearchResult {
  id: string;
  title: string;
  price: number;
  currency_id: string;
  thumbnail: string;
  condition: string;
  shipping: {
    free_shipping: boolean;
  };
  installments?: {
    quantity: number;
    amount: number;
    currency_id: string;
  };
  seller?: {
    nickname: string;
  };
  original_price?: number;
}

export interface MLSearchResponse {
  results: MLSearchResult[];
  filters: Array<{
    id: string;
    values: Array<{
      path_from_root?: Array<{ name: string }>;
    }>;
  }>;
  paging: {
    total: number;
    offset: number;
    limit: number;
  };
}

export interface MLItemDetail {
  id: string;
  title: string;
  price: number;
  currency_id: string;
  pictures: Array<{ url: string; secure_url: string }>;
  condition: string;
  shipping: {
    free_shipping: boolean;
  };
  sold_quantity: number;
  attributes: Array<{
    id: string;
    name: string;
    value_name: string;
  }>;
  category_id: string;
  original_price?: number;
  installments?: {
    quantity: number;
    amount: number;
    currency_id: string;
  };
  seller?: {
    nickname: string;
  };
}

export interface MLItemDescription {
  plain_text: string;
}

export interface MLCategory {
  path_from_root: Array<{ name: string }>;
}

