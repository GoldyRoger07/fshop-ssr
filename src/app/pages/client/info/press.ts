import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SettingsService } from '../../../services/settings.service';
import { InfoLayout } from './info-layout';

/** Espace presse (/presse). */
@Component({
  selector: 'app-press-page',
  imports: [RouterLink, InfoLayout],
  template: `
    <app-info-layout title="Espace presse" intro="Journalistes, créateurs de contenu, partenaires : bienvenue.">
      <h2>Contact presse</h2>
      <p>
        Pour une interview, des visuels, des échantillons ou un partenariat, contactez-nous en précisant votre
        média et votre échéance.
      </p>
      @if (settings().contactEmail; as email) {
        <p>
          <a [href]="'mailto:' + email + '?subject=Presse'">{{ email }}</a> — objet : « Presse ».
        </p>
      } @else {
        <p>Passez par la page <a routerLink="/contact">Nous contacter</a> en précisant « Presse ».</p>
      }

      <h2>Logo</h2>
      <p>Le logo {{ settings().storeName }} peut être utilisé pour illustrer un article parlant de la boutique.</p>
      <p class="flex items-center gap-4">
        <img src="/img/fshop-logo.svg" alt="Logo {{ settings().storeName }}" class="h-8 w-auto dark:invert" />
        <a href="/img/fshop-logo.svg" download>Télécharger (SVG)</a>
      </p>
    </app-info-layout>
  `,
})
export default class PressPage {
  protected readonly settings = inject(SettingsService).settings;
}
