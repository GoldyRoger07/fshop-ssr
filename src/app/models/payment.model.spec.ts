import { DEFAULT_SETTINGS } from './settings.model';
import { enabledPaymentMethods, formatPhone, normalizePhone, paymentFee, walletAccount } from './payment.model';

describe('payment model', () => {
  it('normalizes Haitian phone numbers like the API', () => {
    expect(normalizePhone('+509 3712-3456')).toBe('37123456');
    expect(normalizePhone('509 37 12 34 56')).toBe('37123456');
    expect(normalizePhone('3712.3456')).toBe('37123456');
    expect(normalizePhone('3712')).toBeNull();
    expect(normalizePhone('')).toBeNull();
  });

  it('formats a number in two groups of four', () => {
    expect(formatPhone('37123456')).toBe('3712 3456');
  });

  it('lists enabled methods, wallet accounts and the delivery fee', () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      moncashEnabled: true,
      moncashNumber: '37123456',
      moncashAccountName: 'Fshop',
      cashOnDeliveryFee: 50,
    };
    expect(enabledPaymentMethods(settings)).toEqual(['MONCASH', 'CASH_ON_DELIVERY']);
    expect(walletAccount('MONCASH', settings)).toEqual({ number: '37123456', name: 'Fshop' });
    expect(paymentFee('CASH_ON_DELIVERY', settings)).toBe(50);
    expect(paymentFee('MONCASH', settings)).toBe(0);
  });
});
