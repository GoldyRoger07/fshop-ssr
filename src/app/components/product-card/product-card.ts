import { Component, computed, inject, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { discountPercent, Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { MoneyPipe } from '../../shared/money';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, MoneyPipe, DecimalPipe],
  templateUrl: './product-card.html',
})
export class ProductCard {
  private readonly cart = inject(CartService);
  private readonly wishlist = inject(WishlistService);

  readonly product = input.required<Product>();

  protected readonly discount = computed(() => discountPercent(this.product()));
  protected readonly inWishlist = computed(() => this.wishlist.has(this.product().id));

  protected readonly tagLabels = {
    new: 'Nouveau',
    bestseller: 'Top ventes',
    trending: 'Tendance',
  } as const;

  protected addToCart(): void {
    this.cart.add(this.product());
  }

  protected toggleWishlist(): void {
    this.wishlist.toggle(this.product().id);
  }
}
