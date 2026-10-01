import { Component } from '@angular/core';
import { InfoLayout } from './info-layout';

interface SizeTable {
  title: string;
  headers: string[];
  rows: string[][];
}

/** Guide des tailles (/guide-des-tailles) : correspondances usuelles, en centimètres. */
@Component({
  selector: 'app-size-guide-page',
  imports: [InfoLayout],
  template: `
    <app-info-layout title="Guide des tailles" intro="Trouvez la bonne taille avant de commander.">
      <h2>Comment prendre vos mesures</h2>
      <ul>
        <li><strong>Poitrine</strong> : à l'endroit le plus fort, mètre ruban à l'horizontale.</li>
        <li><strong>Taille</strong> : au creux de la taille, sans serrer.</li>
        <li><strong>Hanches</strong> : à l'endroit le plus large.</li>
        <li><strong>Pied</strong> : du talon au bout du plus long orteil, debout.</li>
      </ul>
      <div class="info-note">
        Correspondances indicatives. Quand une fiche produit précise ses propres mesures, elles priment sur ce
        guide. Entre deux tailles, prenez la plus grande.
      </div>

      @for (table of tables; track table.title) {
        <h2>{{ table.title }}</h2>
        <div class="overflow-x-auto">
          <table>
            <thead>
              <tr>
                @for (header of table.headers; track header) {
                  <th scope="col">{{ header }}</th>
                }
              </tr>
            </thead>
            <tbody>
              @for (row of table.rows; track row[0]) {
                <tr>
                  @for (cell of row; track $index) {
                    <td>{{ cell }}</td>
                  }
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </app-info-layout>
  `,
})
export default class SizeGuidePage {
  protected readonly tables: SizeTable[] = [
    {
      title: 'Femme',
      headers: ['Taille', 'FR', 'US', 'Poitrine (cm)', 'Taille (cm)', 'Hanches (cm)'],
      rows: [
        ['XS', '34', '2', '80-84', '62-66', '88-92'],
        ['S', '36', '4', '84-88', '66-70', '92-96'],
        ['M', '38', '6', '88-92', '70-74', '96-100'],
        ['L', '40', '8', '92-96', '74-78', '100-104'],
        ['XL', '42', '10', '96-102', '78-84', '104-110'],
        ['XXL', '44', '12', '102-108', '84-90', '110-116'],
      ],
    },
    {
      title: 'Grandes tailles',
      headers: ['Taille', 'FR', 'US', 'Poitrine (cm)', 'Taille (cm)', 'Hanches (cm)'],
      rows: [
        ['0XL', '46', '14', '108-114', '90-96', '116-122'],
        ['1XL', '48', '16', '114-120', '96-102', '122-128'],
        ['2XL', '50', '18', '120-126', '102-108', '128-134'],
        ['3XL', '52', '20', '126-132', '108-114', '134-140'],
        ['4XL', '54', '22', '132-138', '114-120', '140-146'],
      ],
    },
    {
      title: 'Homme',
      headers: ['Taille', 'FR', 'Poitrine (cm)', 'Tour de taille (cm)', 'Hanches (cm)'],
      rows: [
        ['S', '44-46', '88-94', '76-82', '90-96'],
        ['M', '48-50', '94-100', '82-88', '96-102'],
        ['L', '52', '100-106', '88-94', '102-108'],
        ['XL', '54', '106-112', '94-100', '108-114'],
        ['XXL', '56', '112-118', '100-106', '114-120'],
        ['3XL', '58', '118-124', '106-112', '120-126'],
      ],
    },
    {
      title: 'Enfant',
      headers: ['Âge', 'Taille (cm)', 'Poitrine (cm)', 'Tour de taille (cm)'],
      rows: [
        ['2 ans', '86-92', '52-53', '50-51'],
        ['4 ans', '98-104', '54-56', '52-53'],
        ['6 ans', '110-116', '58-60', '54-55'],
        ['8 ans', '122-128', '62-64', '56-58'],
        ['10 ans', '134-140', '66-69', '59-61'],
        ['12 ans', '146-152', '71-75', '62-64'],
      ],
    },
    {
      title: 'Chaussures',
      headers: ['EU', 'US femme', 'US homme', 'Longueur du pied (cm)'],
      rows: [
        ['36', '5.5', '—', '22,5'],
        ['37', '6.5', '—', '23,5'],
        ['38', '7.5', '6', '24'],
        ['39', '8.5', '6.5', '25'],
        ['40', '9', '7.5', '25,5'],
        ['41', '10', '8', '26'],
        ['42', '10.5', '9', '27'],
        ['43', '—', '10', '27,5'],
        ['44', '—', '10.5', '28,5'],
        ['45', '—', '11.5', '29'],
      ],
    },
  ];
}
