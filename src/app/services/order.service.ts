import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Order, ShippingAddress } from '../models/order.model';
import { Page } from '../models/page.model';
import { API_URL } from './api';
import { CartService } from './cart.service';

/** Commandes du client connecté. */
@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly cart = inject(CartService);

  /** Transforme le panier en commande. L'API vide ensuite le panier. */
  checkout(shippingAddress: ShippingAddress): Observable<Order> {
    return this.http
      .post<Order>(`${API_URL}/orders`, { shippingAddress })
      .pipe(tap(() => this.cart.clear()));
  }

  getMyOrders(page = 0, size = 10): Observable<Page<Order>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<Order>>(`${API_URL}/orders`, { params });
  }

  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`${API_URL}/orders/${id}`);
  }

  cancel(id: number): Observable<Order> {
    return this.http.post<Order>(`${API_URL}/orders/${id}/cancel`, null);
  }
}
