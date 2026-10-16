import { createAngularRemote } from "@demo/angular-shared";
import { AppComponent } from "./app.component";
import { routes } from "./app.routes";

export const app = createAngularRemote({ root: AppComponent, routes });
