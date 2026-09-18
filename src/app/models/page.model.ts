/** Page de résultats renvoyée par l'API (PageResponse côté Spring). */
export interface Page<T> {
  content: T[];
  /** Numéro de page, à partir de 0. */
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
