import { afterNextRender, Component, computed, DestroyRef, inject, input, signal } from '@angular/core';

/** Découpe une durée en millisecondes en heures / minutes / secondes (jamais négatives). */
export function splitDuration(ms: number): { hours: number; minutes: number; seconds: number } {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

/** Compte à rebours « HH : MM : SS » jusqu'à une date donnée. */
@Component({
  selector: 'app-countdown',
  template: `
    <span class="inline-flex items-center gap-1 font-mono text-sm font-semibold" role="timer" aria-live="off">
      @for (part of parts(); track $index; let last = $last) {
        <span class="min-w-7 bg-black px-1 py-0.5 text-center text-white dark:bg-white dark:text-black">{{ part }}</span>
        @if (!last) {
          <span aria-hidden="true">:</span>
        }
      }
    </span>
  `,
})
export class Countdown {
  /** Fin du compte à rebours (timestamp en millisecondes). */
  readonly endsAt = input.required<number>();

  private readonly now = signal(Date.now());

  protected readonly parts = computed(() => {
    const { hours, minutes, seconds } = splitDuration(this.endsAt() - this.now());
    return [hours, minutes, seconds].map((value) => String(value).padStart(2, '0'));
  });

  constructor() {
    const destroyRef = inject(DestroyRef);

    // Le minuteur ne tourne que dans le navigateur (pas pendant le rendu serveur).
    afterNextRender(() => {
      const timer = setInterval(() => this.now.set(Date.now()), 1000);
      destroyRef.onDestroy(() => clearInterval(timer));
    });
  }
}
