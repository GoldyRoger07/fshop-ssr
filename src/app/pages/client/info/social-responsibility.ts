import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SettingsService } from '../../../services/settings.service';
import { InfoLayout } from './info-layout';

/** Responsabilité sociale (/responsabilite-sociale). */
@Component({
  selector: 'app-social-responsibility-page',
  imports: [RouterLink, InfoLayout],
  template: `
    <app-info-layout
      title="Responsabilité sociale"
      intro="Vendre moins cher ne doit pas vouloir dire vendre n'importe comment."
    >
      <h2>Acheter juste ce qu'il faut</h2>
      <p>
        Le guide des tailles et les fiches produits détaillées sont là pour vous aider à choisir le bon article
        du premier coup : moins de retours, c'est moins de transport et moins de déchets.
        <a routerLink="/guide-des-tailles">Consulter le guide des tailles</a>.
      </p>

      <h2>Des commandes regroupées</h2>
      <p>
        Chaque commande est préparée et expédiée en un seul envoi.
        @if (settings().freeShippingEnabled) {
          La livraison offerte au-delà d'un certain montant encourage aussi à regrouper ses achats plutôt qu'à
          multiplier les petits colis.
        }
      </p>

      <h2>Vos données respectées</h2>
      <p>
        Nous ne collectons que les informations nécessaires à vos commandes et n'utilisons aucun traceur
        publicitaire. Détails dans notre <a routerLink="/confidentialite">politique de confidentialité</a>.
      </p>

      <h2>Une remarque, une idée ?</h2>
      <p>
        Nous progressons grâce à vos retours : <a routerLink="/contact">écrivez-nous</a>.
      </p>
    </app-info-layout>
  `,
})
export default class SocialResponsibilityPage {
  protected readonly settings = inject(SettingsService).settings;
}
