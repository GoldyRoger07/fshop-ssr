import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { computed, effect, inject, Injectable, PLATFORM_ID, signal, untracked } from '@angular/core';
import { concat, last, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { CartLine, CartResponse } from '../models/cart.model';
import { Product } from '../models/product.model';
import { includedTax } from '../models/settings.model';
import { API_URL } from './api';
import { SettingsService } from './settings.service';

export type { CartLine } from '../models/cart.model';

/** Panier visiteur conservé d'une visite à l'autre. */
const STORAGE_KEY = 'fshop.cart';

interface CartSummary {
  subtotal: number;
  shippingCost: number;
  total: number;
}

/**
 * Panier. Visiteur : panier en mémoire. Utilisateur connecté : panier de l'API,
 * dans lequel le panier visiteur est fusionné à la connexion.
 */
@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly settings = inject(SettingsService).settings;
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly lines = signal<CartLine[]>([]);
  /** Totaux renvoyés par l'API (null pour un visiteur : on les calcule). */
  private readonly serverSummary = signal<CartSummary | null>(null);
  /**
   * Incrémenté à chaque appel et à chaque vidage : une réponse de l'API encore
   * en vol ne doit pas écraser un état plus récent (panier vidé après commande).
   */
  private version = 0;

  readonly items = this.lines.asReadonly();
  readonly count = computed(() => this.lines().reduce((total, line) => total + line.quantity, 0));

  readonly subtotal = computed(
    () =>
      this.serverSummary()?.subtotal ??
      this.lines().reduce((total, line) => total + line.product.price * line.quantity, 0),
  );

  readonly shippingCost = computed(() => {
    const fromServer = this.serverSummary()?.shippingCost;
    if (fromServer !== undefined) {
      return fromServer;
    }
    // Visiteur : même règle que l'API (ShippingCalculator).
    const { shippingCost, freeShippingEnabled, freeShippingThreshold } = this.settings();
    const subtotal = this.subtotal();
    return subtotal === 0 || (freeShippingEnabled && subtotal >= freeShippingThreshold) ? 0 : shippingCost;
  });

  readonly total = computed(() => this.serverSummary()?.total ?? this.subtotal() + this.shippingCost());

  /** TVA comprise dans le total (les prix s'entendent TTC). */
  readonly taxAmount = computed(() => includedTax(this.total(), this.settings().vatRate));

  /** Montant restant avant la livraison offerte (0 si déjà atteint ou sans livraison offerte). */
  readonly missingForFreeShipping = computed(() => {
    const { freeShippingEnabled, freeShippingThreshold } = this.settings();
    return freeShippingEnabled ? Math.max(0, freeShippingThreshold - this.subtotal()) : 0;
  });

  /** Montant restant avant le minimum de commande (0 si atteint). */
  readonly missingForMinimum = computed(() => Math.max(0, this.settings().minOrderAmount - this.subtotal()));

  constructor() {
    // Panier visiteur de la visite précédente. S'il y a une session, l'effet
    // ci-dessous le fusionne dans le panier du compte puis vide le stockage.
    this.lines.set(this.restore());

    let wasLoggedIn = this.auth.isLoggedIn();
    effect(() => {
      const loggedIn = this.auth.isLoggedIn();
      untracked(() => {
        if (loggedIn) {
          this.syncWithServer();
        } else if (wasLoggedIn) {
          // Déconnexion : on repart d'un panier vide.
          this.clear();
        }
        wasLoggedIn = loggedIn;
      });
    });

    // Le panier visiteur survit au rechargement de la page.
    effect(() => {
      const lines = this.lines();
      if (!this.auth.isLoggedIn()) {
        this.persist(lines);
      }
    });
  }

  add(product: Product, quantity = 1): void {
    this.addLocally(product, quantity);
    if (this.auth.isLoggedIn()) {
      this.apply(this.http.post<CartResponse>(`${API_URL}/cart/items`, { productId: product.id, quantity }));
    }
  }

  setQuantity(productId: number, quantity: number): void {
    this.lines.update((lines) =>
      quantity > 0
        ? lines.map((line) => (line.product.id === productId ? { ...line, quantity } : line))
        : lines.filter((line) => line.product.id !== productId),
    );
    this.serverSummary.set(null);
    if (this.auth.isLoggedIn()) {
      this.apply(this.http.put<CartResponse>(`${API_URL}/cart/items/${productId}`, { quantity }));
    }
  }

  remove(productId: number): void {
    this.setQuantity(productId, 0);
  }

  /** Vide l'état local (déconnexion, ou commande passée : l'API a vidé le panier). */
  clear(): void {
    this.version++;
    this.lines.set([]);
    this.serverSummary.set(null);
    this.persist([]);
  }

  private persist(lines: CartLine[]): void {
    if (!this.isBrowser) {
      return;
    }
    try {
      if (lines.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Stockage indisponible (navigation privée…) : le panier reste en mémoire.
    }
  }

  private restore(): CartLine[] {
    if (!this.isBrowser) {
      return [];
    }
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as CartLine[];
      return Array.isArray(saved) ? saved.filter((line) => line?.product?.id && line.quantity > 0) : [];
    } catch {
      return [];
    }
  }

  /** Envoie le panier visiteur à l'API, puis charge le panier du compte. */
  private syncWithServer(): void {
    const additions = this.lines().map((line) =>
      this.http.post<CartResponse>(`${API_URL}/cart/items`, {
        productId: line.product.id,
        quantity: line.quantity,
      }),
    );
    this.apply(concat(...additions, this.http.get<CartResponse>(`${API_URL}/cart`)).pipe(last()));
  }

  /** La réponse de l'API fait foi ; en cas d'erreur, on recharge l'état du serveur. */
  private apply(request: Observable<CartResponse>): void {
    const version = ++this.version;
    const accept = (cart: CartResponse) => {
      if (version === this.version) {
        this.setFromServer(cart);
      }
    };

    request.subscribe({
      next: accept,
      error: () => {
        if (this.auth.isLoggedIn() && version === this.version) {
          this.http.get<CartResponse>(`${API_URL}/cart`).subscribe({
            next: accept,
            error: () => undefined,
          });
        }
      },
    });
  }

  private setFromServer(cart: CartResponse): void {
    // Le panier visiteur a été fusionné côté API : on ne le garde plus en local.
    this.persist([]);
    this.lines.set(cart.items.map(({ product, quantity }) => ({ product, quantity })));
    this.serverSummary.set({
      subtotal: cart.subtotal,
      shippingCost: cart.shippingCost,
      total: cart.total,
    });
  }

  private addLocally(product: Product, quantity: number): void {
    this.serverSummary.set(null);
    this.lines.update((lines) => {
      const existing = lines.find((line) => line.product.id === product.id);
      if (existing) {
        return lines.map((line) =>
          line === existing ? { ...line, quantity: line.quantity + quantity } : line,
        );
      }
      return [...lines, { product, quantity }];
    });
  }
}
