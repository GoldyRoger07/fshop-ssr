/** Élément <swiper-container> une fois Swiper initialisé. */
export type SwiperElement = HTMLElement & {
  swiper?: { slidePrev(): void; slideNext(): void };
};

export function slidePrev(el: HTMLElement): void {
  (el as SwiperElement).swiper?.slidePrev();
}

export function slideNext(el: HTMLElement): void {
  (el as SwiperElement).swiper?.slideNext();
}
