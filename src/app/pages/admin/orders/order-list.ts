import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { formatLocality, Order, ORDER_STATUS_LABELS, OrderStatus, nextStatuses } from '../../../models/order.model';
import { Page } from '../../../models/page.model';
import { Pagination } from '../../../components/pagination/pagination';
import { OrderStatusBadge } from './order-status-badge';
import { errorMessage } from '../../../shared/api-error';
import { formatPhone, PAYMENT_METHOD_BADGES, PAYMENT_METHOD_LABELS } from '../../../models/payment.model';
import { MoneyPipe } from '../../../shared/money';

/** Filtre spécial : paiements MonCash / NatCash signalés par les clients. */
const TO_VERIFY = 'TO_VERIFY';

/**
 * Suivi des commandes : filtre par statut, vérification rapide des paiements
 * MonCash / NatCash (confirmer ou signaler introuvable), changement de statut.
 */
@Component({
  selector: 'app-admin-order-list',
  imports: [MoneyPipe, DatePipe, Pagination, OrderStatusBadge],
  templateUrl: './order-list.html',
})
export default class OrderList {
  private readonly admin = inject(AdminService);

  protected readonly statuses = Object.keys(ORDER_STATUS_LABELS) as OrderStatus[];
  protected readonly statusLabels = ORDER_STATUS_LABELS;
  protected readonly formatLocality = formatLocality;
  protected readonly nextStatuses = nextStatuses;
  protected readonly paymentLabels = PAYMENT_METHOD_LABELS;
  protected readonly paymentBadges = PAYMENT_METHOD_BADGES;
  protected readonly formatPhone = formatPhone;
  protected readonly toVerify = TO_VERIFY;
  protected readonly now = Date.now();
  /** Commande dont le paiement est en cours de traitement (bouton désactivé). */
  protected readonly busy = signal<number | null>(null);

  protected readonly result = signal<Page<Order> | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly filter = signal<OrderStatus | typeof TO_VERIFY | ''>('');
  /** Commande dont le détail est déplié. */
  protected readonly expanded = signal<number | null>(null);

  constructor() {
    this.load(0);
  }

  protected load(page: number): void {
    this.loading.set(true);
    const filter = this.filter();
    const status = filter && filter !== TO_VERIFY ? filter : undefined;
    this.admin.getOrders(status, page, 20, filter === TO_VERIFY).subscribe({
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

  /** Échéance de paiement dépassée : annulation automatique imminente. */
  protected isOverdue(order: Order): boolean {
    return (
      order.status === 'PENDING' &&
      !order.paymentDeclaredAt &&
      !!order.paymentDueAt &&
      Date.parse(order.paymentDueAt) < this.now
    );
  }

  protected onFilterChange(status: string): void {
    this.filter.set(status as OrderStatus | typeof TO_VERIFY | '');
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

  /** Paiement retrouvé dans l'historique MonCash / NatCash : la commande passe à « Payée ». */
  protected confirmPayment(order: Order): void {
    this.busy.set(order.id);
    this.error.set(null);
    this.admin.updateOrderStatus(order.id, 'PAID').subscribe({
      next: (updated) => this.afterPaymentReview(updated),
      error: (err: unknown) => {
        this.busy.set(null);
        this.error.set(errorMessage(err));
      },
    });
  }

  /** Paiement introuvable : le client est invité à vérifier et renvoyer son ID. */
  protected rejectPayment(order: Order): void {
    this.busy.set(order.id);
    this.error.set(null);
    this.admin.rejectPayment(order.id).subscribe({
      next: (updated) => this.afterPaymentReview(updated),
      error: (err: unknown) => {
        this.busy.set(null);
        this.error.set(errorMessage(err));
      },
    });
  }

  /** Dans la liste « à vérifier », la commande traitée disparaît. */
  private afterPaymentReview(updated: Order): void {
    this.busy.set(null);
    if (this.filter() === TO_VERIFY) {
      this.result.update((page) =>
        page ? { ...page, content: page.content.filter((order) => order.id !== updated.id) } : page,
      );
    } else {
      this.replace(updated);
    }
  }

  private replace(updated: Order): void {
    this.result.update((page) =>
      page
        ? { ...page, content: page.content.map((order) => (order.id === updated.id ? updated : order)) }
        : page,
    );
  }
}
