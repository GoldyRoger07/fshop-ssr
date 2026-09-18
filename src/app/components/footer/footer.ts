import { Component, signal } from '@angular/core';
import { Container } from '../container/container';

interface FooterColumn {
  title: string;
  links: string[];
}

@Component({
  selector: 'app-footer',
  imports: [Container],
  templateUrl: './footer.html',
})
export class Footer {
  protected readonly year = new Date().getFullYear();
  protected readonly subscribed = signal(false);

  protected readonly columns: FooterColumn[] = [
    {
      title: 'Informations',
      links: ['À propos de Fshop', 'Carrières', 'Responsabilité sociale', 'Espace presse'],
    },
    {
      title: 'Aide & support',
      links: ['Livraison', 'Retours et remboursements', 'Suivi de commande', 'Guide des tailles'],
    },
    {
      title: 'Service client',
      links: ['Nous contacter', 'Moyens de paiement', 'Programme fidélité', 'FAQ'],
    },
  ];

  protected readonly socials = [
    { icon: 'pi-facebook', label: 'Facebook' },
    { icon: 'pi-instagram', label: 'Instagram' },
    { icon: 'pi-tiktok', label: 'TikTok' },
    { icon: 'pi-youtube', label: 'YouTube' },
    { icon: 'pi-pinterest', label: 'Pinterest' },
  ];

  protected readonly payments = ['Visa', 'Mastercard', 'PayPal', 'Apple Pay', 'Klarna'];

  protected subscribe(event: Event): void {
    event.preventDefault();
    this.subscribed.set(true);
  }
}
