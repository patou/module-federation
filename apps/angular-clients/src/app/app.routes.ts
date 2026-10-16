import type { Routes } from "@angular/router";
import { NotFoundComponent } from "@demo/angular-shared";
import { ClientListComponent } from "./pages/client-list/client-list.component";
import { ClientDetailComponent } from "./pages/client-detail/client-detail.component";

export const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "clients" },
  { path: "clients", component: ClientListComponent },
  { path: "clients/:id", component: ClientDetailComponent },
  { path: "**", component: NotFoundComponent },
];
