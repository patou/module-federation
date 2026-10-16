import type { Routes } from "@angular/router";
import { NotFoundComponent } from "@demo/angular-shared";
import { ReportsComponent } from "./pages/reports/reports.component";
import { SettingsComponent } from "./pages/settings/settings.component";

export const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "rapports" },
  { path: "rapports", component: ReportsComponent },
  { path: "parametres", component: SettingsComponent },
  { path: "**", component: NotFoundComponent },
];
