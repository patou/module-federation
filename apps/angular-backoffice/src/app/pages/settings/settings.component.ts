import { Component, inject, signal } from "@angular/core";
import { FavoritesService, PageHeaderComponent } from "@demo/angular-shared";

@Component({
  selector: "angular-settings",
  imports: [PageHeaderComponent],
  templateUrl: "./settings.component.html",
  styleUrl: "./settings.component.css",
})
export class SettingsComponent {
  readonly favorites = inject(FavoritesService);
  readonly notifications = signal(true);
}
