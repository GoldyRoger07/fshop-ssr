import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AnnouncementBar } from '../components/announcement-bar/announcement-bar';
import { Header } from '../components/header/header';
import { Footer } from '../components/footer/footer';

/** Mise en page de la boutique : bandeau, header, contenu, footer. */
@Component({
  selector: 'app-client-layout',
  imports: [RouterOutlet, AnnouncementBar, Header, Footer],
  template: `
    <app-announcement-bar />
    <app-header />

    <main>
      <router-outlet />
    </main>

    <app-footer />
  `,
})
export default class ClientLayout {}
