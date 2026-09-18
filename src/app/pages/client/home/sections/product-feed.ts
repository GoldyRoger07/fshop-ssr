import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { CatalogService, ProductSort } from '../../../../services/catalog.service';
import { ProductCard } from '../../../../components/product-card/product-card';
import { Product } from '../../../../models/product.model';

const PAGE_SIZE = 15;

/** Grille « Pour vous » avec onglets de tri et bouton « Voir plus » (pagination API). */
@Component({
  selector: 'app-product-feed',
  imports: [ProductCard],
  template: `
    <h2 class="mb-4 text-center text-lg font-bold uppercase">Pour vous</h2>

    <div role="tablist" aria-label="Trier les produits" class="no-scrollbar mb-6 flex justify-start gap-2 overflow-x-auto sm:justify-center">
      @for (tab of tabs; track tab.sort) {
        <button
          type="button"
          role="tab"
          class="shrink-0 rounded-full border px-4 py-1.5 text-sm transition-colors"
          [class]="
            sort() === tab.sort
              ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
              : 'border-gray-300 hover:border-black dark:border-gray-700 dark:hover:border-white'
          "
          [attr.aria-selected]="sort() === tab.sort"
          (click)="selectTab(tab.sort)"
        >
          {{ tab.label }}
        </button>
      }
    </div>

    @if (error()) {
      <p class="py-10 text-center text-sm text-gray-500">
        Impossible de charger les produits pour le moment.
        <button type="button" class="underline" (click)="load(0)">Réessayer</button>
      </p>
    }

    <ul class="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" [attr.aria-busy]="loading()">
      @for (product of products(); track product.id) {
        <li><app-product-card [product]="product" /></li>
      }
    </ul>

    @if (hasMore()) {
      <div class="mt-10 flex justify-center">
        <button
          type="button"
          class="border border-black px-12 py-2.5 text-sm font-semibold uppercase transition-colors hover:bg-black hover:text-white disabled:opacity-50 dark:border-white dark:hover:bg-white dark:hover:text-black"
          [disabled]="loading()"
          (click)="showMore()"
        >
          {{ loading() ? 'Chargement…' : 'Voir plus' }}
        </button>
      </div>
    }
  `,
})
export class ProductFeed {
  private readonly catalog = inject(CatalogService);

  protected readonly tabs: { sort: ProductSort; label: string }[] = [
    { sort: 'recommended', label: 'Recommandés' },
    { sort: 'new', label: 'Nouveautés' },
    { sort: 'bestsellers', label: 'Meilleures ventes' },
    { sort: 'price-asc', label: 'Petits prix' },
  ];

  protected readonly sort = signal<ProductSort>('recommended');
  protected readonly products = signal<Product[]>([]);
  protected readonly hasMore = signal(false);
  protected readonly loading = signal(false);
  protected readonly error = signal(false);

  private page = 0;
  private request?: Subscription;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.request?.unsubscribe());
    this.load(0);
  }

  protected selectTab(sort: ProductSort): void {
    this.sort.set(sort);
    this.load(0);
  }

  protected showMore(): void {
    this.load(this.page + 1);
  }

  /** Charge une page ; la page 0 remplace la liste, les suivantes s'y ajoutent. */
  protected load(page: number): void {
    this.request?.unsubscribe();
    this.loading.set(true);
    this.error.set(false);

    this.request = this.catalog.getProducts({ sort: this.sort(), page, size: PAGE_SIZE }).subscribe({
      next: (result) => {
        this.page = result.page;
        this.products.update((products) => (page === 0 ? result.content : [...products, ...result.content]));
        this.hasMore.set(result.page + 1 < result.totalPages);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(page === 0);
        this.loading.set(false);
      },
    });
  }
}
