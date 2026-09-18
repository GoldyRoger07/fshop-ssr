import { Product } from './product.model';

export interface CartLine {
  product: Product;
  quantity: number;
}

/** Panier tel que renvoyé par l'API (GET /api/cart). */
export interface CartResponse {
  items: (CartLine & { lineTotal: number })[];
  count: number;
  subtotal: number;
  shippingCost: number;
  total: number;
}
