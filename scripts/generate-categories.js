/**
 * Génère une liste de catégories (slug, nom, image) à partir des images de
 * public/img/categories, à coller dans src/app/data/catalog.data.ts.
 *
 * Usage : node scripts/generate-categories.js
 */
const fs = require('fs');
const path = require('path');

const targetDirectory = path.join(__dirname, '..', 'public', 'img', 'categories');
const outputFile = path.join(__dirname, 'categories.output.json');

function capitaliserMots(texte) {
  // Met en majuscule la première lettre de chaque mot
  return texte.toLowerCase().replace(/\b\w/g, (lettre) => lettre.toUpperCase());
}

function generateCategories(dirPath) {
  try {
    const result = fs
      .readdirSync(dirPath)
      .filter((file) => file.endsWith('.avif'))
      .map((file) => {
        const slug = file.replace('.avif', '');
        return {
          slug,
          name: capitaliserMots(slug.replaceAll('-', ' ')),
          // Chemin public (servi depuis la racine du site), toujours avec des « / »
          image: `/img/categories/${file}`,
        };
      });

    fs.writeFileSync(outputFile, JSON.stringify(result, null, 2), 'utf-8');
    console.log(`Succès ! ${result.length} catégories écrites dans ${outputFile}.`);
  } catch (error) {
    console.error('Une erreur est survenue :', error.message);
  }
}

generateCategories(targetDirectory);
