import { formatMoney } from './money';

/** Espaces insécables (séparateur de milliers, avant le symbole) → espace simple. */
const plain = (value: string) => value.replace(/[\u00a0\u202f]/g, ' ');

describe('formatMoney', () => {
  it('formats amounts in the chosen currency', () => {
    expect(plain(formatMoney(1500, 'HTG'))).toBe('1 500,00 HTG');
    expect(plain(formatMoney(12.99, 'EUR'))).toBe('12,99 €');
    expect(plain(formatMoney(20, 'USD'))).toBe('20,00 $US');
  });

  it('accepts custom digits', () => {
    expect(plain(formatMoney(5, 'EUR', 'fr-FR', '1.0-0'))).toBe('5 €');
  });
});
