import { Component } from '@angular/core';

/** Bandeau noir d'avantages en haut du site. */
@Component({
  selector: 'app-announcement-bar',
  template: `
    <div class="bg-black text-white">
      <ul
        class="mx-auto flex max-w-6xl items-center justify-center gap-8 px-4 py-2 text-xs font-medium tracking-wide sm:justify-between"
      >
        @for (message of messages; track message.text; let first = $first) {
          <li class="items-center gap-2" [class]="first ? 'flex' : 'hidden sm:flex'">
            <i [class]="'pi ' + message.icon" style="font-size: 0.75rem"></i>
            {{ message.text }}
          </li>
        }
      </ul>
    </div>
  `,
})
export class AnnouncementBar {
  protected readonly messages = [
    { icon: 'pi-truck', text: 'Livraison gratuite dès 29 €' },
    { icon: 'pi-replay', text: 'Retours gratuits sous 30 jours' },
    { icon: 'pi-gift', text: '-15 % sur votre 1re commande avec FSHOP15' },
  ];
}
