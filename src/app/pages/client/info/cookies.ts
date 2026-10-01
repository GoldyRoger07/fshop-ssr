import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InfoLayout } from './info-layout';

/**
 * Cookies (/cookies). Reflète le code : aucun cookie, uniquement le localStorage.
 * À mettre à jour si une clé de stockage ou un outil de mesure d'audience est ajouté.
 */
@Component({
  selector: 'app-cookies-page',
  imports: [RouterLink, InfoLayout],
  template: `
    <app-info-layout
      title="Cookies"
      intro="Ni cookie publicitaire, ni outil de mesure d'audience : seulement le strict nécessaire."
    >
      <h2>Ce que le site enregistre sur votre appareil</h2>
      <p>
        Le site n'écrit pas de cookies. Il utilise le stockage local de votre navigateur (« localStorage »),
        uniquement pour son bon fonctionnement :
      </p>
      <table>
        <thead>
          <tr><th scope="col">Élément</th><th scope="col">Utilité</th><th scope="col">Conservation</th></tr>
        </thead>
        <tbody>
          @for (item of items; track item.key) {
            <tr>
              <td><code>{{ item.key }}</code></td>
              <td>{{ item.purpose }}</td>
              <td>{{ item.lifetime }}</td>
            </tr>
          }
        </tbody>
      </table>
      <p>
        Ces éléments sont strictement nécessaires aux services que vous demandez : ils ne nécessitent pas votre
        consentement et ne sont jamais partagés avec des tiers.
      </p>

      <h2>Les supprimer</h2>
      <p>
        Vous pouvez effacer ces données à tout moment depuis les réglages de votre navigateur (« Effacer les
        données de navigation » / « Données des sites »). Vous serez alors déconnecté et votre panier sera vidé.
      </p>

      <p>En savoir plus : <a routerLink="/confidentialite">politique de confidentialité</a>.</p>
    </app-info-layout>
  `,
})
export default class CookiesPage {
  protected readonly items = [
    { key: 'fshop.auth', purpose: 'Garder votre session ouverte après connexion.', lifetime: "Jusqu'à la déconnexion" },
    { key: 'fshop.cart', purpose: 'Conserver le contenu de votre panier.', lifetime: "Jusqu'à la commande ou au vidage du panier" },
    { key: 'fshop.lastShippingAddress', purpose: 'Préremplir votre dernière adresse de livraison.', lifetime: "Jusqu'à suppression par le navigateur" },
    { key: 'app-theme', purpose: 'Mémoriser le thème clair ou sombre choisi.', lifetime: "Jusqu'à suppression par le navigateur" },
  ];
}
