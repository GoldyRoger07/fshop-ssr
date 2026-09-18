import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { Page } from '../models/page.model';
import { Product, ProductTag } from '../models/product.model';
import { API_URL } from './api';

export type ProductSort = 'recommended' | 'new' | 'bestsellers' | 'rating' | 'price-asc' | 'price-desc';

export interface ProductQuery {
  category?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  tag?: ProductTag;
  sort?: ProductSort;
  page?: number;
  size?: number;
}

/** Accès au catalogue public de l'API. */
@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly http = inject(HttpClient);

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${API_URL}/categories`);
  }

  getCategory(slug: string): Observable<Category> {
    return this.http.get<Category>(`${API_URL}/categories/${encodeURIComponent(slug)}`);
  }

  /** Produits en forte promotion, plus grosse remise en premier. */
  getFlashSaleProducts(limit = 12): Observable<Product[]> {
    return this.http.get<Product[]>(`${API_URL}/products/flash-sale`, { params: { limit } });
  }

  getProducts(query: ProductQuery = {}): Observable<Page<Product>> {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value);
      }
    }
    return this.http.get<Page<Product>>(`${API_URL}/products`, { params });
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${API_URL}/products/${id}`);
  }
}
