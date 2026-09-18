import { Component, input, output } from '@angular/core';

/** Sélecteur de quantité « – n + ». */
@Component({
  selector: 'app-quantity-input',
  template: `
    <div class="inline-flex h-9 items-stretch border border-gray-300 dark:border-gray-700">
      <button
        type="button"
        class="w-9 transition-colors hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-gray-800"
        aria-label="Diminuer la quantité"
        [disabled]="value() <= min()"
        (click)="change(value() - 1)"
      >
        <i class="pi pi-minus" style="font-size: 0.75rem"></i>
      </button>

      <span class="flex w-10 items-center justify-center text-sm font-semibold" aria-live="polite">{{ value() }}</span>

      <button
        type="button"
        class="w-9 transition-colors hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-gray-800"
        aria-label="Augmenter la quantité"
        [disabled]="value() >= max()"
        (click)="change(value() + 1)"
      >
        <i class="pi pi-plus" style="font-size: 0.75rem"></i>
      </button>
    </div>
  `,
})
export class QuantityInput {
  readonly value = input.required<number>();
  readonly min = input(1);
  readonly max = input(99);

  readonly valueChange = output<number>();

  protected change(next: number): void {
    const clamped = Math.min(this.max(), Math.max(this.min(), next));
    if (clamped !== this.value()) {
      this.valueChange.emit(clamped);
    }
  }
}
