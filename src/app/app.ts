import { afterNextRender, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor() {
    // Swiper Element (web components <swiper-container>) : chargé uniquement dans
    // le navigateur, une fois l'hydratation terminée. Ça évite que Swiper modifie
    // le DOM rendu par le serveur avant qu'Angular ne le reprenne, et ça sort
    // Swiper du bundle initial.
    afterNextRender(() => {
      import('swiper/element/bundle').then(({ register }) => register());
    });
  }
}
