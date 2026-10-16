import { CUSTOM_ELEMENTS_SCHEMA, Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import type { Client } from "@demo/shared";
import { EurPipe } from "../../pipes/format.pipes";
import { FavoriteButtonComponent } from "../favorite-button/favorite-button.component";

@Component({
  selector: "shared-client-card",
  imports: [RouterLink, EurPipe, FavoriteButtonComponent],
  // Allows <demo-status-badge>, a Web Component from @demo/shared/ui.
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: "./client-card.component.html",
  styleUrl: "./client-card.component.css",
})
export class ClientCardComponent {
  readonly client = input.required<Client>();
}
