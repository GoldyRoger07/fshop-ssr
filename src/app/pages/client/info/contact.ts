import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SettingsService } from '../../../services/settings.service';
import { InfoLayout } from './info-layout';

/** Nous contacter (/contact) : e-mail de la boutique (paramètres) et raccourcis d'aide. */
@Component({
  selector: 'app-contact-page',
  imports: [RouterLink, InfoLayout],
  template: `
    <app-info-layout title="Nous contacter" intro="Une question sur un produit, une commande ou un paiement ?">
      @if (settings().contactEmail; as email) {
        <div class="mb-6 border border-gray-200 p-5 dark:border-gray-800">
          <p class="mb-1 font-semibold text-gray-900 dark:text-gray-100">
            <i class="pi pi-envelope mr-1"></i> Par e-mail
          </p>
          <p><a [href]="'mailto:' + email">{{ email }}</a></p>
          <a [href]="'mailto:' + email" class="shop-btn">Écrire au service client</a>
        </div>
        <p>Pour une commande, indiquez sa <strong>référence</strong> : nous vous répondrons plus vite.</p>
      } @else {
        <div class="info-note">L'adresse de contact de la boutique n'est pas encore disponible.</div>
      }

      <h2>Vous trouverez peut-être la réponse ici</h2>
      <ul>
        <li><a routerLink="/suivi-commande">Où en est ma commande ?</a></li>
        <li><a routerLink="/moyens-de-paiement">Comment payer avec MonCash ou NatCash ?</a></li>
        <li><a routerLink="/retours">Retourner ou annuler un article</a></li>
        <li><a routerLink="/livraison">Frais et conditions de livraison</a></li>
        <li><a routerLink="/faq">Toutes les questions fréquentes</a></li>
      </ul>
    </app-info-layout>
  `,
})
export default class ContactPage {
  protected readonly settings = inject(SettingsService).settings;
}
