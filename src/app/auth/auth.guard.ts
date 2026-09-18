import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/** Réserve une page aux utilisateurs connectés (panier validé, commandes…). */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return (
    auth.isLoggedIn() || router.createUrlTree(['/connexion'], { queryParams: { redirect: state.url } })
  );
};
