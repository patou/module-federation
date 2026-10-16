import { CUSTOM_ELEMENTS_SCHEMA, Component, inject, resource } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute, RouterLink } from "@angular/router";
import {
  ClientsService, EurPipe, FavoriteButtonComponent, FrDatePipe, PageHeaderComponent,
} from "@demo/angular-shared";

@Component({
  selector: "angular-client-detail",
  imports: [RouterLink, PageHeaderComponent, FavoriteButtonComponent, EurPipe, FrDatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: "./client-detail.component.html",
  styleUrl: "./client-detail.component.css",
})
export class ClientDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly clientsService = inject(ClientsService);
  private readonly params = toSignal(this.route.paramMap);
  readonly query = toSignal(this.route.queryParamMap);
  readonly fragment = toSignal(this.route.fragment);
  readonly client = resource({
    params: () => this.params()?.get("id") ?? "",
    loader: ({ params: id }) => this.clientsService.get(id),
  });
}
