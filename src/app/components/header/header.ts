import { Component, HostListener, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../theme/theme.service';
import { AuthService } from '../../auth/auth.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { Button } from '../button/button';
import { SearchBar } from '../search-bar/search-bar';

interface NavItem {
  label: string;
  /** Route Angular (tableau de segments). */
  link: string[];
  queryParams?: Record<string, string>;
  /** Mise en avant (couleur promo). */
  highlight?: boolean;
}

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, Button, SearchBar],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private readonly themeService = inject(ThemeService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly user = this.auth.user;
  protected readonly isAdmin = this.auth.isAdmin;

  protected readonly cartCount = inject(CartService).count;
  protected readonly wishlistCount = inject(WishlistService).count;

  protected readonly theme = this.themeService.theme;
  protected readonly menuOpen = signal(false);

  /** Vrai quand le header doit être masqué (scroll vers le bas). */
  protected readonly hidden = signal(false);
  private lastScrollY = 0;

  protected readonly navItems: NavItem[] = [
    { label: 'Nouveautés', link: ['/produits'], queryParams: { tag: 'new' } },
    { label: 'Promos', link: ['/promos'], highlight: true },
    { label: 'Femme', link: ['/categorie', 'women'] },
    { label: 'Grandes tailles', link: ['/categorie', 'curve'] },
    { label: 'Homme', link: ['/categorie', 'men'] },
    { label: 'Enfant', link: ['/categorie', 'kids'] },
    { label: 'Chaussures', link: ['/categorie', 'shoes'] },
    { label: 'Bijoux & accessoires', link: ['/categorie', 'jewelry-accessories'] },
    { label: 'Beauté', link: ['/categorie', 'beauty-health'] },
    { label: 'Maison', link: ['/categorie', 'home-living'] },
    { label: 'Lingerie', link: ['/categorie', 'underwear-sleepwear'] },
    { label: 'Sport', link: ['/categorie', 'sports-outdoor'] },
    { label: 'Électronique', link: ['/categorie', 'cell-phones-accessories'] },
    { label: 'Jouets', link: ['/categorie', 'toys-games'] },
  ];

  @HostListener('window:scroll')
  protected onScroll(): void {
    if (!this.isBrowser) {
      return;
    }
    const current = window.scrollY;

    // On garde le header visible tant que le menu mobile est ouvert.
    if (this.menuOpen()) {
      this.lastScrollY = current;
      return;
    }

    // Masque au scroll vers le bas (au-delà d'un petit seuil), réaffiche
    // dès qu'on remonte.
    if (current > this.lastScrollY && current > 160) {
      this.hidden.set(true);
    } else if (current < this.lastScrollY) {
      this.hidden.set(false);
    }

    this.lastScrollY = current;
  }

  protected search(query: string): void {
    this.closeMenu();
    this.router.navigate(['/produits'], { queryParams: { q: query, page: 0 } });
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected logout(): void {
    this.auth.logout();
    this.closeMenu();
    this.router.navigateByUrl('/');
  }

  protected toggleTheme(): void {
    this.themeService.toggle();
  }
}
