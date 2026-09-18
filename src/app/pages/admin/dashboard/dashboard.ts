import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AdminService } from '../../../services/admin.service';
import { Order, ORDER_STATUS_LABELS, OrderStatus } from '../../../models/order.model';
import { errorMessage } from '../../../shared/api-error';
import { OrderStatusBadge } from '../orders/order-status-badge';

/** Vue d'ensemble : chiffres clés et dernières commandes. */
@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink, CurrencyPipe, DatePipe, DecimalPipe, OrderStatusBadge],
  templateUrl: './dashboard.html',
})
export default class Dashboard {
  private readonly admin = inject(AdminService);

  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  private readonly orders = signal<Order[]>([]);
  protected readonly productCount = signal(0);
  protected readonly categoryCount = signal(0);

  protected readonly orderCount = computed(() => this.orders().length);
  protected readonly pendingCount = computed(() => this.countByStatus('PENDING'));
  protected readonly revenue = computed(() =>
    this.orders()
      .filter((order) => order.status !== 'CANCELLED')
      .reduce((total, order) => total + order.total, 0),
  );
  protected readonly recentOrders = computed(() => this.orders().slice(0, 5));

  protected readonly statusCounts = computed(() =>
    (Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]).map((status) => ({
      status,
      label: ORDER_STATUS_LABELS[status],
      count: this.countByStatus(status),
    })),
  );

  constructor() {
    // Les 100 dernières commandes suffisent pour les chiffres affichés ici.
    forkJoin({
      orders: this.admin.getOrders(undefined, 0, 100),
      products: this.admin.listProducts({ size: 1 }),
      categories: this.admin.listCategories(),
    }).subscribe({
      next: ({ orders, products, categories }) => {
        this.orders.set(orders.content);
        this.productCount.set(products.totalElements);
        this.categoryCount.set(categories.length);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        this.error.set(errorMessage(err));
        this.loading.set(false);
      },
    });
  }

  private countByStatus(status: OrderStatus): number {
    return this.orders().filter((order) => order.status === status).length;
  }
}
