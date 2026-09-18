import { ApplicationConfig, DEFAULT_CURRENCY_CODE, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import localeFr from '@angular/common/locales/fr';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { AppPreset } from './theme/app-preset';
import { authInterceptor } from './auth/auth.interceptor';

// Formats français (prix « 12,99 € », dates…), côté serveur comme navigateur.
registerLocaleData(localeFr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding(), withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    provideClientHydration(withEventReplay()),
    // Appels à fshop-api. Les GET faits pendant le rendu serveur sont transmis au
    // navigateur (cache de transfert de l'hydratation) : pas de double requête.
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' },
    providePrimeNG({
      theme: {
        preset: AppPreset,
        options: {
          // Le mode sombre s'active via la classe .app-dark sur <html>.
          // Absence de la classe = mode clair (thème par défaut).
          darkModeSelector: '.app-dark',
          // Compatibilité avec Tailwind CSS v4 : styles PrimeNG dans un layer
          // dédié, en dessous des utilitaires Tailwind.
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng, utilities',
          },
        },
      },
    }),
  ]
};
