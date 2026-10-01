import { Component, computed, effect, inject, input, output, signal, untracked } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Order } from '../../models/order.model';
import {
  formatPhone,
  isMobileWallet,
  normalizePhone,
  PAYMENT_METHOD_BADGES,
  PAYMENT_METHOD_LABELS,
  walletAccount,
} from '../../models/payment.model';
import { OrderService } from '../../services/order.service';
import { SettingsService } from '../../services/settings.service';
import { errorMessage } from '../../shared/api-error';
import { MoneyPipe } from '../../shared/money';

/**
 * Guide de paiement d'une commande. MonCash / NatCash : trois étapes (ouvrir
 * l'appli, envoyer le montant au numéro de la boutique, saisir l'ID de transaction
 * reçu par SMS). Paiement à la livraison : ce qu'il faut préparer.
 */
@Component({
  selector: 'app-payment-instructions',
  imports: [MoneyPipe, DatePipe, ReactiveFormsModule],
  templateUrl: './payment-instructions.html',
})
export class PaymentInstructions {
  private readonly orders = inject(OrderService);
  private readonly fb = inject(NonNullableFormBuilder);
  protected readonly settings = inject(SettingsService).settings;

  readonly order = input.required<Order>();
  /** Commande mise à jour après l'envoi de l'identifiant de transaction. */
  readonly orderChange = output<Order>();

  protected readonly labels = PAYMENT_METHOD_LABELS;
  protected readonly badges = PAYMENT_METHOD_BADGES;
  protected readonly formatPhone = formatPhone;

  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);
  /** Dernière valeur copiée, pour afficher « Copié ». */
  protected readonly copied = signal<string | null>(null);
  /** Le client corrige un identifiant déjà envoyé. */
  protected readonly editing = signal(false);

  protected readonly form = this.fb.group({
    transactionId: ['', [Validators.required, Validators.pattern(/^\s*[A-Za-z0-9-]{4,40}\s*$/)]],
    senderPhone: ['', [Validators.required]],
  });

  protected readonly method = computed(() => this.order().paymentMethod);
  protected readonly wallet = computed(() => {
    const method = this.method();
    const account = isMobileWallet(method) ? walletAccount(method, this.settings()) : null;
    return account?.number ? account : null;
  });
  /** MonCash / NatCash, commande en attente, pas encore payée. */
  protected readonly awaitingPayment = computed(() => {
    const { status, paymentMethod } = this.order();
    return status === 'PENDING' && isMobileWallet(paymentMethod);
  });
  /** Formulaire d'ID visible : rien envoyé, envoi refusé, ou correction demandée. */
  protected readonly showForm = computed(
    () => this.awaitingPayment() && (!this.order().paymentDeclaredAt || this.editing()),
  );

  constructor() {
    // Pré-remplit le numéro payeur avec celui de la livraison (souvent le même).
    effect(() => {
      const order = this.order();
      untracked(() => {
        const phone = order.paymentSenderPhone ?? normalizePhone(order.shippingAddress.phone);
        this.form.reset({
          transactionId: order.paymentTransactionId ?? '',
          senderPhone: phone ? formatPhone(phone) : '',
        });
      });
    });
  }

  protected invalid(name: 'transactionId' | 'senderPhone'): boolean {
    const control = this.form.controls[name];
    if (name === 'senderPhone' && control.touched && !normalizePhone(control.value)) {
      return true;
    }
    return control.invalid && control.touched;
  }

  protected copy(value: string): void {
    navigator.clipboard?.writeText(value).then(() => {
      this.copied.set(value);
      setTimeout(() => this.copied.update((current) => (current === value ? null : current)), 2000);
    });
  }

  protected submit(): void {
    const { transactionId, senderPhone } = this.form.getRawValue();
    if (this.form.invalid || !normalizePhone(senderPhone)) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.error.set(null);
    this.orders.declarePayment(this.order().id, transactionId.trim(), senderPhone).subscribe({
      next: (order) => {
        this.submitting.set(false);
        this.editing.set(false);
        this.orderChange.emit(order);
      },
      error: (err: unknown) => {
        this.submitting.set(false);
        this.error.set(errorMessage(err));
      },
    });
  }
}
