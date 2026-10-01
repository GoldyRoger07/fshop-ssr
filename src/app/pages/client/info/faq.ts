import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SettingsService } from '../../../services/settings.service';
import { MoneyPipe } from '../../../shared/money';
import { InfoLayout } from './info-layout';

/** Questions fréquentes (/faq). Les réponses suivent les paramètres de la boutique. */
@Component({
  selector: 'app-faq-page',
  imports: [RouterLink, MoneyPipe, InfoLayout],
  template: `
    <app-info-layout title="Questions fréquentes" intro="Les réponses aux questions que l'on nous pose le plus.">
      <h2>Commande</h2>
      <details>
        <summary>Dois-je créer un compte pour commander ?</summary>
        <p>
          Oui : le compte permet de suivre vos commandes et de payer en toute sécurité.
          <a routerLink="/connexion" [queryParams]="{ mode: 'inscription' }">Créer un compte</a>.
        </p>
      </details>
      <details>
        <summary>Y a-t-il un montant minimum de commande ?</summary>
        <p>
          @if (settings().minOrderAmount) {
            Oui, {{ settings().minOrderAmount | money }} hors frais de livraison.
          } @else {
            Non, vous pouvez commander dès un article.
          }
        </p>
      </details>
      <details>
        <summary>Combien d'exemplaires d'un même article puis-je commander ?</summary>
        <p>Jusqu'à {{ settings().maxQuantityPerItem }} par article, dans la limite du stock disponible.</p>
      </details>
      <details>
        <summary>Puis-je annuler ma commande ?</summary>
        <p>
          @if (settings().customerCancellation) {
            Oui, tant qu'elle est « En attente », depuis <a routerLink="/commandes">Mes commandes</a>.
          } @else {
            <a routerLink="/contact">Contactez-nous</a> rapidement avec la référence de la commande.
          }
        </p>
      </details>

      <h2>Paiement</h2>
      <details>
        <summary>Quels moyens de paiement acceptez-vous ?</summary>
        <p>Tous les détails sur la page <a routerLink="/moyens-de-paiement">Moyens de paiement</a>.</p>
      </details>
      <details>
        <summary>J'ai payé par MonCash / NatCash, que faire ensuite ?</summary>
        <p>
          Ouvrez la commande dans <a routerLink="/commandes">Mes commandes</a> et saisissez l'identifiant de
          transaction reçu par SMS. Nous vérifions le paiement puis préparons votre colis.
        </p>
      </details>
      <details>
        <summary>Mon paiement est indiqué comme introuvable.</summary>
        <p>
          L'identifiant ou le numéro saisi ne correspond à aucun paiement reçu. Vérifiez le SMS de confirmation et
          corrigez votre saisie depuis la page de la commande.
        </p>
      </details>

      <h2>Livraison & retours</h2>
      <details>
        <summary>Combien coûte la livraison ?</summary>
        <p>
          @if (settings().shippingCost) {
            {{ settings().shippingCost | money }}.
            @if (settings().freeShippingEnabled) {
              Elle est offerte dès {{ settings().freeShippingThreshold | money }} d'achat.
            }
          } @else {
            Elle est offerte.
          }
          Voir <a routerLink="/livraison">Livraison</a>.
        </p>
      </details>
      <details>
        <summary>Comment suivre mon colis ?</summary>
        <p>Le statut de chaque commande est visible dans <a routerLink="/commandes">Mes commandes</a>.</p>
      </details>
      <details>
        <summary>Puis-je retourner un article ?</summary>
        <p>
          @if (settings().returnDays > 0) {
            Oui, gratuitement sous {{ settings().returnDays }} jours après la livraison.
          } @else {
            Les retours gratuits ne sont pas proposés actuellement, sauf article défectueux ou non conforme.
          }
          Voir <a routerLink="/retours">Retours et remboursements</a>.
        </p>
      </details>
      <details>
        <summary>Comment choisir ma taille ?</summary>
        <p>Consultez le <a routerLink="/guide-des-tailles">guide des tailles</a>.</p>
      </details>

      <p class="mt-8">
        Vous n'avez pas trouvé votre réponse ? <a routerLink="/contact">Contactez-nous</a>.
      </p>
    </app-info-layout>
  `,
})
export default class FaqPage {
  protected readonly settings = inject(SettingsService).settings;
}
