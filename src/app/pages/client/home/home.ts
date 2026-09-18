import { Component } from '@angular/core';
import { Container } from '../../../components/container/container';
import { HeroBanner } from './sections/hero-banner';
import { CategoryCarousel } from './sections/category-carousel';
import { FlashSale } from './sections/flash-sale';
import { ProductFeed } from './sections/product-feed';

@Component({
  selector: 'app-home',
  imports: [Container, HeroBanner, CategoryCarousel, FlashSale, ProductFeed],
  templateUrl: './home.html',
})
export default class Home {
  protected readonly benefits = [
    { icon: 'pi-truck', title: 'Livraison gratuite', text: 'Dès 29 € d’achat' },
    { icon: 'pi-replay', title: 'Retours gratuits', text: 'Sous 30 jours' },
    { icon: 'pi-lock', title: 'Paiement sécurisé', text: 'CB, PayPal, Apple Pay' },
    { icon: 'pi-headphones', title: 'Service client', text: '7j/7, réponse en 24 h' },
  ];

  protected readonly coupons = [
    { amount: '-5 €', condition: 'dès 39 € d’achat', code: 'FSHOP5' },
    { amount: '-12 €', condition: 'dès 79 € d’achat', code: 'FSHOP12' },
    { amount: '-25 €', condition: 'dès 149 € d’achat', code: 'FSHOP25' },
  ];
}
