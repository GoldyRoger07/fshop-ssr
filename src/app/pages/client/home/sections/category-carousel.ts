import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { CatalogService } from '../../../../services/catalog.service';
import { Category } from '../../../../models/category.model';
import { slideNext, slidePrev } from '../../../../shared/swiper';

@Component({
  selector: 'app-category-carousel',
  imports: [RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <h2 class="mb-4 text-lg font-bold">Acheter par catégorie</h2>

    <div class="group relative">
      <swiper-container
        #swiper
        slides-per-view="4.3"
        space-between="8"
        breakpoints='{"640": {"slidesPerView": 6}, "1024": {"slidesPerView": 8, "slidesPerGroup": 4}, "1200": {"slidesPerView": 10, "slidesPerGroup": 5}}'
      >
        <!-- Deux catégories par colonne, comme sur Shein -->
        @for (column of columns(); track $index) {
          <swiper-slide>
            <div class="flex flex-col gap-4">
              @for (category of column; track category.slug) {
                <a [routerLink]="['/categorie', category.slug]" class="group/cat flex flex-col items-center gap-1.5 text-center">
                  <span class="block aspect-square w-full max-w-24 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                    <img
                      [src]="category.image"
                      [alt]="category.name"
                      loading="lazy"
                      class="h-full w-full object-cover transition-transform duration-300 group-hover/cat:scale-110"
                    />
                  </span>
                  <span class="line-clamp-2 text-xs leading-tight group-hover/cat:underline">{{ category.name }}</span>
                </a>
              }
            </div>
          </swiper-slide>
        }
      </swiper-container>

      <button type="button" class="carousel-nav -left-2 top-[40%]" aria-label="Catégories précédentes" (click)="prev(swiper)">
        <i class="pi pi-angle-left"></i>
      </button>
      <button type="button" class="carousel-nav -right-2 top-[40%]" aria-label="Catégories suivantes" (click)="next(swiper)">
        <i class="pi pi-angle-right"></i>
      </button>
    </div>
  `,
})
export class CategoryCarousel {
  protected readonly prev = slidePrev;
  protected readonly next = slideNext;

  private readonly categories = toSignal(
    inject(CatalogService).getCategories().pipe(catchError(() => of([]))),
    { initialValue: [] },
  );

  protected readonly columns = computed(() => toColumns(this.categories(), 2));
}

function toColumns(categories: Category[], size: number): Category[][] {
  const columns: Category[][] = [];
  for (let i = 0; i < categories.length; i += size) {
    columns.push(categories.slice(i, i + size));
  }
  return columns;
}
