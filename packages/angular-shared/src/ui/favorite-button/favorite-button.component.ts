import { Component, computed, inject, input } from "@angular/core";
import { FavoritesService } from "../../services/favorites.service";

@Component({
  selector: "shared-favorite-button",
  templateUrl: "./favorite-button.component.html",
  styleUrl: "./favorite-button.component.css",
})
export class FavoriteButtonComponent {
  readonly clientId = input.required<string>();
  private readonly favorites = inject(FavoritesService);
  readonly active = computed(() => this.favorites.ids().includes(this.clientId()));

  toggle(): void {
    this.favorites.toggle(this.clientId());
  }
}
