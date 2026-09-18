import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal, untracked } from '@angular/core';
import { forkJoin, Observable, of, switchMap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Product } from '../models/product.model';
import { API_URL } from './api';

/**
 * Favoris (identifiants produits). Visiteur : en mémoire. Utilisateur connecté :
 * synchronisés avec l'API, les favoris visiteur étant ajoutés au compte à la connexion.
 */
@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  private readonly ids = signal<ReadonlySet<number>>(new Set());

  readonly count = computed(() => this.ids().size);

  constructor() {
    effect(() => {
      const loggedIn = this.auth.isLoggedIn();
      untracked(() => (loggedIn ? this.syncWithServer() : this.ids.set(new Set())));
    });
  }

  has(productId: number): boolean {
    return this.ids().has(productId);
  }

  toggle(productId: number): void {
    const adding = !this.has(productId);
    this.update(productId, adding);

    if (this.auth.isLoggedIn()) {
      const url = `${API_URL}/wishlist/${productId}`;
      const request = adding ? this.http.put<void>(url, null) : this.http.delete<void>(url);
      // En cas d'échec, on annule la modification optimiste.
      request.subscribe({ error: () => this.update(productId, !adding) });
    }
  }

  private syncWithServer(): void {
    const additions = [...this.ids()].map((id) => this.http.put<void>(`${API_URL}/wishlist/${id}`, null));
    const merged: Observable<unknown> = additions.length ? forkJoin(additions) : of(null);
    merged
      .pipe(switchMap(() => this.http.get<Product[]>(`${API_URL}/wishlist`)))
      .subscribe({
        next: (products) => this.ids.set(new Set(products.map((p) => p.id))),
        error: () => undefined,
      });
  }

  private update(productId: number, present: boolean): void {
    this.ids.update((ids) => {
      const next = new Set(ids);
      if (present) {
        next.add(productId);
      } else {
        next.delete(productId);
      }
      return next;
    });
  }
}
