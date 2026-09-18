export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface ShippingAddress {
  fullName: string;
  line1: string;
  line2?: string | null;
  postalCode: string;
  city: string;
  country: string;
  phone?: string | null;
}

export interface OrderItem {
  productId: number | null;
  title: string;
  image: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  id: number;
  reference: string;
  userId: number;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingAddress: ShippingAddress;
  createdAt: string;
  updatedAt: string;
}

/** Libellés français des statuts. */
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'En attente',
  PAID: 'Payée',
  SHIPPED: 'Expédiée',
  DELIVERED: 'Livrée',
  CANCELLED: 'Annulée',
};

/**
 * Statuts atteignables depuis un statut donné.
 * Doit rester identique à OrderStatus.canTransitionTo côté API.
 */
export function nextStatuses(status: OrderStatus): OrderStatus[] {
  switch (status) {
    case 'PENDING':
      return ['PAID', 'CANCELLED'];
    case 'PAID':
      return ['SHIPPED', 'CANCELLED'];
    case 'SHIPPED':
      return ['DELIVERED'];
    default:
      return [];
  }
}
