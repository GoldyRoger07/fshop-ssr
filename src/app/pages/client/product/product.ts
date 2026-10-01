import { Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../../services/catalog.service';
import { CartService } from '../../../services/cart.service';
import { SettingsService } from '../../../services/settings.service';
import { WishlistService } from '../../../services/wishlist.service';
import { discountPercent, Product } from '../../../models/product.model';
import { Container } from '../../../components/container/container';
import { ProductCard } from '../../../components/product-card/product-card';
import { QuantityInput } from '../../../components/quantity-input/quantity-input';
import { errorMessage } from '../../../shared/api-error';
import { MoneyPipe } from '../../../shared/money';

/** Fiche produit (/produit/:id). */
@Component({
  selector: 'app-product-page',
  imports: [RouterLink, MoneyPipe, DecimalPipe, Container, ProductCard, QuantityInput],
  templateUrl: './product.html',
})
export default class ProductPage {
  private readonly catalog = inject(CatalogService);
  private readonly cart = inject(CartService);
  private readonly wishlist = inject(WishlistService);

  /** Paramètre d'URL « id ». */
  readonly id = input.required<string>();

  protected readonly settings = inject(SettingsService).settings;

  protected readonly product = signal<Product | null>(null);
  protected readonly related = signal<Product[]>([]);
  /** Nom de la catégorie pour le fil d'Ariane (le produit ne porte que le slug). */
  protected readonly categoryName = signal('');
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly quantity = signal(1);
  protected readonly added = signal(false);

  protected readonly discount = computed(() => {
    const product = this.product();
    return product ? discountPercent(product) : 0;
  });

  protected readonly inWishlist = computed(() => {
    const product = this.product();
    return product ? this.wishlist.has(product.id) : false;
  });

  protected readonly maxQuantity = computed(() => {
    const limit = this.settings().maxQuantityPerItem;
    return Math.max(1, Math.min(limit, this.product()?.stock ?? limit));
  });
  protected readonly lowStock = computed(() => {
    const stock = this.product()?.stock;
    return stock !== undefined && stock > 0 && stock <= this.settings().lowStockThreshold;
  });
  protected readonly outOfStock = computed(() => this.product()?.stock === 0);

  constructor() {
    effect(() => {
      const id = Number(this.id());
      untracked(() => {
        this.loading.set(true);
        this.error.set(null);
        this.quantity.set(1);
        this.added.set(false);

        this.catalog.getProduct(id).subscribe({
          next: (product) => {
            this.product.set(product);
            this.loading.set(false);
            this.loadCategoryName(product.categorySlug);
            this.loadRelated(product);
          },
          error: (err: unknown) => {
            this.product.set(null);
            this.error.set(errorMessage(err));
            this.loading.set(false);
          },
        });
      });
    });
  }

  protected addToCart(): void {
    const product = this.product();
    if (!product) {
      return;
    }
    this.cart.add(product, this.quantity());
    this.added.set(true);
  }

  protected toggleWishlist(): void {
    const product = this.product();
    if (product) {
      this.wishlist.toggle(product.id);
    }
  }

  private loadCategoryName(slug: string): void {
    this.categoryName.set(slug);
    this.catalog.getCategory(slug).subscribe({
      next: (category) => this.categoryName.set(category.name),
      error: () => undefined,
    });
  }

  private loadRelated(product: Product): void {
    this.catalog.getProducts({ category: product.categorySlug, size: 12 }).subscribe({
      next: (page) => this.related.set(page.content.filter((p) => p.id !== product.id).slice(0, 10)),
      error: () => this.related.set([]),
    });
  }
}
