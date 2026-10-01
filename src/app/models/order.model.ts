import { PaymentMethod } from './payment.model';

export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface ShippingAddress {
  fullName: string;
  /** N° et rue. */
  line1: string;
  /** Quartier, point de repère. */
  line2?: string | null;
  postalCode?: string | null;
  /** Commune (Haïti). */
  city: string;
  /** Département ; absent sur les anciennes commandes. */
  department?: string | null;
  country: string;
  phone?: string | null;
}

/** « HT6110 Delmas, Ouest » : code postal, commune et département présents. */
export function formatLocality(address: ShippingAddress): string {
  const city = [address.postalCode, address.city].filter(Boolean).join(' ');
  return [city, address.department].filter(Boolean).join(', ');
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
  /** Supplément du moyen de paiement (paiement à la réception), compris dans le total. */
  paymentFee: number;
  total: number;
  /** TVA comprise dans le total. */
  taxAmount: number;
  /** Devise de la boutique au moment de la commande. */
  currency: string;
  shippingAddress: ShippingAddress;
  /** Null pour les commandes antérieures aux moyens de paiement. */
  paymentMethod: PaymentMethod | null;
  /** Au-delà, la commande impayée est annulée automatiquement. */
  paymentDueAt: string | null;
  /** Le client a indiqué avoir payé. */
  paymentDeclaredAt: string | null;
  /** Identifiant de transaction MonCash / NatCash saisi par le client. */
  paymentTransactionId: string | null;
  /** Numéro (8 chiffres) depuis lequel le client a payé. */
  paymentSenderPhone: string | null;
  /** Paiement signalé mais introuvable : le client doit corriger sa saisie. */
  paymentRejectedAt: string | null;
  paidAt: string | null;
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
 * Statuts atteignables depuis un statut donné. Paiement à la livraison : expédition
 * possible avant paiement. Doit rester identique à OrderStatus.canTransitionTo côté API.
 */
export function nextStatuses(status: OrderStatus, paymentMethod: PaymentMethod | null = null): OrderStatus[] {
  switch (status) {
    case 'PENDING':
      return paymentMethod === 'CASH_ON_DELIVERY' ? ['PAID', 'SHIPPED', 'CANCELLED'] : ['PAID', 'CANCELLED'];
    case 'PAID':
      return ['SHIPPED', 'CANCELLED'];
    case 'SHIPPED':
      return ['DELIVERED'];
    default:
      return [];
  }
}
