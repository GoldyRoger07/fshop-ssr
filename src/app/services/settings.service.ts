import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { DEFAULT_SETTINGS, StoreSettings } from '../models/settings.model';
import { API_URL } from './api';

/**
 * Paramètres de la boutique, chargés au démarrage (voir app.config.ts). Pendant
 * le rendu serveur, la réponse est transmise au navigateur : pas de double requête.
 */
@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly http = inject(HttpClient);
  private readonly state = signal<StoreSettings>(DEFAULT_SETTINGS);

  readonly settings = this.state.asReadonly();

  /** Charge les paramètres ; en cas d'erreur, les valeurs par défaut restent en place. */
  load(): Observable<void> {
    return this.http.get<StoreSettings>(`${API_URL}/settings`).pipe(
      tap((settings) => this.state.set(settings)),
      map(() => undefined),
      catchError(() => of(undefined)),
    );
  }

  /** Après un enregistrement dans le back-office : la boutique suit sans recharger. */
  set(settings: StoreSettings): void {
    this.state.set(settings);
  }
}
