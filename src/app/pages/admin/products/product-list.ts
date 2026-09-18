import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { Category } from '../../../models/category.model';
import { Page } from '../../../models/page.model';
import { Product } from '../../../models/product.model';
import { Pagination } from '../../../components/pagination/pagination';
import { errorMessage } from '../../../shared/api-error';

const PAGE_SIZE = 20;

/** Liste des produits avec recherche, filtre par catégorie et suppression. */
@Component({
  selector: 'app-admin-product-list',
  imports: [RouterLink, CurrencyPipe, Pagination],
  templateUrl: './product-list.html',
})
export default class ProductList {
  private readonly admin = inject(AdminService);

  protected readonly categories = signal<Category[]>([]);
  protected readonly result = signal<Page<Product> | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly search = signal('');
  protected readonly category = signal('');
  /** Produit dont la suppression attend confirmation. */
  protected readonly confirmingDelete = signal<number | null>(null);

  constructor() {
    this.admin.listCategories().subscribe({ next: (categories) => this.categories.set(categories) });
    this.load(0);
  }

  protected load(page: number): void {
    this.loading.set(true);
    this.admin
      .listProducts({
        q: this.search().trim() || undefined,
        category: this.category() || undefined,
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
  }

  protected submitSearch(event: Event): void {
    event.preventDefault();
    this.load(0);
  }

  protected onCategoryChange(slug: string): void {
    this.category.set(slug);
    this.load(0);
  }

  protected remove(product: Product): void {
    this.error.set(null);
    this.admin.deleteProduct(product.id).subscribe({
      next: () => {
        this.confirmingDelete.set(null);
        this.load(this.result()?.page ?? 0);
      },
      error: (err: unknown) => {
        this.confirmingDelete.set(null);
        this.error.set(errorMessage(err));
      },
    });
  }
}
