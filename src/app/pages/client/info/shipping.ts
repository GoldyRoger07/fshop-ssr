import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SettingsService } from '../../../services/settings.service';
import { MoneyPipe } from '../../../shared/money';
import { InfoLayout } from './info-layout';

/** Livraison (/livraison) : tarifs tirés des paramètres de la boutique. */
@Component({
  selector: 'app-shipping-page',
  imports: [RouterLink, MoneyPipe, InfoLayout],
  template: `
    <app-info-layout title="Livraison" intro="Tarifs, conditions et étapes de l'expédition de votre commande.">
      <h2>Frais de livraison</h2>
      <table>
        <tbody>
          <tr>
            <th scope="row">Livraison standard</th>
            <td>{{ settings().shippingCost ? (settings().shippingCost | money) : 'Offerte' }}</td>
          </tr>
          @if (settings().freeShippingEnabled && settings().shippingCost) {
            <tr>
              <th scope="row">Livraison offerte</th>
              <td>dès {{ settings().freeShippingThreshold | money }} d'achat</td>
            </tr>
          }
          @if (settings().cashOnDeliveryEnabled && settings().cashOnDeliveryFee) {
            <tr>
              <th scope="row">Supplément paiement à la livraison</th>
              <td>{{ settings().cashOnDeliveryFee | money }}</td>
            </tr>
          }
          @if (settings().minOrderAmount) {
            <tr>
              <th scope="row">Montant minimum de commande</th>
              <td>{{ settings().minOrderAmount | money }}</td>
            </tr>
          }
        </tbody>
      </table>
      <p>Le montant exact des frais est toujours affiché dans votre panier avant validation.</p>

      <h2>Quand ma commande est-elle expédiée ?</h2>
      <ul>
        <li>
          <strong>Mobile money (MonCash, NatCash)</strong> : la commande est préparée dès que votre paiement est
          vérifié.
          @if (settings().paymentDelayDays > 0) {
            Sans paiement sous {{ settings().paymentDelayDays }} jour(s), elle est annulée automatiquement.
          }
        </li>
        <li>
          <strong>Paiement à la livraison</strong> : la commande peut être expédiée sans attendre ; vous réglez
          à la réception.
        </li>
      </ul>

      <h2>Adresse de livraison</h2>
      <p>
        Indiquez une adresse complète et un numéro de téléphone joignable : le livreur peut vous appeler pour
        convenir de la remise du colis. Vous saisissez ces informations à l'étape « Livraison » de la commande.
      </p>

      <h2>Suivre ma commande</h2>
      <p>
        Chaque étape (paiement, expédition, livraison) apparaît dans
        <a routerLink="/commandes">Mes commandes</a>. Voir aussi <a routerLink="/suivi-commande">Suivi de commande</a>.
      </p>
    </app-info-layout>
  `,
})
export default class ShippingPage {
  protected readonly settings = inject(SettingsService).settings;
}
