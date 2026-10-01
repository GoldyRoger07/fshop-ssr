import { Component, computed, inject } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { formatMoney } from '../../shared/money';

/** Bandeau noir d'avantages en haut du site (contenu tiré des paramètres de la boutique). */
@Component({
  selector: 'app-announcement-bar',
  template: `
    <div class="bg-black text-white">
      <ul
        class="mx-auto flex max-w-6xl items-center justify-center gap-8 px-4 py-2 text-xs font-medium tracking-wide sm:justify-between"
      >
        @for (message of messages(); track message.text; let first = $first) {
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
  private readonly settings = inject(SettingsService).settings;

  protected readonly messages = computed(() => {
    const s = this.settings();
    const messages: { icon: string; text: string }[] = [];
    if (!s.checkoutEnabled) {
      messages.push({ icon: 'pi-info-circle', text: s.closedMessage ?? 'Les commandes sont momentanément suspendues' });
    }
    messages.push(
      s.freeShippingEnabled
        ? { icon: 'pi-truck', text: `Livraison gratuite dès ${formatMoney(s.freeShippingThreshold, s.currency)}` }
        : { icon: 'pi-truck', text: `Livraison à ${formatMoney(s.shippingCost, s.currency)}` },
    );
    if (s.returnDays > 0) {
      messages.push({ icon: 'pi-replay', text: `Retours gratuits sous ${s.returnDays} jours` });
    }
    if (s.announcement) {
      messages.push({ icon: 'pi-gift', text: s.announcement });
    }
    return messages;
  });
}
