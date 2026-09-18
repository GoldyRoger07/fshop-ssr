import { Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { Order, ORDER_STATUS_LABELS } from '../../../models/order.model';
import { Container } from '../../../components/container/container';
import { errorMessage } from '../../../shared/api-error';

/**
 * Détail d'une commande (/commandes/:id). Sert aussi de page de confirmation
 * juste après le paiement (paramètre « nouvelle »).
 */
@Component({
  selector: 'app-order-detail',
  imports: [RouterLink, CurrencyPipe, DatePipe, Container],
  templateUrl: './order-detail.html',
})
export default class OrderDetail {
  private readonly orders = inject(OrderService);

  readonly id = input.required<string>();
  /** Présent juste après la validation du panier. */
  readonly nouvelle = input<string>();

  protected readonly statusLabels = ORDER_STATUS_LABELS;

  protected readonly order = signal<Order | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly cancelling = signal(false);
  protected readonly confirmingCancel = signal(false);

  protected readonly isNew = computed(() => this.nouvelle() === '1');
  protected readonly canCancel = computed(() => this.order()?.status === 'PENDING');

  constructor() {
    effect(() => {
      const id = Number(this.id());
      untracked(() => {
        this.loading.set(true);
        this.orders.getOrder(id).subscribe({
          next: (order) => {
            this.order.set(order);
            this.loading.set(false);
          },
          error: (err: unknown) => {
            this.error.set(errorMessage(err));
            this.loading.set(false);
          },
        });
      });
    });
  }

  protected cancel(): void {
    const order = this.order();
    if (!order) {
      return;
    }
    this.cancelling.set(true);
    this.orders.cancel(order.id).subscribe({
      next: (updated) => {
        this.order.set(updated);
        this.cancelling.set(false);
        this.confirmingCancel.set(false);
      },
      error: (err: unknown) => {
        this.error.set(errorMessage(err));
        this.cancelling.set(false);
        this.confirmingCancel.set(false);
      },
    });
  }
}
