export interface Category {
  id?: number;
  slug: string;
  name: string;
  /** Chemin public de l'image (ex. « /img/categories/robes.avif »). */
  image: string;
}
