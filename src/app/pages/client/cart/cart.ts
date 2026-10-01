import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { CartService } from '../../../services/cart.service';
import { SettingsService } from '../../../services/settings.service';
import { discountPercent } from '../../../models/product.model';
import { Container } from '../../../components/container/container';
import { QuantityInput } from '../../../components/quantity-input/quantity-input';
import { MoneyPipe } from '../../../shared/money';

/** Panier (/panier). */
@Component({
  selector: 'app-cart-page',
  imports: [RouterLink, MoneyPipe, Container, QuantityInput],
  templateUrl: './cart.html',
})
export default class CartPage {
  private readonly cart = inject(CartService);
  private readonly auth = inject(AuthService);

  protected readonly discountPercent = discountPercent;
  protected readonly settings = inject(SettingsService).settings;

  protected readonly items = this.cart.items;
  protected readonly count = this.cart.count;
  protected readonly subtotal = this.cart.subtotal;
  protected readonly shippingCost = this.cart.shippingCost;
  protected readonly total = this.cart.total;
  protected readonly taxAmount = this.cart.taxAmount;
  protected readonly missingForFreeShipping = this.cart.missingForFreeShipping;
  protected readonly missingForMinimum = this.cart.missingForMinimum;
  /** Commandes suspendues ou minimum non atteint : pas de passage en caisse. */
  protected readonly checkoutBlocked = computed(() => !this.settings().checkoutEnabled || this.missingForMinimum() > 0);

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
