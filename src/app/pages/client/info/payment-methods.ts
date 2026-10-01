import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SettingsService } from '../../../services/settings.service';
import {
  enabledPaymentMethods,
  PAYMENT_METHOD_BADGES,
  PAYMENT_METHOD_LABELS,
} from '../../../models/payment.model';
import { MoneyPipe } from '../../../shared/money';
import { InfoLayout } from './info-layout';

/** Moyens de paiement (/moyens-de-paiement) : uniquement ceux activés dans les paramètres. */
@Component({
  selector: 'app-payment-methods-page',
  imports: [RouterLink, MoneyPipe, InfoLayout],
  template: `
    <app-info-layout title="Moyens de paiement" intro="Payez comme vous en avez l'habitude, en toute simplicité.">
      @if (!methods().length) {
        <div class="info-note">Aucun moyen de paiement n'est disponible pour le moment.</div>
      }

      @for (method of methods(); track method) {
        <h2 class="flex items-center gap-2">
          <span class="rounded px-1.5 py-0.5 text-xs font-bold" [class]="badges[method].classes">
            {{ badges[method].text }}
          </span>
          {{ labels[method] }}
        </h2>
        @if (method === 'CASH_ON_DELIVERY') {
          <p>
            Vous réglez en espèces au livreur, à la réception du colis.
            @if (settings().cashOnDeliveryFee) {
              Un supplément de <strong>{{ settings().cashOnDeliveryFee | money }}</strong> s'applique.
            }
          </p>
        } @else {
          <ol>
            <li>Validez votre commande en choisissant {{ labels[method] }}.</li>
            <li>
              Envoyez le montant exact au numéro de la boutique affiché sur la page de votre commande, en vérifiant
              le nom du bénéficiaire avant de confirmer.
            </li>
            <li>Saisissez l'<strong>identifiant de transaction</strong> reçu par SMS sur la page de la commande.</li>
            <li>Nous vérifions le paiement et votre commande passe au statut « Payée ».</li>
          </ol>
        }
      }

      @if (hasWallet() && settings().paymentDelayDays > 0) {
        <div class="info-note">
          Paiement mobile : vos articles sont réservés {{ settings().paymentDelayDays }} jour(s). Passé ce délai
          sans paiement, la commande est annulée automatiquement.
        </div>
      }

      <h2>Prix et taxes</h2>
      <p>
        Les prix sont affichés toutes taxes comprises{{
          settings().vatRate ? ' (TVA ' + settings().vatRate + ' % incluse)' : ''
        }}. Le total à payer, frais de livraison compris, est rappelé avant la validation de la commande.
      </p>

      <h2>Sécurité</h2>
      <p>
        Nous ne vous demanderons jamais votre code PIN MonCash ou NatCash. En cas de doute sur un message reçu,
        <a routerLink="/contact">contactez-nous</a>.
      </p>
    </app-info-layout>
  `,
})
export default class PaymentMethodsPage {
  protected readonly settings = inject(SettingsService).settings;
  protected readonly labels = PAYMENT_METHOD_LABELS;
  protected readonly badges = PAYMENT_METHOD_BADGES;

  protected readonly methods = computed(() => enabledPaymentMethods(this.settings()));
  protected readonly hasWallet = computed(() => this.methods().some((method) => method !== 'CASH_ON_DELIVERY'));
}
