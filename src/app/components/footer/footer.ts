import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Container } from '../container/container';
import { SettingsService } from '../../services/settings.service';
import { enabledPaymentMethods, PAYMENT_METHOD_LABELS } from '../../models/payment.model';
import { INFO_GROUPS } from '../../pages/client/info/info-pages';

@Component({
  selector: 'app-footer',
  imports: [Container, RouterLink],
  templateUrl: './footer.html',
})
export class Footer {
  protected readonly settings = inject(SettingsService).settings;
  protected readonly year = new Date().getFullYear();
  protected readonly subscribed = signal(false);

  /** Trois colonnes de liens ; le dernier groupe (légal) va dans la barre du bas. */
  protected readonly columns = INFO_GROUPS.slice(0, -1);
  protected readonly legalLinks = INFO_GROUPS.at(-1)!.pages;

  protected readonly socials = [
    { icon: 'pi-facebook', label: 'Facebook' },
    { icon: 'pi-instagram', label: 'Instagram' },
    { icon: 'pi-tiktok', label: 'TikTok' },
    { icon: 'pi-youtube', label: 'YouTube' },
    { icon: 'pi-pinterest', label: 'Pinterest' },
  ];

  /** Moyens réellement proposés, selon les paramètres de la boutique. */
  protected readonly payments = computed(() =>
    enabledPaymentMethods(this.settings()).map((method) => PAYMENT_METHOD_LABELS[method]),
  );

  protected subscribe(event: Event): void {
    event.preventDefault();
    this.subscribed.set(true);
  }
}
