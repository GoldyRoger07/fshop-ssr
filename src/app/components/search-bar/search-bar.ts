import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'search-bar',
  imports: [],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBar {
  readonly placeholder = input('Robes, baskets, coques de téléphone…');

  /** Émis à la validation, avec le texte recherché (sans espaces superflus). */
  readonly search = output<string>();

  protected readonly query = signal('');

  protected submit(event: Event): void {
    event.preventDefault();
    const query = this.query().trim();
    if (query) {
      this.search.emit(query);
    }
  }
}
