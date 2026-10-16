import { CUSTOM_ELEMENTS_SCHEMA, Component, computed, inject, resource } from "@angular/core";
import { ClientsService, EurPipe, FavoritesService, PageHeaderComponent } from "@demo/angular-shared";
import { summarize } from "@demo/shared";

@Component({
  selector: "angular-reports",
  imports: [PageHeaderComponent, EurPipe],
  // <demo-stat-card> is a Web Component from @demo/shared/ui.
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: "./reports.component.html",
  styleUrl: "./reports.component.css",
})
export class ReportsComponent {
  private readonly favorites = inject(FavoritesService);
  private readonly clientsService = inject(ClientsService);
  private readonly clients = resource({ loader: () => this.clientsService.list() });
  readonly summary = computed(() =>
    this.clients.hasValue() ? summarize(this.clients.value(), this.favorites.ids()) : undefined);
}
