import { formatCurrency, getCurrencySymbol, getNumberOfCurrencyDigits, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { SettingsService } from '../services/settings.service';

// Formats français disponibles dès que ce fichier est utilisé (tests compris).
registerLocaleData(localeFr);

/** Devises proposées dans les paramètres (code ISO 4217 → libellé). */
export const CURRENCIES: { code: string; label: string }[] = [
  { code: 'HTG', label: 'Gourde haïtienne (HTG)' },
  { code: 'USD', label: 'Dollar américain ($US)' },
  { code: 'EUR', label: 'Euro (€)' },
  { code: 'CAD', label: 'Dollar canadien ($CA)' },
  { code: 'DOP', label: 'Peso dominicain (DOP)' },
];

/**
 * Montant formaté dans la devise donnée : « 1 500,00 HTG », « 12,99 € », « 20,00 $US ».
 * Symbole « large » : sans ambiguïté entre les différents dollars.
 */
export function formatMoney(amount: number, currency: string, locale = 'fr-FR', digitsInfo?: string): string {
  const digits = getNumberOfCurrencyDigits(currency);
  return formatCurrency(
    amount,
    locale,
    getCurrencySymbol(currency, 'wide', locale),
    currency,
    digitsInfo ?? `1.${digits}-${digits}`,
  );
}

/**
 * Remplace le pipe « currency » : suit la devise choisie dans les paramètres de la
 * boutique (mise à jour immédiate après un changement dans le back-office). Pour une
 * commande, passer sa devise figée : {{ order.total | money: order.currency }}.
 */
@Pipe({ name: 'money', pure: false })
export class MoneyPipe implements PipeTransform {
  private readonly settings = inject(SettingsService).settings;
  private readonly locale = inject(LOCALE_ID);

  transform(amount: number | null | undefined, currency?: string | null): string | null {
    if (amount === null || amount === undefined) {
      return null;
    }
    return formatMoney(amount, currency || this.settings().currency, this.locale);
  }
}
