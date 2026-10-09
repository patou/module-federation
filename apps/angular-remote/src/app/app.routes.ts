import type { Routes } from "@angular/router";
import { ClientListComponent } from "./pages/clients/client-list.component";
import { ClientDetailComponent } from "./pages/clients/client-detail.component";
import { ReportsComponent } from "./pages/reports/reports.component";
import { SettingsComponent } from "./pages/settings/settings.component";
import { NotFoundComponent } from "./pages/not-found/not-found.component";

export const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "clients" },
  { path: "clients", component: ClientListComponent },
  { path: "clients/:id", component: ClientDetailComponent },
  { path: "rapports", component: ReportsComponent },
  { path: "parametres", component: SettingsComponent },
  { path: "**", component: NotFoundComponent },
];
