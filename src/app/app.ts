import { afterNextRender, Component, effect, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { SettingsService } from './services/settings.service';
import { formatMoney } from './shared/money';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly settings = inject(SettingsService).settings;
  private readonly meta = inject(Meta);

  constructor() {
    // Description pour les moteurs de recherche, rendue côté serveur : nom de la
    // boutique et livraison offerte dans la devise choisie (paramètres).
    effect(() => {
      const s = this.settings();
      const shipping = s.freeShippingEnabled
        ? ` Livraison gratuite dès ${formatMoney(s.freeShippingThreshold, s.currency, 'fr-FR', '1.0-2')}.`
        : '';
      this.meta.updateTag({
        name: 'description',
        content: `${s.storeName} : mode femme, homme, enfant, maison et beauté à petits prix.${shipping}`,
      });
    });

    // Swiper Element (web components <swiper-container>) : chargé uniquement dans
    // le navigateur, une fois l'hydratation terminée. Ça évite que Swiper modifie
    // le DOM rendu par le serveur avant qu'Angular ne le reprenne, et ça sort
    // Swiper du bundle initial.
    afterNextRender(() => {
      import('swiper/element/bundle').then(({ register }) => register());
    });
  }
}
