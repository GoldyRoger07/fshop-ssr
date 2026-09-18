import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { Order, ORDER_STATUS_LABELS } from '../../../models/order.model';
import { Page } from '../../../models/page.model';
import { Container } from '../../../components/container/container';
import { Pagination } from '../../../components/pagination/pagination';
import { errorMessage } from '../../../shared/api-error';

/** Historique des commandes du client (/commandes). */
@Component({
  selector: 'app-order-list-page',
  imports: [RouterLink, CurrencyPipe, DatePipe, Container, Pagination],
  templateUrl: './order-list.html',
})
export default class OrderListPage {
  private readonly orders = inject(OrderService);

  protected readonly statusLabels = ORDER_STATUS_LABELS;
  protected readonly result = signal<Page<Order> | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  constructor() {
    this.load(0);
  }

  protected load(page: number): void {
    this.loading.set(true);
    this.orders.getMyOrders(page).subscribe({
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
}
