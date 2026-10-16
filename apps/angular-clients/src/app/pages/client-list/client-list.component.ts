import { Component, inject, resource } from "@angular/core";
import { ClientCardComponent, ClientsService, PageHeaderComponent } from "@demo/angular-shared";

@Component({
  selector: "angular-client-list",
  imports: [PageHeaderComponent, ClientCardComponent],
  templateUrl: "./client-list.component.html",
  styleUrl: "./client-list.component.css",
})
export class ClientListComponent {
  private readonly clientsService = inject(ClientsService);
  readonly clients = resource({ loader: () => this.clientsService.list() });
}
