import { Category } from '../models/category.model';
import { Product, ProductTag } from '../models/product.model';

/**
 * Données de démonstration, en attendant une vraie API.
 * Les images produits réutilisent les visuels des catégories.
 */

const categoryImage = (slug: string) => `/img/categories/${slug}.avif`;

export const CATEGORIES: Category[] = [
  { slug: 'women', name: 'Femme' },
  { slug: 'curve', name: 'Grandes tailles' },
  { slug: 'dresses', name: 'Robes' },
  { slug: 'tops', name: 'Hauts' },
  { slug: 'tricots', name: 'Tricots' },
  { slug: 'beachwear', name: 'Maillots de bain' },
  { slug: 'underwear-sleepwear', name: 'Lingerie & pyjamas' },
  { slug: 'men', name: 'Mode homme' },
  { slug: 'homme', name: 'Homme' },
  { slug: 'kids', name: 'Mode enfant' },
  { slug: 'enfant', name: 'Enfant' },
  { slug: 'baby-maternity', name: 'Bébé & maternité' },
  { slug: 'shoes', name: 'Chaussures' },
  { slug: 'jewelry-accessories', name: 'Bijoux & accessoires' },
  { slug: 'beauty-health', name: 'Beauté & santé' },
  { slug: 'home-living', name: 'Maison & déco' },
  { slug: 'linge-maison', name: 'Linge de maison' },
  { slug: 'electromenager', name: 'Électroménager' },
  { slug: 'cell-phones-accessories', name: 'Téléphonie' },
  { slug: 'accs-telephone', name: 'Accessoires téléphone' },
  { slug: 'sports-outdoor', name: 'Tenues de sport' },
  { slug: 'sports-exterieur', name: 'Sports & plein air' },
  { slug: 'toys-games', name: 'Jeux & loisirs' },
  { slug: 'jouets-jeux', name: 'Jouets' },
  { slug: 'papeterie-bureau', name: 'Papeterie & bureau' },
  { slug: 'outils-bricolage', name: 'Outils & bricolage' },
  { slug: 'automobile', name: 'Auto & moto' },
  { slug: 'animaux-de-compagnie', name: 'Animaux' },
  { slug: 'mariage-evenement', name: 'Mariage & événements' },
  { slug: 'personnalisation', name: 'Personnalisation' },
].map((c) => ({ ...c, image: categoryImage(c.slug) }));

/** [titre, catégorie, prix, prix d'origine ?, étiquette ?] */
type ProductSeed = [string, string, number, number?, ProductTag?];

const PRODUCT_SEEDS: ProductSeed[] = [
  ['Robe midi fleurie à col en V et manches bouffantes', 'dresses', 14.99, 29.99, 'trending'],
  ['Top côtelé col carré à bretelles fines', 'tops', 5.49, 9.99, 'bestseller'],
  ['Pull en maille torsadée coupe ample', 'tricots', 17.99, 32.0],
  ['Maillot de bain une pièce à découpe', 'beachwear', 11.99, 24.99, 'new'],
  ['Ensemble pyjama satiné chemise et short', 'underwear-sleepwear', 12.49],
  ['Chemise oversize en lin pour homme', 'men', 16.99, 27.99],
  ['Sweat à capuche basique en molleton', 'homme', 19.99, 34.99, 'bestseller'],
  ['Robe à volants imprimé cœur pour fille', 'kids', 9.99, 18.99, 'new'],
  ['Baskets plateforme en similicuir', 'shoes', 24.99, 45.99, 'trending'],
  ['Collier superposé plaqué or avec pendentif', 'jewelry-accessories', 3.99, 8.49],
  ['Palette fards à paupières 18 teintes nude', 'beauty-health', 7.99, 12.99],
  ['Coussin décoratif en velours côtelé', 'home-living', 6.49],
  ['Parure de lit en coton lavé 3 pièces', 'linge-maison', 29.99, 54.99, 'bestseller'],
  ['Mini blender portable rechargeable USB', 'electromenager', 15.99, 31.99, 'trending'],
  ['Coque transparente antichoc avec cordon', 'accs-telephone', 2.99, 6.99],
  ['Écouteurs sans fil Bluetooth 5.3', 'cell-phones-accessories', 13.99, 29.99, 'new'],
  ['Legging de sport taille haute sans couture', 'sports-outdoor', 10.99, 19.99, 'bestseller'],
  ['Gourde isotherme en acier inoxydable 750 ml', 'sports-exterieur', 8.99],
  ['Jeu de construction en blocs 520 pièces', 'toys-games', 18.99, 26.99],
  ['Peluche lapin douce 30 cm', 'jouets-jeux', 7.49, 12.99, 'new'],
  ['Carnet A5 couverture rigide pointillé', 'papeterie-bureau', 3.49],
  ['Set de 24 embouts de vissage avec étui', 'outils-bricolage', 9.99, 16.99],
  ['Organisateur de siège arrière pour voiture', 'automobile', 11.49, 19.99],
  ['Lit pour chat en peluche anti-stress', 'animaux-de-compagnie', 14.49, 25.99, 'trending'],
  ['Robe longue de soirée en satin drapé', 'mariage-evenement', 34.99, 59.99],
  ['Mug personnalisé avec prénom', 'personnalisation', 8.99],
  ['Jean mom taille haute délavé', 'curve', 21.99, 36.99, 'bestseller'],
  ['Body bébé en coton bio lot de 3', 'baby-maternity', 12.99, 19.99],
  ['T-shirt imprimé graphique col rond', 'enfant', 4.99, 8.99],
  ['Cardigan court boutonné en maille fine', 'women', 13.49, 23.99, 'new'],
  ['Robe chemise ceinturée à manches longues', 'dresses', 18.99, 33.99],
  ['Débardeur crop à col montant', 'tops', 4.49],
  ['Bikini triangle à nouer imprimé tropical', 'beachwear', 9.49, 17.99, 'trending'],
  ['Mocassins en daim à pampilles', 'shoes', 27.99, 49.99],
  ['Boucles d’oreilles créoles en acier', 'jewelry-accessories', 2.49, 5.99, 'bestseller'],
  ['Sérum visage à l’acide hyaluronique', 'beauty-health', 9.99, 15.99, 'new'],
  ['Guirlande lumineuse LED 5 m à piles', 'home-living', 5.99, 11.99],
  ['Polo en piqué de coton coupe ajustée', 'men', 12.99],
  ['Pull de Noël à motif renne', 'tricots', 15.99, 28.99, 'trending'],
  ['Short de bain à séchage rapide', 'homme', 10.49, 18.99],
];

export const PRODUCTS: Product[] = PRODUCT_SEEDS.map(
  ([title, categorySlug, price, originalPrice, tag], index) => ({
    id: index + 1,
    title,
    categorySlug,
    image: categoryImage(categorySlug),
    price,
    originalPrice,
    tag,
    // Valeurs pseudo-aléatoires mais stables (identiques côté serveur et navigateur)
    rating: 4 + ((index * 7) % 10) / 10,
    reviewCount: 40 + ((index * 137) % 2900),
    soldCount: 100 + ((index * 389) % 9800),
  }),
);
