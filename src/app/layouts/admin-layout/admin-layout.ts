import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { ThemeService } from '../../theme/theme.service';

interface AdminLink {
  path: string;
  label: string;
  icon: string;
}

/** Mise en page du back-office : barre latérale + contenu. */
@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.html',
})
export default class AdminLayout {
  private readonly auth = inject(AuthService);
  private readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);

  protected readonly user = this.auth.user;
  protected readonly theme = this.themeService.theme;
  protected readonly menuOpen = signal(false);

  protected readonly links: AdminLink[] = [
    { path: '/admin', label: 'Tableau de bord', icon: 'pi-chart-bar' },
    { path: '/admin/produits', label: 'Produits', icon: 'pi-tag' },
    { path: '/admin/categories', label: 'Catégories', icon: 'pi-th-large' },
    { path: '/admin/commandes', label: 'Commandes', icon: 'pi-shopping-bag' },
    { path: '/admin/parametres', label: 'Paramètres', icon: 'pi-cog' },
  ];

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected toggleTheme(): void {
    this.themeService.toggle();
  }

  protected logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }
}
