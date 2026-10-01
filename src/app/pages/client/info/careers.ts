import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SettingsService } from '../../../services/settings.service';
import { InfoLayout } from './info-layout';

/** Carrières (/carrieres). */
@Component({
  selector: 'app-careers-page',
  imports: [RouterLink, InfoLayout],
  template: `
    <app-info-layout title="Carrières" intro="Envie de faire grandir la boutique avec nous ?">
      <div class="info-note">Aucune offre d'emploi n'est ouverte pour le moment.</div>

      <h2>Candidature spontanée</h2>
      <p>
        Logistique, service client, marketing, photo, développement… Si vous souhaitez participer à l'aventure,
        envoyez-nous votre CV et quelques lignes sur ce qui vous motive.
      </p>
      @if (settings().contactEmail; as email) {
        <p>
          <a [href]="'mailto:' + email + '?subject=Candidature%20spontan%C3%A9e'">{{ email }}</a>
          — objet : « Candidature spontanée ».
        </p>
      } @else {
        <p>Utilisez la page <a routerLink="/contact">Nous contacter</a> en précisant « Candidature spontanée ».</p>
      }
      <p>Nous lisons chaque candidature et revenons vers vous si un poste correspond à votre profil.</p>
    </app-info-layout>
  `,
})
export default class CareersPage {
  protected readonly settings = inject(SettingsService).settings;
}
