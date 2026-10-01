import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SettingsService } from '../../../services/settings.service';
import { InfoLayout } from './info-layout';

/** Politique de confidentialité (/confidentialite). Reflète les données réellement collectées. */
@Component({
  selector: 'app-privacy-page',
  imports: [RouterLink, InfoLayout],
  template: `
    <app-info-layout
      title="Politique de confidentialité"
      intro="Quelles données nous collectons, pourquoi, et comment exercer vos droits."
    >
      <h2>Données collectées</h2>
      <ul>
        <li><strong>Compte</strong> : prénom, nom, adresse e-mail et mot de passe.</li>
        <li><strong>Commandes</strong> : articles, montants, nom du destinataire, adresse et téléphone de livraison.</li>
        <li>
          <strong>Paiement mobile</strong> : identifiant de transaction MonCash / NatCash et numéro de l'expéditeur,
          que vous saisissez pour que nous puissions vérifier le paiement. Nous n'avons jamais accès à votre
          compte ni à votre code PIN.
        </li>
        <li><strong>Favoris</strong> : les articles que vous ajoutez à vos favoris depuis votre compte.</li>
      </ul>

      <h2>Pourquoi ?</h2>
      <ul>
        <li>Gérer votre compte, vos commandes, leur paiement et leur livraison.</li>
        <li>Vous contacter au sujet d'une commande (livreur, service client).</li>
        <li>Respecter nos obligations comptables et légales.</li>
      </ul>

      <h2>Partage</h2>
      <p>
        Vos données ne sont ni vendues ni louées. Seules les informations nécessaires à la livraison (nom,
        adresse, téléphone) sont transmises à la personne chargée de livrer votre colis.
      </p>

      <h2>Conservation</h2>
      <p>
        Les données du compte sont conservées tant que le compte est actif. Les commandes sont conservées le
        temps exigé par les obligations comptables.
      </p>

      <h2>Cookies et stockage local</h2>
      <p>Aucun traceur publicitaire. Détails sur la page <a routerLink="/cookies">Cookies</a>.</p>

      <h2>Vos droits</h2>
      <p>
        Vous pouvez demander à tout moment l'accès à vos données, leur correction ou leur suppression.
        @if (settings().contactEmail; as email) {
          Écrivez-nous à <a [href]="'mailto:' + email">{{ email }}</a>.
        } @else {
          Écrivez-nous via la page <a routerLink="/contact">Nous contacter</a>.
        }
      </p>
    </app-info-layout>
  `,
})
export default class PrivacyPage {
  protected readonly settings = inject(SettingsService).settings;
}
