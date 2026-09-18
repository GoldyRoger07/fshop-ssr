import { Component, computed, input } from '@angular/core';
import { ORDER_STATUS_LABELS, OrderStatus } from '../../../models/order.model';

const STATUS_CLASSES: Record<OrderStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-800',
  PAID: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-gray-200 text-gray-600',
};

/** Pastille colorée du statut d'une commande. */
@Component({
  selector: 'app-order-status-badge',
  template: `
    <span class="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold" [class]="classes()">
      {{ label() }}
    </span>
  `,
})
export class OrderStatusBadge {
  readonly status = input.required<OrderStatus>();

  protected readonly label = computed(() => ORDER_STATUS_LABELS[this.status()]);
  protected readonly classes = computed(() => STATUS_CLASSES[this.status()]);
}
