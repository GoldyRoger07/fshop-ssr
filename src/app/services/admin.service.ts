import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { Order, OrderStatus } from '../models/order.model';
import { Page } from '../models/page.model';
import { Product, ProductTag } from '../models/product.model';
import { ProductQuery } from './catalog.service';
import { API_URL } from './api';

export interface CategoryRequest {
  slug: string;
  name: string;
  image?: string;
}

export interface ProductRequest {
  title: string;
  description?: string;
  image?: string;
  categorySlug: string;
  price: number;
  originalPrice?: number | null;
  stock: number;
  tag?: ProductTag | null;
}

/** Appels du back-office : écritures /api/admin/** et lectures non mises en cache. */
@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);

  // --- Lectures du catalogue ---
  //
  // Les endpoints publics renvoient « Cache-Control: max-age=60 » : sans
  // paramètre anti-cache, le back-office afficherait encore l'ancienne liste
  // juste après un ajout ou une suppression.

  listCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${API_URL}/categories`, { params: this.freshParams() });
  }

  listProducts(query: ProductQuery = {}): Observable<Page<Product>> {
    let params = this.freshParams();
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value);
      }
    }
    return this.http.get<Page<Product>>(`${API_URL}/products`, { params });
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${API_URL}/products/${id}`, { params: this.freshParams() });
  }

  private freshParams(): HttpParams {
    return new HttpParams().set('_', Date.now());
  }

  // --- Catégories ---

  createCategory(request: CategoryRequest): Observable<Category> {
    return this.http.post<Category>(`${API_URL}/admin/categories`, request);
  }

  updateCategory(id: number, request: CategoryRequest): Observable<Category> {
    return this.http.put<Category>(`${API_URL}/admin/categories/${id}`, request);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/admin/categories/${id}`);
  }

  // --- Produits ---

  createProduct(request: ProductRequest): Observable<Product> {
    return this.http.post<Product>(`${API_URL}/admin/products`, request);
  }

  updateProduct(id: number, request: ProductRequest): Observable<Product> {
    return this.http.put<Product>(`${API_URL}/admin/products/${id}`, request);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/admin/products/${id}`);
  }

  // --- Commandes ---

  getOrders(status?: OrderStatus, page = 0, size = 20): Observable<Page<Order>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<Page<Order>>(`${API_URL}/admin/orders`, { params });
  }

  updateOrderStatus(id: number, status: OrderStatus): Observable<Order> {
    return this.http.patch<Order>(`${API_URL}/admin/orders/${id}/status`, { status });
  }
}
