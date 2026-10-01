import type { StoreSettings } from './settings.model';

/**
 * Moyens de paiement, sans prestataire intégré. MonCash / NatCash : le client envoie
 * l'argent au numéro de la boutique puis saisit l'identifiant de transaction reçu
 * par SMS ; l'administrateur le vérifie et fait passer la commande à « Payée ».
 */
export type PaymentMethod = 'MONCASH' | 'NATCASH' | 'CASH_ON_DELIVERY';
export type MobileWallet = Exclude<PaymentMethod, 'CASH_ON_DELIVERY'>;

export const PAYMENT_METHODS: PaymentMethod[] = ['MONCASH', 'NATCASH', 'CASH_ON_DELIVERY'];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  MONCASH: 'MonCash',
  NATCASH: 'NatCash',
  CASH_ON_DELIVERY: 'Paiement à la livraison',
};

/** Pastille visuelle : initiales et couleurs propres à chaque moyen. */
export const PAYMENT_METHOD_BADGES: Record<PaymentMethod, { text: string; classes: string }> = {
  MONCASH: { text: 'MC', classes: 'bg-red-600 text-white' },
  NATCASH: { text: 'NC', classes: 'bg-orange-500 text-white' },
  CASH_ON_DELIVERY: { text: 'HTG', classes: 'bg-green-700 text-white' },
};

export function isPaymentMethodEnabled(method: PaymentMethod, settings: StoreSettings): boolean {
  switch (method) {
    case 'MONCASH':
      return settings.moncashEnabled;
    case 'NATCASH':
      return settings.natcashEnabled;
    case 'CASH_ON_DELIVERY':
      return settings.cashOnDeliveryEnabled;
  }
}

export function enabledPaymentMethods(settings: StoreSettings): PaymentMethod[] {
  return PAYMENT_METHODS.filter((method) => isPaymentMethodEnabled(method, settings));
}

/** Supplément lié au moyen de paiement (même calcul que StoreSettings.paymentFee côté API). */
export function paymentFee(method: PaymentMethod | null, settings: StoreSettings): number {
  return method === 'CASH_ON_DELIVERY' ? settings.cashOnDeliveryFee : 0;
}

/** Paiement attendu avant l'expédition (soumis au délai de paiement). */
export function isMobileWallet(method: PaymentMethod | null): method is MobileWallet {
  return method === 'MONCASH' || method === 'NATCASH';
}

/** Numéro et nom du compte de la boutique pour ce portefeuille. */
export function walletAccount(
  method: MobileWallet,
  settings: StoreSettings,
): { number: string | null; name: string | null } {
  return method === 'MONCASH'
    ? { number: settings.moncashNumber, name: settings.moncashAccountName }
    : { number: settings.natcashNumber, name: settings.natcashAccountName };
}

/**
 * Numéro haïtien réduit à 8 chiffres (« +509 3712-3456 » → « 37123456 »),
 * ou null s'il est invalide. Même règle que PhoneNumbers.normalize côté API.
 */
export function normalizePhone(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }
  let digits = value.replace(/[\s.\-()]/g, '');
  if (digits.startsWith('+')) {
    digits = digits.slice(1);
  }
  if (digits.length === 11 && digits.startsWith('509')) {
    digits = digits.slice(3);
  }
  return /^\d{8}$/.test(digits) ? digits : null;
}

/** « 37123456 » → « 3712 3456 » (lisible et facile à recopier). */
export function formatPhone(number: string): string {
  return /^\d{8}$/.test(number) ? `${number.slice(0, 4)} ${number.slice(4)}` : number;
}
