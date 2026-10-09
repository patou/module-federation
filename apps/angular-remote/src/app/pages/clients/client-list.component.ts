import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { clients } from "../../data/clients";

@Component({
  selector: "angular-client-list",
  imports: [RouterLink],
  templateUrl: "./client-list.component.html",
  styleUrl: "../page.css",
})
export class ClientListComponent {
  readonly clients = clients;
}
