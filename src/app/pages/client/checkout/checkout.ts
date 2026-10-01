import { Component, afterNextRender, computed, inject, signal } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { CartService } from '../../../services/cart.service';
import { OrderService } from '../../../services/order.service';
import { SettingsService } from '../../../services/settings.service';
import { Container } from '../../../components/container/container';
import { errorMessage } from '../../../shared/api-error';
import { includedTax } from '../../../models/settings.model';
import { formatLocality, ShippingAddress } from '../../../models/order.model';
import { communesOf, HAITI_DEPARTMENTS, SHIPPING_COUNTRIES } from '../../../data/haiti.data';
import {
  enabledPaymentMethods,
  formatPhone,
  isMobileWallet,
  normalizePhone,
  PAYMENT_METHOD_BADGES,
  PAYMENT_METHOD_LABELS,
  PaymentMethod,
  paymentFee,
  walletAccount,
} from '../../../models/payment.model';
import { MoneyPipe } from '../../../shared/money';

type Step = 1 | 2 | 3;

/** Dernière adresse utilisée, pour pré-remplir la commande suivante (confort, facultatif). */
const ADDRESS_KEY = 'fshop.lastShippingAddress';

/** Numéro haïtien à 8 chiffres, +509 facultatif. */
function haitianPhone(control: AbstractControl<string>): ValidationErrors | null {
  return !control.value || normalizePhone(control.value) ? null : { phone: true };
}

/**
 * Tunnel de commande (/commande) en trois étapes : livraison, paiement,
 * confirmation. Chaque étape est validée avant de passer à la suivante.
 */
@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, RouterLink, MoneyPipe, Container],
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
  protected readonly settings = inject(SettingsService).settings;

  protected readonly steps = [
    { step: 1 as Step, label: 'Livraison' },
    { step: 2 as Step, label: 'Paiement' },
    { step: 3 as Step, label: 'Confirmation' },
  ];
  protected readonly step = signal<Step>(1);

  protected readonly labels = PAYMENT_METHOD_LABELS;
  protected readonly badges = PAYMENT_METHOD_BADGES;
  protected readonly formatLocality = formatLocality;
  protected readonly formatPhone = formatPhone;
  protected readonly isMobileWallet = isMobileWallet;

  protected readonly paymentMethods = computed(() => enabledPaymentMethods(this.settings()));
  private readonly chosenPayment = signal<PaymentMethod | null>(null);
  /** Choix du client ; présélectionné s'il n'y a qu'un seul moyen. */
  protected readonly paymentMethod = computed(() => {
    const methods = this.paymentMethods();
    const chosen = this.chosenPayment();
    if (chosen && methods.includes(chosen)) {
      return chosen;
    }
    return methods.length === 1 ? methods[0] : null;
  });
  protected readonly paymentFee = computed(() => paymentFee(this.paymentMethod(), this.settings()));
  protected readonly total = computed(() => this.cart.total() + this.paymentFee());
  protected readonly taxAmount = computed(() => includedTax(this.total(), this.settings().vatRate));

  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly paymentError = signal(false);

  protected readonly form = this.fb.group({
    fullName: [this.defaultName(), [Validators.required, Validators.maxLength(200)]],
    phone: ['', [Validators.required, Validators.maxLength(30), haitianPhone]],
    line1: ['', [Validators.required, Validators.maxLength(255)]],
    line2: ['', Validators.maxLength(255)],
    department: ['', Validators.required],
    city: [{ value: '', disabled: true }, Validators.required],
    postalCode: ['', Validators.maxLength(20)],
    country: [SHIPPING_COUNTRIES[0], Validators.required],
  });

  protected readonly countries = SHIPPING_COUNTRIES;
  protected readonly departments = HAITI_DEPARTMENTS;
  private readonly department = toSignal(this.form.controls.department.valueChanges, {
    initialValue: this.form.controls.department.value,
  });
  /** Communes du département choisi. */
  protected readonly communes = computed(() => communesOf(this.department()));

  /** Adresse saisie, pour le récapitulatif de l'étape 3. */
  protected readonly address = signal<ShippingAddress | null>(null);

  constructor() {
    // Changer de département invalide la commune ; pas de département, pas de commune.
    this.form.controls.department.valueChanges.pipe(takeUntilDestroyed()).subscribe((department) => {
      const city = this.form.controls.city;
      if (!communesOf(department).includes(city.value)) {
        city.setValue('');
      }
      if (department) {
        city.enable();
      } else {
        city.disable();
      }
    });
    afterNextRender(() => this.restoreAddress());
  }

  protected wallet(method: PaymentMethod) {
    return isMobileWallet(method) ? walletAccount(method, this.settings()) : null;
  }

  protected invalid(name: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[name];
    return control.invalid && control.touched;
  }

  protected choosePayment(method: PaymentMethod): void {
    this.chosenPayment.set(method);
    this.paymentError.set(false);
  }

  /** Étape suivante, si l'étape en cours est complète. */
  protected next(): void {
    this.error.set(null);
    if (this.step() === 1) {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        this.error.set('Complétez les champs en rouge pour continuer.');
        return;
      }
      this.address.set(this.shippingAddress());
      this.goTo(2);
    } else if (this.step() === 2) {
      if (!this.paymentMethod()) {
        this.paymentError.set(true);
        return;
      }
      this.goTo(3);
    }
  }

  /** Retour à une étape déjà franchie (fil d'étapes, boutons « Modifier »). */
  protected goTo(step: Step): void {
    if (step > this.step() + 1) {
      return;
    }
    this.step.set(step);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  protected submit(): void {
    const paymentMethod = this.paymentMethod();
    const address = this.address();
    if (!paymentMethod || !address) {
      return;
    }

    this.submitting.set(true);
    this.error.set(null);
    this.orders.checkout(address, paymentMethod).subscribe({
      next: (order) => {
        this.saveAddress(address);
        this.router.navigate(['/commandes', order.id], { queryParams: { nouvelle: 1 } });
      },
      error: (err: unknown) => {
        this.submitting.set(false);
        this.error.set(errorMessage(err));
      },
    });
  }

  private shippingAddress(): ShippingAddress {
    const value = this.form.getRawValue();
    const phone = normalizePhone(value.phone);
    return {
      fullName: value.fullName.trim(),
      phone: phone ? `+509 ${formatPhone(phone)}` : value.phone.trim(),
      line1: value.line1.trim(),
      line2: value.line2.trim() || null,
      city: value.city,
      department: value.department,
      postalCode: value.postalCode.trim() || null,
      country: value.country,
    };
  }

  private restoreAddress(): void {
    try {
      const saved = JSON.parse(localStorage.getItem(ADDRESS_KEY) ?? 'null') as Partial<ShippingAddress> | null;
      if (saved) {
        // Adresse enregistrée avant les listes : département et commune gardés s'ils existent.
        const department = HAITI_DEPARTMENTS.some((d) => d.name === saved.department) ? saved.department! : '';
        this.form.patchValue({
          fullName: saved.fullName || this.form.controls.fullName.value,
          phone: saved.phone ?? '',
          line1: saved.line1 ?? '',
          line2: saved.line2 ?? '',
          department,
          postalCode: saved.postalCode ?? '',
        });
        if (communesOf(department).includes(saved.city ?? '')) {
          this.form.controls.city.setValue(saved.city!);
        }
      }
    } catch {
      // Stockage indisponible (navigation privée...) : formulaire vide.
    }
  }

  private saveAddress(address: ShippingAddress): void {
    try {
      localStorage.setItem(ADDRESS_KEY, JSON.stringify(address));
    } catch {
      // Sans conséquence : l'adresse sera simplement à ressaisir.
    }
  }

  private defaultName(): string {
    const user = this.auth.user();
    return user ? `${user.firstName} ${user.lastName}`.trim() : '';
  }
}
