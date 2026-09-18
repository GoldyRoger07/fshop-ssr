/**
 * Préfixe des appels à l'API Spring (fshop-api).
 *
 * URL relative : dans le navigateur, `/api` est relayé vers l'API par le proxy
 * du serveur de dev (proxy.conf.json) ou par le serveur Express (server.ts).
 * Pendant le rendu serveur, Angular la résout par rapport à l'URL de la page.
 */
export const API_URL = '/api';
