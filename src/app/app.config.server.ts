import { mergeApplicationConfig, ApplicationConfig, inject, Injectable } from '@angular/core';
import { FetchBackend, HttpBackend, HttpEvent, HttpRequest } from '@angular/common/http';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { Observable } from 'rxjs';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

/** Adresse de fshop-api (sans le préfixe /api), comme le proxy de server.ts. */
const apiUrl = (process.env['API_URL'] || 'http://localhost:8081').replace(/\/+$/, '');

/**
 * Pendant le rendu serveur, les URL relatives (/api/...) sont résolues sur le domaine
 * public du site : le serveur s'appellerait lui-même via Internet (lent, et bloquant
 * tant que le site n'est pas en ligne). On envoie donc ces appels directement à
 * fshop-api. La réécriture se fait au niveau du backend, après le cache de transfert :
 * le navigateur retrouve les réponses sous leur URL d'origine.
 */
@Injectable()
class ServerApiBackend implements HttpBackend {
  private readonly fetchBackend = inject(FetchBackend);

  handle(req: HttpRequest<unknown>): Observable<HttpEvent<unknown>> {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/api' || url.pathname.startsWith('/api/')) {
      req = req.clone({ url: apiUrl + url.pathname + url.search });
    }
    return this.fetchBackend.handle(req);
  }
}

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    ServerApiBackend,
    { provide: HttpBackend, useExisting: ServerApiBackend },
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
