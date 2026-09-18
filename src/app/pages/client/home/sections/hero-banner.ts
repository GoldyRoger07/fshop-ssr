import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink } from '@angular/router';
import { slideNext, slidePrev } from '../../../../shared/swiper';

@Component({
  selector: 'app-hero-banner',
  imports: [RouterLink],
  templateUrl: './hero-banner.html',
  styleUrl: './hero-banner.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  // Swiper en mode boucle réordonne lui-même les slides : Angular ne doit pas
  // essayer de réutiliser ce DOM à l'hydratation (erreur NG0500), sinon le
  // reste de la page (header compris) n'est plus hydraté.
  host: { ngSkipHydration: 'true' },
})
export class HeroBanner {
  protected readonly prev = slidePrev;
  protected readonly next = slideNext;

  protected readonly sideTiles = [
    { label: 'Meilleures ventes', image: '/img/hero-section/01.avif', link: ['/produits'], params: { sort: 'bestsellers' } },
    { label: 'Nouveautés', image: '/img/hero-section/02.avif', link: ['/produits'], params: { tag: 'new' } },
    { label: 'Évasion soleil', image: '/img/hero-section/03.avif', link: ['/categorie', 'beachwear'], params: {} },
  ];

  protected readonly brandTiles = [
    { label: 'RowWe', image: '/img/hero-section/04.avif', link: ['/categorie', 'women'] },
    { label: 'EMERY ROSE', image: '/img/hero-section/05.avif', link: ['/categorie', 'dresses'] },
    { label: 'MOTF', image: '/img/hero-section/06.avif', link: ['/categorie', 'tops'] },
  ];

  /** Visuels du carrousel, répétés pour que la boucle Swiper ait assez de slides. */
  protected readonly slides = [1, 2]
    .flatMap(() => ['01', '02', '03'])
    .map((name) => `/img/hero-section/main-slider/${name}.avif`);
}
