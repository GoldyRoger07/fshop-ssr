import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { CartService } from '../../../services/cart.service';
import { OrderService } from '../../../services/order.service';
import { Container } from '../../../components/container/container';
import { errorMessage } from '../../../shared/api-error';

/** Tunnel de commande (/commande) : adresse de livraison puis validation. */
@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, RouterLink, CurrencyPipe, Container],
  templateUrl: './checkout.html',
})
export default class Checkout {
  private readonly cart = inject(CartService);
  private readonly orders = inject(OrderService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly items = this.cart.items;
  protected readonly subtotal = this.cart.subtotal;
  protected readonly shippingCost = this.cart.shippingCost;
  protected readonly total = this.cart.total;

  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly form = this.fb.group({
    fullName: [this.defaultName(), [Validators.required, Validators.maxLength(200)]],
    line1: ['', [Validators.required, Validators.maxLength(255)]],
    line2: ['', Validators.maxLength(255)],
    postalCode: ['', [Validators.required, Validators.maxLength(20)]],
    city: ['', [Validators.required, Validators.maxLength(100)]],
    country: ['France', [Validators.required, Validators.maxLength(100)]],
    phone: ['', Validators.maxLength(30)],
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set('Renseignez le nom, l’adresse, le code postal, la ville et le pays.');
      return;
    }

    const value = this.form.getRawValue();
    this.submitting.set(true);
    this.error.set(null);

    this.orders
      .checkout({
        fullName: value.fullName.trim(),
        line1: value.line1.trim(),
        line2: value.line2.trim() || null,
        postalCode: value.postalCode.trim(),
        city: value.city.trim(),
        country: value.country.trim(),
        phone: value.phone.trim() || null,
      })
      .subscribe({
        next: (order) => this.router.navigate(['/commandes', order.id], { queryParams: { nouvelle: 1 } }),
        error: (err: unknown) => {
          this.submitting.set(false);
          this.error.set(errorMessage(err));
        },
      });
  }

  private defaultName(): string {
    const user = this.auth.user();
    return user ? `${user.firstName} ${user.lastName}`.trim() : '';
  }
}
