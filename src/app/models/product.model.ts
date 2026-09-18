export type ProductTag = 'new' | 'bestseller' | 'trending';

export interface Product {
  id: number;
  title: string;
  description?: string | null;
  image: string;
  categorySlug: string;
  /** Prix de vente actuel, en euros. */
  price: number;
  /** Prix avant remise, présent uniquement si le produit est en promotion. */
  originalPrice?: number | null;
  /** Note moyenne sur 5. */
  rating: number;
  reviewCount: number;
  soldCount: number;
  stock?: number;
  tag?: ProductTag | null;
}

/** Pourcentage de remise arrondi (0 si le produit n'est pas en promotion). */
export function discountPercent(product: Product): number {
  if (!product.originalPrice || product.originalPrice <= product.price) {
    return 0;
  }
  return Math.round((1 - product.price / product.originalPrice) * 100);
}
