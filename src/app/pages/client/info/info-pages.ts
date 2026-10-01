import { Type } from '@angular/core';
import { Route } from '@angular/router';

export interface InfoPage {
  /** Segment d'URL (/aide/livraison → 'aide/livraison'). */
  path: string;
  label: string;
  load: () => Promise<{ default: Type<unknown> }>;
}

export interface InfoGroup {
  title: string;
  pages: InfoPage[];
}

/**
 * Pages de contenu (footer + menu latéral des pages d'information).
 * Source unique : les routes et les liens du footer en sont dérivés.
 */
export const INFO_GROUPS: InfoGroup[] = [
  {
    title: 'Informations',
    pages: [
      { path: 'a-propos', label: 'À propos de Fshop', load: () => import('./about') },
      { path: 'carrieres', label: 'Carrières', load: () => import('./careers') },
      { path: 'responsabilite-sociale', label: 'Responsabilité sociale', load: () => import('./social-responsibility') },
      { path: 'presse', label: 'Espace presse', load: () => import('./press') },
    ],
  },
  {
    title: 'Aide & support',
    pages: [
      { path: 'livraison', label: 'Livraison', load: () => import('./shipping') },
      { path: 'retours', label: 'Retours et remboursements', load: () => import('./returns') },
      { path: 'suivi-commande', label: 'Suivi de commande', load: () => import('./order-tracking') },
      { path: 'guide-des-tailles', label: 'Guide des tailles', load: () => import('./size-guide') },
    ],
  },
  {
    title: 'Service client',
    pages: [
      { path: 'contact', label: 'Nous contacter', load: () => import('./contact') },
      { path: 'moyens-de-paiement', label: 'Moyens de paiement', load: () => import('./payment-methods') },
      { path: 'fidelite', label: 'Programme fidélité', load: () => import('./loyalty') },
      { path: 'faq', label: 'FAQ', load: () => import('./faq') },
    ],
  },
  {
    title: 'Informations légales',
    pages: [
      { path: 'confidentialite', label: 'Confidentialité', load: () => import('./privacy') },
      { path: 'cgv', label: 'CGV', load: () => import('./terms') },
      { path: 'cookies', label: 'Cookies', load: () => import('./cookies') },
      { path: 'mentions-legales', label: 'Mentions légales', load: () => import('./legal-notice') },
    ],
  },
];

export const INFO_ROUTES: Route[] = INFO_GROUPS.flatMap((group) =>
  group.pages.map((page) => ({ path: page.path, title: `${page.label} – Fshop`, loadComponent: page.load })),
);
