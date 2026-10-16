import { Injectable } from "@angular/core";
import { clientService, type Client } from "@demo/shared";

/** Angular facade over the framework-agnostic client service of @demo/shared. */
@Injectable({ providedIn: "root" })
export class ClientsService {
  list(): Promise<readonly Client[]> {
    return clientService.list();
  }

  get(id: string): Promise<Client | undefined> {
    return clientService.get(id);
  }
}
