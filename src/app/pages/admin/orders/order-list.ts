import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { Order, ORDER_STATUS_LABELS, OrderStatus, nextStatuses } from '../../../models/order.model';
import { Page } from '../../../models/page.model';
import { Pagination } from '../../../components/pagination/pagination';
import { OrderStatusBadge } from './order-status-badge';
import { errorMessage } from '../../../shared/api-error';

/** Suivi des commandes : filtre par statut, détail et changement de statut. */
@Component({
  selector: 'app-admin-order-list',
  imports: [CurrencyPipe, DatePipe, Pagination, OrderStatusBadge],
  templateUrl: './order-list.html',
})
export default class OrderList {
  private readonly admin = inject(AdminService);

  protected readonly statuses = Object.keys(ORDER_STATUS_LABELS) as OrderStatus[];
  protected readonly statusLabels = ORDER_STATUS_LABELS;
  protected readonly nextStatuses = nextStatuses;

  protected readonly result = signal<Page<Order> | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly filter = signal<OrderStatus | ''>('');
  /** Commande dont le détail est déplié. */
  protected readonly expanded = signal<number | null>(null);

  constructor() {
    this.load(0);
  }

  protected load(page: number): void {
    this.loading.set(true);
    this.admin.getOrders(this.filter() || undefined, page).subscribe({
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

  protected onFilterChange(status: string): void {
    this.filter.set(status as OrderStatus | '');
    this.load(0);
  }

  protected toggleDetails(orderId: number): void {
    this.expanded.update((current) => (current === orderId ? null : orderId));
  }

  protected changeStatus(order: Order, status: string): void {
    if (!status) {
      return;
    }
    this.error.set(null);
    this.admin.updateOrderStatus(order.id, status as OrderStatus).subscribe({
      next: (updated) => this.replace(updated),
      error: (err: unknown) => this.error.set(errorMessage(err)),
    });
  }

  private replace(updated: Order): void {
    this.result.update((page) =>
      page
        ? { ...page, content: page.content.map((order) => (order.id === updated.id ? updated : order)) }
        : page,
    );
  }
}
