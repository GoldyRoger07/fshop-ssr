import { Component, computed, inject } from '@angular/core';
import { Container } from '../../../components/container/container';
import { HeroBanner } from './sections/hero-banner';
import { CategoryCarousel } from './sections/category-carousel';
import { FlashSale } from './sections/flash-sale';
import { ProductFeed } from './sections/product-feed';
import { SettingsService } from '../../../services/settings.service';
import { formatMoney } from '../../../shared/money';
import { enabledPaymentMethods, PAYMENT_METHOD_LABELS } from '../../../models/payment.model';

@Component({
  selector: 'app-home',
  imports: [Container, HeroBanner, CategoryCarousel, FlashSale, ProductFeed],
  templateUrl: './home.html',
})
export default class Home {
  private readonly settings = inject(SettingsService).settings;

  /** Livraison et retours suivent les paramètres de la boutique. */
  protected readonly benefits = computed(() => {
    const s = this.settings();
    return [
      s.freeShippingEnabled
        ? { icon: 'pi-truck', title: 'Livraison gratuite', text: `Dès ${formatMoney(s.freeShippingThreshold, s.currency)} d’achat` }
        : { icon: 'pi-truck', title: 'Livraison rapide', text: `${formatMoney(s.shippingCost, s.currency)} seulement` },
      ...(s.returnDays > 0
        ? [{ icon: 'pi-replay', title: 'Retours gratuits', text: `Sous ${s.returnDays} jours` }]
        : []),
      {
        icon: 'pi-mobile',
        title: 'Paiement facile',
        text:
          enabledPaymentMethods(s)
            .map((method) => PAYMENT_METHOD_LABELS[method])
            .join(', ') || 'Sans carte bancaire',
      },
      { icon: 'pi-headphones', title: 'Service client', text: '7j/7, réponse en 24 h' },
    ];
  });

  /** Montants affichés dans la devise de la boutique. */
  protected readonly coupons = computed(() => {
    const money = (amount: number) => formatMoney(amount, this.settings().currency, 'fr-FR', '1.0-0');
    return [
      { amount: `-${money(5)}`, condition: `dès ${money(39)} d’achat`, code: 'FSHOP5' },
      { amount: `-${money(12)}`, condition: `dès ${money(79)} d’achat`, code: 'FSHOP12' },
      { amount: `-${money(25)}`, condition: `dès ${money(149)} d’achat`, code: 'FSHOP25' },
    ];
  });
}
