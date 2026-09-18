import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Réserve les routes /admin aux comptes ADMIN.
 * Visiteur : renvoyé vers la connexion (avec l'URL de retour).
 * Client connecté sans le rôle : renvoyé vers l'accueil.
 */
export const adminGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAdmin()) {
    return true;
  }

  return auth.isLoggedIn()
    ? router.createUrlTree(['/'])
    : router.createUrlTree(['/connexion'], { queryParams: { redirect: state.url } });
};
