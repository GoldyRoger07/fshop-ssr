import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SettingsService } from '../../../services/settings.service';
import { MoneyPipe } from '../../../shared/money';
import { InfoLayout } from './info-layout';

/** Programme fidélité (/fidelite) : pas encore de programme à points, avantages actuels. */
@Component({
  selector: 'app-loyalty-page',
  imports: [RouterLink, MoneyPipe, InfoLayout],
  template: `
    <app-info-layout title="Programme fidélité" intro="Parce que nos clients fidèles méritent plus.">
      <div class="info-note">
        Notre programme de fidélité est en préparation : revenez bientôt pour découvrir ses avantages.
      </div>

      <h2>Vos avantages dès aujourd'hui</h2>
      <ul>
        @if (settings().freeShippingEnabled) {
          <li><strong>Livraison offerte</strong> dès {{ settings().freeShippingThreshold | money }} d'achat.</li>
        }
        <li><strong>Promotions</strong> toute l'année sur la page <a routerLink="/promos">Promos</a>.</li>
        <li><strong>Favoris</strong> : enregistrez vos coups de cœur dans votre compte pour les retrouver facilement.</li>
      </ul>

      <p>
        Pas encore de compte ?
        <a routerLink="/connexion" [queryParams]="{ mode: 'inscription' }">Créez-le en quelques secondes</a>.
      </p>
    </app-info-layout>
  `,
})
export default class LoyaltyPage {
  protected readonly settings = inject(SettingsService).settings;
}
