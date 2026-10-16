import { Component, ViewEncapsulation, input } from "@angular/core";

/** Common frame of the Angular applications: header, projected navigation and content. */
@Component({
  selector: "shared-remote-layout",
  templateUrl: "./remote-layout.component.html",
  styleUrl: "./remote-layout.component.css",
  // Disabled so that the projected navigation links can be styled; selectors are prefixed instead.
  encapsulation: ViewEncapsulation.None,
})
export class RemoteLayoutComponent {
  readonly appName = input.required<string>();
  readonly badge = input.required<string>();
}
