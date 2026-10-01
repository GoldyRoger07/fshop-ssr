import { Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { SettingsService } from '../../../services/settings.service';
import { formatLocality, Order, ORDER_STATUS_LABELS } from '../../../models/order.model';
import { Container } from '../../../components/container/container';
import { PaymentInstructions } from '../../../components/payment-instructions/payment-instructions';
import { errorMessage } from '../../../shared/api-error';
import { isMobileWallet, PAYMENT_METHOD_LABELS } from '../../../models/payment.model';
import { MoneyPipe } from '../../../shared/money';

/** Étape du suivi de commande. */
interface ProgressStep {
  label: string;
  done: boolean;
}

/**
 * Détail d'une commande (/commandes/:id). Sert aussi de page de confirmation
 * juste après la validation (paramètre « nouvelle ») : elle indique alors comment payer.
 */
@Component({
  selector: 'app-order-detail',
  imports: [RouterLink, MoneyPipe, DatePipe, Container, PaymentInstructions],
  templateUrl: './order-detail.html',
})
export default class OrderDetail {
  private readonly orders = inject(OrderService);
  private readonly settings = inject(SettingsService).settings;

  readonly id = input.required<string>();
  /** Présent juste après la validation du panier. */
  readonly nouvelle = input<string>();

  protected readonly statusLabels = ORDER_STATUS_LABELS;
  protected readonly formatLocality = formatLocality;

  protected readonly order = signal<Order | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly cancelling = signal(false);
  protected readonly confirmingCancel = signal(false);

  protected readonly isNew = computed(() => this.nouvelle() === '1');
  protected readonly isMobileWallet = isMobileWallet;
  protected readonly paymentLabels = PAYMENT_METHOD_LABELS;

  /** Suivi : de la commande à la livraison, avec les étapes de paiement propres au moyen choisi. */
  protected readonly progress = computed<ProgressStep[]>(() => {
    const order = this.order();
    if (!order || order.status === 'CANCELLED') {
      return [];
    }
    const shipped = order.status === 'SHIPPED' || order.status === 'DELIVERED';
    const delivered = order.status === 'DELIVERED';
    const paid = !!order.paidAt || order.status === 'PAID' || (shipped && order.paymentMethod !== 'CASH_ON_DELIVERY');
    const steps: ProgressStep[] = [{ label: 'Commande reçue', done: true }];
    if (isMobileWallet(order.paymentMethod)) {
      steps.push(
        { label: 'Paiement envoyé', done: paid || !!order.paymentDeclaredAt },
        { label: 'Paiement confirmé', done: paid },
      );
    } else if (order.paymentMethod !== 'CASH_ON_DELIVERY') {
      steps.push({ label: 'Payée', done: paid });
    }
    steps.push({ label: 'Expédiée', done: shipped });
    steps.push({
      label: order.paymentMethod === 'CASH_ON_DELIVERY' ? 'Livrée et payée' : 'Livrée',
      done: delivered,
    });
    return steps;
  });
  /** Annulation en ligne : commande en attente, si la boutique l'autorise. */
  protected readonly canCancel = computed(
    () => this.order()?.status === 'PENDING' && this.settings().customerCancellation,
  );

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

  protected updateOrder(order: Order): void {
    this.order.set(order);
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
