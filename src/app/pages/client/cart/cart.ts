import { Component, computed, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { CartService, FREE_SHIPPING_THRESHOLD } from '../../../services/cart.service';
import { discountPercent } from '../../../models/product.model';
import { Container } from '../../../components/container/container';
import { QuantityInput } from '../../../components/quantity-input/quantity-input';

/** Panier (/panier). */
@Component({
  selector: 'app-cart-page',
  imports: [RouterLink, CurrencyPipe, Container, QuantityInput],
  templateUrl: './cart.html',
})
export default class CartPage {
  private readonly cart = inject(CartService);
  private readonly auth = inject(AuthService);

  protected readonly discountPercent = discountPercent;
  protected readonly freeShippingThreshold = FREE_SHIPPING_THRESHOLD;

  protected readonly items = this.cart.items;
  protected readonly count = this.cart.count;
  protected readonly subtotal = this.cart.subtotal;
  protected readonly shippingCost = this.cart.shippingCost;
  protected readonly total = this.cart.total;
  protected readonly missingForFreeShipping = this.cart.missingForFreeShipping;

  /** Un visiteur doit se connecter avant de commander. */
  protected readonly checkoutLink = computed(() => (this.auth.isLoggedIn() ? '/commande' : '/connexion'));
  protected readonly checkoutParams = computed(() =>
    this.auth.isLoggedIn() ? {} : { redirect: '/commande' },
  );

  protected setQuantity(productId: number, quantity: number): void {
    this.cart.setQuantity(productId, quantity);
  }

  protected remove(productId: number): void {
    this.cart.remove(productId);
  }
}
