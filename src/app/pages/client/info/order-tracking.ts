import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ORDER_STATUS_LABELS, OrderStatus } from '../../../models/order.model';
import { InfoLayout } from './info-layout';

/** Suivi de commande (/suivi-commande) : explication des statuts + accès à l'espace client. */
@Component({
  selector: 'app-order-tracking-page',
  imports: [RouterLink, InfoLayout],
  template: `
    <app-info-layout title="Suivi de commande" intro="Suivez chaque étape de votre commande depuis votre compte.">
      <p>
        <a routerLink="/commandes" class="shop-btn"><i class="pi pi-box"></i> Voir mes commandes</a>
      </p>
      <p>Connectez-vous avec le compte utilisé pour commander : la liste de vos commandes et leur statut s'affichent.</p>

      <h2>Que signifie le statut de ma commande ?</h2>
      <table>
        <tbody>
          @for (step of steps; track step.status) {
            <tr>
              <th scope="row" class="whitespace-nowrap">{{ labels[step.status] }}</th>
              <td>{{ step.text }}</td>
            </tr>
          }
        </tbody>
      </table>

      <h2>Un problème ?</h2>
      <p>
        Commande introuvable, paiement signalé comme non reçu, colis en retard : <a routerLink="/contact">contactez-nous</a>
        avec la référence de votre commande.
      </p>
    </app-info-layout>
  `,
})
export default class OrderTrackingPage {
  protected readonly labels = ORDER_STATUS_LABELS;

  protected readonly steps: { status: OrderStatus; text: string }[] = [
    { status: 'PENDING', text: 'Commande enregistrée. Paiement mobile : en attente de votre paiement ou de sa vérification.' },
    { status: 'PAID', text: 'Paiement confirmé : votre commande est en préparation.' },
    { status: 'SHIPPED', text: 'Votre colis est en route.' },
    { status: 'DELIVERED', text: 'Colis remis. Bonne découverte !' },
    { status: 'CANCELLED', text: 'Commande annulée (par vous, par la boutique, ou faute de paiement dans le délai).' },
  ];
}
