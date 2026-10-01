import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Container } from '../../../components/container/container';
import { INFO_GROUPS } from './info-pages';

/** Gabarit des pages d'information : fil d'Ariane, menu latéral, contenu projeté. */
@Component({
  selector: 'app-info-layout',
  imports: [RouterLink, RouterLinkActive, Container],
  template: `
    <my-container>
      <div class="py-8">
        <nav class="mb-4 text-xs text-gray-500" aria-label="Fil d'Ariane">
          <a routerLink="/" class="hover:underline">Accueil</a>
          <span class="mx-1.5">/</span>
          <span class="text-gray-700 dark:text-gray-300">{{ title() }}</span>
        </nav>

        <div class="grid gap-10 lg:grid-cols-[14rem_1fr]">
          <aside class="order-last lg:order-first">
            <nav class="space-y-6 lg:sticky lg:top-40" aria-label="Pages d'information">
              @for (group of groups; track group.title) {
                <div>
                  <h2 class="mb-2 text-xs font-bold tracking-wide text-gray-500 uppercase">{{ group.title }}</h2>
                  <ul class="space-y-1 text-sm">
                    @for (page of group.pages; track page.path) {
                      <li>
                        <a
                          [routerLink]="['/', page.path]"
                          routerLinkActive="font-semibold text-black dark:text-white"
                          ariaCurrentWhenActive="page"
                          class="text-gray-600 hover:text-black hover:underline dark:text-gray-400 dark:hover:text-white"
                        >
                          {{ page.label }}
                        </a>
                      </li>
                    }
                  </ul>
                </div>
              }
            </nav>
          </aside>

          <article class="info-prose min-w-0 max-w-3xl">
            <h1>{{ title() }}</h1>
            @if (intro(); as text) {
              <p class="info-lead">{{ text }}</p>
            }
            <ng-content />
          </article>
        </div>
      </div>
    </my-container>
  `,
})
export class InfoLayout {
  readonly title = input.required<string>();
  readonly intro = input<string>();

  protected readonly groups = INFO_GROUPS;
}
