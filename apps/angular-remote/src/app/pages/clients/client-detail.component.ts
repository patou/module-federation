import { Component, computed, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { clients } from "../../data/clients";

@Component({
  selector: "angular-client-detail",
  imports: [RouterLink],
  templateUrl: "./client-detail.component.html",
  styleUrl: "../page.css",
})
export class ClientDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.paramMap);
  readonly query = toSignal(this.route.queryParamMap);
  readonly fragment = toSignal(this.route.fragment);
  readonly client = computed(() => clients.find((client) => client.id === this.params()?.get("id")));
}
