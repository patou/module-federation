import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { RemoteLayoutComponent } from "@demo/angular-shared";

@Component({
  selector: "angular-backoffice-root",
  imports: [RouterOutlet, RouterLink, RouterLinkActive, RemoteLayoutComponent],
  templateUrl: "./app.component.html",
})
export class AppComponent {}
