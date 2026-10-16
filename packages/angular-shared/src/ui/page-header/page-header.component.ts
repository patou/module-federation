import { Component, input } from "@angular/core";

@Component({
  selector: "shared-page-header",
  templateUrl: "./page-header.component.html",
  styleUrl: "./page-header.component.css",
})
export class PageHeaderComponent {
  readonly heading = input.required<string>();
  readonly subtitle = input<string>();
}
