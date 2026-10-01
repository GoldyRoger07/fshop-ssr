/** Découpage administratif d'Haïti : départements et leurs communes (listes des formulaires d'adresse). */
export interface HaitiDepartment {
  name: string;
  communes: string[];
}

export const HAITI_DEPARTMENTS: HaitiDepartment[] = [
  {
    name: 'Artibonite',
    communes: [
      'Anse-Rouge', 'Dessalines', 'Desdunes', 'Ennery', 'Gonaïves', 'Grande-Saline', 'Gros-Morne', 'La Chapelle',
      "L'Estère", 'Liancourt', 'Marmelade', "Petite-Rivière-de-l'Artibonite", 'Saint-Marc',
      "Saint-Michel-de-l'Attalaye", 'Terre-Neuve', 'Verrettes',
    ],
  },
  {
    name: 'Centre',
    communes: [
      'Belladère', 'Boucan-Carré', 'Cerca-Carvajal', 'Cerca-la-Source', 'Hinche', 'Lascahobas', 'Maïssade',
      'Mirebalais', "Saut-d'Eau", 'Savanette', 'Thomassique', 'Thomonde',
    ],
  },
  {
    name: "Grand'Anse",
    communes: [
      'Abricots', "Anse-d'Hainault", 'Beaumont', 'Bonbon', 'Chambellan', 'Corail', 'Dame-Marie', 'Jérémie',
      'Les Irois', 'Marfranc', 'Moron', 'Pestel', 'Roseaux',
    ],
  },
  {
    name: 'Nippes',
    communes: [
      'Anse-à-Veau', 'Arnaud', 'Baradères', 'Fonds-des-Nègres', 'Grand-Boucan', "L'Asile", 'Miragoâne',
      'Paillant', 'Petit-Trou-de-Nippes', 'Petite-Rivière-de-Nippes', 'Plaisance-du-Sud',
    ],
  },
  {
    name: 'Nord',
    communes: [
      'Acul-du-Nord', 'Bahon', 'Bas-Limbé', 'Borgne', 'Cap-Haïtien', 'Dondon', 'Grande-Rivière-du-Nord',
      'La Victoire', 'Limbé', 'Limonade', 'Milot', 'Pignon', 'Pilate', 'Plaine-du-Nord', 'Plaisance',
      'Port-Margot', 'Quartier-Morin', 'Ranquitte', 'Saint-Raphaël',
    ],
  },
  {
    name: 'Nord-Est',
    communes: [
      'Capotille', 'Caracol', 'Carice', 'Ferrier', 'Fort-Liberté', 'Mombin-Crochu', 'Mont-Organisé', 'Ouanaminthe',
      'Perches', 'Sainte-Suzanne', 'Terrier-Rouge', 'Trou-du-Nord', 'Vallières',
    ],
  },
  {
    name: 'Nord-Ouest',
    communes: [
      'Anse-à-Foleur', 'Baie-de-Henne', 'Bassin-Bleu', 'Bombardopolis', 'Chansolme', 'Jean-Rabel', 'La Tortue',
      'Môle-Saint-Nicolas', 'Port-de-Paix', 'Saint-Louis-du-Nord',
    ],
  },
  {
    name: 'Ouest',
    communes: [
      'Anse-à-Galets', 'Arcahaie', 'Cabaret', 'Carrefour', 'Cité Soleil', 'Cornillon', 'Croix-des-Bouquets',
      'Delmas', 'Fonds-Verrettes', 'Ganthier', 'Grand-Goâve', 'Gressier', 'Kenscoff', 'Léogâne', 'Petit-Goâve',
      'Pétion-Ville', 'Pointe-à-Raquette', 'Port-au-Prince', 'Tabarre', 'Thomazeau',
    ],
  },
  {
    name: 'Sud',
    communes: [
      'Aquin', 'Arniquet', 'Camp-Perrin', 'Cavaillon', 'Chantal', 'Chardonnières', 'Côteaux', 'Île-à-Vache',
      'Les Anglais', 'Les Cayes', 'Maniche', 'Port-à-Piment', 'Port-Salut', 'Roche-à-Bateau',
      'Saint-Jean-du-Sud', 'Saint-Louis-du-Sud', 'Tiburon', 'Torbeck',
    ],
  },
  {
    name: 'Sud-Est',
    communes: [
      'Anse-à-Pitres', 'Bainet', 'Belle-Anse', 'Cayes-Jacmel', 'Côtes-de-Fer', 'Grand-Gosier', 'Jacmel',
      'La Vallée-de-Jacmel', 'Marigot', 'Thiotte',
    ],
  },
];

/** Pays de livraison proposés. */
export const SHIPPING_COUNTRIES = ['Haïti'];

export function communesOf(department: string | null | undefined): string[] {
  return HAITI_DEPARTMENTS.find((d) => d.name === department)?.communes ?? [];
}
