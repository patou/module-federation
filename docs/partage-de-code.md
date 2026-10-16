# Partage de code entre applications

La démonstration compte cinq applications : un shell Vue, deux applications Angular et deux applications Vue. Elles partagent du code via trois bibliothèques organisées en couches :

```text
                ┌─────────────────────────────┐
                │ @demo/shared (TS pur)       │  services + Web Components
                └──────┬───────────────┬──────┘
                       │               │
        ┌──────────────▼─────┐   ┌─────▼──────────────┐
        │ @demo/angular-shared│   │ @demo/vue-shared   │  adaptateurs + composants
        └──────┬───────┬─────┘   └─────┬───────┬──────┘
               │       │               │       │
         Angular 1  Angular 2        Vue 1   Vue 2   (+ shell Vue)
```

Règle : **la logique métier et ce qui doit être identique partout vont dans `@demo/shared`** ; les bibliothèques de framework se contentent d’exposer cette logique de façon idiomatique (signals et injection pour Angular, composables pour Vue) et de fournir des composants propres au framework.

C’est aussi ce qui facilite la migration : le code de `@demo/shared` ne change pas quand une page passe d’Angular à Vue. Seule la couche de présentation est réécrite.

## `@demo/shared` — commun à toutes les applications

Paquet : [packages/shared](../packages/shared/src/index.ts). Aucune dépendance à un framework.

| Élément | Rôle |
| --- | --- |
| `clientService` | Accès asynchrone (`list`, `get`) aux clients fictifs, comme un appel HTTP. |
| `favorites` / `createFavoritesStore` | Store observable (`list`, `has`, `toggle`, `clear`, `subscribe`). L’instance `favorites` est l’état partagé de la page. |
| `formatCurrency`, `formatDate` | Formatage `fr-FR` identique dans tous les frameworks. |
| `summarize` | Calcul des indicateurs du rapport. |
| `defineDemoElements()` (`@demo/shared/ui`) | Enregistre les Web Components `<demo-status-badge status>` et `<demo-stat-card label value hint>`. |

### Composants UI indépendants du framework

Les Web Components sont la seule forme de composant UI réellement utilisable partout : HTML standard, Shadow DOM pour isoler les styles, attributs comme API. Les bootstraps `createAngularRemote` et `createVueRemote` appellent `defineDemoElements()` ; l’enregistrement est idempotent.

Chaque framework doit savoir qu’il s’agit d’éléments personnalisés :

- Vue : `compilerOptions.isCustomElement: (tag) => tag.startsWith("demo-")` dans chaque `vite.config.ts`.
- Angular : `schemas: [CUSTOM_ELEMENTS_SCHEMA]` sur le composant qui les utilise, et passage des valeurs par attribut (`[attr.status]="…"`).

```html
<!-- Angular -->
<demo-status-badge [attr.status]="client().status"></demo-status-badge>
```

```vue
<!-- Vue -->
<demo-status-badge :status="client.status" />
```

## `@demo/angular-shared` — commun aux applications Angular

Paquet : [packages/angular-shared](../packages/angular-shared/src/index.ts).

| Catégorie | Éléments |
| --- | --- |
| Intégration | `createAngularRemote({ root, routes })` : mode fédéré (localisation mémoire, gardes de délégation) et mode autonome. |
| Services | `ClientsService` (wrapper injectable de `clientService`), `FavoritesService` (store `favorites` exposé en signals `ids`, `count`). |
| Pipes | `eur` et `frDate`, basés sur `formatCurrency` / `formatDate`. |
| Composants | `shared-page-header`, `shared-client-card`, `shared-favorite-button`, `shared-remote-layout` (menu interne + contenu), `shared-not-found`. Chacun a ses fichiers `.ts`, `.html` et `.css`. |

Exemple dans [settings.component.ts](../apps/angular-backoffice/src/app/pages/settings/settings.component.ts) :

```ts
import { FavoritesService, PageHeaderComponent } from "@demo/angular-shared";

@Component({
  selector: "angular-settings",
  imports: [PageHeaderComponent],
  templateUrl: "./settings.component.html",
})
export class SettingsComponent {
  readonly favorites = inject(FavoritesService);
}
```

La bibliothèque est consommée **en sources TypeScript** : le `tsconfig.app.json` de chaque application Angular inclut `packages/angular-shared/src` et `packages/shared/src`, afin que le compilateur Angular compile aussi les composants partagés. Dans un vrai projet, on publierait plutôt une bibliothèque construite avec `ng-packagr`.

## `@demo/vue-shared` — commun aux applications Vue

Paquet : [packages/vue-shared](../packages/vue-shared/src/index.ts).

| Catégorie | Éléments |
| --- | --- |
| Intégration | `createVueRemote({ component, routes })` et `bridgeNavigation`. |
| Composables | `useFavorites()`, `useClientList()`, `useClient(id)`. |
| Composants | `PageHeader`, `ClientCard`, `FavoriteButton`, `RemoteLayout` (slot `#nav`), `NotFoundPage`. |

Le shell utilise aussi `useFavorites()` pour afficher le compteur de favoris dans son en-tête.

## Partagé à l’exécution ou à la compilation ?

Les bibliothèques sont des workspaces npm : chaque application les importe normalement. Ce qui change, c’est la façon dont Module Federation les traite, configurée dans [federation.ts](../build/federation.ts).

| Paquet | Stratégie | Conséquence |
| --- | --- | --- |
| `@demo/shared` | `shared` **singleton** dans toutes les applications | Une seule instance de module dans la page. Le store `favorites` est le même pour le shell, Angular 1 et 2, Vue 1 et 2. |
| `vue`, `@angular/*`, `rxjs` | `shared` **singleton** par famille de framework | Une seule copie du framework, même si deux remotes du même framework sont affichés successivement. |
| `@demo/angular-shared`, `@demo/vue-shared` | **Copiés** dans chaque bundle | Pas d’état global à partager ; chaque remote embarque la version avec laquelle il a été construit. |

Démonstration : ajoutez un client en favori dans la liste Vue 1, puis ouvrez **Paramètres** affiché par Angular 2 : le compteur est identique, et le compteur du shell est mis à jour en direct.

Le choix entre singleton et copie dépend du besoin :

- **Singleton** si le module porte un état qui doit être unique (store, cache, configuration) ou si le dupliquer casserait le fonctionnement (framework, injection Angular).
- **Copie** pour du code sans état : chaque application peut évoluer à son rythme sans coordination à l’exécution.

> Si `@demo/shared` n’était pas déclaré comme singleton, chaque application aurait sa propre instance de `favorites` et les compteurs ne seraient plus synchronisés, sans aucune erreur visible.

## Versions et déploiements indépendants

Un module singleton est fourni par **la première application qui le charge** : le shell en général. Les autres applications utilisent cette version au lieu de la leur. En cas de déploiement indépendant :

- Gardez l’API des bibliothèques singleton **rétrocompatible** et versionnée (semver). `requiredVersion: "^1.0.0"` signale une incompatibilité dans la console si une version majeure différente est fournie.
- Une évolution cassante de `@demo/shared` impose de redéployer ensemble toutes les applications qui en dépendent, ou de la publier sous un nouveau nom/une nouvelle version majeure non singleton.
- Les bibliothèques copiées (`angular-shared`, `vue-shared`) n’imposent pas de coordination : une application redéployée embarque simplement la nouvelle version.
- Angular est plus strict : toutes les applications Angular partageant `@angular/core` doivent être construites avec la même version d’Angular.
- Chaque point d’entrée Angular secondaire utilisé (par exemple `@angular/core/rxjs-interop`) doit être déclaré dans `shared`, sinon l’erreur `NG0203` apparaît dès que deux applications Angular cohabitent.

## Ajouter un élément partagé

1. **Logique ou état utile à tous** : ajoutez-le dans `packages/shared/src/services/`, exportez-le depuis `index.ts` et testez-le dans [tests/shared-services.test.ts](../tests/shared-services.test.ts).
2. **Composant visuel identique partout** : ajoutez un Web Component dans `packages/shared/src/ui/` avec un préfixe `demo-`.
3. **Adaptation idiomatique** : exposez-le dans `@demo/angular-shared` (service injectable, pipe, composant) et dans `@demo/vue-shared` (composable, composant `.vue`).
4. Vérifiez avec `npm run typecheck`, `npm test` et `npm run build`, puis dans le shell avec les trois scénarios.
