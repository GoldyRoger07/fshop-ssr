import { Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CatalogService, ProductSort } from '../../../services/catalog.service';
import { Category } from '../../../models/category.model';
import { Page } from '../../../models/page.model';
import { Product, ProductTag } from '../../../models/product.model';
import { Container } from '../../../components/container/container';
import { ProductCard } from '../../../components/product-card/product-card';
import { Pagination } from '../../../components/pagination/pagination';
import { errorMessage } from '../../../shared/api-error';

const PAGE_SIZE = 20;

/**
 * Liste de produits, utilisée par trois routes :
 * /produits (recherche et filtres), /categorie/:slug et /promos.
 */
@Component({
  selector: 'app-catalog',
  imports: [RouterLink, Container, ProductCard, Pagination],
  templateUrl: './catalog.html',
})
export default class Catalog {
  private readonly catalog = inject(CatalogService);
  private readonly router = inject(Router);

  /** Paramètres de route et d'URL (liés par withComponentInputBinding). */
  readonly slug = input<string>();
  readonly q = input<string>();
  readonly tag = input<string>();
  readonly sort = input<string>('recommended');
  readonly page = input<string>('0');
  /** Défini par la route /promos (data). */
  readonly mode = input<string>();

  protected readonly category = signal<Category | null>(null);
  protected readonly result = signal<Page<Product> | null>(null);
  protected readonly promos = signal<Product[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly isPromos = computed(() => this.mode() === 'promos');

  protected readonly sortOptions: { value: ProductSort; label: string }[] = [
    { value: 'recommended', label: 'Recommandés' },
    { value: 'new', label: 'Nouveautés' },
    { value: 'bestsellers', label: 'Meilleures ventes' },
    { value: 'rating', label: 'Mieux notés' },
    { value: 'price-asc', label: 'Prix croissant' },
    { value: 'price-desc', label: 'Prix décroissant' },
  ];

  protected readonly title = computed(() => {
    if (this.isPromos()) {
      return 'Promotions';
    }
    const category = this.category();
    if (category) {
      return category.name;
    }
    const query = this.q();
    if (query) {
      return `Résultats pour « ${query} »`;
    }
    return this.tag() === 'new' ? 'Nouveautés' : 'Tous les produits';
  });

  protected readonly products = computed(() => (this.isPromos() ? this.promos() : (this.result()?.content ?? [])));

  constructor() {
    // Rechargement à chaque changement d'URL (catégorie, recherche, tri, page).
    effect(() => {
      const slug = this.slug();
      const query = this.q();
      const tag = this.tag();
      const sort = this.sort();
      const page = Number(this.page()) || 0;

      this.loading.set(true);
      this.error.set(null);

      if (this.isPromos()) {
        untracked(() => this.loadPromos());
        return;
      }

      // untracked : loadCategory lit le signal « category », qu'il met aussi à
      // jour — sans ça l'effet se relancerait à chaque chargement de catégorie.
      untracked(() => this.loadCategory(slug));
      this.catalog
        .getProducts({
          category: slug,
          q: query,
          tag: tag as ProductTag | undefined,
          sort: sort as ProductSort,
          page,
          size: PAGE_SIZE,
        })
        .subscribe({
          next: (result) => {
            this.result.set(result);
            this.loading.set(false);
          },
          error: (err: unknown) => {
            this.error.set(errorMessage(err));
            this.loading.set(false);
          },
        });
    });
  }

  private loadPromos(): void {
    this.category.set(null);
    this.catalog.getFlashSaleProducts(48).subscribe({
      next: (products) => {
        this.promos.set(products);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        this.error.set(errorMessage(err));
        this.loading.set(false);
      },
    });
  }

  private loadCategory(slug: string | undefined): void {
    if (!slug) {
      this.category.set(null);
      return;
    }
    if (this.category()?.slug === slug) {
      return;
    }
    this.catalog.getCategory(slug).subscribe({
      next: (category) => this.category.set(category),
      error: () => this.category.set(null),
    });
  }

  protected changeSort(sort: string): void {
    this.navigate({ sort, page: 0 });
  }

  protected goToPage(page: number): void {
    this.navigate({ page });
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  private navigate(queryParams: Record<string, string | number>): void {
    this.router.navigate([], { queryParams, queryParamsHandling: 'merge' });
  }
}
