import { HttpErrorResponse } from '@angular/common/http';

/** Message lisible à partir d'une erreur ProblemDetail (RFC 9457) de l'API. */
export function errorMessage(err: unknown): string {
  if (err instanceof HttpErrorResponse) {
    if (err.status === 0 || err.status >= 502) {
      return 'Le serveur est injoignable, réessayez dans un instant.';
    }
    if (err.status === 403) {
      return "Vous n'avez pas les droits pour cette action.";
    }
    const problem = err.error as { detail?: string; errors?: Record<string, string> } | null;
    const fieldErrors = problem?.errors ? Object.values(problem.errors).join(', ') : '';
    if (problem?.detail) {
      return fieldErrors ? `${problem.detail} : ${fieldErrors}` : problem.detail;
    }
    if (fieldErrors) {
      return fieldErrors;
    }
  }
  return 'Une erreur est survenue, réessayez.';
}
