import { Component, computed, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Page } from '../../models/page.model';

/** Navigation « page précédente / suivante » pour les listes paginées de l'API. */
@Component({
  selector: 'app-pagination',
  imports: [DecimalPipe],
  template: `
    @if (page(); as p) {
      <div class="flex items-center justify-between gap-4 text-sm">
        <p class="text-gray-500">
          {{ p.totalElements | number }} résultat{{ p.totalElements > 1 ? 's' : '' }} ·
          page {{ p.page + 1 }} / {{ p.totalPages || 1 }}
        </p>
        <div class="flex gap-2">
          <button type="button" class="pagination-btn" [disabled]="p.page === 0" (click)="go(p.page - 1)">
            <i class="pi pi-angle-left"></i> Précédent
          </button>
          <button type="button" class="pagination-btn" [disabled]="isLast()" (click)="go(p.page + 1)">
            Suivant <i class="pi pi-angle-right"></i>
          </button>
        </div>
      </div>
    }
  `,
})
export class Pagination {
  readonly page = input.required<Page<unknown> | null>();
  readonly pageChange = output<number>();

  protected readonly isLast = computed(() => {
    const p = this.page();
    return !p || p.page >= p.totalPages - 1;
  });

  protected go(page: number): void {
    this.pageChange.emit(page);
  }
}
