import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/** Adresse de fshop-api (sans le préfixe /api). */
const apiUrl = (process.env['API_URL'] || 'http://localhost:8081').replace(/\/+$/, '');

/** En-têtes propres à chaque connexion, à ne pas relayer. */
const hopByHopHeaders = new Set([
  'connection',
  'keep-alive',
  'transfer-encoding',
  'upgrade',
  'host',
  'content-length',
  'content-encoding',
  'accept-encoding',
]);

/** Health check de l'hébergeur : répond sans rendu Angular ni appel à l'API. */
app.get('/healthz', (_req, res) => {
  res.type('text/plain').send('ok');
});

/**
 * Relaie /api/** vers fshop-api : le navigateur (et le rendu serveur) appellent
 * la même origine que le site, sans configuration CORS.
 */
app.use('/api', async (req, res, next) => {
  try {
    const headers = new Headers();
    for (const [name, value] of Object.entries(req.headers)) {
      if (value !== undefined && !hopByHopHeaders.has(name)) {
        headers.set(name, Array.isArray(value) ? value.join(', ') : value);
      }
    }

    const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
    const response = await fetch(apiUrl + req.originalUrl, {
      method: req.method,
      headers,
      body: hasBody ? (req as unknown as ReadableStream) : undefined,
      duplex: hasBody ? 'half' : undefined,
      redirect: 'manual',
    } as RequestInit);

    res.status(response.status);
    response.headers.forEach((value, name) => {
      if (!hopByHopHeaders.has(name)) {
        res.setHeader(name, value);
      }
    });
    res.send(Buffer.from(await response.arrayBuffer()));
  } catch (error) {
    console.error(`Proxy API : ${req.method} ${req.originalUrl} a échoué`, error);
    if (res.headersSent) {
      next(error);
    } else {
      res.status(502).type('application/problem+json').send({
        title: 'Bad Gateway',
        status: 502,
        detail: 'API FShop injoignable',
      });
    }
  }
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  // Le rendu serveur rejette tout domaine absent de cette liste (en plus de
  // « localhost », déclaré dans angular.json) : on refuse de démarrer sans elle.
  if (!process.env['NG_ALLOWED_HOSTS']?.trim()) {
    console.error(
      'NG_ALLOWED_HOSTS manquant : indiquez le(s) domaine(s) du site, ex. NG_ALLOWED_HOSTS=fshop.fr,www.fshop.fr',
    );
    process.exit(1);
  }

  // Une API_URL invalide (sans « https:// », avec /api…) ferait échouer chaque appel
  // en 502 : on l'affiche au démarrage et on refuse une URL mal formée.
  if (!/^https?:\/\/[^/]+$/.test(apiUrl)) {
    console.error(
      `API_URL invalide (« ${apiUrl} ») : indiquez l'adresse de fshop-api sans /api, ex. API_URL=https://fshop-api.example.com`,
    );
    process.exit(1);
  }
  console.log(`API FShop : ${apiUrl}`);

  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
