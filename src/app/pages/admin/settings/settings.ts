import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { SettingsService } from '../../../services/settings.service';
import { includedTax, StoreSettings, StoreSettingsRequest } from '../../../models/settings.model';
import { errorMessage } from '../../../shared/api-error';
import { formatPhone, normalizePhone } from '../../../models/payment.model';
import { CURRENCIES, MoneyPipe } from '../../../shared/money';

/** Numéro MonCash / NatCash : 8 chiffres, +509 facultatif (vide accepté). */
function walletNumber(control: AbstractControl<string>): ValidationErrors | null {
  return !control.value?.trim() || normalizePhone(control.value) ? null : { phone: true };
}

/**
 * Paramètres de la boutique (/admin/parametres) : informations, commandes,
 * paiement, livraison, TVA, stock et retours. Appliqués aussitôt par l'API et la boutique.
 */
@Component({
  selector: 'app-admin-settings',
  imports: [ReactiveFormsModule, MoneyPipe, DatePipe, NgTemplateOutlet],
  templateUrl: './settings.html',
})
export default class Settings {
  private readonly admin = inject(AdminService);
  private readonly settingsService = inject(SettingsService);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly loading = signal(true);
  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly saved = signal(false);
  protected readonly updatedAt = signal<string | undefined>(undefined);

  protected readonly form = this.fb.group({
    storeName: ['', [Validators.required, Validators.maxLength(100)]],
    currency: ['EUR', Validators.required],
    contactEmail: ['', [Validators.email, Validators.maxLength(255)]],
    announcement: ['', Validators.maxLength(255)],
    checkoutEnabled: [true],
    closedMessage: ['', Validators.maxLength(255)],
    shippingCost: [0, [Validators.required, Validators.min(0)]],
    freeShippingEnabled: [true],
    freeShippingThreshold: [0, [Validators.required, Validators.min(0)]],
    minOrderAmount: [0, [Validators.required, Validators.min(0)]],
    maxQuantityPerItem: [99, [Validators.required, Validators.min(1), Validators.max(99)]],
    customerCancellation: [true],
    vatRate: [20, [Validators.required, Validators.min(0), Validators.max(100)]],
    lowStockThreshold: [10, [Validators.required, Validators.min(0), Validators.max(10000)]],
    returnDays: [30, [Validators.required, Validators.min(0), Validators.max(365)]],
    moncashEnabled: [false],
    moncashNumber: ['', [Validators.maxLength(30), walletNumber]],
    moncashAccountName: ['', Validators.maxLength(100)],
    natcashEnabled: [false],
    natcashNumber: ['', [Validators.maxLength(30), walletNumber]],
    natcashAccountName: ['', Validators.maxLength(100)],
    cashOnDeliveryEnabled: [true],
    cashOnDeliveryFee: [0, [Validators.required, Validators.min(0)]],
    paymentDelayDays: [7, [Validators.required, Validators.min(0), Validators.max(60)]],
  });

  private readonly value = toSignal(this.form.valueChanges, { initialValue: this.form.getRawValue() });
  private readonly status = toSignal(this.form.statusChanges, { initialValue: this.form.status });

  /** Barre d'enregistrement visible dès qu'un champ a été modifié. */
  protected readonly dirty = computed(() => {
    this.value();
    this.status();
    return this.form.dirty;
  });

  protected readonly checkoutEnabled = computed(() => this.value().checkoutEnabled ?? true);
  protected readonly freeShippingEnabled = computed(() => this.value().freeShippingEnabled ?? true);
  protected readonly wallets = [
    {
      key: 'moncash',
      label: 'MonCash',
      enabled: 'moncashEnabled',
      number: 'moncashNumber',
      accountName: 'moncashAccountName',
    },
    {
      key: 'natcash',
      label: 'NatCash',
      enabled: 'natcashEnabled',
      number: 'natcashNumber',
      accountName: 'natcashAccountName',
    },
  ] as const;
  protected readonly currencies = CURRENCIES;
  /** Devise sélectionnée (libellés des montants, exemple de TVA). */
  protected readonly currencyCode = computed(() => this.value().currency || 'EUR');
  /** La devise a changé par rapport à la valeur enregistrée : les prix ne sont pas convertis. */
  protected readonly currencyChanged = computed(
    () => this.currencyCode() !== this.settingsService.settings().currency,
  );
  protected readonly cashOnDeliveryEnabled = computed(() => this.value().cashOnDeliveryEnabled ?? false);
  protected readonly noPaymentMethod = computed(
    () => !this.walletEnabled('moncash') && !this.walletEnabled('natcash') && !this.cashOnDeliveryEnabled(),
  );

  /** Exemple chiffré pour la TVA : 100 TTC dans la devise choisie. */
  protected readonly taxExample = computed(() => includedTax(100, Number(this.value().vatRate) || 0));

  constructor() {
    this.admin.getSettings().subscribe({
      next: (settings) => {
        this.apply(settings);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        this.error.set(errorMessage(err));
        this.loading.set(false);
      },
    });
  }

  protected walletEnabled(key: 'moncash' | 'natcash'): boolean {
    return this.value()[`${key}Enabled`] ?? false;
  }

  protected invalid(name: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.touched || control.dirty);
  }

  protected discard(): void {
    this.apply(this.settingsService.settings());
    this.error.set(null);
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set('Certains champs sont invalides : vérifiez les valeurs en rouge.');
      return;
    }

    const v = this.form.getRawValue();
    const request: StoreSettingsRequest = {
      ...v,
      storeName: v.storeName.trim(),
      contactEmail: v.contactEmail.trim() || null,
      announcement: v.announcement.trim() || null,
      closedMessage: v.closedMessage.trim() || null,
      moncashNumber: v.moncashNumber.trim() || null,
      moncashAccountName: v.moncashAccountName.trim() || null,
      natcashNumber: v.natcashNumber.trim() || null,
      natcashAccountName: v.natcashAccountName.trim() || null,
    };

    this.submitting.set(true);
    this.error.set(null);
    this.admin.updateSettings(request).subscribe({
      next: (settings) => {
        this.submitting.set(false);
        this.apply(settings);
        this.saved.set(true);
        setTimeout(() => this.saved.set(false), 3000);
      },
      error: (err: unknown) => {
        this.submitting.set(false);
        this.error.set(errorMessage(err));
      },
    });
  }

  /** Remplit le formulaire et répercute les valeurs sur la boutique. */
  private apply(settings: StoreSettings): void {
    this.settingsService.set(settings);
    this.updatedAt.set(settings.updatedAt);
    this.form.reset({
      storeName: settings.storeName,
      currency: settings.currency,
      contactEmail: settings.contactEmail ?? '',
      announcement: settings.announcement ?? '',
      checkoutEnabled: settings.checkoutEnabled,
      closedMessage: settings.closedMessage ?? '',
      shippingCost: settings.shippingCost,
      freeShippingEnabled: settings.freeShippingEnabled,
      freeShippingThreshold: settings.freeShippingThreshold,
      minOrderAmount: settings.minOrderAmount,
      maxQuantityPerItem: settings.maxQuantityPerItem,
      customerCancellation: settings.customerCancellation,
      vatRate: settings.vatRate,
      lowStockThreshold: settings.lowStockThreshold,
      returnDays: settings.returnDays,
      moncashEnabled: settings.moncashEnabled,
      moncashNumber: settings.moncashNumber ? formatPhone(settings.moncashNumber) : '',
      moncashAccountName: settings.moncashAccountName ?? '',
      natcashEnabled: settings.natcashEnabled,
      natcashNumber: settings.natcashNumber ? formatPhone(settings.natcashNumber) : '',
      natcashAccountName: settings.natcashAccountName ?? '',
      cashOnDeliveryEnabled: settings.cashOnDeliveryEnabled,
      cashOnDeliveryFee: settings.cashOnDeliveryFee,
      paymentDelayDays: settings.paymentDelayDays,
    });
  }
}
