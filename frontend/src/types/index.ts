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

