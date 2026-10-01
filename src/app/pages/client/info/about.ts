import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SettingsService } from '../../../services/settings.service';
import { InfoLayout } from './info-layout';

/** À propos (/a-propos). */
@Component({
  selector: 'app-about-page',
  imports: [RouterLink, InfoLayout],
  template: `
    <app-info-layout
      [title]="'À propos de ' + settings().storeName"
      intro="La mode et les essentiels du quotidien, à petits prix et livrés chez vous."
    >
      <h2>Qui sommes-nous ?</h2>
      <p>
        {{ settings().storeName }} est une boutique en ligne de mode et de maison : vêtements femme, homme et
        enfant, chaussures, accessoires, beauté, déco… Notre objectif est simple : rendre les tendances
        accessibles à tous, avec un catalogue renouvelé régulièrement et des promotions toute l'année.
      </p>

      <h2>Nos engagements</h2>
      <ul>
        <li><strong>Des prix justes</strong>, affichés toutes taxes comprises, sans frais cachés.</li>
        <li>
          <strong>Des paiements adaptés</strong> : mobile money ou paiement à la livraison, selon ce qui vous
          convient (<a routerLink="/moyens-de-paiement">voir les moyens de paiement</a>).
        </li>
        <li><strong>Un suivi clair</strong> de chaque commande, depuis votre espace client.</li>
        <li><strong>Un service client à l'écoute</strong> pour toute question avant ou après l'achat.</li>
      </ul>

      <h2>Envie d'en savoir plus ?</h2>
      <p>
        Découvrez <a routerLink="/produits">tout le catalogue</a>, nos <a routerLink="/promos">promotions du moment</a>
        ou <a routerLink="/contact">écrivez-nous</a>.
      </p>
    </app-info-layout>
  `,
})
export default class AboutPage {
  protected readonly settings = inject(SettingsService).settings;
}
