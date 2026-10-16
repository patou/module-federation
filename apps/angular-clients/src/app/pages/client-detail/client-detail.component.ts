import { CUSTOM_ELEMENTS_SCHEMA, Component, DestroyRef, inject, input, resource, signal } from "@angular/core";
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
  private readonly clientsService = inject(ClientsService);
  /** Route parameter and query parameter, bound by `withComponentInputBinding()`. */
  readonly id = input.required<string>();
  readonly source = input<string>();
  readonly fragment = signal<string | null>(null);
  readonly client = resource({
    params: () => this.id(),
    loader: ({ params: id }) => this.clientsService.get(id),
  });

  constructor() {
    // No toSignal(): @angular/core/rxjs-interop embeds private copies of Angular core internals and
    // breaks (NG0203) when another remote provides @angular/core. See docs/partage-de-code.md.
    const subscription = inject(ActivatedRoute).fragment.subscribe((fragment) => this.fragment.set(fragment));
    inject(DestroyRef).onDestroy(() => subscription.unsubscribe());
  }
}
