import { RenderMode, ServerRoute } from '@angular/ssr';

/** Pages liées au compte : rendu navigateur (la session vit dans le localStorage). */
const clientOnly = ['admin', 'admin/**', 'panier', 'commande', 'commandes', 'commandes/**'];

export const serverRoutes: ServerRoute[] = [
  ...clientOnly.map((path) => ({ path, renderMode: RenderMode.Client }) as ServerRoute),
  {
    // Boutique : rendu serveur à chaque requête (SEO + affichage rapide), puis
    // hydratation. Swiper n'est chargé qu'après l'hydratation (voir App).
    path: '**',
    renderMode: RenderMode.Server,
  },
];
