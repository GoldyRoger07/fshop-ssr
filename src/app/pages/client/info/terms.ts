import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LEGAL_INFO } from '../../../data/legal.data';
import { enabledPaymentMethods, PAYMENT_METHOD_LABELS } from '../../../models/payment.model';
import { SettingsService } from '../../../services/settings.service';
import { MoneyPipe } from '../../../shared/money';
import { InfoLayout } from './info-layout';

/** Conditions générales de vente (/cgv). Les montants et délais suivent les paramètres. */
@Component({
  selector: 'app-terms-page',
  imports: [RouterLink, MoneyPipe, InfoLayout],
  template: `
    <app-info-layout title="Conditions générales de vente">
      <h2>1. Objet</h2>
      <p>
        Les présentes conditions régissent les ventes conclues sur le site
        {{ settings().storeName }}{{ legal.companyName ? ', exploité par ' + legal.companyName : '' }}. Passer commande implique leur acceptation. L'identité du vendeur figure dans les
        <a routerLink="/mentions-legales">mentions légales</a>.
      </p>

      <h2>2. Prix</h2>
      <p>
        Les prix sont indiqués en {{ settings().currency }}, toutes taxes comprises{{ vatNote() }}, hors frais de livraison. Le prix applicable est celui affiché au moment de la validation de la
        commande.
      </p>

      <h2>3. Commande</h2>
      <p>
        La commande nécessite un compte client. Elle est enregistrée à sa validation et apparaît dans
        <a routerLink="/commandes">Mes commandes</a>.
        @if (settings().minOrderAmount) {
          Le montant minimum d'achat est de {{ settings().minOrderAmount | money }}.
        }
        La quantité est limitée à {{ settings().maxQuantityPerItem }} exemplaires par article et au stock disponible.
      </p>

      <h2>4. Paiement</h2>
      <p>
        Moyens acceptés : {{ paymentLabels() || 'aucun pour le moment' }}. Pour un paiement MonCash ou NatCash, le
        client transfère le montant au numéro de la boutique puis déclare l'identifiant de transaction ; la
        commande est confirmée après vérification.
        @if (settings().paymentDelayDays > 0) {
          À défaut de paiement sous {{ settings().paymentDelayDays }} jour(s), la commande est annulée.
        }
        @if (settings().cashOnDeliveryEnabled && settings().cashOnDeliveryFee) {
          Le paiement à la livraison entraîne un supplément de {{ settings().cashOnDeliveryFee | money }}.
        }
        Détails : <a routerLink="/moyens-de-paiement">moyens de paiement</a>.
      </p>

      <h2>5. Livraison</h2>
      <p>
        Les frais de livraison s'élèvent à {{ settings().shippingCost | money }}.
        @if (settings().freeShippingEnabled) {
          Ils sont offerts à partir de {{ settings().freeShippingThreshold | money }} d'achat.
        }
        La livraison est effectuée à l'adresse indiquée par le client, qui doit rester joignable au numéro
        fourni. Voir <a routerLink="/livraison">Livraison</a>.
      </p>

      <h2>6. Annulation, retours et remboursements</h2>
      <p>
        @if (settings().customerCancellation) {
          Le client peut annuler sa commande tant qu'elle n'a pas été payée ni expédiée.
        }
        @if (settings().returnDays > 0) {
          Les articles peuvent être retournés gratuitement dans un délai de {{ settings().returnDays }} jours après
          la livraison, dans leur état d'origine.
        }
        Les modalités sont détaillées sur la page <a routerLink="/retours">Retours et remboursements</a>.
      </p>

      <h2>7. Garantie</h2>
      <p>
        Un article défectueux ou non conforme à la commande est échangé ou remboursé, sur signalement au service
        client.
      </p>

      <h2>8. Données personnelles</h2>
      <p>Voir la <a routerLink="/confidentialite">politique de confidentialité</a>.</p>

      <h2>9. Réclamations</h2>
      <p>
        Toute réclamation est à adresser au service client :
        @if (settings().contactEmail; as email) {
          <a [href]="'mailto:' + email">{{ email }}</a>.
        } @else {
          <a routerLink="/contact">Nous contacter</a>.
        }
        Nous recherchons en priorité une solution amiable.
      </p>
    </app-info-layout>
  `,
})
export default class TermsPage {
  protected readonly settings = inject(SettingsService).settings;
  protected readonly legal = LEGAL_INFO;

  protected readonly vatNote = computed(() =>
    this.settings().vatRate ? ` (TVA ${this.settings().vatRate} % incluse)` : '',
  );

  protected readonly paymentLabels = computed(() =>
    enabledPaymentMethods(this.settings())
      .map((method) => PAYMENT_METHOD_LABELS[method])
      .join(', '),
  );
}
