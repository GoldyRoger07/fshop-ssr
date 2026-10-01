import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LEGAL_INFO } from '../../../data/legal.data';
import { SettingsService } from '../../../services/settings.service';
import { InfoLayout } from './info-layout';

/** Mentions légales (/mentions-legales) : identité tirée de data/legal.data.ts. */
@Component({
  selector: 'app-legal-notice-page',
  imports: [RouterLink, InfoLayout],
  template: `
    <app-info-layout title="Mentions légales">
      <h2>Éditeur du site</h2>
      <table>
        <tbody>
          <tr><th scope="row">Nom commercial</th><td>{{ settings().storeName }}</td></tr>
          <tr><th scope="row">Raison sociale</th><td>{{ legal.companyName ?? missing }}</td></tr>
          <tr><th scope="row">Forme juridique</th><td>{{ legal.legalForm ?? missing }}</td></tr>
          <tr><th scope="row">Adresse</th><td>{{ legal.address ?? missing }}</td></tr>
          <tr><th scope="row">Immatriculation / NIF</th><td>{{ legal.registrationNumber ?? missing }}</td></tr>
          <tr><th scope="row">Téléphone</th><td>{{ legal.phone ?? missing }}</td></tr>
          <tr>
            <th scope="row">E-mail</th>
            <td>
              @if (settings().contactEmail; as email) {
                <a [href]="'mailto:' + email">{{ email }}</a>
              } @else {
                {{ missing }}
              }
            </td>
          </tr>
          <tr><th scope="row">Directeur de la publication</th><td>{{ legal.publisher ?? missing }}</td></tr>
        </tbody>
      </table>

      <h2>Hébergement</h2>
      <table>
        <tbody>
          <tr><th scope="row">Hébergeur</th><td>{{ legal.hostName ?? missing }}</td></tr>
          <tr><th scope="row">Adresse</th><td>{{ legal.hostAddress ?? missing }}</td></tr>
        </tbody>
      </table>

      <h2>Propriété intellectuelle</h2>
      <p>
        Les contenus du site (textes, logo, photos, mise en page) sont protégés. Toute reproduction sans
        autorisation préalable de {{ settings().storeName }} est interdite.
      </p>

      <h2>Données personnelles</h2>
      <p>
        Voir la <a routerLink="/confidentialite">politique de confidentialité</a> et la page
        <a routerLink="/cookies">Cookies</a>.
      </p>
    </app-info-layout>
  `,
})
export default class LegalNoticePage {
  protected readonly settings = inject(SettingsService).settings;
  protected readonly legal = LEGAL_INFO;
  protected readonly missing = 'Non renseigné';
}
