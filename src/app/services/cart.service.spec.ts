import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Product } from '../models/product.model';
import { DEFAULT_SETTINGS } from '../models/settings.model';
import { CartService } from './cart.service';
import { SettingsService } from './settings.service';

const { shippingCost: SHIPPING_COST, freeShippingThreshold: FREE_SHIPPING_THRESHOLD } = DEFAULT_SETTINGS;

const product = (id: number, price: number): Product => ({
  id,
  title: `Produit ${id}`,
  image: '',
  categorySlug: 'tops',
  price,
  rating: 4.5,
  reviewCount: 10,
  soldCount: 100,
});

describe('CartService (visiteur)', () => {
  let cart: CartService;
  let settings: SettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    cart = TestBed.inject(CartService);
    settings = TestBed.inject(SettingsService);
  });

  it('groups the same product into a single line', () => {
    cart.add(product(1, 10));
    cart.add(product(1, 10));
    cart.add(product(2, 5));

    expect(cart.items().length).toBe(2);
    expect(cart.count()).toBe(3);
    expect(cart.subtotal()).toBeCloseTo(25);
  });

  it('charges shipping below the free threshold only', () => {
    cart.add(product(1, 10));
    expect(cart.shippingCost()).toBeCloseTo(SHIPPING_COST);
    expect(cart.total()).toBeCloseTo(10 + SHIPPING_COST);
    expect(cart.missingForFreeShipping()).toBeCloseTo(FREE_SHIPPING_THRESHOLD - 10);

    cart.setQuantity(1, 4);
    expect(cart.subtotal()).toBeCloseTo(40);
    expect(cart.shippingCost()).toBe(0);
    expect(cart.total()).toBeCloseTo(40);
    expect(cart.missingForFreeShipping()).toBe(0);
  });

  it('follows the shop settings', () => {
    settings.set({ ...DEFAULT_SETTINGS, shippingCost: 5, freeShippingEnabled: false, minOrderAmount: 50 });
    cart.add(product(1, 40));

    expect(cart.shippingCost()).toBe(5);
    expect(cart.missingForFreeShipping()).toBe(0);
    expect(cart.missingForMinimum()).toBeCloseTo(10);
    // 45 € TTC à 20 % : 7,50 € de TVA
    expect(cart.taxAmount()).toBeCloseTo(7.5);
  });

  it('removes a line when its quantity reaches zero', () => {
    cart.add(product(1, 10));
    cart.remove(1);

    expect(cart.items()).toEqual([]);
    expect(cart.shippingCost()).toBe(0);
  });
});
