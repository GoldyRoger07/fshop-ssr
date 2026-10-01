/** Paramètres de la boutique (GET /api/settings), modifiables dans le back-office. */
export interface StoreSettings {
  storeName: string;
  /** Code ISO 4217 (HTG, USD, EUR…) : devise de tous les prix. */
  currency: string;
  contactEmail: string | null;
  /** Message promotionnel du bandeau (null = aucun). */
  announcement: string | null;
  /** Faux : la boutique reste consultable mais les commandes sont suspendues. */
  checkoutEnabled: boolean;
  closedMessage: string | null;
  shippingCost: number;
  freeShippingEnabled: boolean;
  freeShippingThreshold: number;
  minOrderAmount: number;
  maxQuantityPerItem: number;
  customerCancellation: boolean;
  /** Taux de TVA en % ; les prix du catalogue s'entendent TTC. */
  vatRate: number;
  lowStockThreshold: number;
  /** Délai de retour gratuit en jours (0 = pas de retours gratuits). */
  returnDays: number;
  // Paiement manuel (voir payment.model.ts)
  moncashEnabled: boolean;
  /** 8 chiffres, sans +509. */
  moncashNumber: string | null;
  /** Nom affiché par MonCash avant confirmation. */
  moncashAccountName: string | null;
  natcashEnabled: boolean;
  natcashNumber: string | null;
  natcashAccountName: string | null;
  cashOnDeliveryEnabled: boolean;
  cashOnDeliveryFee: number;
  /** Jours pour payer avant annulation automatique (0 = jamais). */
  paymentDelayDays: number;
  updatedAt?: string;
}

export type StoreSettingsRequest = Omit<StoreSettings, 'updatedAt'>;

/** Valeurs initiales de l'API (migrations V3 à V5), utilisées tant que l'API n'a pas répondu. */
export const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'Fshop',
  currency: 'EUR',
  contactEmail: null,
  announcement: '-15 % sur votre 1re commande avec FSHOP15',
  checkoutEnabled: true,
  closedMessage: null,
  shippingCost: 3.99,
  freeShippingEnabled: true,
  freeShippingThreshold: 29,
  minOrderAmount: 0,
  maxQuantityPerItem: 99,
  customerCancellation: true,
  vatRate: 20,
  lowStockThreshold: 10,
  returnDays: 30,
  moncashEnabled: false,
  moncashNumber: null,
  moncashAccountName: null,
  natcashEnabled: false,
  natcashNumber: null,
  natcashAccountName: null,
  cashOnDeliveryEnabled: true,
  cashOnDeliveryFee: 0,
  paymentDelayDays: 7,
};

/** Part de TVA comprise dans un montant TTC (même calcul que l'API). */
export function includedTax(amountInclTax: number, vatRate: number): number {
  return Math.round(((amountInclTax * vatRate) / (100 + vatRate)) * 100) / 100;
}
