import { discountPercent, Product } from './product.model';

const product = (price: number, originalPrice?: number): Product => ({
  id: 1,
  title: 'Test',
  image: '',
  categorySlug: 'tops',
  price,
  originalPrice,
  rating: 4.5,
  reviewCount: 10,
  soldCount: 100,
});

describe('discountPercent', () => {
  it('returns the rounded discount', () => {
    expect(discountPercent(product(14.99, 29.99))).toBe(50);
    expect(discountPercent(product(5.49, 9.99))).toBe(45);
  });

  it('returns 0 without a valid original price', () => {
    expect(discountPercent(product(10))).toBe(0);
    expect(discountPercent(product(10, 8))).toBe(0);
  });
});
