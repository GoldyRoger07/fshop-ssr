import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { CatalogService } from '../../../../services/catalog.service';
import { ProductCard } from '../../../../components/product-card/product-card';
import { Countdown } from '../../../../components/countdown/countdown';
import { slideNext, slidePrev } from '../../../../shared/swiper';

@Component({
  selector: 'app-flash-sale',
  imports: [RouterLink, ProductCard, Countdown],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="bg-sale-soft p-3 sm:p-5 dark:bg-gray-900">
      <div class="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        <h2 class="flex items-center gap-1.5 text-xl font-extrabold tracking-tight text-sale uppercase italic">
          <i class="pi pi-bolt" style="font-size: 1.25rem"></i>
          Vente flash
        </h2>
        <div class="flex items-center gap-2 text-sm">
          <span class="text-gray-600 dark:text-gray-300">Se termine dans</span>
          <app-countdown [endsAt]="endsAt" />
        </div>
        <a routerLink="/promos" class="ml-auto flex items-center text-sm font-medium hover:underline">
          Voir tout <i class="pi pi-angle-right"></i>
        </a>
      </div>

      <div class="group relative">
        <swiper-container
          #swiper
          slides-per-view="2.3"
          space-between="10"
          breakpoints='{"640": {"slidesPerView": 3.3}, "1024": {"slidesPerView": 5, "slidesPerGroup": 5}, "1200": {"slidesPerView": 6, "slidesPerGroup": 6}}'
        >
          @for (product of products(); track product.id) {
            <swiper-slide class="h-auto">
              <app-product-card [product]="product" />
            </swiper-slide>
          }
        </swiper-container>

        <button type="button" class="carousel-nav -left-2 top-[38%]" aria-label="Produits précédents" (click)="prev(swiper)">
          <i class="pi pi-angle-left"></i>
        </button>
        <button type="button" class="carousel-nav -right-2 top-[38%]" aria-label="Produits suivants" (click)="next(swiper)">
          <i class="pi pi-angle-right"></i>
        </button>
      </div>
    </div>
  `,
})
export class FlashSale {
  protected readonly prev = slidePrev;
  protected readonly next = slideNext;

  protected readonly products = toSignal(
    inject(CatalogService).getFlashSaleProducts().pipe(catchError(() => of([]))),
    { initialValue: [] },
  );

  /** La vente flash se termine à minuit (heure locale). */
  protected readonly endsAt = new Date().setHours(24, 0, 0, 0);
}
