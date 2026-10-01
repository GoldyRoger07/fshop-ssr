import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SettingsService } from '../../../services/settings.service';
import { InfoLayout } from './info-layout';

/** Retours et remboursements (/retours). */
@Component({
  selector: 'app-returns-page',
  imports: [RouterLink, InfoLayout],
  template: `
    <app-info-layout title="Retours et remboursements" intro="Un article ne vous convient pas ? Voici comment faire.">
      @if (settings().returnDays > 0) {
        <div class="info-note">
          Vous disposez de <strong>{{ settings().returnDays }} jours</strong> après la livraison pour nous
          retourner un article gratuitement.
        </div>
      } @else {
        <div class="info-note">
          Les retours gratuits ne sont pas proposés actuellement. Un article défectueux ou non conforme reste
          toujours échangé ou remboursé.
        </div>
      }

      <h2>Annuler une commande</h2>
      @if (settings().customerCancellation) {
        <p>
          Tant que votre commande est « En attente », vous pouvez l'annuler vous-même depuis
          <a routerLink="/commandes">Mes commandes</a>. Une fois payée ou expédiée, contactez-nous.
        </p>
      } @else {
        <p>Pour annuler une commande, <a routerLink="/contact">contactez-nous</a> au plus vite.</p>
      }

      <h2>Retourner un article</h2>
      <ol>
        <li><a routerLink="/contact">Contactez-nous</a> en indiquant la référence de la commande et l'article concerné.</li>
        <li>Nous vous indiquons comment nous remettre l'article.</li>
        <li>L'article doit être non porté, non lavé et avec ses étiquettes d'origine.</li>
      </ol>
      <p>
        Pour des raisons d'hygiène, les sous-vêtements, maillots de bain, bijoux pour piercing et produits de
        beauté ouverts ne sont ni repris ni échangés, sauf défaut.
      </p>

      <h2>Remboursement</h2>
      <p>
        Après réception et vérification de l'article, le remboursement est effectué par le moyen de paiement
        utilisé (MonCash ou NatCash) ou, pour un paiement à la livraison, selon la solution convenue avec vous.
      </p>

      <h2>Article défectueux ou erreur de commande</h2>
      <p>
        Si vous recevez un article abîmé ou différent de votre commande, signalez-le-nous avec une photo : nous
        vous proposons un échange ou un remboursement, sans frais.
      </p>
    </app-info-layout>
  `,
})
export default class ReturnsPage {
  protected readonly settings = inject(SettingsService).settings;
}
